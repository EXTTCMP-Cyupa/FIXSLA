package com.empresa.incidentes.infrastructure.adapter.out;

import com.empresa.incidentes.domain.model.Usuario;
import com.empresa.incidentes.domain.model.UsuarioRol;
import com.empresa.incidentes.domain.port.out.UsuarioRepositoryPort;
import com.empresa.incidentes.domain.port.out.UsuarioCatalogoRepositoryPort;
import com.empresa.incidentes.infrastructure.adapter.out.entity.UsuarioEntity;
import com.empresa.incidentes.infrastructure.adapter.out.repository.SpringDataUsuarioRepository;
import com.empresa.incidentes.infrastructure.mapper.UsuarioPersistenceMapper;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Component
public class UsuarioRepositoryAdapter implements UsuarioRepositoryPort {

    private final SpringDataUsuarioRepository repository;
    private final UsuarioPersistenceMapper mapper;
    private final UsuarioCatalogoRepositoryPort catalogoPort;

    public UsuarioRepositoryAdapter(SpringDataUsuarioRepository repository, UsuarioPersistenceMapper mapper, UsuarioCatalogoRepositoryPort catalogoPort) {
        this.repository = repository;
        this.mapper = mapper;
        this.catalogoPort = catalogoPort;
    }

    @Override
    public Mono<Usuario> save(Usuario usuario) {
        return repository.existsById(usuario.id())
                .flatMap(exists -> {
                    UsuarioEntity entity = mapper.toEntity(usuario);
                    entity.setNewEntity(!exists);
                    return repository.save(entity);
                })
                .flatMap(saved ->
                    catalogoPort.syncCatalogos(saved.getId(), usuario.catalogoIds())
                        .then(catalogoPort.findCatalogoIdsByUsuarioId(saved.getId()).collectList())
                        .map(catalogoIds -> mapper.toDomain(saved, catalogoIds))
                );
    }

    @Override
    public Flux<Usuario> findAll() {
        return repository.findAll()
                .flatMap(entity ->
                    catalogoPort.findCatalogoIdsByUsuarioId(entity.getId())
                        .collectList()
                        .map(catalogoIds -> mapper.toDomain(entity, catalogoIds))
                );
    }

    @Override
    public Mono<Usuario> findByUsername(String username) {
        return repository.findByUsername(username.toLowerCase())
                .flatMap(entity ->
                    catalogoPort.findCatalogoIdsByUsuarioId(entity.getId())
                        .collectList()
                        .map(catalogoIds -> mapper.toDomain(entity, catalogoIds))
                );
    }

    @Override
    public Flux<Usuario> findByRolAndArea(UsuarioRol rol, String area) {
        return repository.findByRol(rol)
                .flatMap(entity ->
                    catalogoPort.findCatalogoIdsByUsuarioId(entity.getId())
                        .collectList()
                        .map(catalogoIds -> mapper.toDomain(entity, catalogoIds))
                )
                .filter(usuario -> area == null || area.isBlank() || usuario.area().equalsIgnoreCase(area));
    }
}
