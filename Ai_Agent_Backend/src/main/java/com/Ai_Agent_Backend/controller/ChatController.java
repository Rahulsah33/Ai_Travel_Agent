package com.Ai_Agent_Backend.controller;

import com.Ai_Agent_Backend.service.ChatService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<ChatResponse> chat(
            @RequestHeader("Conversation-Id") String conversationId,
            @Valid @RequestBody ChatRequest request) {
        return ResponseEntity.ok(new ChatResponse(chatService.chat(request.message(), conversationId)));
    }

    @GetMapping("/history")
    public ResponseEntity<List<ChatService.ChatMessageDto>> getHistory(
            @RequestHeader("Conversation-Id") String conversationId) {
        return ResponseEntity.ok(chatService.getHistory(conversationId));
    }

    @DeleteMapping("/history")
    public ResponseEntity<Void> clearHistory(
            @RequestHeader("Conversation-Id") String conversationId) {
        chatService.clearHistory(conversationId);
        return ResponseEntity.noContent().build();
    }

    public record ChatRequest(
            @NotBlank
            @Size(max = 4000)
            String message) {}

    public record ChatResponse(String message) {}
}
