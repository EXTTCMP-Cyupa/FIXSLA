package com.empresa.incidentes.application.usecase;

import com.empresa.incidentes.domain.exception.TicketNotFoundException;
import com.empresa.incidentes.domain.model.Ticket;
import com.empresa.incidentes.domain.port.in.GetTicketByIdUseCase;
import com.empresa.incidentes.domain.port.out.TicketRepositoryPort;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Service
public class GetTicketByIdService implements GetTicketByIdUseCase {

    private final TicketRepositoryPort ticketRepository;

    public GetTicketByIdService(TicketRepositoryPort ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    @Override
    public Mono<Ticket> handle(UUID ticketId) {
        return ticketRepository.findById(ticketId)
                .switchIfEmpty(Mono.error(new TicketNotFoundException(ticketId)));
    }
}
