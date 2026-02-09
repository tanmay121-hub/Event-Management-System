package com.project.backend.controller.team;

import com.project.backend.dto.registration.request.CreateTeamRequest;
import com.project.backend.dto.registration.request.JoinTeamRequest;
import com.project.backend.entity.Team;
import com.project.backend.service.team.TeamService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/teams")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @PostMapping
    public ResponseEntity<Team> create(
            @RequestBody CreateTeamRequest request,
            Authentication auth) {

        return ResponseEntity.ok(
                teamService.create(request, auth.getName())
        );
    }

    @PostMapping("/join")
    public ResponseEntity<String> join(
            @RequestBody JoinTeamRequest request,
            Authentication auth) {

        teamService.join(request, auth.getName());

        return ResponseEntity.ok("Joined successfully");
    }
}
