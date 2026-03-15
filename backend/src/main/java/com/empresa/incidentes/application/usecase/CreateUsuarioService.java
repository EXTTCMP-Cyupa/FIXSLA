package com.empresa.incidentes.application.usecase;

import com.empresa.incidentes.domain.model.Usuario;
import com.empresa.incidentes.domain.port.in.CreateUsuarioCommand;
import com.empresa.incidentes.domain.port.in.CreateUsuarioUseCase;
import com.empresa.incidentes.domain.port.out.ClockPort;
import com.empresa.incidentes.domain.port.out.UsuarioRepositoryPort;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import java.util.List;

@Service
public class CreateUsuarioService implements CreateUsuarioUseCase {

    private final UsuarioRepositoryPort usuarioRepository;
    private final ClockPort clockPort;

    public CreateUsuarioService(UsuarioRepositoryPort usuarioRepository, ClockPort clockPort) {
        this.usuarioRepository = usuarioRepository;
        this.clockPort = clockPort;
    }

    @Override
    public Mono<Usuario> handle(CreateUsuarioCommand command) {
        return Mono.fromSupplier(() -> Usuario.createNew(
                        command.username(),
                        command.nombre(),
                        command.rol(),
                        command.area(),
                command.catalogoIds() != null ? command.catalogoIds() : List.of(),
                        clockPort.now()
                ))
                .flatMap(usuarioRepository::save);
    }
}
