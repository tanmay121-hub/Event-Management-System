package com.project.backend.service.auth;
import com.project.backend.dto.auth.request.LoginRequest;
import com.project.backend.dto.auth.request.RegisterRequest;
import com.project.backend.dto.auth.response.AuthResponse;
import com.project.backend.entity.Role;
import com.project.backend.entity.User;
import com.project.backend.repository.UserRepository;
import com.project.backend.security.JwtTokenProvider;
import com.project.backend.exception.BadRequestException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthServiceImpl(UserRepository userRepository,
                           BCryptPasswordEncoder passwordEncoder,
                           JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setEnabled(true);
        user.setDeleted(false);

        userRepository.save(user);

        String token = tokenProvider.generateToken(user.getEmail(), user.getRole().name());
        String refreshToken = tokenProvider.generateRefreshToken(user.getEmail(), user.getRole().name());

        return new AuthResponse(token, refreshToken, user.getEmail(), user.getRole().name());
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        String token = tokenProvider.generateToken(user.getEmail(), user.getRole().name());
        String refreshToken = tokenProvider.generateRefreshToken(user.getEmail(), user.getRole().name());

        return new AuthResponse(token, refreshToken, user.getEmail(), user.getRole().name());
    }

    @Override
    public AuthResponse refreshToken(String refreshToken) {
        if (!tokenProvider.validateToken(refreshToken)) {
            throw new BadRequestException("Invalid refresh token");
        }

        String email = tokenProvider.getEmailFromToken(refreshToken);
        String role = tokenProvider.getRoleFromToken(refreshToken);

        String newToken = tokenProvider.generateToken(email, role);
        String newRefreshToken = tokenProvider.generateRefreshToken(email, role);

        return new AuthResponse(newToken, newRefreshToken, email, role);
    }
}
