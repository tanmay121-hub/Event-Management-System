package com.project.backend.repository;

import com.project.backend.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TeamRepository extends JpaRepository<Team, Long> {

    List<Team> findByEventId(Long eventId);

    Optional<Team> findByJoinCode(String joinCode);
}
