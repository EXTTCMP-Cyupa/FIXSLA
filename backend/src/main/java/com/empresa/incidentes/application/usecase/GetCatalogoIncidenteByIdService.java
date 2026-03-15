package com.empresa.incidentes.application.usecase;

import com.empresa.incidentes.domain.exception.CatalogoIncidenteNotFoundException;
import com.empresa.incidentes.domain.model.CatalogoIncidente;
import com.empresa.incidentes.domain.port.in.GetCatalogoIncidenteByIdUseCase;
import com.empresa.incidentes.domain.port.out.CatalogoIncidenteRepositoryPort;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Service
public class GetCatalogoIncidenteByIdService implements GetCatalogoIncidenteByIdUseCase {

    private final CatalogoIncidenteRepositoryPort catalogoRepository;

    public GetCatalogoIncidenteByIdService(CatalogoIncidenteRepositoryPort catalogoRepository) {
        this.catalogoRepository = catalogoRepository;
    }

    @Override
    public Mono<CatalogoIncidente> handle(UUID catalogoId) {
        return catalogoRepository.findById(catalogoId)
                .switchIfEmpty(Mono.error(new CatalogoIncidenteNotFoundException(catalogoId)));
    }
}
