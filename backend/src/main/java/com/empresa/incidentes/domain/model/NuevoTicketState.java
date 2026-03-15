package com.empresa.incidentes.domain.model;

final class NuevoTicketState implements TicketState {

    static final NuevoTicketState INSTANCE = new NuevoTicketState();

    private NuevoTicketState() {
    }

    @Override
    public boolean canTransitionTo(TicketStatus nextStatus) {
        return nextStatus == TicketStatus.EN_PROCESO || nextStatus == TicketStatus.CANCELADO;
    }
}
