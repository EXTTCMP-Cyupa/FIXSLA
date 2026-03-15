package com.empresa.incidentes.infrastructure.adapter.in.dto;

import com.empresa.incidentes.domain.model.TicketStatus;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record UpdateTicketStatusRequest(
        @NotNull TicketStatus nextStatus,
        UUID tecnicoAsignadoId
) {
}
