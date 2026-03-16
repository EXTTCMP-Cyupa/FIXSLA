package com.empresa.incidentes.infrastructure.mapper;

import com.empresa.incidentes.domain.model.Ticket;
import com.empresa.incidentes.infrastructure.adapter.out.entity.TicketEntity;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-03-15T19:02:50-0500",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.16 (Oracle Corporation)"
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
