package com.empresa.incidentes.infrastructure.adapter.in.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record CreateTicketRequest(
        String codigo,
        @NotBlank String titulo,
        @NotBlank String descripcion,
        @NotNull UUID solicitanteId,
        @NotNull UUID catalogoIncidenteId
) {
}
