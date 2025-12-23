package com.typing.ai.repository;

import com.typing.ai.model.TestSession;
import com.typing.ai.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestSessionRepository extends JpaRepository<TestSession, Long> {
    List<TestSession> findByUserOrderByCompletedAtDesc(User user);

    List<TestSession> findTop10ByOrderByWpmDesc();
}
