package com.empresa.incidentes.infrastructure.mapper;

import com.empresa.incidentes.domain.model.CatalogoIncidente;
import com.empresa.incidentes.infrastructure.adapter.out.entity.CatalogoIncidenteEntity;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-03-19T16:15:57-0500",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.45.0.v20260224-0835, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class CatalogoIncidentePersistenceMapperImpl implements CatalogoIncidentePersistenceMapper {

    @Override
    public CatalogoIncidenteEntity toEntity(CatalogoIncidente catalogoIncidente) {
        if ( catalogoIncidente == null ) {
            return null;
        }

        CatalogoIncidenteEntity catalogoIncidenteEntity = new CatalogoIncidenteEntity();

        catalogoIncidenteEntity.setId( catalogoIncidente.id() );
        catalogoIncidenteEntity.setNombre( catalogoIncidente.nombre() );
        catalogoIncidenteEntity.setDescripcion( catalogoIncidente.descripcion() );
        catalogoIncidenteEntity.setPrioridadPorDefecto( catalogoIncidente.prioridadPorDefecto() );
        catalogoIncidenteEntity.setActivo( catalogoIncidente.activo() );
        catalogoIncidenteEntity.setCreadoEn( catalogoIncidente.creadoEn() );
        catalogoIncidenteEntity.setActualizadoEn( catalogoIncidente.actualizadoEn() );

        catalogoIncidenteEntity.setNewEntity( true );

        return catalogoIncidenteEntity;
    }
}
