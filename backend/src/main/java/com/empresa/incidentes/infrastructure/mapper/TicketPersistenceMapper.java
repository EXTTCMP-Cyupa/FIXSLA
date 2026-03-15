package com.empresa.incidentes.infrastructure.mapper;

import com.empresa.incidentes.domain.model.Ticket;
import com.empresa.incidentes.infrastructure.adapter.out.entity.TicketEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.time.Duration;

@Mapper(componentModel = "spring")
public interface TicketPersistenceMapper {

    @Mapping(target = "slaPausadoSegundos", expression = "java(toSeconds(ticket.getSlaPausadoAcumulado()))")
    @Mapping(target = "newEntity", constant = "true")
    TicketEntity toEntity(Ticket ticket);

    default Ticket toDomain(TicketEntity entity) {
        entity.setNewEntity(false);
        return Ticket.reconstruct(
                entity.getId(),
                entity.getCodigo(),
                entity.getTitulo(),
                entity.getDescripcion(),
                entity.getSolicitanteId(),
                entity.getTecnicoAsignadoId(),
                entity.getCatalogoIncidenteId(),
                entity.getEstado(),
                entity.getPrioridad(),
                entity.getCreadoEn(),
                entity.getActualizadoEn(),
                entity.getPrimeraRespuestaLimite(),
                entity.getResolucionLimite(),
                entity.getPendienteDesde(),
                toDuration(entity.getSlaPausadoSegundos())
        );
    }

    default Long toSeconds(Duration duration) {
        return duration == null ? 0L : duration.getSeconds();
    }

    default Duration toDuration(Long seconds) {
        return Duration.ofSeconds(seconds == null ? 0L : seconds);
    }
}
