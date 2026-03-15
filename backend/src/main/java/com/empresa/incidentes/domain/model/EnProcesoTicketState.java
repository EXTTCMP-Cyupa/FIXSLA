package com.empresa.incidentes.domain.model;

final class EnProcesoTicketState implements TicketState {

    static final EnProcesoTicketState INSTANCE = new EnProcesoTicketState();

    private EnProcesoTicketState() {
    }

    @Override
    public boolean canTransitionTo(TicketStatus nextStatus) {
        return nextStatus == TicketStatus.PENDIENTE
                || nextStatus == TicketStatus.RESUELTO
                || nextStatus == TicketStatus.CANCELADO;
    }
}
