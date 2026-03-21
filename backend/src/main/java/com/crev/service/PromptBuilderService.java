package com.crev.service;

import org.springframework.stereotype.Service;

@Service
public class PromptBuilderService {

    public String buildPrompt(String code, String language) {
        return "You are a senior software engineer conducting a code review.\n" +
               "Analyze the following " + language + " code and return ONLY a valid\n" +
               "JSON object. No markdown, no explanation, no backticks.\n" +
               "\n" +
               "Review criteria:\n" +
               "- Security vulnerabilities (SQL injection, XSS, auth issues)\n" +
               "- Performance problems (N+1 queries, unnecessary loops, memory leaks)\n" +
               "- Error handling (unhandled exceptions, missing null checks)\n" +
               "- Code quality (magic numbers, naming, dead code, complexity)\n" +
               "- Best practices for " + language + " specifically\n" +
               "\n" +
               "Return this exact JSON structure:\n" +
               "{\n" +
               "  \"score\": <integer 0-100>,\n" +
               "  \"issues\": [\n" +
               "    {\n" +
               "      \"line\": <integer or null if not applicable>,\n" +
               "      \"severity\": <\"critical\" | \"warning\" | \"info\">,\n" +
               "      \"title\": <string, max 80 chars>,\n" +
               "      \"description\": <string, max 200 chars>,\n" +
               "      \"suggestion\": <string, max 200 chars, concrete fix>\n" +
               "    }\n" +
               "  ]\n" +
               "}\n" +
               "\n" +
               "Score rubric:\n" +
               "  90-100: excellent, production ready\n" +
               "  70-89:  good, minor issues\n" +
               "  50-69:  needs work, notable problems\n" +
               "  0-49:   serious issues, not production ready\n" +
               "\n" +
               "Max 10 issues. Prioritize by severity (critical first).\n" +
               "If the code is empty or not valid " + language + ", return score: 0\n" +
               "and one critical issue explaining why.\n" +
               "\n" +
               "Code to review:\n" +
               "```" + language + "\n" +
               code + "\n" +
               "```\n";
    }
}
