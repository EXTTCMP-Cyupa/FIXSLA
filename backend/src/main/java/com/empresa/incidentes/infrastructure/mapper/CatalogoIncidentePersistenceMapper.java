package com.empresa.incidentes.infrastructure.mapper;

import com.empresa.incidentes.domain.model.CatalogoIncidente;
import com.empresa.incidentes.infrastructure.adapter.out.entity.CatalogoIncidenteEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CatalogoIncidentePersistenceMapper {

    @Mapping(target = "newEntity", constant = "true")
    CatalogoIncidenteEntity toEntity(CatalogoIncidente catalogoIncidente);

    default CatalogoIncidente toDomain(CatalogoIncidenteEntity entity) {
        entity.setNewEntity(false);
        return CatalogoIncidente.reconstruct(
                entity.getId(),
                entity.getNombre(),
                entity.getDescripcion(),
                entity.getPrioridadPorDefecto(),
                Boolean.TRUE.equals(entity.getActivo()),
                entity.getCreadoEn(),
                entity.getActualizadoEn()
        );
    }
}
