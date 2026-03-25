package com.empresa.incidentes.infrastructure.mapper;

import com.empresa.incidentes.domain.model.Ubicacion;
import com.empresa.incidentes.domain.port.in.CreateUbicacionCommand;
import com.empresa.incidentes.infrastructure.adapter.in.dto.CreateUbicacionRequest;
import com.empresa.incidentes.infrastructure.adapter.in.dto.UbicacionResponse;
import java.time.Instant;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-03-19T16:15:57-0500",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.45.0.v20260224-0835, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class UbicacionApiMapperImpl implements UbicacionApiMapper {

    @Override
    public CreateUbicacionCommand toCommand(CreateUbicacionRequest request) {
        if ( request == null ) {
            return null;
        }

        String nombre = null;
        String descripcion = null;

        nombre = request.nombre();
        descripcion = request.descripcion();

        CreateUbicacionCommand createUbicacionCommand = new CreateUbicacionCommand( nombre, descripcion );

        return createUbicacionCommand;
    }

    @Override
    public UbicacionResponse toResponse(Ubicacion ubicacion) {
        if ( ubicacion == null ) {
            return null;
        }

        UUID id = null;
        String nombre = null;
        String descripcion = null;
        boolean activo = false;
        Instant creadoEn = null;
        Instant actualizadoEn = null;

        id = ubicacion.id();
        nombre = ubicacion.nombre();
        descripcion = ubicacion.descripcion();
        activo = ubicacion.activo();
        creadoEn = ubicacion.creadoEn();
        actualizadoEn = ubicacion.actualizadoEn();

        UbicacionResponse ubicacionResponse = new UbicacionResponse( id, nombre, descripcion, activo, creadoEn, actualizadoEn );

        return ubicacionResponse;
    }
}
