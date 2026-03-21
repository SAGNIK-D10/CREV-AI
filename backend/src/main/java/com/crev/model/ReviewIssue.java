package com.crev.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "review_issues")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewIssue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = false)
    private Review review;

    @Column(name = "line_number")
    private Integer lineNumber;

    @Column(nullable = false)
    private String severity;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String suggestion;
}
