package com.empresa.incidentes.infrastructure.adapter.out.repository;

import com.empresa.incidentes.infrastructure.adapter.out.entity.TicketAuditEntity;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

import java.util.UUID;

public interface SpringDataTicketAuditRepository extends ReactiveCrudRepository<TicketAuditEntity, UUID> {

    Flux<TicketAuditEntity> findByTicketIdOrderByFechaDesc(UUID ticketId);
}
