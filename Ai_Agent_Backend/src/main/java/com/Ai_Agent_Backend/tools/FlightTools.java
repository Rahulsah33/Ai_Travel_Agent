package com.Ai_Agent_Backend.tools;

import com.Ai_Agent_Backend.model.Flight;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class FlightTools {

    // Demo flight data
    private final List<Flight> flights = List.of(
            new Flight(
                    "Flight-A",
                    "AA101",
                    "New York",
                    "Los Angeles",
                    "2023-10-10",
                    5000
            ),
            new Flight(
                    "Flight-B",
                    "AA102",
                    "Los Angeles",
                    "New York",
                    "2023-10-11",
                    4500
            ),
            new Flight(
                    "Flight-C",
                    "AA103",
                    "Delhi",
                    "Patna",
                    "2026-10-11",
                    5000
            ),
            new Flight(
                    "Flight-D",
                    "AA104",
                    "Patna",
                    "Delhi",
                    "2026-10-12",
                    4500
            ),
            new Flight(
                    "Flight-E",
                    "AA105",
                    "Patna",
                    "Gorakhpur",
                    "2026-11-11",
                    5000
            ),
            new Flight("Flight-F", "AI201", "Delhi", "Mumbai", "2026-10-11", 6200),

            new Flight("Flight-G", "6E404", "Mumbai", "Goa", "2026-10-12", 4100),

            new Flight("Flight-H", "UK818", "Delhi", "Bengaluru", "2026-10-15", 7350),

            new Flight("Flight-I", "AI512", "Bengaluru", "Chennai", "2026-10-17", 3800),

            new Flight("Flight-J", "6E711", "Kolkata", "Delhi", "2026-10-20", 5700),

            new Flight("Flight-K", "EK507", "Mumbai", "Dubai", "2026-10-22", 18900),

            new Flight("Flight-L", "QR571", "Delhi", "Doha", "2026-10-24", 22400),

            new Flight("Flight-M", "AI146", "Delhi", "London", "2026-11-05", 48700),

            new Flight("Flight-N", "AF225", "Delhi", "Paris", "2026-11-08", 51200),

            new Flight("Flight-O", "SQ403", "Mumbai", "Singapore", "2026-11-12", 27600),

            new Flight("Flight-P", "6E221", "Hyderabad", "Goa", "2026-11-15", 4450
            )
    );

    /**
     * Search available flights.
     */
    @Tool(
            name = "searchFlights",
            description = """
                    Search for available flights based on source,
                    destination and date.

                    Returns the flight number, source, destination,
                    date and price.
                    """
    )
    public String searchFlight(
            String source,
            String destination,
            String date
    ) {

        List<Flight> filteredFlights = flights.stream()
                .filter(flight ->
                        flight.getSource().equalsIgnoreCase(source)
                                && flight.getDestination().equalsIgnoreCase(destination)
                                && flight.getDate().equals(date)
                )
                .toList();

        if (filteredFlights.isEmpty()) {
            return "No flights found for the given criteria.";
        }

        return filteredFlights.stream()
                .map(flight ->
                        "Flight: " + flight.getFlightNo()
                                + " | From: " + flight.getSource()
                                + " | To: " + flight.getDestination()
                                + " | Date: " + flight.getDate()
                                + " | Price: ₹" + flight.getPrice()
                )
                .collect(Collectors.joining("\n"));
    }
}