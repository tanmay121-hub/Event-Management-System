package com.project.backend.service.admin;

import com.project.backend.dto.admin.response.RegistrationSummaryResponse;
import com.project.backend.dto.admin.response.UserSummaryResponse;
import com.project.backend.entity.Registration;
import com.project.backend.entity.RegistrationStatus;
import com.project.backend.entity.User;
import com.project.backend.repository.EventRepository;
import com.project.backend.repository.RegistrationRepository;
import com.project.backend.repository.UserRepository;
import com.project.backend.service.registration.RegistrationService;
import com.project.backend.exception.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final RegistrationService registrationService;

    public AdminService(UserRepository userRepository,
                        RegistrationRepository registrationRepository,
                        EventRepository eventRepository,
                        RegistrationService registrationService) {
        this.userRepository = userRepository;
        this.registrationRepository = registrationRepository;
        this.eventRepository = eventRepository;
        this.registrationService = registrationService;
    }

    // Get All Users
    public List<UserSummaryResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .filter(u -> !u.getDeleted())
                .map(u -> new UserSummaryResponse(
                        u.getId(),
                        u.getFullName(),
                        u.getEmail(),
                        u.getRole().name(),
                        u.getEnabled()
                ))
                .collect(Collectors.toList());
    }

    // Enable / Disable User
    public void updateUserStatus(Long userId, boolean enabled, String adminEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // LOGIC FIX: Prevent admin from disabling themselves
        if (user.getEmail().equals(adminEmail) && !enabled) {
            throw new BadRequestException("You cannot disable your own administrator account");
        }

        user.setEnabled(enabled);
        userRepository.save(user);
    }

    // Get Registrations by Event
    public List<RegistrationSummaryResponse> getRegistrationsByEvent(Long eventId) {

        return registrationRepository.findByEventId(eventId)
                .stream()
                .map(r -> new RegistrationSummaryResponse(
                        r.getId(),
                        r.getUser().getId(),
                        r.getUser().getEmail(),
                        r.getType().name(),
                        r.getStatus().name()
                ))
                .collect(Collectors.toList());
    }

    // Approve / Reject Registration (Admin Only endpoint calls Service)
    public void updateRegistrationStatus(Long regId, RegistrationStatus status, String adminEmail) {
        registrationService.updateStatus(regId, status, adminEmail);
    }

    // Basic Report: Total Events
    public long getTotalEvents() {
        return eventRepository.count();
    }

    // Basic Report: Total Users
    public long getTotalUsers() {
        return userRepository.count();
    }
}