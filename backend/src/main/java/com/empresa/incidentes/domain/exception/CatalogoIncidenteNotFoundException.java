package com.empresa.incidentes.domain.exception;

import java.util.UUID;

public class CatalogoIncidenteNotFoundException extends DomainException {

    public CatalogoIncidenteNotFoundException(UUID catalogoId) {
        super("No se encontró el catálogo de incidente con id " + catalogoId);
    }
}
