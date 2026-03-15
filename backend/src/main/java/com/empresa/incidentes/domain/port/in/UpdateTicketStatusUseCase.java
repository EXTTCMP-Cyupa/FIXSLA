package com.empresa.incidentes.domain.port.in;

import com.empresa.incidentes.domain.model.Ticket;
import reactor.core.publisher.Mono;

public interface UpdateTicketStatusUseCase {

    Mono<Ticket> handle(UpdateTicketStatusCommand command);
}
