package com.empresa.incidentes.application.usecase;

import com.empresa.incidentes.domain.model.Ticket;
import com.empresa.incidentes.domain.port.in.ListTicketsQuery;
import com.empresa.incidentes.domain.port.in.ListTicketsUseCase;
import com.empresa.incidentes.domain.port.out.TicketRepositoryPort;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Service
public class ListTicketsService implements ListTicketsUseCase {

    private final TicketRepositoryPort ticketRepository;

    public ListTicketsService(TicketRepositoryPort ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    @Override
    public Flux<Ticket> handle(ListTicketsQuery query) {
        return ticketRepository.findAll()
                .filter(ticket -> query.estado() == null || query.estado() == ticket.getEstado())
                .filter(ticket -> query.prioridad() == null || query.prioridad() == ticket.getPrioridad())
                .filter(ticket -> query.solicitanteId() == null || query.solicitanteId().equals(ticket.getSolicitanteId()))
                .filter(ticket -> query.tecnicoAsignadoId() == null || query.tecnicoAsignadoId().equals(ticket.getTecnicoAsignadoId()))
                .filter(ticket -> query.catalogoIncidenteId() == null || query.catalogoIncidenteId().equals(ticket.getCatalogoIncidenteId()));
    }
}
