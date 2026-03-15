package com.empresa.incidentes.domain.port.in;

import com.empresa.incidentes.domain.model.Ticket;
import java.util.UUID;
import reactor.core.publisher.Mono;

public interface GetTicketByIdUseCase {

    Mono<Ticket> handle(UUID ticketId);
}
