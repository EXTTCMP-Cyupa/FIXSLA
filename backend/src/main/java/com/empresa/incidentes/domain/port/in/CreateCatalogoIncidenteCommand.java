package com.empresa.incidentes.domain.port.in;

import com.empresa.incidentes.domain.model.TicketPriority;

public record CreateCatalogoIncidenteCommand(
        String nombre,
        String descripcion,
        TicketPriority prioridadPorDefecto
) {
}
