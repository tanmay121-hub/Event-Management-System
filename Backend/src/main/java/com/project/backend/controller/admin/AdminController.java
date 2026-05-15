package com.project.backend.controller.admin;

import com.project.backend.dto.admin.response.RegistrationSummaryResponse;
import com.project.backend.dto.admin.response.UserSummaryResponse;
import com.project.backend.entity.RegistrationStatus;
import com.project.backend.service.admin.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserSummaryResponse>> getUsers() {

        return ResponseEntity.ok(
                adminService.getAllUsers()
        );
    }

    @PostMapping("/users/{id}/status")
    public ResponseEntity<String> updateUserStatus(
            @PathVariable Long id,
            @RequestParam boolean enabled,
            org.springframework.security.core.Authentication auth) {

        adminService.updateUserStatus(id, enabled, auth.getName());

        return ResponseEntity.ok("User status updated");
    }

    @GetMapping("/events/{eventId}/registrations")
    public ResponseEntity<List<RegistrationSummaryResponse>>
    getRegistrations(@PathVariable Long eventId) {

        return ResponseEntity.ok(
                adminService.getRegistrationsByEvent(eventId)
        );
    }

    @PostMapping("/registrations/{id}/status")
    public ResponseEntity<String> updateRegistrationStatus(
            @PathVariable Long id,
            @RequestParam RegistrationStatus status,
            org.springframework.security.core.Authentication auth) {

        adminService.updateRegistrationStatus(id, status, auth.getName());

        return ResponseEntity.ok("Registration status updated");
    }

    @GetMapping("/reports/summary")
    public ResponseEntity<String> getSummary() {

        long users = adminService.getTotalUsers();
        long events = adminService.getTotalEvents();

        return ResponseEntity.ok(
                "Users: " + users + ", Events: " + events
        );
    }
}
