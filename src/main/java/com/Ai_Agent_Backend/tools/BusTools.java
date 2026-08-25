package com.Ai_Agent_Backend.tools;


import com.Ai_Agent_Backend.model.Bus;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class BusTools {

    private final List<Bus> buses = List.of(
            new Bus(
                    "Bus-A",
                    "101",
                    "Dehradun",
                    "Delhi",
                    "2026-08-26",
                    List.of("Sunday", "Monday", "Tuesday"),
                    LocalTime.of(6, 30),   //06:30 AM
                    LocalTime.of(12, 30),  // 12:30 PM
                    500
            ),
            new Bus(
                    "Bus-A",
                    "101",
                    "Dehradun",
                    "Delhi",
                    "2026-08-26",
                    List.of("Sunday", "Monday", "Tuesday"),
                    LocalTime.of(12, 30),      // 12:30 PM
                    LocalTime.of(18, 30),     // 06:30 PM
                    500
            ),

            new Bus(
                    "Bus-B",
                    "102",
                    "Delhi",
                    "Mumbai",
                    "2026-08-26",
                    List.of("Monday", "Wednesday", "Friday"),
                    LocalTime.of(18, 30),     // 06:30 PM
                    LocalTime.of(8, 30),      // 09:30 AM
                    1200
            ),
            new Bus(
                    "Bus-B",
                    "102",
                    "Mumbai",
                    "Delhi",
                    "2026-08-26",
                    List.of("Monday", "Wednesday", "Friday"),
                    LocalTime.of(18, 30),     // 06:30 PM
                    LocalTime.of(8, 30),      // 09:30 AM
                    1200
            ),
            new Bus(
                    "Bus-C",
                    "103",
                    "Delhi",
                    "UP",
                    "2026-08-26",
                    List.of("Monday", "Wednesday", "Friday"),
                    LocalTime.of(18, 30),     // 06:30 PM
                    LocalTime.of(8, 30),      // 08:30 AM
                    2000
            ),

            new Bus(
                    "Bus-D",
                    "104",
                    "Dehradun",
                    "UP",
                    "2026-08-26",
                    List.of("Monday", "Wednesday", "Friday", "Saturday"),
                    LocalTime.of(18, 30),     // 06:30 PM
                    LocalTime.of(8, 30),      // 08:30 AM
                    1800
            ),

            new Bus(
                    "Bus-E",
                    "105",
                    "Dehradun",
                    "Haridwar",
                    "2026-08-26",
                    List.of( "Tuesday", "Wednesday", "Friday"),
                    LocalTime.of(18, 30),     // 06:30 PM
                    LocalTime.of(8, 30),      // 08:30 AM
                    250
            )

    );

    // Search Available Buses.

    @Tool(name = "searchBuses" ,
            description = """
                    Search for available buses based on source, destination and date.
                    Returns the bus number, source, destination, date, departure time, arrival time and price.
                    """
    )
    public String searchBuses(String source, String destination, String date) {

        List<Bus> filteredBus = buses.stream()
                .filter(bus -> bus.getSource().equalsIgnoreCase(source))
                .filter(bus -> bus.getDestination().equalsIgnoreCase(destination))
                .filter(bus -> bus.getDate().equalsIgnoreCase(date))
                .toList();

        if (filteredBus.isEmpty()) {
            return "No buses found";
        }
        return filteredBus.stream().map(bus ->
                "Bus:" + bus.getBusNo()
                + "| From: " + bus.getSource()
                + "| To: " + bus.getDestination()
                + "| Date: " + bus.getDate()
                + "| Departure: " + bus.getDepartureTime()
                + "| Arrival: " + bus.getArrivalTime()
                + "| Price: ₹" + bus.getPrice()
                )
        .collect(Collectors.joining("\n"));
    }


}
