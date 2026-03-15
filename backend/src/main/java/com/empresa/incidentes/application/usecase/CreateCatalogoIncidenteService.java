package com.empresa.incidentes.application.usecase;

import com.empresa.incidentes.domain.model.CatalogoIncidente;
import com.empresa.incidentes.domain.port.in.CreateCatalogoIncidenteCommand;
import com.empresa.incidentes.domain.port.in.CreateCatalogoIncidenteUseCase;
import com.empresa.incidentes.domain.port.out.CatalogoIncidenteRepositoryPort;
import com.empresa.incidentes.domain.port.out.ClockPort;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class CreateCatalogoIncidenteService implements CreateCatalogoIncidenteUseCase {

    private final CatalogoIncidenteRepositoryPort catalogoRepository;
    private final ClockPort clockPort;

    public CreateCatalogoIncidenteService(CatalogoIncidenteRepositoryPort catalogoRepository, ClockPort clockPort) {
        this.catalogoRepository = catalogoRepository;
        this.clockPort = clockPort;
    }

    @Override
    public Mono<CatalogoIncidente> handle(CreateCatalogoIncidenteCommand command) {
        return Mono.fromSupplier(() -> CatalogoIncidente.createNew(
                        command.nombre(),
                        command.descripcion(),
                        command.prioridadPorDefecto(),
                        clockPort.now()
                ))
                .flatMap(catalogoRepository::save);
    }
}
