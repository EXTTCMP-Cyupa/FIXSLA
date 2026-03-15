package com.empresa.incidentes.domain.exception;

import java.util.UUID;

public class TicketNotFoundException extends DomainException {

    public TicketNotFoundException(UUID ticketId) {
        super("No se encontró el ticket con id " + ticketId);
    }
}
