package com.Ai_Agent_Backend.controller;

import com.Ai_Agent_Backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<String> chat(@RequestHeader("Conversation-Id") String conversationId, @RequestBody String message){

        return ResponseEntity.ok(chatService.chat(message,  conversationId));
    }

}
