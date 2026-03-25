package com.empresa.incidentes.infrastructure.mapper;

import com.empresa.incidentes.domain.model.Ubicacion;
import com.empresa.incidentes.infrastructure.adapter.out.entity.UbicacionEntity;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-03-19T16:15:57-0500",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.45.0.v20260224-0835, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class UbicacionPersistenceMapperImpl implements UbicacionPersistenceMapper {

    @Override
    public UbicacionEntity toEntity(Ubicacion ubicacion) {
        if ( ubicacion == null ) {
            return null;
        }

        UbicacionEntity ubicacionEntity = new UbicacionEntity();

        ubicacionEntity.setId( ubicacion.id() );
        ubicacionEntity.setNombre( ubicacion.nombre() );
        ubicacionEntity.setDescripcion( ubicacion.descripcion() );
        ubicacionEntity.setActivo( ubicacion.activo() );
        ubicacionEntity.setCreadoEn( ubicacion.creadoEn() );
        ubicacionEntity.setActualizadoEn( ubicacion.actualizadoEn() );

        ubicacionEntity.setNewEntity( true );

        return ubicacionEntity;
    }
}
