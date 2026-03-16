package com.empresa.incidentes.domain.exception;

import java.util.UUID;

public class UsuarioNotFoundException extends DomainException {

    public UsuarioNotFoundException(UUID userId) {
        super("Usuario no encontrado: " + userId);
    }
}
