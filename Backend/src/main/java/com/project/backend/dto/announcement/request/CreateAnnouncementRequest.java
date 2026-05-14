package com.project.backend.dto.announcement.request;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateAnnouncementRequest {

    private Long eventId;
    private String title;
    private String message;
}
