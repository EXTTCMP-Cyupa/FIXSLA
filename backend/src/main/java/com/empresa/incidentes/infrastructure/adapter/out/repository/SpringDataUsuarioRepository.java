package com.empresa.incidentes.infrastructure.adapter.out.repository;

import com.empresa.incidentes.domain.model.UsuarioRol;
import com.empresa.incidentes.infrastructure.adapter.out.entity.UsuarioEntity;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface SpringDataUsuarioRepository extends ReactiveCrudRepository<UsuarioEntity, UUID> {

    Mono<UsuarioEntity> findByUsername(String username);

    Flux<UsuarioEntity> findByRol(UsuarioRol rol);
}
