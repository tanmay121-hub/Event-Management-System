package com.project.backend.controller.registration;

import com.project.backend.dto.registration.request.RegisterEventRequest;
import com.project.backend.service.registration.RegistrationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/registrations")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(
            RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @PostMapping
    public ResponseEntity<String> register(
            @RequestBody RegisterEventRequest request,
            Authentication auth) {

        registrationService.register(request, auth.getName());

        return ResponseEntity.ok("Registered successfully");
    }
}
