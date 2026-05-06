package com.appkhila.server.controller;

import com.appkhila.server.dto.AuthRequest;
import com.appkhila.server.dto.UserResponse;
import com.appkhila.server.repository.UserRepository;
import com.appkhila.server.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authManager;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest req) {
        try {
            authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
        }
        var user = userRepository.findByEmail(req.getEmail()).orElseThrow();
        String token = jwtUtil.generate(user.getEmail(), user.getRole().name());
        return ResponseEntity.ok(Map.of("token", token, "user", UserResponse.from(user)));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication auth) {
        var user = userRepository.findByEmail(auth.getName()).orElseThrow();
        return ResponseEntity.ok(UserResponse.from(user));
    }
}
