package com.typing.ai.payload.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TestSubmissionRequest {
    private Double wpm;
    private Double accuracy;
    private Integer durationSeconds;
    private Integer errorCount;
    private String errorKeys; // "a,s,d,f"
}
