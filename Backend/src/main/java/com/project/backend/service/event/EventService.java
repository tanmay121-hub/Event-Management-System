package com.project.backend.service.event;

import com.project.backend.dto.event.request.CreateEventRequest;
import com.project.backend.dto.event.response.EventResponse;
import com.project.backend.entity.Event;
import com.project.backend.entity.EventStatus;
import com.project.backend.entity.Organization;
import com.project.backend.entity.User;
import com.project.backend.repository.EventRepository;
import com.project.backend.repository.OrganizationRepository;
import com.project.backend.repository.UserRepository;
import com.project.backend.exception.BadRequestException;
import com.project.backend.exception.ForbiddenException;
import com.project.backend.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;

    public EventService(EventRepository eventRepository,
                        OrganizationRepository organizationRepository,
                        UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.organizationRepository = organizationRepository;
        this.userRepository = userRepository;
    }

    // Create Event (DRAFT)
    public EventResponse create(CreateEventRequest request, String email) {
        User organizer = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Organization org = organizationRepository.findById(request.getOrganizationId())
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));

        // LOGIC FIX: Check if organization is approved
        if (!org.getStatus().name().equals("APPROVED")) {
            throw new BadRequestException("Organization must be approved before hosting events");
        }

        // LOGIC FIX: Check if user belongs to the organization (Optional, but good for security)
        // If there's an ownership relation, we should check it here.

        // LOGIC FIX: Date validation
        if (request.getStartTime().after(request.getEndTime())) {
            throw new BadRequestException("Start time must be before end time");
        }

        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setOrganizer(organizer);
        event.setOrganization(org);
        event.setStatus(EventStatus.DRAFT);
        event.setDeleted(false);

        eventRepository.save(event);
        return mapToResponse(event);
    }

    // Publish Event
    public EventResponse publish(Long id, String email) {
        Event event = getEvent(id);

        // LOGIC FIX: Authorization - only organizer or admin can publish
        if (!event.getOrganizer().getEmail().equals(email)) {
            // We should ideally check if the user is an admin here too, 
            // but for now let's enforce ownership.
            throw new ForbiddenException("You are not authorized to publish this event");
        }

        event.setStatus(EventStatus.PUBLISHED);
        eventRepository.save(event);
        return mapToResponse(event);
    }

    // Close Registration
    public EventResponse closeRegistration(Long id, String email) {
        Event event = getEvent(id);

        // LOGIC FIX: Authorization
        if (!event.getOrganizer().getEmail().equals(email)) {
            throw new ForbiddenException("You are not authorized to close registration for this event");
        }

        event.setStatus(EventStatus.REGISTRATION_CLOSED);
        eventRepository.save(event);
        return mapToResponse(event);
    }
    public List<EventResponse> getAll() {

        return eventRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Public: List Published Events
    public List<EventResponse> getPublished() {

        return eventRepository.findByStatus(EventStatus.PUBLISHED)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private Event getEvent(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
    }

    private EventResponse mapToResponse(Event e) {

        return new EventResponse(
                e.getId(),
                e.getTitle(),
                e.getDescription(),
                e.getStatus().name(),
                e.getStartTime(),
                e.getEndTime(),
                e.getOrganization().getName(),
                e.getOrganizer().getEmail()
        );
    }
}
