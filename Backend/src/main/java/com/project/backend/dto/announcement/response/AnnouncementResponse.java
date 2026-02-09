package com.project.backend.dto.announcement.response;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnnouncementResponse {

    private Long id;
    private String title;
    private String message;
    private String createdBy;
    private LocalDateTime createdAt;
}