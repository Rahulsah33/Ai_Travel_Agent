package com.Ai_Agent_Backend.rag;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class TravelKnowledgeLoader implements ApplicationRunner {

    private final VectorStore vectorStore;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("classpath:travel-knowledge.json")
    private Resource travelKnowledgeResource;

    @Value("${spring.ai.google.genai.embedding.api-key:}")
    private String apiKey;

    @Override
    public void run(ApplicationArguments args) {
        if (apiKey == null || apiKey.isBlank() || apiKey.equals("demo-key")) {
            log.info("RAG Knowledge Loader: API_KEY is placeholder or not configured. Skipping initial embedding call.");
            return;
        }

        try {
            if (!travelKnowledgeResource.exists()) {
                log.warn("RAG Knowledge resource not found: travel-knowledge.json");
                return;
            }

            try (InputStream inputStream = travelKnowledgeResource.getInputStream()) {
                List<Map<String, Object>> entries = objectMapper.readValue(
                        inputStream,
                        new TypeReference<List<Map<String, Object>>>() {}
                );

                List<Document> documents = new ArrayList<>();
                for (Map<String, Object> entry : entries) {
                    String content = (String) entry.get("content");
                    String id = (String) entry.get("id");
                    String title = (String) entry.get("title");
                    String category = (String) entry.get("category");

                    Map<String, Object> metadata = Map.of(
                            "id", id != null ? id : "",
                            "title", title != null ? title : "",
                            "category", category != null ? category : ""
                    );

                    documents.add(new Document(content, metadata));
                }

                log.info("Indexing {} travel knowledge documents into VectorStore...", documents.size());
                vectorStore.add(documents);
                log.info("Successfully indexed {} documents for RAG retrieval.", documents.size());
            }
        } catch (Exception exception) {
            log.warn("Could not load travel knowledge into VectorStore: {}", exception.getMessage());
        }
    }
}
