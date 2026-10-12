package com.Ai_Agent_Backend;

import com.Ai_Agent_Backend.config.DotenvLoader;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AiAgentApplication {

    static {
        DotenvLoader.load();
    }

    public static void main(String[] args) {
        SpringApplication.run(AiAgentApplication.class, args);
    }

}
