package com.empresa.incidentes.domain.port.in;

import com.empresa.incidentes.domain.model.Usuario;
import reactor.core.publisher.Mono;

public interface CreateUsuarioUseCase {

    Mono<Usuario> handle(CreateUsuarioCommand command);
}
