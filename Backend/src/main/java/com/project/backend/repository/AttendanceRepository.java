package com.project.backend.repository;

import com.project.backend.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttendanceRepository
        extends JpaRepository<Attendance, Long> {

    boolean existsByEventIdAndUserId(Long eventId, Long userId);

    List<Attendance> findByEventId(Long eventId);
}
