package com.empresa.incidentes.domain.port.in;

import com.empresa.incidentes.domain.model.Usuario;
import reactor.core.publisher.Flux;

public interface ListUsuariosUseCase {

    Flux<Usuario> handle(ListUsuariosQuery query);
}
