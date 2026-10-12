package com.Ai_Agent_Backend.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;

@Slf4j
@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException exception) {
        log.warn("Validation error: {}", exception.getMessage());
        return ResponseEntity.badRequest().body(new ApiError(
                Instant.now(), 400, "Invalid request", "Please provide a message of up to 4000 characters."));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleUnexpected(Exception exception) {
        log.error("Chat request failed with exception: ", exception);

        String detail = exception.getMessage() != null ? exception.getMessage() : "Unknown error";
        String userFriendlyMessage = "The travel assistant encountered an error.";

        if (detail.toLowerCase().contains("api_key") || detail.toLowerCase().contains("api key")
                || detail.toLowerCase().contains("unauthenticated") || detail.toLowerCase().contains("invalid_argument")) {
            userFriendlyMessage = "Google Gemini API key is missing or invalid. Please configure a valid API_KEY environment variable (e.g. set API_KEY=AIzaSy... and restart the backend).";
        } else if (exception.getCause() != null && exception.getCause().getMessage() != null) {
            String causeMsg = exception.getCause().getMessage().toLowerCase();
            if (causeMsg.contains("api_key") || causeMsg.contains("api key")) {
                userFriendlyMessage = "Google Gemini API key is missing or invalid. Please configure a valid API_KEY environment variable.";
            }
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiError(
                Instant.now(), 500, "Request failed", userFriendlyMessage + " (" + detail + ")"));
    }

    public record ApiError(Instant timestamp, int status, String error, String message) {}
}
