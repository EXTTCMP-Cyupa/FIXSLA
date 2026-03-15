package com.empresa.incidentes.application.usecase;

import com.empresa.incidentes.domain.model.TicketAudit;
import com.empresa.incidentes.domain.port.in.ListTicketAuditUseCase;
import com.empresa.incidentes.domain.port.out.TicketAuditRepositoryPort;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.util.UUID;

@Service
public class ListTicketAuditService implements ListTicketAuditUseCase {

    private final TicketAuditRepositoryPort auditRepository;

    public ListTicketAuditService(TicketAuditRepositoryPort auditRepository) {
        this.auditRepository = auditRepository;
    }

    @Override
    public Flux<TicketAudit> handle(UUID ticketId) {
        return auditRepository.findByTicketId(ticketId);
    }
}
