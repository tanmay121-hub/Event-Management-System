package com.project.backend.dto.registration.request;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterEventRequest {

    private Long eventId;
    private String type; // INDIVIDUAL / TEAM
    private Long teamId; // optional
}
