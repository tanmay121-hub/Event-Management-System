package com.project.backend.dto.organization.response;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrganizationResponse {

    private Long id;
    private String name;
    private String description;
    private String status;
}
