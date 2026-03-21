package com.crev.dto.response;

import lombok.Data;
import java.util.List;

@Data
public class ReviewResponse {
    private int score;
    private List<IssueDto> issues;
}
