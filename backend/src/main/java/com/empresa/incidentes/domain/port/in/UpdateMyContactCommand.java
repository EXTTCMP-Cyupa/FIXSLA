package com.empresa.incidentes.domain.port.in;

public record UpdateMyContactCommand(
        String username,
        String numeroContacto
) {
}
