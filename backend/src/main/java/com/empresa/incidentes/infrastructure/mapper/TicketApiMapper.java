package com.empresa.incidentes.infrastructure.mapper;

import com.empresa.incidentes.domain.model.Ticket;
import com.empresa.incidentes.domain.port.in.CreateTicketCommand;
import com.empresa.incidentes.domain.port.in.UpdateTicketStatusCommand;
import com.empresa.incidentes.infrastructure.adapter.in.dto.CreateTicketRequest;
import com.empresa.incidentes.infrastructure.adapter.in.dto.TicketResponse;
import com.empresa.incidentes.infrastructure.adapter.in.dto.UpdateTicketStatusRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.UUID;

@Mapper(componentModel = "spring")
public interface TicketApiMapper {

    CreateTicketCommand toCommand(CreateTicketRequest request);

    @Mapping(target = "ticketId", source = "ticketId")
    UpdateTicketStatusCommand toCommand(UUID ticketId, UpdateTicketStatusRequest request);

    @Mapping(target = "slaPausadoSegundos", expression = "java(ticket.getSlaPausadoAcumulado().getSeconds())")
    TicketResponse toResponse(Ticket ticket);
}
