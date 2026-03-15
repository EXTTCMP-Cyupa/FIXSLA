package com.empresa.incidentes.infrastructure.adapter.in;

import com.empresa.incidentes.infrastructure.adapter.in.dto.LoginRequest;
import com.empresa.incidentes.infrastructure.adapter.in.dto.LoginResponse;
import com.empresa.incidentes.infrastructure.security.JwtProperties;
import com.empresa.incidentes.infrastructure.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final JwtService jwtService;
    private final JwtProperties jwtProperties;

    public AuthController(JwtService jwtService, JwtProperties jwtProperties) {
        this.jwtService = jwtService;
        this.jwtProperties = jwtProperties;
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public Mono<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return Mono.fromSupplier(() -> {
            String role = normalizeRole(request.role());
            String token = jwtService.generateToken(request.username(), role);
            return new LoginResponse(
                    token,
                    "Bearer",
                    jwtProperties.expirationHours() * 3600,
                    request.username(),
                    role
            );
        });
    }

    private String normalizeRole(String rawRole) {
        if (rawRole == null || rawRole.isBlank()) {
            return "COLABORADOR";
        }

        String role = rawRole.trim().toUpperCase();
        return switch (role) {
            case "USER", "COLABORADOR" -> "COLABORADOR";
            case "TECH", "TECNICO" -> "TECNICO";
            case "ADMIN", "ADMINISTRADOR" -> "ADMIN";
            default -> "COLABORADOR";
        };
    }
}
