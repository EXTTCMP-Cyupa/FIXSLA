package com.empresa.incidentes.infrastructure.adapter.in.dto;

import com.empresa.incidentes.domain.model.TicketPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateCatalogoIncidenteRequest(
        @NotBlank String nombre,
        String descripcion,
        @NotNull TicketPriority prioridadPorDefecto
) {
}
