package com.project.backend.service.announcement;
import com.project.backend.dto.announcement.request.CreateAnnouncementRequest;
import com.project.backend.dto.announcement.response.AnnouncementResponse;
import com.project.backend.entity.Announcement;
import com.project.backend.entity.Event;
import com.project.backend.entity.User;
import com.project.backend.repository.AnnouncementRepository;
import com.project.backend.repository.EventRepository;
import com.project.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import com.project.backend.repository.RegistrationRepository;
import com.project.backend.exception.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final RegistrationRepository registrationRepository;

    public AnnouncementService(AnnouncementRepository announcementRepository,
                               EventRepository eventRepository,
                               UserRepository userRepository,
                               RegistrationRepository registrationRepository) {
        this.announcementRepository = announcementRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.registrationRepository = registrationRepository;
    }


    // Create Announcement
    public AnnouncementResponse create(CreateAnnouncementRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        // LOGIC FIX: Authorization - only organizer or admin
        if (!event.getOrganizer().getEmail().equals(email)) {
            throw new ForbiddenException("You are not authorized to post announcements for this event");
        }

        Announcement announcement = new Announcement();
        announcement.setTitle(request.getTitle()); // Now using the request title
        announcement.setMessage(request.getMessage());
        announcement.setEvent(event);
        announcement.setCreatedBy(user);

        announcementRepository.save(announcement);
        return mapToResponse(announcement);
    }

    // Get by Event
    public List<AnnouncementResponse> getByEvent(Long eventId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        // LOGIC FIX: Privacy - only registered/approved participants or the organizer can see announcements
        boolean isOrganizer = event.getOrganizer().getEmail().equals(userEmail);
        boolean isRegistered = registrationRepository.existsByEventIdAndUserId(eventId, user.getId());
        // We could also check if registration status is APPROVED

        if (!isOrganizer && !isRegistered && !user.getRole().name().equals("ADMIN")) {
            throw new ForbiddenException("You must be registered for this event to view announcements");
        }

        return announcementRepository.findByEventIdOrderByCreatedAtDesc(eventId)
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
