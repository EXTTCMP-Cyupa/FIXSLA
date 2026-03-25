package com.empresa.incidentes.application.usecase;

import com.empresa.incidentes.domain.exception.UsuarioNotFoundException;
import com.empresa.incidentes.domain.model.Usuario;
import com.empresa.incidentes.domain.port.in.UpdateMyContactCommand;
import com.empresa.incidentes.domain.port.in.UpdateMyContactUseCase;
import com.empresa.incidentes.domain.port.out.ClockPort;
import com.empresa.incidentes.domain.port.out.UsuarioRepositoryPort;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class UpdateMyContactService implements UpdateMyContactUseCase {

    private final UsuarioRepositoryPort usuarioRepository;
    private final ClockPort clockPort;

    public UpdateMyContactService(UsuarioRepositoryPort usuarioRepository, ClockPort clockPort) {
        this.usuarioRepository = usuarioRepository;
        this.clockPort = clockPort;
    }

    @Override
    public Mono<Usuario> handle(UpdateMyContactCommand command) {
        return usuarioRepository.findByUsername(command.username())
                .switchIfEmpty(Mono.error(new UsuarioNotFoundException(null)))
                .map(existing -> Usuario.reconstruct(
                        existing.id(),
                        existing.username(),
                        existing.nombre(),
                        existing.rol(),
                        existing.area(),
                        command.numeroContacto(),
                        existing.catalogoIds(),
                        existing.activo(),
                        existing.creadoEn(),
                        clockPort.now()
                ))
                .flatMap(usuarioRepository::save);
    }
}
