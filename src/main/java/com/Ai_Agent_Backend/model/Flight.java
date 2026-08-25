package com.Ai_Agent_Backend.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Flight {

    private String name;
    private String flightNo;
    private String source;
    private String destination;
    private String date;
    private Integer price;
}