package com.Ai_Agent_Backend.tools;


import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

@Component
public class WeatherTools {

    @Tool(name = "getForecast", description = "Get the weather forecast for a given city and date")
    public String getForecast(String city, String date) {
        // Implement the logic to get the weather forecast for the given city and date
        // This is a placeholder implementation
        return "The weather forecast for " + city + " on " + date + " is sunny with a high of 25°C.";
    }


}

