package com.empresa.incidentes.domain.port.in;

import com.empresa.incidentes.domain.model.Ubicacion;
import reactor.core.publisher.Flux;

public interface ListUbicacionesUseCase {
    Flux<Ubicacion> handle();
}
