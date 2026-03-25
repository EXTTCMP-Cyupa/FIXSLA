package com.empresa.incidentes.domain.port.in;

import java.util.UUID;

public record CreateTicketCommand(
        String codigo,
        String titulo,
        String descripcion,
        UUID solicitanteId,
        UUID catalogoIncidenteId,
        UUID ubicacionId,
        String numeroContacto
) {
}
