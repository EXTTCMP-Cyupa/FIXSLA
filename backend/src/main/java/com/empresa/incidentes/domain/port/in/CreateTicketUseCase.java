package com.empresa.incidentes.domain.port.in;

import com.empresa.incidentes.domain.model.Ticket;
import reactor.core.publisher.Mono;

public interface CreateTicketUseCase {

    Mono<Ticket> handle(CreateTicketCommand command);
}
