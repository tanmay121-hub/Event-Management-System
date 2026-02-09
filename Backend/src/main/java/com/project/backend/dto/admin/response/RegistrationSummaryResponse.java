package com.project.backend.dto.admin.response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationSummaryResponse {

    private Long id;
    private Long userId;
    private String userEmail;
    private String type;
    private String status;
}
