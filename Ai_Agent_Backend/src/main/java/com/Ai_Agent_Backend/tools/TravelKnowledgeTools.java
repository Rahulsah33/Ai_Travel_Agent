package com.Ai_Agent_Backend.tools;

import org.springframework.ai.document.Document;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class TravelKnowledgeTools {

    private final VectorStore vectorStore;

    public TravelKnowledgeTools(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    @Tool(
            name = "searchTravelGuideAndPolicies",
            description = """
                    Search the curated travel knowledge base for destination guides,
                    cultural etiquette, transit tips, luggage limits, and booking/cancellation policies.
                    Use this tool when users ask about travel recommendations, packing tips,
                    luggage rules, or cancellation policies.
                    """
    )
    public String searchTravelGuide(String query) {
        try {
            List<Document> results = vectorStore.similaritySearch(
                    SearchRequest.builder()
                            .query(query)
                            .topK(3)
                            .build()
            );

            if (results.isEmpty()) {
                return "No matching travel knowledge articles found for: " + query;
            }

            return results.stream()
                    .map(doc -> {
                        Object title = doc.getMetadata().getOrDefault("title", "Travel Guide");
                        return "=== " + title + " ===\n" + doc.getText();
                    })
                    .collect(Collectors.joining("\n\n"));
        } catch (Exception exception) {
            return "Travel knowledge search is temporarily unavailable: " + exception.getMessage();
        }
    }
}
