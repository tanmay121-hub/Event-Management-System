package com.project.backend.dto.admin.response;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSummaryResponse {

    private Long id;
    private String fullName;
    private String email;
    private String role;
    private boolean enabled;
}