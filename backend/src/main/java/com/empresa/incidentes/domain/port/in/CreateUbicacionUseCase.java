package com.empresa.incidentes.domain.port.in;

import com.empresa.incidentes.domain.model.Ubicacion;
import reactor.core.publisher.Mono;

public interface CreateUbicacionUseCase {
    Mono<Ubicacion> handle(CreateUbicacionCommand command);
}
