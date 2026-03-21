package com.crev.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ReviewRequest {
    @NotBlank
    @Size(min = 10, max = 10000, message = "Code must be between 10 and 10000 characters")
    private String code;
    
    @NotBlank
    private String language;
}
