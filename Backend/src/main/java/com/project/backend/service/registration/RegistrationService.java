package com.project.backend.service.registration;

import com.project.backend.dto.registration.request.RegisterEventRequest;
import com.project.backend.entity.*;
import com.project.backend.repository.EventRepository;
import com.project.backend.repository.RegistrationRepository;
import com.project.backend.repository.TeamRepository;
import com.project.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

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
                .orElseThrow();

        if (registrationRepository.existsByEventIdAndUserId(
                request.getEventId(), user.getId())) {
            throw new RuntimeException("Already registered");
        }

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow();

        Registration reg = new Registration();

        reg.setUser(user);
        reg.setEvent(event);
        reg.setType(RegistrationType.valueOf(request.getType()));
        reg.setStatus(RegistrationStatus.PENDING);

        if (request.getTeamId() != null) {
            Team team = teamRepository
                    .findById(request.getTeamId())
                    .orElseThrow();

            reg.setTeam(team);
        }

        registrationRepository.save(reg);
    }
}