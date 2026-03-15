package com.empresa.incidentes.domain.model;

public interface TicketState {

    boolean canTransitionTo(TicketStatus nextStatus);
}
