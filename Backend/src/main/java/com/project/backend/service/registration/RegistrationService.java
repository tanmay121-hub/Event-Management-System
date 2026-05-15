package com.project.backend.service.registration;

import com.project.backend.dto.registration.request.RegisterEventRequest;
import com.project.backend.entity.*;
import com.project.backend.repository.EventRepository;
import com.project.backend.repository.RegistrationRepository;
import com.project.backend.repository.TeamRepository;
import com.project.backend.repository.UserRepository;
import com.project.backend.exception.BadRequestException;
import com.project.backend.exception.*;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final TeamRepository teamRepository;

    public RegistrationService(RegistrationRepository registrationRepository,
                               UserRepository userRepository,
                               EventRepository eventRepository,
                               TeamRepository teamRepository) {
        this.registrationRepository = registrationRepository;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.teamRepository = teamRepository;
    }

    // Register Event
    public void register(RegisterEventRequest request, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (registrationRepository.existsByEventIdAndUserId(
                request.getEventId(), user.getId())) {
            throw new BadRequestException("Already registered for this event");
        }

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        // LOGIC FIX: Check event status
        if (!event.getStatus().name().equals("PUBLISHED")) {
            throw new BadRequestException("Registration is only open for published events");
        }

        // LOGIC FIX: Check registration deadline (cannot register after event starts)
        if (LocalDateTime.now().isAfter(event.getStartTime())) {
            throw new BadRequestException("Registration has closed as the event has already started");
        }

        Registration reg = new Registration();

        reg.setUser(user);
        reg.setEvent(event);
        reg.setType(RegistrationType.valueOf(request.getType()));
        reg.setStatus(RegistrationStatus.PENDING);

        if (request.getTeamId() != null) {
            Team team = teamRepository
                    .findById(request.getTeamId())
                    .orElseThrow(() -> new ResourceNotFoundException("Team not found"));

            // LOGIC FIX: Ensure team belongs to the event
            if (!team.getEvent().getId().equals(event.getId())) {
                throw new BadRequestException("This team does not belong to the selected event");
            }

            reg.setTeam(team);
        }

        registrationRepository.save(reg);
    }

    // Approve / Reject Registration (Admin or Organizer Only)
    public void updateStatus(Long id, RegistrationStatus status, String requesterEmail) {
        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Registration reg = registrationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found"));
        
        Event event = reg.getEvent();

        // LOGIC FIX: Authorization check
        boolean isAdmin = requester.getRole().name().equals("ADMIN");
        boolean isOrganizer = event.getOrganizer().getEmail().equals(requesterEmail);

        if (!isAdmin && !isOrganizer) {
            throw new ForbiddenException("You are not authorized to manage registrations for this event");
        }

        reg.setStatus(status);
        registrationRepository.save(reg);
    }
}