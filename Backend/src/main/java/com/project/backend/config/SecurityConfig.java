package com.project.backend.config;

import com.project.backend.security.CustomUserDetailsService;
import com.project.backend.security.JwtAuthenticationFilter;
import com.project.backend.security.JwtTokenProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
@Configuration
public class SecurityConfig {

    private final JwtTokenProvider tokenProvider;
    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(JwtTokenProvider tokenProvider,
                          CustomUserDetailsService userDetailsService) {
        this.tokenProvider = tokenProvider;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        JwtAuthenticationFilter jwtFilter =
                new JwtAuthenticationFilter(tokenProvider, userDetailsService);

        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth

                        /* ---------- PUBLIC ---------- */
                        .requestMatchers(
                                "/api/v1/auth/**",
                                "/api/v1/events/public/**"
                        ).permitAll()

                        /* ---------- ADMIN ---------- */
                        .requestMatchers("/api/v1/admin/**")
                        .hasRole("ADMIN")

                        /* ---------- ORGANIZER ---------- */
                        .requestMatchers(
                                "/api/v1/events/**",
                                "/api/v1/announcements/**",
                                "/api/v1/attendance/**"
                        ).hasAnyRole("ADMIN", "ORGANIZER")

                        /* ---------- PARTICIPANT ---------- */
                        .requestMatchers(
                                "/api/v1/registrations/**",
                                "/api/v1/teams/**",
                                "/api/v1/user/**"
                        ).hasAnyRole("PARTICIPANT", "ADMIN")

                        /* ---------- EVERYTHING ELSE ---------- */
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
