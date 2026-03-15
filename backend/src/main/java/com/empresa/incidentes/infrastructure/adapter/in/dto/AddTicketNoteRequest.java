package com.empresa.incidentes.infrastructure.adapter.in.dto;

import jakarta.validation.constraints.NotBlank;

public record AddTicketNoteRequest(
        @NotBlank String nota
) {
}
