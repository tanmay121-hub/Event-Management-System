package com.project.backend.controller.announcement;

import com.project.backend.dto.announcement.request.CreateAnnouncementRequest;
import com.project.backend.dto.announcement.response.AnnouncementResponse;
import com.project.backend.service.announcement.AnnouncementService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/announcements")
public class AnnouncementController {

    private final AnnouncementService announcementService;

    public AnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    // Organizer/Admin: Create
    @PostMapping
    public ResponseEntity<AnnouncementResponse> create(
            @RequestBody CreateAnnouncementRequest request,
            Authentication auth) {

        return ResponseEntity.ok(
                announcementService.create(request, auth.getName())
        );
    }

    // Participants: View by Event
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<AnnouncementResponse>> getByEvent(
            @PathVariable Long eventId) {

        return ResponseEntity.ok(
                announcementService.getByEvent(eventId)
        );
    }
}
