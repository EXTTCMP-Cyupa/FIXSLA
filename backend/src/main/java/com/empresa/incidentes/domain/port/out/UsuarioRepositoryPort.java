package com.empresa.incidentes.domain.port.out;

import com.empresa.incidentes.domain.model.Usuario;
import com.empresa.incidentes.domain.model.UsuarioRol;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface UsuarioRepositoryPort {

    Mono<Usuario> save(Usuario usuario);

    Mono<Usuario> findById(java.util.UUID id);

    Flux<Usuario> findAll();

    Mono<Usuario> findByUsername(String username);

    Flux<Usuario> findByRolAndArea(UsuarioRol rol, String area);
}
