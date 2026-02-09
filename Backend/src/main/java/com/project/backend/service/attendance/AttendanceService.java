package com.project.backend.service.attendance;

import com.project.backend.dto.attendance.request.CheckInRequest;
import com.project.backend.dto.attendance.response.AttendanceResponse;
import com.project.backend.entity.Attendance;
import com.project.backend.entity.Event;
import com.project.backend.entity.User;
import com.project.backend.repository.AttendanceRepository;
import com.project.backend.repository.EventRepository;
import com.project.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;

    public AttendanceService(AttendanceRepository attendanceRepository,
                             UserRepository userRepository,
                             EventRepository eventRepository) {
        this.attendanceRepository = attendanceRepository;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
    }

    // Check-in
    public void checkIn(CheckInRequest request, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (attendanceRepository.existsByEventIdAndUserId(
                event.getId(), user.getId())) {
            throw new RuntimeException("Already checked in");
        }

        Attendance attendance = new Attendance();

        attendance.setUser(user);
        attendance.setEvent(event);

        attendanceRepository.save(attendance);
    }

    // View Attendance (Organizer/Admin)
    public List<AttendanceResponse> getByEvent(Long eventId) {

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
