package com.empresa.incidentes.infrastructure.mapper;

import com.empresa.incidentes.domain.model.Ubicacion;
import com.empresa.incidentes.infrastructure.adapter.out.entity.UbicacionEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UbicacionPersistenceMapper {

    @Mapping(target = "newEntity", constant = "true")
    UbicacionEntity toEntity(Ubicacion ubicacion);

    default Ubicacion toDomain(UbicacionEntity entity) {
        entity.setNewEntity(false);
        return Ubicacion.reconstruct(
                entity.getId(),
                entity.getNombre(),
                entity.getDescripcion(),
                Boolean.TRUE.equals(entity.getActivo()),
                entity.getCreadoEn(),
                entity.getActualizadoEn()
        );
    }
}
