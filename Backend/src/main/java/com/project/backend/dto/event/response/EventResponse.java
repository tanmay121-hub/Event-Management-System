package com.project.backend.dto.event.response;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventResponse {

    private Long id;
    private String title;
    private String description;
    private String status;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private String organizationName;
    private String organizerEmail;
}