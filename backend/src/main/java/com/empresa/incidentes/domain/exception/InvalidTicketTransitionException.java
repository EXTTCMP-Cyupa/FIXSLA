package com.empresa.incidentes.domain.exception;

public class InvalidTicketTransitionException extends DomainException {

    public InvalidTicketTransitionException(String message) {
        super(message);
    }
}
