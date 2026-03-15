package com.empresa.incidentes.domain.exception;

import java.util.UUID;

public class InactiveCatalogoIncidenteException extends DomainException {

    public InactiveCatalogoIncidenteException(UUID catalogoId) {
        super("El catálogo de incidente " + catalogoId + " está inactivo");
    }
}
