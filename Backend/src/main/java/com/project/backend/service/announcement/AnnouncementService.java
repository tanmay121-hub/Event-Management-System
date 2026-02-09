package com.project.backend.service.announcement;
import com.project.backend.dto.announcement.request.CreateAnnouncementRequest;
import com.project.backend.dto.announcement.response.AnnouncementResponse;
import com.project.backend.entity.Announcement;
import com.project.backend.entity.Event;
import com.project.backend.entity.User;
import com.project.backend.repository.AnnouncementRepository;
import com.project.backend.repository.EventRepository;
import com.project.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public AnnouncementService(AnnouncementRepository announcementRepository,
                               EventRepository eventRepository,
                               UserRepository userRepository) {
        this.announcementRepository = announcementRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    // Create Announcement
    public AnnouncementResponse create(CreateAnnouncementRequest request,
                                       String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        Announcement announcement = new Announcement();

        announcement.setTitle(request.getTitle());
        announcement.setMessage(request.getMessage());
        announcement.setEvent(event);
        announcement.setCreatedBy(user);

        announcementRepository.save(announcement);

        return mapToResponse(announcement);
    }

    // Get by Event
    public List<AnnouncementResponse> getByEvent(Long eventId) {

        return announcementRepository
                .findByEventIdOrderByCreatedAtDesc(eventId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private AnnouncementResponse mapToResponse(Announcement a) {

        return new AnnouncementResponse(
                a.getId(),
                a.getTitle(),
                a.getMessage(),
                a.getCreatedBy().getEmail(),
                a.getCreatedAt()
        );
    }
}
