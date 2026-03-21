package com.crev.service;

import com.crev.dto.request.ReviewRequest;
import com.crev.dto.response.IssueDto;
import com.crev.dto.response.ReviewResponse;
import com.crev.exception.RateLimitException;
import com.crev.model.RateLimitLog;
import com.crev.model.Review;
import com.crev.model.ReviewIssue;
import com.crev.model.User;
import com.crev.repository.RateLimitLogRepository;
import com.crev.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewService {

    private final PromptBuilderService promptBuilder;
    private final ClaudeApiService claudeApi;
    private final ResponseParserService responseParser;
    private final ReviewRepository reviewRepository;
    private final RateLimitLogRepository rateLimitLogRepository;

    @Value("${rate.limit.requests}")
    private int maxRequests;

    @Value("${rate.limit.window.minutes}")
    private int windowMinutes;

    private static final Set<String> ALLOWED_LANGUAGES = Set.of(
            "javascript", "typescript", "python", "java", "go", "rust",
            "cpp", "php", "ruby", "swift", "kotlin", "csharp", "c", "scala",
            "r", "dart", "shell", "sql"
    );

    @Transactional
    public ReviewResponse runReview(ReviewRequest request, User user) {
        if (!ALLOWED_LANGUAGES.contains(request.getLanguage().toLowerCase())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported language: " + request.getLanguage());
        }

        log.info("Review requested by user={} lang={} codeLen={}", user.getUsername(), request.getLanguage(), request.getCode().length());

        checkRateLimit(user);

        String codeHash = computeSha256(request.getCode());
        LocalDateTime cacheWindow = LocalDateTime.now().minusHours(1);
        
        var cached = reviewRepository.findTopByUserIdAndCodeHashAndCreatedAtAfterOrderByCreatedAtDesc(
                user.getId(), codeHash, cacheWindow);

        if (cached.isPresent()) {
            log.info("Cache hit for user={} hash={}", user.getUsername(), codeHash);
            Review r = cached.get();
            ReviewResponse resp = new ReviewResponse();
            resp.setScore(r.getScore());
            List<IssueDto> issueDtos = r.getIssues().stream().map(i -> {
                IssueDto dto = new IssueDto();
                dto.setLine(i.getLineNumber());
                dto.setSeverity(i.getSeverity());
                dto.setTitle(i.getTitle());
                dto.setDescription(i.getDescription());
                dto.setSuggestion(i.getSuggestion());
                return dto;
            }).toList();
            resp.setIssues(issueDtos);
            return resp;
        }

        rateLimitLogRepository.save(RateLimitLog.builder().userId(user.getId()).build());

        String prompt = promptBuilder.buildPrompt(request.getCode(), request.getLanguage());
        String rawResponse = claudeApi.callClaude(prompt);
        ReviewResponse response = responseParser.parse(rawResponse);

        Review review = Review.builder()
                .user(user)
                .language(request.getLanguage())
                .codeHash(codeHash)
                .codeSnippet(request.getCode())
                .score(response.getScore())
                .build();

        List<ReviewIssue> issues = new ArrayList<>();
        if (response.getIssues() != null) {
            for (IssueDto dto : response.getIssues()) {
                issues.add(ReviewIssue.builder()
                        .review(review)
                        .lineNumber(dto.getLine())
                        .severity(dto.getSeverity())
                        .title(dto.getTitle() != null && dto.getTitle().length() > 200 ? dto.getTitle().substring(0, 200) : dto.getTitle())
                        .description(dto.getDescription())
                        .suggestion(dto.getSuggestion())
                        .build());
            }
        }
        review.setIssues(issues);
        review = reviewRepository.save(review);

        log.info("Review saved id={} score={}", review.getId(), review.getScore());

        return response;
    }

    private void checkRateLimit(User user) {
        LocalDateTime windowStart = LocalDateTime.now().minusMinutes(windowMinutes);
        long count = rateLimitLogRepository.countByUserIdAndHitAtAfter(user.getId(), windowStart);
        if (count >= maxRequests) {
            log.warn("Rate limit hit for user={}", user.getUsername());
            throw new RateLimitException("Rate limit exceeded");
        }
    }

    private String computeSha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder(2 * hash.length);
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("SHA-256 algorithm not found", e);
        }
    }
    
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getHistory(User user) {
        return reviewRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .limit(50)
                .map(r -> Map.<String, Object>of(
                        "id", r.getId(),
                        "language", r.getLanguage(),
                        "score", r.getScore(),
                        "issueCount", r.getIssues() != null ? r.getIssues().size() : 0,
                        "createdAt", r.getCreatedAt(),
                        "snippet", getSnippet(r.getCodeSnippet())
                ))
                .toList();
    }
    
    private String getSnippet(String fullCode) {
        if (fullCode == null) return "";
        return fullCode.length() > 80 ? fullCode.substring(0, 80) : fullCode;
    }
    
    @Transactional(readOnly = true)
    public Map<String, Object> getReviewById(Long id, User user) {
        Review r = reviewRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found"));
        
        if (!r.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }
        
        List<Map<String, Object>> issues = r.getIssues().stream()
                .map(i -> Map.<String, Object>of(
                        "line", i.getLineNumber() != null ? i.getLineNumber() : -1,
                        "severity", i.getSeverity(),
                        "title", i.getTitle() != null ? i.getTitle() : "",
                        "description", i.getDescription() != null ? i.getDescription() : "",
                        "suggestion", i.getSuggestion() != null ? i.getSuggestion() : ""
                ))
                .toList();

        return Map.of(
                "id", r.getId(),
                "language", r.getLanguage(),
                "score", r.getScore(),
                "createdAt", r.getCreatedAt(),
                "code", r.getCodeSnippet(),
                "issues", issues
        );
    }
    
    @Transactional
    public void deleteReview(Long id, User user) {
        Review r = reviewRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found"));
        
        if (!r.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }
        
        reviewRepository.delete(r);
    }
}
