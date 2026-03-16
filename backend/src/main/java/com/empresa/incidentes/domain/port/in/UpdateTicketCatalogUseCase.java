package com.empresa.incidentes.domain.port.in;

import com.empresa.incidentes.domain.model.Ticket;
import reactor.core.publisher.Mono;

public interface UpdateTicketCatalogUseCase {

    Mono<Ticket> handle(UpdateTicketCatalogCommand command);
}
