package com.empresa.incidentes.application.usecase;

import com.empresa.incidentes.domain.model.Ubicacion;
import com.empresa.incidentes.domain.port.in.CreateUbicacionCommand;
import com.empresa.incidentes.domain.port.in.CreateUbicacionUseCase;
import com.empresa.incidentes.domain.port.out.ClockPort;
import com.empresa.incidentes.domain.port.out.UbicacionRepositoryPort;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class CreateUbicacionService implements CreateUbicacionUseCase {

    private final UbicacionRepositoryPort ubicacionRepository;
    private final ClockPort clockPort;

    public CreateUbicacionService(UbicacionRepositoryPort ubicacionRepository, ClockPort clockPort) {
        this.ubicacionRepository = ubicacionRepository;
        this.clockPort = clockPort;
    }

    @Override
    public Mono<Ubicacion> handle(CreateUbicacionCommand command) {
        return Mono.fromSupplier(() -> Ubicacion.createNew(command.nombre(), command.descripcion(), clockPort.now()))
                .flatMap(ubicacionRepository::save);
    }
}
