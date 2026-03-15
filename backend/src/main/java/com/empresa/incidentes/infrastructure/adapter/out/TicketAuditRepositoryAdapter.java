package com.empresa.incidentes.infrastructure.adapter.out;

import com.empresa.incidentes.domain.model.TicketAudit;
import com.empresa.incidentes.domain.port.out.TicketAuditRepositoryPort;
import com.empresa.incidentes.infrastructure.adapter.out.repository.SpringDataTicketAuditRepository;
import com.empresa.incidentes.infrastructure.mapper.TicketAuditPersistenceMapper;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Component
public class TicketAuditRepositoryAdapter implements TicketAuditRepositoryPort {

    private final SpringDataTicketAuditRepository repository;
    private final TicketAuditPersistenceMapper mapper;

    public TicketAuditRepositoryAdapter(SpringDataTicketAuditRepository repository, TicketAuditPersistenceMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Mono<TicketAudit> save(TicketAudit audit) {
        return repository.save(mapper.toEntity(audit)).map(mapper::toDomain);
    }

    @Override
    public Flux<TicketAudit> findByTicketId(UUID ticketId) {
        return repository.findByTicketIdOrderByFechaDesc(ticketId).map(mapper::toDomain);
    }
}
