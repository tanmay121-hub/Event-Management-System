package com.project.backend.repository;

import com.project.backend.entity.Event;
import com.project.backend.entity.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByStatus(EventStatus status);

    List<Event> findByOrganizerId(Long organizerId);

    List<Event> findByStartTimeBetween(LocalDateTime start, LocalDateTime end);
}
