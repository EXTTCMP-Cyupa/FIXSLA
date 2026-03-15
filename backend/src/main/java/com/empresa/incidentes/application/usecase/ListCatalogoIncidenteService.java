package com.empresa.incidentes.application.usecase;

import com.empresa.incidentes.domain.model.CatalogoIncidente;
import com.empresa.incidentes.domain.port.in.ListCatalogoIncidenteQuery;
import com.empresa.incidentes.domain.port.in.ListCatalogoIncidenteUseCase;
import com.empresa.incidentes.domain.port.out.CatalogoIncidenteRepositoryPort;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Service
public class ListCatalogoIncidenteService implements ListCatalogoIncidenteUseCase {

    private final CatalogoIncidenteRepositoryPort catalogoRepository;

    public ListCatalogoIncidenteService(CatalogoIncidenteRepositoryPort catalogoRepository) {
        this.catalogoRepository = catalogoRepository;
    }

    @Override
    public Flux<CatalogoIncidente> handle(ListCatalogoIncidenteQuery query) {
        return catalogoRepository.findAll()
                .filter(catalogo -> !query.soloActivos() || catalogo.activo());
    }
}
