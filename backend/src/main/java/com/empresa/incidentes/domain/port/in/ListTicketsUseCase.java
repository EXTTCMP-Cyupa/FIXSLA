package com.empresa.incidentes.domain.port.in;

import com.empresa.incidentes.domain.model.Ticket;
import reactor.core.publisher.Flux;

public interface ListTicketsUseCase {

    Flux<Ticket> handle(ListTicketsQuery query);
}
