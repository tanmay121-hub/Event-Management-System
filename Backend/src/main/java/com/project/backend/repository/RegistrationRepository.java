package com.project.backend.repository;


import com.project.backend.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RegistrationRepository
        extends JpaRepository<Registration, Long> {

    boolean existsByEventIdAndUserId(Long eventId, Long userId);

    List<Registration> findByEventId(Long eventId);

    java.util.Optional<com.project.backend.entity.Registration> findByEventIdAndUserId(Long eventId, Long userId);
}
