package com.empresa.incidentes.domain.model;

final class CanceladoTicketState implements TicketState {

    static final CanceladoTicketState INSTANCE = new CanceladoTicketState();

    private CanceladoTicketState() {
    }

    @Override
    public boolean canTransitionTo(TicketStatus nextStatus) {
        return false;
    }
}
