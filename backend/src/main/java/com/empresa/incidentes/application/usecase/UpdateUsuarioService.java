package com.empresa.incidentes.application.usecase;

import com.empresa.incidentes.domain.exception.UsuarioNotFoundException;
import com.empresa.incidentes.domain.model.Usuario;
import com.empresa.incidentes.domain.model.UsuarioRol;
import com.empresa.incidentes.domain.port.in.UpdateUsuarioCommand;
import com.empresa.incidentes.domain.port.in.UpdateUsuarioUseCase;
import com.empresa.incidentes.domain.port.out.ClockPort;
import com.empresa.incidentes.domain.port.out.UsuarioRepositoryPort;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
public class UpdateUsuarioService implements UpdateUsuarioUseCase {

    private final UsuarioRepositoryPort usuarioRepository;
    private final ClockPort clockPort;

    public UpdateUsuarioService(UsuarioRepositoryPort usuarioRepository, ClockPort clockPort) {
        this.usuarioRepository = usuarioRepository;
        this.clockPort = clockPort;
    }

    @Override
    public Mono<Usuario> handle(UpdateUsuarioCommand command) {
        return usuarioRepository.findById(command.id())
                .switchIfEmpty(Mono.error(new UsuarioNotFoundException(command.id())))
                .map(existing -> Usuario.reconstruct(
                        existing.id(),
                        existing.username(),
                        command.nombre(),
                        command.rol(),
                        command.area(),
                        command.rol() == UsuarioRol.TECNICO
                                ? (command.catalogoIds() != null ? command.catalogoIds() : List.of())
                                : List.of(),
                        Boolean.TRUE.equals(command.activo()),
                        existing.creadoEn(),
                        clockPort.now()
                ))
                .flatMap(usuarioRepository::save);
    }
}
