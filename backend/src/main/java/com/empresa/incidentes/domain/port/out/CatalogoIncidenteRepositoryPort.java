package com.empresa.incidentes.domain.port.out;

import com.empresa.incidentes.domain.model.CatalogoIncidente;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface CatalogoIncidenteRepositoryPort {

    Mono<CatalogoIncidente> save(CatalogoIncidente catalogoIncidente);

    Mono<CatalogoIncidente> findById(UUID catalogoId);

    Flux<CatalogoIncidente> findAll();
}
