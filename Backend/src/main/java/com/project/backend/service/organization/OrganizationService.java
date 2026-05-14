package com.project.backend.service.organization;

import com.project.backend.dto.organization.request.CreateOrganizationRequest;
import com.project.backend.dto.organization.response.OrganizationResponse;
import com.project.backend.entity.Organization;
import com.project.backend.entity.OrganizationStatus;
import com.project.backend.entity.User;
import com.project.backend.repository.OrganizationRepository;
import com.project.backend.repository.UserRepository;
import com.project.backend.exception.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrganizationService {

    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;

    public OrganizationService(OrganizationRepository organizationRepository,
                               UserRepository userRepository) {
        this.organizationRepository = organizationRepository;
        this.userRepository = userRepository;
    }

    // Create Organization
    public OrganizationResponse create(CreateOrganizationRequest request, String email) {
        if (organizationRepository.existsByName(request.getName())) {
            throw new BadRequestException("Organization name already taken");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Organization org = new Organization();

        org.setName(request.getName());
        org.setDescription(request.getDescription());
        org.setStatus(OrganizationStatus.PENDING);
        org.setCreatedBy(user);
        org.setDeleted(false);

        organizationRepository.save(org);

        return mapToResponse(org);
    }

    // Approve / Reject (Admin Only)
    public OrganizationResponse updateStatus(Long id, OrganizationStatus status, String adminEmail) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));
        
        if (!admin.getRole().name().equals("ADMIN")) {
            throw new ForbiddenException("Only administrators can approve/reject organizations");
        }

        Organization org = organizationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));

        org.setStatus(status);

        // LOGIC FIX: Automatic Role Promotion
        if (status == OrganizationStatus.APPROVED) {
            User creator = org.getCreatedBy();
            if (creator.getRole() == com.project.backend.entity.Role.PARTICIPANT) {
                creator.setRole(com.project.backend.entity.Role.ORGANIZER);
                userRepository.save(creator);
            }
        }

        organizationRepository.save(org);
        return mapToResponse(org);
    }

    // Get Approved Organizations
    public List<OrganizationResponse> getApproved() {
        return organizationRepository
                .findByStatus(OrganizationStatus.APPROVED)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get All Organizations (Admin Only)
    public List<OrganizationResponse> getAll(String adminEmail) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));
        
        if (!admin.getRole().name().equals("ADMIN")) {
            throw new ForbiddenException("Only administrators can view the full organization directory");
        }

        return organizationRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private OrganizationResponse mapToResponse(Organization org) {

        return new OrganizationResponse(
                org.getId(),
                org.getName(),
                org.getDescription(),
                org.getStatus().name()
        );
    }
}