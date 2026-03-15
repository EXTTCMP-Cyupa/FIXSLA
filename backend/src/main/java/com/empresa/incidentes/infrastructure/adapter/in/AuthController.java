package com.empresa.incidentes.infrastructure.adapter.in;

import com.empresa.incidentes.domain.model.Usuario;
import com.empresa.incidentes.domain.port.out.UsuarioRepositoryPort;
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
    private final UsuarioRepositoryPort usuarioRepositoryPort;

    public AuthController(
            JwtService jwtService,
            JwtProperties jwtProperties,
            UsuarioRepositoryPort usuarioRepositoryPort
    ) {
        this.jwtService = jwtService;
        this.jwtProperties = jwtProperties;
        this.usuarioRepositoryPort = usuarioRepositoryPort;
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public Mono<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        String username = normalizeUsername(request.username());
        return usuarioRepositoryPort.findByUsername(username)
                .switchIfEmpty(Mono.error(new IllegalArgumentException("Usuario no registrado")))
                .map(this::buildLoginResponse);
    }

    private LoginResponse buildLoginResponse(Usuario usuario) {
        String role = usuario.rol().name();
        String token = jwtService.generateToken(usuario.username(), role);
        return new LoginResponse(
                token,
                "Bearer",
                jwtProperties.expirationHours() * 3600,
                usuario.username(),
                role
        );
    }

    private String normalizeUsername(String username) {
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("El username es obligatorio");
        }
        return username.trim().toLowerCase();
    }
}
