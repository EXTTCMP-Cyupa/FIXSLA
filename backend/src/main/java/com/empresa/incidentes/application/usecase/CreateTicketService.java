package com.empresa.incidentes.application.usecase;

import com.empresa.incidentes.domain.exception.CatalogoIncidenteNotFoundException;
import com.empresa.incidentes.domain.exception.InactiveCatalogoIncidenteException;
import com.empresa.incidentes.domain.model.CatalogoIncidente;
import com.empresa.incidentes.domain.model.Ticket;
import com.empresa.incidentes.domain.model.TicketAudit;
import com.empresa.incidentes.domain.model.TicketAuditAction;
import com.empresa.incidentes.domain.model.UsuarioRol;
import com.empresa.incidentes.domain.port.in.CreateTicketCommand;
import com.empresa.incidentes.domain.port.in.CreateTicketUseCase;
import com.empresa.incidentes.domain.port.out.CatalogoIncidenteRepositoryPort;
import com.empresa.incidentes.domain.port.out.ClockPort;
import com.empresa.incidentes.domain.port.out.SlaCalculatorPort;
import com.empresa.incidentes.domain.port.out.TicketCodeGeneratorPort;
import com.empresa.incidentes.domain.port.out.TicketAuditRepositoryPort;
import com.empresa.incidentes.domain.port.out.TicketRepositoryPort;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class CreateTicketService implements CreateTicketUseCase {

    private final TicketRepositoryPort ticketRepository;
    private final CatalogoIncidenteRepositoryPort catalogoRepository;
    private final TicketCodeGeneratorPort ticketCodeGenerator;
    private final ClockPort clockPort;
    private final SlaCalculatorPort slaCalculatorPort;
        private final TicketAuditRepositoryPort auditRepository;

    public CreateTicketService(
            TicketRepositoryPort ticketRepository,
            CatalogoIncidenteRepositoryPort catalogoRepository,
            TicketCodeGeneratorPort ticketCodeGenerator,
            ClockPort clockPort,
                        SlaCalculatorPort slaCalculatorPort,
                        TicketAuditRepositoryPort auditRepository
    ) {
        this.ticketRepository = ticketRepository;
        this.catalogoRepository = catalogoRepository;
        this.ticketCodeGenerator = ticketCodeGenerator;
        this.clockPort = clockPort;
        this.slaCalculatorPort = slaCalculatorPort;
                this.auditRepository = auditRepository;
    }

    @Override
    public Mono<Ticket> handle(CreateTicketCommand command) {
        return catalogoRepository.findById(command.catalogoIncidenteId())
                .switchIfEmpty(Mono.error(new CatalogoIncidenteNotFoundException(command.catalogoIncidenteId())))
                .flatMap(this::validateCatalogoActivo)
                .flatMap(catalogo -> ticketCodeGenerator.nextCode()
                        .zipWith(slaCalculatorPort.calculate(catalogo.prioridadPorDefecto(), clockPort.now()))
                        .map(tuple -> buildTicket(command, catalogo, tuple.getT1(), tuple.getT2().primeraRespuestaLimite(), tuple.getT2().resolucionLimite())))
                .flatMap(ticketRepository::save)
                .flatMap(saved -> auditRepository.save(TicketAudit.create(
                                saved.getId(),
                                TicketAuditAction.TICKET_CREADO,
                                "Ticket creado con prioridad " + saved.getPrioridad(),
                                "system",
                                UsuarioRol.COLABORADOR,
                                clockPort.now()
                        ))
                        .thenReturn(saved));
    }

    private Mono<CatalogoIncidente> validateCatalogoActivo(CatalogoIncidente catalogo) {
        return catalogo.activo()
                ? Mono.just(catalogo)
                : Mono.error(new InactiveCatalogoIncidenteException(catalogo.id()));
    }

    private Ticket buildTicket(
            CreateTicketCommand command,
            CatalogoIncidente catalogo,
            String codigo,
            java.time.Instant primeraRespuestaLimite,
            java.time.Instant resolucionLimite
    ) {
        java.time.Instant now = clockPort.now();
        return Ticket.createNew(
                command.codigo() == null || command.codigo().isBlank() ? codigo : command.codigo(),
                command.titulo(),
                command.descripcion(),
                command.solicitanteId(),
                catalogo.id(),
                command.ubicacionId(),
                command.numeroContacto(),
                catalogo.prioridadPorDefecto(),
                now,
                primeraRespuestaLimite,
                resolucionLimite
        );
    }
}
