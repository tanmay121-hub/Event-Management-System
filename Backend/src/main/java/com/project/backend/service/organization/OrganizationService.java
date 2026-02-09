package com.project.backend.service.organization;

import com.project.backend.dto.organization.request.CreateOrganizationRequest;
import com.project.backend.dto.organization.response.OrganizationResponse;
import com.project.backend.entity.Organization;
import com.project.backend.entity.OrganizationStatus;
import com.project.backend.entity.User;
import com.project.backend.repository.OrganizationRepository;
import com.project.backend.repository.UserRepository;
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
    public OrganizationResponse create(CreateOrganizationRequest request,
                                       String email) {

        if (organizationRepository.existsByName(request.getName())) {
            throw new RuntimeException("Organization already exists");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Organization org = new Organization();

        org.setName(request.getName());
        org.setDescription(request.getDescription());
        org.setStatus(OrganizationStatus.PENDING);
        org.setCreatedBy(user);
        org.setDeleted(false);

        organizationRepository.save(org);

        return mapToResponse(org);
    }

    // Approve / Reject
    public OrganizationResponse updateStatus(Long id,
                                             OrganizationStatus status) {

        Organization org = organizationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Organization not found"));

        org.setStatus(status);

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

    private OrganizationResponse mapToResponse(Organization org) {

        return new OrganizationResponse(
                org.getId(),
                org.getName(),
                org.getDescription(),
                org.getStatus().name()
        );
    }
}