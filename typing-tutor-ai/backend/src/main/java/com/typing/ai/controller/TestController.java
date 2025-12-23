package com.typing.ai.controller;

import com.typing.ai.model.TestSession;
import com.typing.ai.model.User;
import com.typing.ai.payload.request.TestSubmissionRequest;
import com.typing.ai.payload.response.MessageResponse;
import com.typing.ai.repository.TestSessionRepository;
import com.typing.ai.repository.UserRepository;
import com.typing.ai.service.AnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    TestSessionRepository testSessionRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    AnalysisService analysisService;

    @PostMapping("/submit")
    public ResponseEntity<?> submitTest(@RequestBody TestSubmissionRequest request) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        TestSession session = new TestSession(
                user,
                request.getWpm(),
                request.getAccuracy(),
                request.getDurationSeconds(),
                request.getErrorCount(),
                request.getErrorKeys());

        testSessionRepository.save(session);
        analysisService.updateUserStats(user);

        return ResponseEntity.ok(new MessageResponse("Test submitted successfully!"));
    }

    @GetMapping("/history")
    public ResponseEntity<List<TestSession>> getUserHistory() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        List<TestSession> history = testSessionRepository.findByUserOrderByCompletedAtDesc(user);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/generate")
    public ResponseEntity<MessageResponse> getPersonalizedTest(
            @RequestParam(required = false, defaultValue = "medium") String length) {

        // Check if user is authenticated
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            User user = userRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Error: User not found."));
            String text = analysisService.generatePersonalizedText(user, length);
            return ResponseEntity.ok(new MessageResponse(text));
        } else {
            // Guest mode: generate random text (pass null user or handle in service)
            // We can use the same service method but need to handle null user
            String text = analysisService.generatePersonalizedText(null, length);
            return ResponseEntity.ok(new MessageResponse(text));
        }
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<TestSession>> getLeaderboard() {
        // Simple leaderboard: top 10 test sessions by WPM
        return ResponseEntity.ok(testSessionRepository.findTop10ByOrderByWpmDesc());
    }

    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfile() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));
        return ResponseEntity.ok(user);
    }
}
