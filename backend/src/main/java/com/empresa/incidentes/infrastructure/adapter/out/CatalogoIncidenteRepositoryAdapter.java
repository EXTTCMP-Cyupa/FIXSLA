package com.empresa.incidentes.infrastructure.adapter.out;

import com.empresa.incidentes.domain.model.CatalogoIncidente;
import com.empresa.incidentes.domain.port.out.CatalogoIncidenteRepositoryPort;
import com.empresa.incidentes.infrastructure.adapter.out.entity.CatalogoIncidenteEntity;
import com.empresa.incidentes.infrastructure.adapter.out.repository.SpringDataCatalogoIncidenteRepository;
import com.empresa.incidentes.infrastructure.mapper.CatalogoIncidentePersistenceMapper;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Component
public class CatalogoIncidenteRepositoryAdapter implements CatalogoIncidenteRepositoryPort {

    private final SpringDataCatalogoIncidenteRepository repository;
    private final CatalogoIncidentePersistenceMapper mapper;

    public CatalogoIncidenteRepositoryAdapter(
            SpringDataCatalogoIncidenteRepository repository,
            CatalogoIncidentePersistenceMapper mapper
    ) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Mono<CatalogoIncidente> save(CatalogoIncidente catalogoIncidente) {
        return repository.existsById(catalogoIncidente.id())
                .flatMap(exists -> {
                    CatalogoIncidenteEntity entity = mapper.toEntity(catalogoIncidente);
                    entity.setNewEntity(!exists);
                    return repository.save(entity);
                })
                .map(mapper::toDomain);
    }

    @Override
    public Mono<CatalogoIncidente> findById(UUID catalogoId) {
        return repository.findById(catalogoId)
                .map(mapper::toDomain);
    }

    @Override
    public Flux<CatalogoIncidente> findAll() {
        return repository.findAll()
                .map(mapper::toDomain);
    }
}
