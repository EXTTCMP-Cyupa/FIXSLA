package com.empresa.incidentes.application.usecase;

import com.empresa.incidentes.domain.model.Usuario;
import com.empresa.incidentes.domain.port.in.ListUsuariosQuery;
import com.empresa.incidentes.domain.port.in.ListUsuariosUseCase;
import com.empresa.incidentes.domain.port.out.UsuarioRepositoryPort;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Service
public class ListUsuariosService implements ListUsuariosUseCase {

    private final UsuarioRepositoryPort usuarioRepository;

    public ListUsuariosService(UsuarioRepositoryPort usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public Flux<Usuario> handle(ListUsuariosQuery query) {
        if (query.rol() != null) {
            return usuarioRepository.findByRolAndArea(query.rol(), query.area());
        }

        return usuarioRepository.findAll()
                .filter(usuario -> query.area() == null || query.area().isBlank() || usuario.area().equalsIgnoreCase(query.area()));
    }
}
