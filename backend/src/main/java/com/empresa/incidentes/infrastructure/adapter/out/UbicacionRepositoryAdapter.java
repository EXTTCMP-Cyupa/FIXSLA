package com.empresa.incidentes.infrastructure.adapter.out;

import com.empresa.incidentes.domain.model.Ubicacion;
import com.empresa.incidentes.domain.port.out.UbicacionRepositoryPort;
import com.empresa.incidentes.infrastructure.adapter.out.entity.UbicacionEntity;
import com.empresa.incidentes.infrastructure.adapter.out.repository.SpringDataUbicacionRepository;
import com.empresa.incidentes.infrastructure.mapper.UbicacionPersistenceMapper;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Component
public class UbicacionRepositoryAdapter implements UbicacionRepositoryPort {

    private final SpringDataUbicacionRepository repository;
    private final UbicacionPersistenceMapper mapper;

    public UbicacionRepositoryAdapter(SpringDataUbicacionRepository repository, UbicacionPersistenceMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Mono<Ubicacion> save(Ubicacion ubicacion) {
        return repository.existsById(ubicacion.id())
                .flatMap(exists -> {
                    UbicacionEntity entity = mapper.toEntity(ubicacion);
                    entity.setNewEntity(!exists);
                    return repository.save(entity);
                })
                .map(mapper::toDomain);
    }

    @Override
    public Mono<Ubicacion> findById(UUID id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public Flux<Ubicacion> findAll() {
        return repository.findAll().map(mapper::toDomain);
    }
}
