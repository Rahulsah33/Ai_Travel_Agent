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