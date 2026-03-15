package com.empresa.incidentes.application.usecase;

import com.empresa.incidentes.domain.model.TicketAudit;
import com.empresa.incidentes.domain.model.TicketAuditAction;
import com.empresa.incidentes.domain.model.UsuarioRol;
import com.empresa.incidentes.domain.port.in.AddTicketNoteCommand;
import com.empresa.incidentes.domain.port.in.AddTicketNoteUseCase;
import com.empresa.incidentes.domain.port.out.ClockPort;
import com.empresa.incidentes.domain.port.out.TicketAuditRepositoryPort;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class AddTicketNoteService implements AddTicketNoteUseCase {

    private final TicketAuditRepositoryPort auditRepository;
    private final ClockPort clockPort;

    public AddTicketNoteService(TicketAuditRepositoryPort auditRepository, ClockPort clockPort) {
        this.auditRepository = auditRepository;
        this.clockPort = clockPort;
    }

    @Override
    public Mono<TicketAudit> handle(AddTicketNoteCommand command) {
        return auditRepository.save(TicketAudit.create(
                command.ticketId(),
                TicketAuditAction.COMENTARIO,
                command.nota(),
                command.actorUsername(),
                UsuarioRol.valueOf(command.actorRol().toUpperCase()),
                clockPort.now()
        ));
    }
}
