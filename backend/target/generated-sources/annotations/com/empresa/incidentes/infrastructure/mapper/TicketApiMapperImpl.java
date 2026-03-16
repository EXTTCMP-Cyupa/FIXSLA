package com.empresa.incidentes.infrastructure.mapper;

import com.empresa.incidentes.domain.model.Ticket;
import com.empresa.incidentes.domain.model.TicketPriority;
import com.empresa.incidentes.domain.model.TicketStatus;
import com.empresa.incidentes.domain.port.in.CreateTicketCommand;
import com.empresa.incidentes.domain.port.in.UpdateTicketStatusCommand;
import com.empresa.incidentes.infrastructure.adapter.in.dto.CreateTicketRequest;
import com.empresa.incidentes.infrastructure.adapter.in.dto.TicketResponse;
import com.empresa.incidentes.infrastructure.adapter.in.dto.UpdateTicketStatusRequest;
import java.time.Instant;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-03-15T19:02:50-0500",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.16 (Oracle Corporation)"
)
@Component
public class TicketApiMapperImpl implements TicketApiMapper {

    @Override
    public CreateTicketCommand toCommand(CreateTicketRequest request) {
        if ( request == null ) {
            return null;
        }

        String codigo = null;
        String titulo = null;
        String descripcion = null;
        UUID solicitanteId = null;
        UUID catalogoIncidenteId = null;

        codigo = request.codigo();
        titulo = request.titulo();
        descripcion = request.descripcion();
        solicitanteId = request.solicitanteId();
        catalogoIncidenteId = request.catalogoIncidenteId();

        CreateTicketCommand createTicketCommand = new CreateTicketCommand( codigo, titulo, descripcion, solicitanteId, catalogoIncidenteId );

        return createTicketCommand;
    }

    @Override
    public UpdateTicketStatusCommand toCommand(UUID ticketId, UpdateTicketStatusRequest request) {
        if ( ticketId == null && request == null ) {
            return null;
        }

        TicketStatus nextStatus = null;
        UUID tecnicoAsignadoId = null;
        if ( request != null ) {
            nextStatus = request.nextStatus();
            tecnicoAsignadoId = request.tecnicoAsignadoId();
        }
        UUID ticketId1 = null;
        ticketId1 = ticketId;

        UpdateTicketStatusCommand updateTicketStatusCommand = new UpdateTicketStatusCommand( ticketId1, nextStatus, tecnicoAsignadoId );

        return updateTicketStatusCommand;
    }

    @Override
    public TicketResponse toResponse(Ticket ticket) {
        if ( ticket == null ) {
            return null;
        }

        UUID id = null;
        String codigo = null;
        String titulo = null;
        String descripcion = null;
        UUID solicitanteId = null;
        UUID tecnicoAsignadoId = null;
        UUID catalogoIncidenteId = null;
        TicketStatus estado = null;
        TicketPriority prioridad = null;
        Instant creadoEn = null;
        Instant actualizadoEn = null;
        Instant primeraRespuestaLimite = null;
        Instant resolucionLimite = null;
        Instant pendienteDesde = null;

        id = ticket.getId();
        codigo = ticket.getCodigo();
        titulo = ticket.getTitulo();
        descripcion = ticket.getDescripcion();
        solicitanteId = ticket.getSolicitanteId();
        tecnicoAsignadoId = ticket.getTecnicoAsignadoId();
        catalogoIncidenteId = ticket.getCatalogoIncidenteId();
        estado = ticket.getEstado();
        prioridad = ticket.getPrioridad();
        creadoEn = ticket.getCreadoEn();
        actualizadoEn = ticket.getActualizadoEn();
        primeraRespuestaLimite = ticket.getPrimeraRespuestaLimite();
        resolucionLimite = ticket.getResolucionLimite();
        pendienteDesde = ticket.getPendienteDesde();

        Long slaPausadoSegundos = ticket.getSlaPausadoAcumulado().getSeconds();

        TicketResponse ticketResponse = new TicketResponse( id, codigo, titulo, descripcion, solicitanteId, tecnicoAsignadoId, catalogoIncidenteId, estado, prioridad, creadoEn, actualizadoEn, primeraRespuestaLimite, resolucionLimite, pendienteDesde, slaPausadoSegundos );

        return ticketResponse;
    }
}
