package com.Ai_Agent_Backend.tools;

import com.Ai_Agent_Backend.model.Hotel;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class HotelTools {

    private final List<Hotel> hotels = List.of(
            new Hotel("Hotel-A" , "Goa" , 1000 , 4.5),
            new Hotel("Hotel-B" , "Goa" , 2000 , 4.0),
            new Hotel("Hotel-C" , "Goa" , 3000 ,5.0),
            new Hotel("Hotel-D" , "Goa" , 4000 , 3.5),
            new Hotel("Sea Breeze Resort", "Goa", 5500, 4.7),
            new Hotel("The Leela Palace", "Delhi", 9500, 4.8),
            new Hotel("Metro View Inn", "Delhi", 2800, 4.1),
            new Hotel("Harbor Lights", "Mumbai", 6200, 4.4),
            new Hotel("City Garden Hotel", "Mumbai", 3900, 4.0),
            new Hotel("Royal Orchid", "Bengaluru", 5100, 4.5),
            new Hotel("The Residency", "Chennai", 3600, 4.2),
            new Hotel("Pink City Haveli", "Jaipur", 2400, 4.6),
            new Hotel("Lake View Retreat", "Udaipur", 7200, 4.8),
            new Hotel("Riverside Stay", "Rishikesh", 1900, 4.3),
            new Hotel("Paris Central", "Paris", 14500, 4.5),
            new Hotel("London Garden Suites", "London", 18200, 4.4)
    );


    // Search Hotels
    @Tool(name = "searchHotel", description = "Search hotels in a city with a maximum price per night. Returns the hotels city and price.")
    public String searchHotels(String city, int maxPrice) {
        StringBuilder result = new StringBuilder();
        for (Hotel hotel : hotels) {

            if (hotel.city().equalsIgnoreCase(city) && hotel.pricePerNightINR() <= maxPrice) {

                result.append("Hotel Name").append(hotel.name())
                        .append("PricePerNightINR").append(hotel.pricePerNightINR())
                        .append("Rating").append(hotel.rating()).append("\n");
            }
        }
        return result.length() > 0 ? result.toString() : "No hotels found in " + city + " under price " + maxPrice;
    }



}
