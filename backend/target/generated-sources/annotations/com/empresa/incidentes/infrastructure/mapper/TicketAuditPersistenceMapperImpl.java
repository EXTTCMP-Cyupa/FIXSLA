package com.empresa.incidentes.infrastructure.mapper;

import com.empresa.incidentes.domain.model.TicketAudit;
import com.empresa.incidentes.infrastructure.adapter.out.entity.TicketAuditEntity;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-03-19T16:15:57-0500",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.45.0.v20260224-0835, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class TicketAuditPersistenceMapperImpl implements TicketAuditPersistenceMapper {

    @Override
    public TicketAuditEntity toEntity(TicketAudit audit) {
        if ( audit == null ) {
            return null;
        }

        TicketAuditEntity ticketAuditEntity = new TicketAuditEntity();

        ticketAuditEntity.setId( audit.id() );
        ticketAuditEntity.setTicketId( audit.ticketId() );
        ticketAuditEntity.setAccion( audit.accion() );
        ticketAuditEntity.setDetalle( audit.detalle() );
        ticketAuditEntity.setActorUsername( audit.actorUsername() );
        ticketAuditEntity.setActorRol( audit.actorRol() );
        ticketAuditEntity.setFecha( audit.fecha() );

        ticketAuditEntity.setNewEntity( true );

        return ticketAuditEntity;
    }
}
