package com.crev.repository;

import com.crev.model.RateLimitLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface RateLimitLogRepository extends JpaRepository<RateLimitLog, Long> {
    long countByUserIdAndHitAtAfter(Long userId, LocalDateTime since);
}
