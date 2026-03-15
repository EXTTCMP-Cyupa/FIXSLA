package com.empresa.incidentes.domain.port.in;

import com.empresa.incidentes.domain.model.CatalogoIncidente;
import reactor.core.publisher.Mono;

public interface CreateCatalogoIncidenteUseCase {

    Mono<CatalogoIncidente> handle(CreateCatalogoIncidenteCommand command);
}
