package com.empresa.incidentes.infrastructure.mapper;

import com.empresa.incidentes.domain.model.TicketAudit;
import com.empresa.incidentes.infrastructure.adapter.in.dto.TicketAuditResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TicketAuditApiMapper {

    TicketAuditResponse toResponse(TicketAudit audit);
}
