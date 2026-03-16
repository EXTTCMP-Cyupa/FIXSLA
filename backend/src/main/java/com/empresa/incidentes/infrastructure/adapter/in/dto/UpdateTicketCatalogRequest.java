package com.empresa.incidentes.infrastructure.adapter.in.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record UpdateTicketCatalogRequest(
        @NotNull UUID catalogoIncidenteId
) {
}
