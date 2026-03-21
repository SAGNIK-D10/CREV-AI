package com.crev.repository;

import com.crev.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    Optional<Review> findTopByUserIdAndCodeHashAndCreatedAtAfterOrderByCreatedAtDesc(
            Long userId, String codeHash, LocalDateTime since);
}
