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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtTokenProvider tokenProvider;
    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(JwtTokenProvider tokenProvider,
                          CustomUserDetailsService userDetailsService) {
        this.tokenProvider = tokenProvider;
        this.userDetailsService = userDetailsService;
    }

    /* ================= PASSWORD ENCODER ================= */

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /* ================= AUTHENTICATION MANAGER ================= */

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /* ================= CORS CONFIGURATION ================= */

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(
                List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")
        );
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    /* ================= SECURITY FILTER CHAIN ================= */

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        JwtAuthenticationFilter jwtFilter =
                new JwtAuthenticationFilter(tokenProvider, userDetailsService);

        http
                .cors(cors -> {})
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth

                        /* ---------- PUBLIC ---------- */
                        .requestMatchers(
                                "/api/v1/auth/**",
                                "/api/v1/events/public/**",
                                "/api/v1/events/published",
                                "/health"
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

                        /* ---------- PARTICIPANT & COMMON ---------- */
                        .requestMatchers(
                                "/api/v1/registrations/**",
                                "/api/v1/teams/**",
                                "/api/v1/user/**"
                        ).hasAnyRole("PARTICIPANT", "ORGANIZER", "ADMIN")

                        /* ---------- EVERYTHING ELSE ---------- */
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
