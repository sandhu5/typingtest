package com.typing.ai.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "test_sessions")
@Data
@NoArgsConstructor
public class TestSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "password", "email", "totalTests", "averageWpm",
            "averageAccuracy", "createdAt", "updatedAt", "hibernateLazyInitializer", "handler" })
    private User user;

    @Column(nullable = false)
    private Double wpm;

    @Column(nullable = false)
    private Double accuracy;

    @Column(nullable = false)
    private Integer durationSeconds;

    @Column(nullable = false)
    private Integer errorCount;

    @Column(columnDefinition = "TEXT")
    private String errorKeys; // JSON or comma-separated list of keys user struggled with

    @CreationTimestamp
    private LocalDateTime completedAt;

    public TestSession(User user, Double wpm, Double accuracy, Integer durationSeconds, Integer errorCount,
            String errorKeys) {
        this.user = user;
        this.wpm = wpm;
        this.accuracy = accuracy;
        this.durationSeconds = durationSeconds;
        this.errorCount = errorCount;
        this.errorKeys = errorKeys;
    }
}
