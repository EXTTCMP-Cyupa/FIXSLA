package com.empresa.incidentes.domain.port.out;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Collection;
import java.util.UUID;

public interface UsuarioCatalogoRepositoryPort {

    Flux<UUID> findCatalogoIdsByUsuarioId(UUID usuarioId);

    Mono<Void> syncCatalogos(UUID usuarioId, Collection<UUID> catalogoIds);
}
