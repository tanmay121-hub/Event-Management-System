package com.project.backend.dto.registration.request;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTeamRequest {

    private String name;
    private Long eventId;
}
