package com.empresa.incidentes.infrastructure.adapter.out;

import com.empresa.incidentes.domain.model.Ticket;
import com.empresa.incidentes.domain.port.out.TicketRepositoryPort;
import com.empresa.incidentes.infrastructure.adapter.out.entity.TicketEntity;
import com.empresa.incidentes.infrastructure.adapter.out.repository.SpringDataTicketRepository;
import com.empresa.incidentes.infrastructure.mapper.TicketPersistenceMapper;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Component
public class TicketRepositoryAdapter implements TicketRepositoryPort {

    private final SpringDataTicketRepository repository;
    private final TicketPersistenceMapper mapper;

    public TicketRepositoryAdapter(SpringDataTicketRepository repository, TicketPersistenceMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Mono<Ticket> save(Ticket ticket) {
        return repository.existsById(ticket.getId())
                .flatMap(exists -> {
                    TicketEntity entity = mapper.toEntity(ticket);
                    entity.setNewEntity(!exists);
                    return repository.save(entity);
                })
                .map(mapper::toDomain);
    }

    @Override
    public Mono<Ticket> findById(UUID ticketId) {
        return repository.findById(ticketId)
                .map(mapper::toDomain);
    }

    @Override
    public Flux<Ticket> findAll() {
        return repository.findAll()
                .map(mapper::toDomain);
    }
}
