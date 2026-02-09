package com.project.backend.controller.attendance;

import com.project.backend.dto.attendance.request.CheckInRequest;
import com.project.backend.dto.attendance.response.AttendanceResponse;
import com.project.backend.service.attendance.AttendanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    // Participant: Check-in
    @PostMapping("/checkin")
    public ResponseEntity<String> checkIn(
            @RequestBody CheckInRequest request,
            Authentication auth) {

        attendanceService.checkIn(request, auth.getName());

        return ResponseEntity.ok("Check-in successful");
    }

    // Organizer/Admin: View attendance
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<AttendanceResponse>> getByEvent(
            @PathVariable Long eventId) {

        return ResponseEntity.ok(
                attendanceService.getByEvent(eventId)
        );
    }
}
