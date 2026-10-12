package com.Ai_Agent_Backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.MessageType;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatClient chatClient;
    private final ChatMemory chatMemory;

    public String chat(String query, String conversationId) {
        try {
            return chatClient.prompt()
                    .user(query)
                    .advisors(advisorSpec -> advisorSpec.param(ChatMemory.CONVERSATION_ID, conversationId))
                    .call()
                    .content();
        } catch (Exception exception) {
            log.error("Google Gemini chat call failed: {}", exception.getMessage(), exception);
            String msg = exception.getMessage() != null ? exception.getMessage().toLowerCase() : "";
            
            if (msg.contains("api_key") || msg.contains("api key") || msg.contains("400") || msg.contains("401")
                    || msg.contains("unauthenticated") || msg.contains("invalid_argument")) {
                String guidance = "⚠️ **Google Gemini API Key Required**\n\n"
                        + "Lizza communicates via Google Gemini (`gemini-3-flash-preview`), but the `API_KEY` environment variable is missing, expired, or using a placeholder.\n\n"
                        + "👉 **Quick Setup:**\n"
                        + "1. Obtain an API key from Google AI Studio: https://aistudio.google.com/\n"
                        + "2. In your terminal where you run Spring Boot, set your key before starting:\n"
                        + "   `$env:API_KEY=\"AIzaSy...\"`\n"
                        + "   `./mvnw spring-boot:run`\n"
                        + "   *(Alternatively, add `spring.ai.google.genai.api-key=YOUR_KEY` in `application.properties`)*.";
                
                // Store turn in chat memory so session continuity works
                chatMemory.add(conversationId, List.of(new UserMessage(query), new AssistantMessage(guidance)));
                return guidance;
            }
            throw exception;
        }
    }

    public List<ChatMessageDto> getHistory(String conversationId) {
        List<Message> messages = chatMemory.get(conversationId);
        if (messages == null || messages.isEmpty()) {
            return List.of();
        }
        return messages.stream()
                .filter(message -> message.getMessageType() == MessageType.USER || message.getMessageType() == MessageType.ASSISTANT)
                .map(message -> new ChatMessageDto(
                        message.getMessageType() == MessageType.USER ? "user" : "assistant",
                        message.getText()))
                .toList();
    }

    public void clearHistory(String conversationId) {
        chatMemory.clear(conversationId);
    }

    public record ChatMessageDto(String role, String text) {}
}
