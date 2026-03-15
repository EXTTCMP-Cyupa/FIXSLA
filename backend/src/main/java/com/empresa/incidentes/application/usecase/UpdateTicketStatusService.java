package com.empresa.incidentes.application.usecase;

import com.empresa.incidentes.domain.exception.InvalidTicketTransitionException;
import com.empresa.incidentes.domain.exception.TicketNotFoundException;
import com.empresa.incidentes.domain.model.Ticket;
import com.empresa.incidentes.domain.model.TicketAudit;
import com.empresa.incidentes.domain.model.TicketAuditAction;
import com.empresa.incidentes.domain.model.TicketStatus;
import com.empresa.incidentes.domain.model.UsuarioRol;
import com.empresa.incidentes.domain.port.in.UpdateTicketStatusCommand;
import com.empresa.incidentes.domain.port.in.UpdateTicketStatusUseCase;
import com.empresa.incidentes.domain.port.out.ClockPort;
import com.empresa.incidentes.domain.port.out.TicketAuditRepositoryPort;
import com.empresa.incidentes.domain.port.out.TicketRepositoryPort;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class UpdateTicketStatusService implements UpdateTicketStatusUseCase {

    private final TicketRepositoryPort ticketRepository;
    private final TicketAuditRepositoryPort auditRepository;
    private final ClockPort clockPort;

    public UpdateTicketStatusService(
            TicketRepositoryPort ticketRepository,
            TicketAuditRepositoryPort auditRepository,
            ClockPort clockPort
    ) {
        this.ticketRepository = ticketRepository;
        this.auditRepository = auditRepository;
        this.clockPort = clockPort;
    }

    @Override
    public Mono<Ticket> handle(UpdateTicketStatusCommand command) {
        return ticketRepository.findById(command.ticketId())
                .switchIfEmpty(Mono.error(new TicketNotFoundException(command.ticketId())))
                .map(ticket -> applyTransition(ticket, command))
            .flatMap(ticketRepository::save)
            .flatMap(saved -> auditRepository.save(TicketAudit.create(
                    saved.getId(),
                    TicketAuditAction.ESTADO_ACTUALIZADO,
                    "Estado actualizado a " + saved.getEstado(),
                    "system",
                    UsuarioRol.TECNICO,
                    clockPort.now()
                ))
                .thenReturn(saved));
    }

    private Ticket applyTransition(Ticket ticket, UpdateTicketStatusCommand command) {
        Ticket workingTicket = ticket;
        if (command.tecnicoAsignadoId() != null && ticket.getTecnicoAsignadoId() == null) {
            workingTicket = workingTicket.assignTechnician(command.tecnicoAsignadoId(), clockPort.now());
        }

        return switch (command.nextStatus()) {
            case EN_PROCESO -> ticket.getEstado() == TicketStatus.PENDIENTE
                    ? workingTicket.resumeFromPending(clockPort.now())
                    : workingTicket.startProgress(clockPort.now());
            case PENDIENTE -> workingTicket.markPending(clockPort.now());
            case RESUELTO -> workingTicket.resolve(clockPort.now());
            case CANCELADO -> workingTicket.cancel(clockPort.now());
            case NUEVO -> throw new InvalidTicketTransitionException("No es válido retornar un ticket a NUEVO");
        };
    }
}
