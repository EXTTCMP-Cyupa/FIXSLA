package com.empresa.incidentes.infrastructure.mapper;

import com.empresa.incidentes.domain.model.TicketAudit;
import com.empresa.incidentes.domain.model.TicketAuditAction;
import com.empresa.incidentes.domain.model.UsuarioRol;
import com.empresa.incidentes.infrastructure.adapter.in.dto.TicketAuditResponse;
import java.time.Instant;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-03-15T21:50:40-0500",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.16 (Oracle Corporation)"
)
@Component
public class TicketAuditApiMapperImpl implements TicketAuditApiMapper {

    @Override
    public TicketAuditResponse toResponse(TicketAudit audit) {
        if ( audit == null ) {
            return null;
        }

        UUID id = null;
        UUID ticketId = null;
        TicketAuditAction accion = null;
        String detalle = null;
        String actorUsername = null;
        UsuarioRol actorRol = null;
        Instant fecha = null;

        id = audit.id();
        ticketId = audit.ticketId();
        accion = audit.accion();
        detalle = audit.detalle();
        actorUsername = audit.actorUsername();
        actorRol = audit.actorRol();
        fecha = audit.fecha();

        TicketAuditResponse ticketAuditResponse = new TicketAuditResponse( id, ticketId, accion, detalle, actorUsername, actorRol, fecha );

        return ticketAuditResponse;
    }
}
