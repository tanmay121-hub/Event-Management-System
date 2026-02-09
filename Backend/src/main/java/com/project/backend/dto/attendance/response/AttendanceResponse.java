package com.project.backend.dto.attendance.response;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceResponse {

    private Long userId;
    private String userEmail;
    private LocalDateTime checkInTime;
}
