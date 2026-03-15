package com.empresa.incidentes.domain.model;

public enum TicketStatus {
    NUEVO,
    EN_PROCESO,
    PENDIENTE,
    RESUELTO,
    CANCELADO;

    public boolean isFinalState() {
        return this == RESUELTO || this == CANCELADO;
    }
}
