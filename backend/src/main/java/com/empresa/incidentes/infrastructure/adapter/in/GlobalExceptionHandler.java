package com.empresa.incidentes.infrastructure.adapter.in;

import com.empresa.incidentes.domain.exception.CatalogoIncidenteNotFoundException;
import com.empresa.incidentes.domain.exception.DomainException;
import com.empresa.incidentes.domain.exception.TicketNotFoundException;
import com.empresa.incidentes.infrastructure.adapter.in.dto.ApiErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.Instant;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({TicketNotFoundException.class, CatalogoIncidenteNotFoundException.class})
    public Mono<ResponseEntity<ApiErrorResponse>> handleNotFound(RuntimeException exception, ServerWebExchange exchange) {
        return buildResponse(HttpStatus.NOT_FOUND, exception, exchange.getRequest().getPath().value());
    }

    @ExceptionHandler(DomainException.class)
    public Mono<ResponseEntity<ApiErrorResponse>> handleDomain(DomainException exception, ServerWebExchange exchange) {
        return buildResponse(HttpStatus.BAD_REQUEST, exception, exchange.getRequest().getPath().value());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public Mono<ResponseEntity<ApiErrorResponse>> handleArgument(IllegalArgumentException exception, ServerWebExchange exchange) {
        return buildResponse(HttpStatus.BAD_REQUEST, exception, exchange.getRequest().getPath().value());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public Mono<ResponseEntity<ApiErrorResponse>> handleAccessDenied(AccessDeniedException exception, ServerWebExchange exchange) {
        return buildResponse(HttpStatus.FORBIDDEN, exception, exchange.getRequest().getPath().value());
    }

    private Mono<ResponseEntity<ApiErrorResponse>> buildResponse(HttpStatus status, Exception exception, String path) {
        return Mono.just(ResponseEntity.status(status).body(
                new ApiErrorResponse(
                        Instant.now(),
                        status.value(),
                        status.getReasonPhrase(),
                        exception.getMessage(),
                        path
                )
        ));
    }
}
