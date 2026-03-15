package com.empresa.incidentes.infrastructure.security;

import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
public class JwtAuthenticationManager implements ReactiveAuthenticationManager {

    private final JwtService jwtService;

    public JwtAuthenticationManager(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public Mono<Authentication> authenticate(Authentication authentication) {
        return Mono.fromSupplier(() -> jwtService.parseToken(authentication.getCredentials().toString()))
                .map(claims -> new UsernamePasswordAuthenticationToken(
                        claims.getSubject(),
                        authentication.getCredentials(),
                        List.of(new SimpleGrantedAuthority("ROLE_" + claims.get("role", String.class)))
                ));
    }
}
