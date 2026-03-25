package com.empresa.incidentes.domain.port.in;

public record CreateUbicacionCommand(
        String nombre,
        String descripcion
) {
}
