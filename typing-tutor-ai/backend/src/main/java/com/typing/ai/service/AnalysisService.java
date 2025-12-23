package com.typing.ai.service;

import com.typing.ai.model.TestSession;
import com.typing.ai.model.User;
import com.typing.ai.repository.TestSessionRepository;
import com.typing.ai.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalysisService {

    @Autowired
    TestSessionRepository testSessionRepository;

    @Autowired
    UserRepository userRepository;

    public void updateUserStats(User user) {
        List<TestSession> sessions = testSessionRepository.findByUserOrderByCompletedAtDesc(user);
        if (sessions.isEmpty())
            return;

        double avgWpm = sessions.stream().mapToDouble(TestSession::getWpm).average().orElse(0.0);
        double avgAcc = sessions.stream().mapToDouble(TestSession::getAccuracy).average().orElse(0.0);

        user.setAverageWpm(Math.round(avgWpm * 100.0) / 100.0);
        user.setAverageAccuracy(Math.round(avgAcc * 100.0) / 100.0);
        user.setTotalTests(sessions.size());

        userRepository.save(user);
    }

    public String generatePersonalizedText(User user, String length) {
        try {
            List<Map<String, String>> sessionData = new ArrayList<>();

            // 1. Get recent error keys ONLY if user exists
            if (user != null) {
                List<TestSession> recentSessions = testSessionRepository.findByUserOrderByCompletedAtDesc(user);
                for (TestSession session : recentSessions.stream().limit(10).toList()) {
                    Map<String, String> map = new HashMap<>();
                    map.put("errorKeys", session.getErrorKeys());
                    sessionData.add(map);
                }
            }

            // 2. Call Python Service
            org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
            Map<String, Object> analysisResult = new HashMap<>();

            // Only analyze if we have data
            if (!sessionData.isEmpty()) {
                Map<String, Object> payload = new HashMap<>();
                payload.put("sessions", sessionData);
                analysisResult = restTemplate.postForObject("http://localhost:5000/analyze", payload, Map.class);
            }

            // Generate
            Map<String, Object> generationPayload = new HashMap<>();
            generationPayload.put("weakKeys", analysisResult.getOrDefault("weakKeys", Collections.emptyList()));
            generationPayload.put("length", length);

            Map<String, String> generationResult = restTemplate.postForObject("http://localhost:5000/generate",
                    generationPayload, Map.class);

            if (generationResult != null && generationResult.containsKey("text")) {
                return generationResult.get("text");
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Python service unavailable. Falling back to Java logic.");
            return fallbackLogic(user); // Fallback
        }

        return "The quick brown fox jumps over the lazy dog.";
    }

    // Kept as fallback
    private String fallbackLogic(User user) {
        // ... (simplified original logic)
        return "The quick brown fox jumps over the lazy dog. (Fallback Mode)";
    }
}
