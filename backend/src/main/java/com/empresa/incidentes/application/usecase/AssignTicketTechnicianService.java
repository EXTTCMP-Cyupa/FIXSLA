package com.empresa.incidentes.application.usecase;

import com.empresa.incidentes.domain.exception.TicketNotFoundException;
import com.empresa.incidentes.domain.model.Ticket;
import com.empresa.incidentes.domain.model.TicketAudit;
import com.empresa.incidentes.domain.model.TicketAuditAction;
import com.empresa.incidentes.domain.model.UsuarioRol;
import com.empresa.incidentes.domain.port.in.AssignTicketTechnicianCommand;
import com.empresa.incidentes.domain.port.in.AssignTicketTechnicianUseCase;
import com.empresa.incidentes.domain.port.out.ClockPort;
import com.empresa.incidentes.domain.port.out.TicketAuditRepositoryPort;
import com.empresa.incidentes.domain.port.out.TicketRepositoryPort;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class AssignTicketTechnicianService implements AssignTicketTechnicianUseCase {

    private final TicketRepositoryPort ticketRepository;
    private final TicketAuditRepositoryPort auditRepository;
    private final ClockPort clockPort;

    public AssignTicketTechnicianService(
            TicketRepositoryPort ticketRepository,
            TicketAuditRepositoryPort auditRepository,
            ClockPort clockPort
    ) {
        this.ticketRepository = ticketRepository;
        this.auditRepository = auditRepository;
        this.clockPort = clockPort;
    }

    @Override
    public Mono<Ticket> handle(AssignTicketTechnicianCommand command) {
        return ticketRepository.findById(command.ticketId())
                .switchIfEmpty(Mono.error(new TicketNotFoundException(command.ticketId())))
                .map(ticket -> ticket.assignTechnician(command.tecnicoAsignadoId(), clockPort.now()))
                .flatMap(ticketRepository::save)
                .flatMap(saved -> auditRepository.save(TicketAudit.create(
                                saved.getId(),
                                TicketAuditAction.ASIGNACION_ACTUALIZADA,
                                "Ticket asignado al técnico " + command.tecnicoAsignadoId(),
                                command.actorUsername(),
                                UsuarioRol.valueOf(command.actorRol().toUpperCase()),
                                clockPort.now()
                        ))
                        .thenReturn(saved));
    }
}
