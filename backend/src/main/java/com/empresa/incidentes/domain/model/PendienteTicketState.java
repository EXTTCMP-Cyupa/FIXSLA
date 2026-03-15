package com.empresa.incidentes.domain.model;

final class PendienteTicketState implements TicketState {

    static final PendienteTicketState INSTANCE = new PendienteTicketState();

    private PendienteTicketState() {
    }

    @Override
    public boolean canTransitionTo(TicketStatus nextStatus) {
        return nextStatus == TicketStatus.EN_PROCESO || nextStatus == TicketStatus.CANCELADO;
    }
}
