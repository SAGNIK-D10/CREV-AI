package com.crev.repository;

import com.crev.model.ReviewIssue;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewIssueRepository extends JpaRepository<ReviewIssue, Long> {
}
