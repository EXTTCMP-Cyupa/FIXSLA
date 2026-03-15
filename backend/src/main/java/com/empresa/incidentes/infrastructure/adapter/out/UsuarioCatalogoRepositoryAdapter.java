package com.empresa.incidentes.infrastructure.adapter.out;

import com.empresa.incidentes.domain.port.out.UsuarioCatalogoRepositoryPort;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Collection;
import java.util.UUID;

@Component
public class UsuarioCatalogoRepositoryAdapter implements UsuarioCatalogoRepositoryPort {

    private final DatabaseClient databaseClient;

    public UsuarioCatalogoRepositoryAdapter(DatabaseClient databaseClient) {
        this.databaseClient = databaseClient;
    }

    @Override
    public Flux<UUID> findCatalogoIdsByUsuarioId(UUID usuarioId) {
        return databaseClient
                .sql("SELECT catalogo_id FROM usuario_catalogo WHERE usuario_id = :usuarioId")
                .bind("usuarioId", usuarioId)
                .map((row, metadata) -> row.get("catalogo_id", UUID.class))
                .all();
    }

    @Override
    public Mono<Void> syncCatalogos(UUID usuarioId, Collection<UUID> catalogoIds) {
        Mono<Void> deleteExisting = databaseClient
                .sql("DELETE FROM usuario_catalogo WHERE usuario_id = :usuarioId")
                .bind("usuarioId", usuarioId)
                .then();

        if (catalogoIds == null || catalogoIds.isEmpty()) {
            return deleteExisting;
        }

        return deleteExisting.thenMany(
                Flux.fromIterable(catalogoIds)
                        .flatMap(catalogoId -> databaseClient
                                .sql("INSERT INTO usuario_catalogo (usuario_id, catalogo_id) VALUES (:usuarioId, :catalogoId)")
                                .bind("usuarioId", usuarioId)
                                .bind("catalogoId", catalogoId)
                                .then())
        ).then();
    }
}
