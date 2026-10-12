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
            ),
            new Bus("Bus-F", "106", "Delhi", "Jaipur", "2026-10-11",
                    List.of("Sunday", "Tuesday", "Thursday"), LocalTime.of(7, 0), LocalTime.of(12, 30), 850),
            new Bus("Bus-G", "107", "Jaipur", "Udaipur", "2026-10-12",
                    List.of("Monday", "Wednesday", "Saturday"), LocalTime.of(8, 15), LocalTime.of(15, 0), 1100),
            new Bus("Bus-H", "108", "Mumbai", "Pune", "2026-10-15",
                    List.of("Monday", "Tuesday", "Wednesday", "Thursday", "Friday"), LocalTime.of(6, 0), LocalTime.of(9, 30), 650),
            new Bus("Bus-I", "109", "Bengaluru", "Mysuru", "2026-10-17",
                    List.of("Saturday", "Sunday"), LocalTime.of(7, 30), LocalTime.of(11, 0), 550),
            new Bus("Bus-J", "110", "Chennai", "Pondicherry", "2026-10-20",
                    List.of("Tuesday", "Thursday", "Saturday"), LocalTime.of(9, 0), LocalTime.of(12, 0), 450),
            new Bus("Bus-K", "111", "Kolkata", "Bhubaneswar", "2026-10-22",
                    List.of("Monday", "Wednesday", "Friday"), LocalTime.of(20, 0), LocalTime.of(6, 0), 1450),
            new Bus("Bus-L", "112", "Ahmedabad", "Udaipur", "2026-10-24",
                    List.of("Friday", "Saturday", "Sunday"), LocalTime.of(6, 30), LocalTime.of(12, 0), 900
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
