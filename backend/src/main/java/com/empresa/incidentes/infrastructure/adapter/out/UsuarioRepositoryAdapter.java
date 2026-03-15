package com.empresa.incidentes.infrastructure.adapter.out;

import com.empresa.incidentes.domain.model.Usuario;
import com.empresa.incidentes.domain.model.UsuarioRol;
import com.empresa.incidentes.domain.port.out.UsuarioRepositoryPort;
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

    public UsuarioRepositoryAdapter(SpringDataUsuarioRepository repository, UsuarioPersistenceMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Mono<Usuario> save(Usuario usuario) {
        return repository.existsById(usuario.id())
                .flatMap(exists -> {
                    UsuarioEntity entity = mapper.toEntity(usuario);
                    entity.setNewEntity(!exists);
                    return repository.save(entity);
                })
                .map(mapper::toDomain);
    }

    @Override
    public Flux<Usuario> findAll() {
        return repository.findAll().map(mapper::toDomain);
    }

    @Override
    public Mono<Usuario> findByUsername(String username) {
        return repository.findByUsername(username.toLowerCase()).map(mapper::toDomain);
    }

    @Override
    public Flux<Usuario> findByRolAndArea(UsuarioRol rol, String area) {
        return repository.findByRol(rol)
                .map(mapper::toDomain)
                .filter(usuario -> area == null || area.isBlank() || usuario.area().equalsIgnoreCase(area));
    }
}
