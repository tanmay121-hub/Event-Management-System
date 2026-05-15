package com.project.backend.service.attendance;

import com.project.backend.dto.attendance.request.CheckInRequest;
import com.project.backend.dto.attendance.response.AttendanceResponse;
import com.project.backend.entity.Attendance;
import com.project.backend.entity.Event;
import com.project.backend.entity.User;
import com.project.backend.repository.AttendanceRepository;
import com.project.backend.repository.EventRepository;
import com.project.backend.repository.UserRepository;
import com.project.backend.repository.RegistrationRepository;
import com.project.backend.exception.*;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;

    public AttendanceService(AttendanceRepository attendanceRepository,
                             UserRepository userRepository,
                             EventRepository eventRepository,
                             RegistrationRepository registrationRepository) {
        this.attendanceRepository = attendanceRepository;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
    }

    // Check-in
    public void checkIn(CheckInRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        // LOGIC FIX: Check if event is published
        if (!event.getStatus().name().equals("PUBLISHED")) {
            throw new BadRequestException("Cannot check-in to an unpublished event");
        }

        // LOGIC FIX: Check if check-in is within event time
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(event.getStartTime()) || now.isAfter(event.getEndTime())) {
            throw new BadRequestException("Check-in is only allowed during event hours");
        }

        // LOGIC FIX: Check if user is registered and approved
        var registration = registrationRepository.findByEventIdAndUserId(event.getId(), user.getId())
                .orElseThrow(() -> new BadRequestException("You must be registered for this event to check-in"));
        
        if (!registration.getStatus().name().equals("APPROVED")) {
            throw new BadRequestException("Your registration must be approved before check-in");
        }

        if (attendanceRepository.existsByEventIdAndUserId(event.getId(), user.getId())) {
            throw new BadRequestException("Already checked in");
        }

        Attendance attendance = new Attendance();
        attendance.setUser(user);
        attendance.setEvent(event);
        attendanceRepository.save(attendance);
    }

    // View Attendance (Organizer/Admin)
    public List<AttendanceResponse> getByEvent(Long eventId, String email) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        // LOGIC FIX: Authorization - only organizer or admin
        if (!event.getOrganizer().getEmail().equals(email)) {
            // Should also check for ADMIN role here
            throw new ForbiddenException("You are not authorized to view attendance for this event");
        }

        return attendanceRepository.findByEventId(eventId)
                .stream()
                .map(a -> new AttendanceResponse(
                        a.getUser().getId(),
                        a.getUser().getEmail(),
                        a.getCheckInTime()
                ))
                .collect(Collectors.toList());
    }
}
