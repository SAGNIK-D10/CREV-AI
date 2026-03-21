package com.crev.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "rate_limit_log")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RateLimitLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "hit_at", insertable = false, updatable = false)
    private LocalDateTime hitAt;
}
