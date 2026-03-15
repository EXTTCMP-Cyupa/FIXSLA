package com.empresa.incidentes.domain.model;

final class ResueltoTicketState implements TicketState {

    static final ResueltoTicketState INSTANCE = new ResueltoTicketState();

    private ResueltoTicketState() {
    }

    @Override
    public boolean canTransitionTo(TicketStatus nextStatus) {
        return false;
    }
}
