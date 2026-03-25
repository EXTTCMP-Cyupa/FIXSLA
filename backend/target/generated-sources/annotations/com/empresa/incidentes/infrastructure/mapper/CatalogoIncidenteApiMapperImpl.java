package com.empresa.incidentes.infrastructure.mapper;

import com.empresa.incidentes.domain.model.CatalogoIncidente;
import com.empresa.incidentes.domain.model.TicketPriority;
import com.empresa.incidentes.domain.port.in.CreateCatalogoIncidenteCommand;
import com.empresa.incidentes.infrastructure.adapter.in.dto.CatalogoIncidenteResponse;
import com.empresa.incidentes.infrastructure.adapter.in.dto.CreateCatalogoIncidenteRequest;
import java.time.Instant;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-03-19T16:15:56-0500",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.45.0.v20260224-0835, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class CatalogoIncidenteApiMapperImpl implements CatalogoIncidenteApiMapper {

    @Override
    public CreateCatalogoIncidenteCommand toCommand(CreateCatalogoIncidenteRequest request) {
        if ( request == null ) {
            return null;
        }

        String nombre = null;
        String descripcion = null;
        TicketPriority prioridadPorDefecto = null;

        nombre = request.nombre();
        descripcion = request.descripcion();
        prioridadPorDefecto = request.prioridadPorDefecto();

        CreateCatalogoIncidenteCommand createCatalogoIncidenteCommand = new CreateCatalogoIncidenteCommand( nombre, descripcion, prioridadPorDefecto );

        return createCatalogoIncidenteCommand;
    }

    @Override
    public CatalogoIncidenteResponse toResponse(CatalogoIncidente catalogoIncidente) {
        if ( catalogoIncidente == null ) {
            return null;
        }

        UUID id = null;
        String nombre = null;
        String descripcion = null;
        TicketPriority prioridadPorDefecto = null;
        boolean activo = false;
        Instant creadoEn = null;
        Instant actualizadoEn = null;

        id = catalogoIncidente.id();
        nombre = catalogoIncidente.nombre();
        descripcion = catalogoIncidente.descripcion();
        prioridadPorDefecto = catalogoIncidente.prioridadPorDefecto();
        activo = catalogoIncidente.activo();
        creadoEn = catalogoIncidente.creadoEn();
        actualizadoEn = catalogoIncidente.actualizadoEn();

        CatalogoIncidenteResponse catalogoIncidenteResponse = new CatalogoIncidenteResponse( id, nombre, descripcion, prioridadPorDefecto, activo, creadoEn, actualizadoEn );

        return catalogoIncidenteResponse;
    }
}
