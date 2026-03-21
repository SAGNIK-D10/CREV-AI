package com.crev.controller;

import com.crev.dto.request.ReviewRequest;
import com.crev.dto.response.ReviewResponse;
import com.crev.model.User;
import com.crev.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReviewResponse> runReview(
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(reviewService.runReview(request, user));
    }

    @GetMapping("/history")
    public ResponseEntity<List<Map<String, Object>>> getHistory(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(reviewService.getHistory(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getReviewById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(reviewService.getReviewById(id, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        reviewService.deleteReview(id, user);
        return ResponseEntity.noContent().build();
    }
}
