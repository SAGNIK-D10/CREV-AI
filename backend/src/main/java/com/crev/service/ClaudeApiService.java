package com.crev.service;

import com.crev.exception.ClaudeApiException;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
public class ClaudeApiService {

    @Value("${claude.api.key}")
    private String apiKey;

    @Value("${claude.api.url}")
    private String apiUrl;

    @Value("${claude.api.model}")
    private String model;

    @Value("${claude.api.max_tokens}")
    private int maxTokens;

    private final OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(10, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .build();

    public String callClaude(String prompt) {
        log.info("Calling Claude API model={}", model);

        String jsonBody = String.format("""
                {
                  "model": "%s",
                  "max_tokens": %d,
                  "messages": [
                    { "role": "user", "content": %s }
                  ]
                }
                """, model, maxTokens, escapeJsonString(prompt));

        RequestBody body = RequestBody.create(jsonBody, MediaType.parse("application/json"));
        Request request = new Request.Builder()
                .url(apiUrl)
                .post(body)
                .addHeader("Content-Type", "application/json")
                .addHeader("x-api-key", apiKey)
                .addHeader("anthropic-version", "2023-06-01")
                .build();

        long start = System.currentTimeMillis();
        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "";
                log.error("Claude API call failed: {}", errorBody);
                throw new ClaudeApiException("Claude API error: " + response.code());
            }

            log.info("Claude responded in {}ms", System.currentTimeMillis() - start);
            
            String responseStr = response.body().string();
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            com.fasterxml.jackson.databind.JsonNode root = mapper.readTree(responseStr);
            return root.get("content").get(0).get("text").asText();
            
        } catch (IOException e) {
            log.error("Claude API call failed: {}", e.getMessage());
            throw new ClaudeApiException(e.getMessage());
        }
    }

    private String escapeJsonString(String prompt) {
        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            return mapper.writeValueAsString(prompt);
        } catch (Exception e) {
            return "\"" + prompt.replace("\"", "\\\"").replace("\n", "\\n") + "\"";
        }
    }
}
