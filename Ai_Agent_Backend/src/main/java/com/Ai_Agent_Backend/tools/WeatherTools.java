package com.Ai_Agent_Backend.tools;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClient;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;

@Component
public class WeatherTools {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final String providerUrl;

    public WeatherTools(@Value("${app.weather.provider-url}") String providerUrl) {
        this.restClient = RestClient.create();
        this.objectMapper = new ObjectMapper();
        this.providerUrl = providerUrl;
    }

    @Tool(name = "getForecast", description = "Get the weather forecast for a given city and date")
    public String getForecast(String city, String date) {
        try {
            LocalDate requestedDate = LocalDate.parse(date);
            JsonNode location = geocode(city);
            if (location == null) {
                return "I could not find a location named " + city + ".";
            }

            LocalDate today = LocalDate.now();
            long dayOffset = ChronoUnit.DAYS.between(today, requestedDate);
            if (dayOffset < 0 || dayOffset > 15) {
                return "Live forecast data is available for the next 15 days. Please choose a date between "
                        + today + " and " + today.plusDays(15) + ".";
            }

            String forecast = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .scheme(providerUrl.startsWith("https") ? "https" : "http")
                            .host(providerUrl.replaceFirst("^https?://", ""))
                            .path("/v1/forecast")
                            .queryParam("latitude", location.get("latitude").asDouble())
                            .queryParam("longitude", location.get("longitude").asDouble())
                            .queryParam("daily", "temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max")
                            .queryParam("timezone", "auto")
                            .queryParam("forecast_days", 16)
                            .build())
                    .retrieve()
                    .body(String.class);

            JsonNode root = objectMapper.readTree(forecast);
            JsonNode daily = root.path("daily");
            int index = -1;
            for (int currentIndex = 0; currentIndex < daily.path("time").size(); currentIndex++) {
                if (requestedDate.toString().equals(daily.path("time").get(currentIndex).asText())) {
                    index = currentIndex;
                    break;
                }
            }
            if (index < 0) {
                return "No live forecast is available for " + requestedDate + ".";
            }

            return String.format("Live weather for %s on %s: %s, high %s°C, low %s°C, precipitation chance %s%%.",
                    city, requestedDate, weatherDescription(daily.path("weather_code").get(index).asInt()),
                    daily.path("temperature_2m_max").get(index).asText(),
                    daily.path("temperature_2m_min").get(index).asText(),
                    daily.path("precipitation_probability_max").get(index).asText());
        } catch (DateTimeParseException | RestClientException exception) {
            return "Live weather is temporarily unavailable for " + city + ". Please try again shortly.";
        } catch (com.fasterxml.jackson.core.JsonProcessingException exception) {
            return "Live weather returned an unexpected response for " + city + ".";
        }
    }

    private JsonNode geocode(String city) throws com.fasterxml.jackson.core.JsonProcessingException {
        String response = restClient.get()
                .uri("https://geocoding-api.open-meteo.com/v1/search?name="
                        + URLEncoder.encode(city, StandardCharsets.UTF_8) + "&count=1&language=en&format=json")
                .retrieve()
                .body(String.class);
        JsonNode results = objectMapper.readTree(response).path("results");
        return results.isArray() && !results.isEmpty() ? results.get(0) : null;
    }

    private String weatherDescription(int code) {
        return switch (code) {
            case 0 -> "clear skies";
            case 1, 2 -> "partly cloudy";
            case 3 -> "overcast";
            case 45, 48 -> "foggy";
            case 51, 53, 55, 56, 57 -> "drizzle";
            case 61, 63, 65, 66, 67 -> "rain";
            case 71, 73, 75, 77 -> "snow";
            case 80, 81, 82 -> "rain showers";
            case 85, 86 -> "snow showers";
            case 95, 96, 99 -> "thunderstorms";
            default -> "mixed conditions";
        };
    }
}
