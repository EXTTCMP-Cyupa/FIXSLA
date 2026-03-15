package com.empresa.incidentes.infrastructure.mapper;

import com.empresa.incidentes.domain.model.TicketAudit;
import com.empresa.incidentes.infrastructure.adapter.out.entity.TicketAuditEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TicketAuditPersistenceMapper {

    @Mapping(target = "newEntity", constant = "true")
    TicketAuditEntity toEntity(TicketAudit audit);

    default TicketAudit toDomain(TicketAuditEntity entity) {
        entity.setNewEntity(false);
        return TicketAudit.reconstruct(
                entity.getId(),
                entity.getTicketId(),
                entity.getAccion(),
                entity.getDetalle(),
                entity.getActorUsername(),
                entity.getActorRol(),
                entity.getFecha()
        );
    }
}
