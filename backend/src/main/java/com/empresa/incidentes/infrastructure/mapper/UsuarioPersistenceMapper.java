package com.empresa.incidentes.infrastructure.mapper;

import com.empresa.incidentes.domain.model.Usuario;
import com.empresa.incidentes.infrastructure.adapter.out.entity.UsuarioEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.util.List;
import java.util.UUID;

@Mapper(componentModel = "spring")
public interface UsuarioPersistenceMapper {

    @Mapping(target = "newEntity", constant = "true")
    UsuarioEntity toEntity(Usuario usuario);

    default Usuario toDomain(UsuarioEntity entity, List<UUID> catalogoIds) {
        entity.setNewEntity(false);
        return Usuario.reconstruct(
                entity.getId(),
                entity.getUsername(),
                entity.getNombre(),
                entity.getRol(),
                entity.getArea(),
                catalogoIds,
                Boolean.TRUE.equals(entity.getActivo()),
                entity.getCreadoEn(),
                entity.getActualizadoEn()
        );
    }
}
