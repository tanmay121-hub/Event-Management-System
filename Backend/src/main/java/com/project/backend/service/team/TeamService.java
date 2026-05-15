package com.project.backend.service.team;

import com.project.backend.dto.registration.request.CreateTeamRequest;
import com.project.backend.dto.registration.request.JoinTeamRequest;
import com.project.backend.dto.team.response.TeamResponse;
import com.project.backend.entity.*;
import com.project.backend.repository.EventRepository;
import com.project.backend.repository.TeamMemberRepository;
import com.project.backend.repository.TeamRepository;
import com.project.backend.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import com.project.backend.exception.*;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.UUID;

@RequiredArgsConstructor
@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository memberRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final JavaMailSender mailSender;

    // Create Team
    public TeamResponse create(CreateTeamRequest request, String email) {
        User leader = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        // LOGIC FIX: Check event status
        if (!event.getStatus().name().equals("PUBLISHED")) {
            throw new BadRequestException("Teams can only be created for published events");
        }

        // LOGIC FIX: Prevent duplicate team name in same event
        if (teamRepository.existsByEventIdAndName(event.getId(), request.getName())) {
            throw new BadRequestException("A team with this name already exists for this event");
        }

        // LOGIC FIX: Check if user already in a team for this event
        if (memberRepository.existsByTeamEventIdAndUserId(event.getId(), leader.getId())) {
            throw new BadRequestException("You are already a member of a team for this event");
        }

        Team team = new Team();
        team.setName(request.getName());
        team.setEvent(event);
        team.setLeader(leader);
        String code = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        team.setJoinCode(code);

        Team saved = teamRepository.save(team);

        TeamMember member = new TeamMember();
        member.setTeam(team);
        member.setUser(leader);
        member.setRole(TeamMemberRole.LEADER);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true);

            helper.setTo(leader.getEmail());
            helper.setSubject("Team Created: " + request.getName() + " - Join Code");
            helper.setText("""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Team Join Code</title>
        </head>
        <body style="margin:0; padding:0; background-color:#f4f6f9; font-family:Arial, sans-serif;">
        
            <table align="center" width="100%%" cellpadding="0" cellspacing="0" 
                   style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.08);">

                <!-- Header -->
                <tr>
                    <td style="background:#1e293b; padding:20px; text-align:center; color:white;">
                        <h2 style="margin:0;">%s</h2>
                        <p style="margin:5px 0 0; font-size:14px;">Team Invitation</p>
                    </td>
                </tr>

                <!-- Content -->
                <tr>
                    <td style="padding:30px;">
                        <p style="font-size:16px;">Hi <strong>%s</strong>,</p>

                        <p style="font-size:15px; line-height:1.6;">
                            You have been invited to join the team 
                            <strong>%s</strong> for the event 
                            <strong>%s</strong>.
                        </p>

                        <p style="margin-top:20px; font-size:15px;">
                            Use the following join code to become a member:
                        </p>

                        <!-- Join Code Box -->
                        <div style="margin:25px 0; text-align:center;">
                            <span style="display:inline-block; padding:15px 30px; 
                                         font-size:22px; letter-spacing:3px; 
                                         background:#2563eb; color:#ffffff; 
                                         border-radius:8px; font-weight:bold;">
                                %s
                            </span>
                        </div>

                        <p style="font-size:14px; color:#555;">
                            Enter this code inside the platform to join the team.
                        </p>

                        <p style="margin-top:30px; font-size:14px; color:#888;">
                            If you did not expect this invitation, please ignore this email.
                        </p>
                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td style="background:#f1f5f9; padding:15px; text-align:center; font-size:12px; color:#777;">
                        © %d Your Event Platform. All rights reserved.
                    </td>
                </tr>

            </table>
        </body>
        </html>
        """.formatted(
                        event.getTitle(),
                        leader.getFullName(),
                        request.getName(),
                        event.getTitle(),
                        code,
                        java.time.Year.now().getValue())

, true);

            mailSender.send(message);

        } catch (Exception e) {
            // LOGIC FIX: Do not fail the whole transaction if email fails
            System.err.println("Failed to send team creation email: " + e.getMessage());
        }

        memberRepository.save(member);


        

        return TeamResponse.builder()
                .id(saved.getId())
                .name(saved.getName())
                .joinCode(saved.getJoinCode())
                .eventId(event.getId())
                .build();
    }

    public void join(JoinTeamRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Team team = teamRepository.findByJoinCode(request.getJoinCode())
                .orElseThrow(() -> new BadRequestException("Invalid join code"));

        Event event = team.getEvent();

        // LOGIC FIX: Check event status
        if (!event.getStatus().name().equals("PUBLISHED")) {
            throw new BadRequestException("Teams can only be joined for published events");
        }

        // LOGIC FIX: Check if user already in a team for this event
        if (memberRepository.existsByTeamEventIdAndUserId(event.getId(), user.getId())) {
            throw new BadRequestException("You are already a member of a team for this event");
        }

        TeamMember member = new TeamMember();
        member.setTeam(team);
        member.setUser(user);
        member.setRole(TeamMemberRole.MEMBER);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(user.getEmail());
            helper.setSubject("Successfully Joined Team: " + team.getName());
            helper.setText("Congratulations! You have successfully joined " + team.getName() + " for " + event.getTitle(), true);
            mailSender.send(message);
        } catch (MessagingException e) {
            // Log error but don't fail the join process
        }
        memberRepository.save(member);
    }
}