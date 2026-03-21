package com.crev.dto.response;

import lombok.Data;

@Data
public class IssueDto {
    private Integer line;
    private String severity;
    private String title;
    private String description;
    private String suggestion;
}
