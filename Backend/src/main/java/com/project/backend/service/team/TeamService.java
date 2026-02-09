package com.project.backend.service.team;

import com.project.backend.dto.registration.request.CreateTeamRequest;
import com.project.backend.dto.registration.request.JoinTeamRequest;
import com.project.backend.entity.*;
import com.project.backend.repository.EventRepository;
import com.project.backend.repository.TeamMemberRepository;
import com.project.backend.repository.TeamRepository;
import com.project.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository memberRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;

    public TeamService(TeamRepository teamRepository,
                       TeamMemberRepository memberRepository,
                       UserRepository userRepository,
                       EventRepository eventRepository) {
        this.teamRepository = teamRepository;
        this.memberRepository = memberRepository;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
    }

    // Create Team
    public Team create(CreateTeamRequest request, String email) {

        User leader = userRepository.findByEmail(email)
                .orElseThrow();

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow();

        Team team = new Team();

        team.setName(request.getName());
        team.setEvent(event);
        team.setLeader(leader);
        team.setJoinCode(UUID.randomUUID().toString().substring(0, 6));

        teamRepository.save(team);

        TeamMember member = new TeamMember();
        member.setTeam(team);
        member.setUser(leader);
        member.setRole(TeamMemberRole.LEADER);

        memberRepository.save(member);

        return team;
    }

    // Join Team
    public void join(JoinTeamRequest request, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow();

        Team team = teamRepository
                .findByJoinCode(request.getJoinCode())
                .orElseThrow();

        if (memberRepository.existsByTeamIdAndUserId(
                team.getId(), user.getId())) {
            throw new RuntimeException("Already joined");
        }

        TeamMember member = new TeamMember();

        member.setTeam(team);
        member.setUser(user);
        member.setRole(TeamMemberRole.MEMBER);

        memberRepository.save(member);
    }
}