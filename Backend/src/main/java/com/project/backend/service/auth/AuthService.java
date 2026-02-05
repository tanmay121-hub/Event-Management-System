package com.project.backend.service.auth;


import com.project.backend.dto.auth.request.LoginRequest;
import com.project.backend.dto.auth.request.RegisterRequest;
import com.project.backend.dto.auth.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
