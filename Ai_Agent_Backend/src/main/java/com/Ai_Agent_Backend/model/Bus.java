package com.Ai_Agent_Backend.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalTime;
import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Bus {

    private String name;
    private String busNo;
    private String source;
    private String destination;

    private String date;

    private List<String> travellingDays;

    private LocalTime departureTime;
    private LocalTime arrivalTime;

    private Integer price;
}