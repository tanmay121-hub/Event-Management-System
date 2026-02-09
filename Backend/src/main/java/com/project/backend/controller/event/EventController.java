package com.project.backend.controller.event;

import com.project.backend.dto.event.request.CreateEventRequest;
import com.project.backend.dto.event.response.EventResponse;
import com.project.backend.service.event.EventService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    // Organizer: Create
    @PostMapping
    public ResponseEntity<EventResponse> create(
            @RequestBody CreateEventRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                eventService.create(request, email)
        );
    }

    // Organizer: Publish
    @PostMapping("/{id}/publish")
    public ResponseEntity<EventResponse> publish(@PathVariable Long id) {

        return ResponseEntity.ok(
                eventService.publish(id)
        );
    }

    // Organizer: Close Registration
    @PostMapping("/{id}/close")
    public ResponseEntity<EventResponse> close(@PathVariable Long id) {

        return ResponseEntity.ok(
                eventService.closeRegistration(id)
        );
    }

    // Public: View Published Events
    @GetMapping("/published")
    public ResponseEntity<List<EventResponse>> getPublished() {

        return ResponseEntity.ok(
                eventService.getPublished()
        );
    }
}
