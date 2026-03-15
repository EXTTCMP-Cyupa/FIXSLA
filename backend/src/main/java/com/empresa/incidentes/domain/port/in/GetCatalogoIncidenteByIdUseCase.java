package com.empresa.incidentes.domain.port.in;

import com.empresa.incidentes.domain.model.CatalogoIncidente;
import java.util.UUID;
import reactor.core.publisher.Mono;

public interface GetCatalogoIncidenteByIdUseCase {

    Mono<CatalogoIncidente> handle(UUID catalogoId);
}
