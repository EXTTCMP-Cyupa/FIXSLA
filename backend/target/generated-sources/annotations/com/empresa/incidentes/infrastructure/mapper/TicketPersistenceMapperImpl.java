package com.empresa.incidentes.infrastructure.mapper;

import com.empresa.incidentes.domain.model.Ticket;
import com.empresa.incidentes.infrastructure.adapter.out.entity.TicketEntity;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-03-19T16:15:57-0500",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.45.0.v20260224-0835, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class TicketPersistenceMapperImpl implements TicketPersistenceMapper {

    @Override
    public TicketEntity toEntity(Ticket ticket) {
        if ( ticket == null ) {
            return null;
        }

        TicketEntity ticketEntity = new TicketEntity();

        ticketEntity.setId( ticket.getId() );
        ticketEntity.setCodigo( ticket.getCodigo() );
        ticketEntity.setTitulo( ticket.getTitulo() );
        ticketEntity.setDescripcion( ticket.getDescripcion() );
        ticketEntity.setSolicitanteId( ticket.getSolicitanteId() );
        ticketEntity.setTecnicoAsignadoId( ticket.getTecnicoAsignadoId() );
        ticketEntity.setCatalogoIncidenteId( ticket.getCatalogoIncidenteId() );
        ticketEntity.setUbicacionId( ticket.getUbicacionId() );
        ticketEntity.setNumeroContacto( ticket.getNumeroContacto() );
        ticketEntity.setEstado( ticket.getEstado() );
        ticketEntity.setPrioridad( ticket.getPrioridad() );
        ticketEntity.setCreadoEn( ticket.getCreadoEn() );
        ticketEntity.setActualizadoEn( ticket.getActualizadoEn() );
        ticketEntity.setPrimeraRespuestaLimite( ticket.getPrimeraRespuestaLimite() );
        ticketEntity.setResolucionLimite( ticket.getResolucionLimite() );
        ticketEntity.setPendienteDesde( ticket.getPendienteDesde() );

        ticketEntity.setSlaPausadoSegundos( toSeconds(ticket.getSlaPausadoAcumulado()) );
        ticketEntity.setNewEntity( true );

        return ticketEntity;
    }
}
