package com.project.backend.controller.organization;

import com.project.backend.dto.organization.request.CreateOrganizationRequest;
import com.project.backend.dto.organization.response.OrganizationResponse;
import com.project.backend.entity.OrganizationStatus;
import com.project.backend.service.organization.OrganizationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/v1/organizations")
public class OrganizationController {

    private final OrganizationService organizationService;

    public OrganizationController(OrganizationService organizationService) {
        this.organizationService = organizationService;
    }

    // Organizer creates organization
    @PostMapping
    public ResponseEntity<OrganizationResponse> create(
            @RequestBody CreateOrganizationRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                organizationService.create(request, email)
        );
    }

    // Public: view approved organizations
    @GetMapping("/approved")
    public ResponseEntity<List<OrganizationResponse>> getApproved() {

        return ResponseEntity.ok(
                organizationService.getApproved()
        );
    }

    // Admin: approve/reject
    @PostMapping("/{id}/status")
    public ResponseEntity<OrganizationResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam OrganizationStatus status,
            Authentication authentication) {

        return ResponseEntity.ok(
                organizationService.updateStatus(id, status, authentication.getName())
        );
    }

    // Admin: view all (directory)
    @GetMapping("/directory")
    public ResponseEntity<List<OrganizationResponse>> getAll(Authentication authentication) {
        return ResponseEntity.ok(
                organizationService.getAll(authentication.getName())
        );
    }
}
