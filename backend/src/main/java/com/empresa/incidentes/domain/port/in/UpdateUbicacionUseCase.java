package com.empresa.incidentes.domain.port.in;

import com.empresa.incidentes.domain.model.Ubicacion;
import reactor.core.publisher.Mono;

public interface UpdateUbicacionUseCase {
    Mono<Ubicacion> handle(UpdateUbicacionCommand command);
}
