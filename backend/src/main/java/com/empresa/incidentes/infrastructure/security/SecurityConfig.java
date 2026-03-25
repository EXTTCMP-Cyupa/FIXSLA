package com.empresa.incidentes.infrastructure.security;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authentication.AuthenticationWebFilter;
import org.springframework.security.web.server.context.NoOpServerSecurityContextRepository;

@Configuration
@EnableWebFluxSecurity
@EnableConfigurationProperties(JwtProperties.class)
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(
            ServerHttpSecurity http,
            JwtAuthenticationManager authenticationManager,
            JwtServerAuthenticationConverter authenticationConverter
    ) {
        AuthenticationWebFilter authenticationWebFilter = new AuthenticationWebFilter(authenticationManager);
        authenticationWebFilter.setServerAuthenticationConverter(authenticationConverter);
        authenticationWebFilter.setSecurityContextRepository(NoOpServerSecurityContextRepository.getInstance());

        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
                .securityContextRepository(NoOpServerSecurityContextRepository.getInstance())
                .authorizeExchange(exchange -> exchange
                        .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .pathMatchers(HttpMethod.POST, "/api/v1/auth/login").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/v1/usuarios/me").authenticated()
                        .pathMatchers(HttpMethod.PATCH, "/api/v1/usuarios/me/contacto").authenticated()
                        .pathMatchers(HttpMethod.GET, "/api/v1/usuarios").hasAnyRole("TECNICO", "ADMIN")
                        .pathMatchers(HttpMethod.POST, "/api/v1/usuarios").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.PATCH, "/api/v1/usuarios/*").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.POST, "/api/v1/catalogos").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.GET, "/api/v1/catalogos", "/api/v1/catalogos/**")
                        .hasAnyRole("COLABORADOR", "TECNICO", "ADMIN")
                        .pathMatchers(HttpMethod.POST, "/api/v1/ubicaciones").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.PATCH, "/api/v1/ubicaciones/*").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.GET, "/api/v1/ubicaciones")
                        .hasAnyRole("COLABORADOR", "TECNICO", "ADMIN")
                        .pathMatchers(HttpMethod.PATCH, "/api/v1/tickets/*/status").hasAnyRole("TECNICO", "ADMIN")
                        .pathMatchers(HttpMethod.PATCH, "/api/v1/tickets/*/assignee").hasAnyRole("TECNICO", "ADMIN")
                        .pathMatchers(HttpMethod.PATCH, "/api/v1/tickets/*/catalogo").hasAnyRole("TECNICO", "ADMIN")
                        .pathMatchers(HttpMethod.POST, "/api/v1/tickets/*/notas").hasAnyRole("COLABORADOR", "TECNICO")
                        .pathMatchers(HttpMethod.POST, "/api/v1/tickets").hasAnyRole("COLABORADOR", "TECNICO", "ADMIN")
                        .pathMatchers(HttpMethod.GET, "/api/v1/tickets", "/api/v1/tickets/**")
                        .hasAnyRole("COLABORADOR", "TECNICO", "ADMIN")
                        .anyExchange().authenticated())
                .addFilterAt(authenticationWebFilter, SecurityWebFiltersOrder.AUTHENTICATION)
                .build();
    }
}
