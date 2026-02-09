package com.project.backend.repository;

import com.project.backend.entity.Organization;
import com.project.backend.entity.OrganizationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {

    List<Organization> findByStatus(OrganizationStatus status);

    boolean existsByName(String name);
}
