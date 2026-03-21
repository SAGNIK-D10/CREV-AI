package com.crev.service;

import com.crev.dto.response.IssueDto;
import com.crev.dto.response.ReviewResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ResponseParserService {

    private final ObjectMapper mapper;

    public ReviewResponse parse(String rawResponse) {
        String cleaned = rawResponse.trim();
        if (cleaned.startsWith("```json")) {
            cleaned = cleaned.substring("```json".length());
            if (cleaned.endsWith("```")) {
                cleaned = cleaned.substring(0, cleaned.length() - 3);
            }
        } else if (cleaned.startsWith("```")) {
            cleaned = cleaned.substring("```".length());
            if (cleaned.endsWith("```")) {
                cleaned = cleaned.substring(0, cleaned.length() - 3);
            }
        }
        cleaned = cleaned.trim();

        try {
            JsonNode root = mapper.readTree(cleaned);
            ReviewResponse response = new ReviewResponse();
            
            int score = root.has("score") ? root.get("score").asInt() : 0;
            response.setScore(Math.min(100, Math.max(0, score)));
            
            List<IssueDto> issuesList = new ArrayList<>();
            if (root.has("issues") && root.get("issues").isArray()) {
                for (JsonNode node : root.get("issues")) {
                    IssueDto issue = new IssueDto();
                    if (node.has("line") && !node.get("line").isNull()) {
                        issue.setLine(node.get("line").asInt());
                    } else {
                        issue.setLine(null);
                    }
                    issue.setSeverity(node.has("severity") ? node.get("severity").asText() : "info");
                    issue.setTitle(node.has("title") ? node.get("title").asText() : "Issue");
                    issue.setDescription(node.has("description") ? node.get("description").asText() : "");
                    issue.setSuggestion(node.has("suggestion") ? node.get("suggestion").asText() : "");
                    issuesList.add(issue);
                }
            }
            response.setIssues(issuesList);
            return response;

        } catch (Exception e) {
            log.warn("Failed to parse Claude response: {}", e.getMessage());
            log.debug("Raw response was: \n{}", rawResponse);
            
            ReviewResponse fallback = new ReviewResponse();
            fallback.setScore(0);
            IssueDto errIssue = new IssueDto();
            errIssue.setSeverity("critical");
            errIssue.setTitle("Parse error");
            errIssue.setDescription("Could not parse AI response");
            errIssue.setSuggestion("Try again");
            fallback.setIssues(List.of(errIssue));
            return fallback;
        }
    }
}
