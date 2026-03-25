package com.empresa.incidentes.domain.port.out;

import com.empresa.incidentes.domain.model.Ubicacion;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface UbicacionRepositoryPort {
    Mono<Ubicacion> save(Ubicacion ubicacion);
    Mono<Ubicacion> findById(UUID id);
    Flux<Ubicacion> findAll();
}
