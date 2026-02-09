package com.project.backend.service.admin;

import com.project.backend.dto.admin.response.RegistrationSummaryResponse;
import com.project.backend.dto.admin.response.UserSummaryResponse;
import com.project.backend.entity.Registration;
import com.project.backend.entity.RegistrationStatus;
import com.project.backend.entity.User;
import com.project.backend.repository.EventRepository;
import com.project.backend.repository.RegistrationRepository;
import com.project.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;

    public AdminService(UserRepository userRepository,
                        RegistrationRepository registrationRepository,
                        EventRepository eventRepository) {
        this.userRepository = userRepository;
        this.registrationRepository = registrationRepository;
        this.eventRepository = eventRepository;
    }

    // Get All Users
    public List<UserSummaryResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .filter(u -> !u.isDeleted())
                .map(u -> new UserSummaryResponse(
                        u.getId(),
                        u.getFullName(),
                        u.getEmail(),
                        u.getRole().name(),
                        u.isEnabled()
                ))
                .collect(Collectors.toList());
    }

    // Enable / Disable User
    public void updateUserStatus(Long userId, boolean enabled) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

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

    // Approve / Reject Registration
    public void updateRegistrationStatus(Long regId,
                                         RegistrationStatus status) {

        Registration reg = registrationRepository.findById(regId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));

        reg.setStatus(status);

        registrationRepository.save(reg);
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