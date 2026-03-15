package com.empresa.incidentes.domain.port.out;

import com.empresa.incidentes.domain.model.TicketAudit;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface TicketAuditRepositoryPort {

    Mono<TicketAudit> save(TicketAudit audit);

    Flux<TicketAudit> findByTicketId(UUID ticketId);
}
