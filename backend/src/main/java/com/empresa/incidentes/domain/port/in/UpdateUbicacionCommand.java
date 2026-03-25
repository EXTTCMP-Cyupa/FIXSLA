package com.empresa.incidentes.domain.port.in;

import java.util.UUID;

public record UpdateUbicacionCommand(
        UUID id,
        String nombre,
        String descripcion,
        Boolean activo
) {
}
