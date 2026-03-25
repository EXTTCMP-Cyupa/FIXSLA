package com.empresa.incidentes.application.usecase;

import com.empresa.incidentes.domain.model.Ubicacion;
import com.empresa.incidentes.domain.port.in.UpdateUbicacionCommand;
import com.empresa.incidentes.domain.port.in.UpdateUbicacionUseCase;
import com.empresa.incidentes.domain.port.out.ClockPort;
import com.empresa.incidentes.domain.port.out.UbicacionRepositoryPort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

@Service
public class UpdateUbicacionService implements UpdateUbicacionUseCase {

    private final UbicacionRepositoryPort ubicacionRepository;
    private final ClockPort clockPort;

    public UpdateUbicacionService(UbicacionRepositoryPort ubicacionRepository, ClockPort clockPort) {
        this.ubicacionRepository = ubicacionRepository;
        this.clockPort = clockPort;
    }

    @Override
    public Mono<Ubicacion> handle(UpdateUbicacionCommand command) {
        return ubicacionRepository.findById(command.id())
                .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND, "Ubicación no encontrada")))
                .map(existing -> existing.update(
                        command.nombre(),
                        command.descripcion(),
                        Boolean.TRUE.equals(command.activo()),
                        clockPort.now()
                ))
                .flatMap(ubicacionRepository::save);
    }
}
