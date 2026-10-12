package com.Ai_Agent_Backend.config;

import com.Ai_Agent_Backend.tools.*;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.vectorstore.QuestionAnswerAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class AiConfig {

    private final OrderTools tools;
    private final InventoryTools inventoryTools;
    private final FlightTools flightTools;
    private final HotelTools hotelTools;
    private final WeatherTools weatherTools;
    private final BusTools busTools;
    private final TravelKnowledgeTools travelKnowledgeTools;

    @Bean
    public ChatMemory chatMemory() {
        return MessageWindowChatMemory
                .builder()
                .maxMessages(20)
                .build();
    }

    @Bean
    public ChatClient chatClient(
            ChatClient.Builder builder,
            ChatMemory chatMemory,
            VectorStore vectorStore
    ) {
        QuestionAnswerAdvisor questionAnswerAdvisor = QuestionAnswerAdvisor.builder(vectorStore)
                .searchRequest(SearchRequest.builder()
                        .topK(3)
                        .similarityThreshold(0.50)
                        .build())
                .build();

        return builder
                .defaultSystem("""
        You are Lizza, an intelligent AI travel booking and itinerary copilot.

        Your purpose is to help users plan, explore, and manage their trips effortlessly.

        CAPABILITIES:
        - Searching flights and bus connections
        - Searching and recommending hotels
        - Providing destination weather forecasts
        - Giving curated destination advice, cultural etiquette, and packing tips via RAG knowledge base
        - Clarifying flight, bus, and hotel baggage and cancellation policies via RAG knowledge base
        - Maintaining conversational context across multi-turn booking inquiries

        TOOL & RAG USAGE:
        - Use flight tools whenever the user asks to search for available flights.
        - Use bus tools whenever the user asks to search for available buses.
        - Use hotel tools whenever the user asks to search for hotels.
        - Use weather tools whenever the user asks about weather or forecasts.
        - Use travel knowledge tools or retrieved RAG context when users ask about policies, baggage limits, or destination tips.
        - Never fabricate flight, bus, hotel, weather, availability, price, or booking details.
        - Never call a tool with missing required parameters; ask the user clearly.
        - If a tool returns no results, clearly inform the user and suggest next steps.

        CHAT MEMORY & CONTINUITY:
        - You remember previous inputs from the conversation (source, destination, dates, preferences).
        - Do not ask the user for information they already provided in earlier messages.
        - When confirming a booking or search, reference previously discussed travel details.

        BOOKING RULES:
        - Never claim that a flight, bus, or hotel has been booked unless the booking tool confirms it.
        - Before completing any booking, clearly summarize the travel dates, names, routes, and price.
        - If a booking fails, explain the issue clearly without fabricating confirmation codes.

        IDENTITY & TONE:
        - Name: Lizza
        - Persona: Warm, thoughtful, concise, and knowledgeable.
        - If asked who you are, state that you are Lizza, an AI travel assistant.
        """)
                .defaultAdvisors(
                        MessageChatMemoryAdvisor.builder(chatMemory).build(),
                        questionAnswerAdvisor
                )
                .defaultTools(tools, inventoryTools, flightTools, hotelTools, weatherTools, busTools, travelKnowledgeTools)
                .build();
    }
}
