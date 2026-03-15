package com.empresa.incidentes.domain.port.out;

import com.empresa.incidentes.domain.model.Ticket;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface TicketRepositoryPort {

    Mono<Ticket> save(Ticket ticket);

    Mono<Ticket> findById(UUID ticketId);

    Flux<Ticket> findAll();
}
