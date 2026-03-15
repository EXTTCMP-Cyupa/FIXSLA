package com.empresa.incidentes.domain.port.in;

import com.empresa.incidentes.domain.model.CatalogoIncidente;
import reactor.core.publisher.Flux;

public interface ListCatalogoIncidenteUseCase {

    Flux<CatalogoIncidente> handle(ListCatalogoIncidenteQuery query);
}
