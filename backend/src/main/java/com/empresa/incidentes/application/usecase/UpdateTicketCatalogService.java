package com.empresa.incidentes.application.usecase;

import com.empresa.incidentes.domain.exception.CatalogoIncidenteNotFoundException;
import com.empresa.incidentes.domain.exception.TicketNotFoundException;
import com.empresa.incidentes.domain.model.Ticket;
import com.empresa.incidentes.domain.model.TicketAudit;
import com.empresa.incidentes.domain.model.TicketAuditAction;
import com.empresa.incidentes.domain.model.UsuarioRol;
import com.empresa.incidentes.domain.port.in.UpdateTicketCatalogCommand;
import com.empresa.incidentes.domain.port.in.UpdateTicketCatalogUseCase;
import com.empresa.incidentes.domain.port.out.CatalogoIncidenteRepositoryPort;
import com.empresa.incidentes.domain.port.out.ClockPort;
import com.empresa.incidentes.domain.port.out.TicketAuditRepositoryPort;
import com.empresa.incidentes.domain.port.out.TicketRepositoryPort;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class UpdateTicketCatalogService implements UpdateTicketCatalogUseCase {

    private final TicketRepositoryPort ticketRepository;
    private final CatalogoIncidenteRepositoryPort catalogoRepository;
    private final TicketAuditRepositoryPort auditRepository;
    private final ClockPort clockPort;

    public UpdateTicketCatalogService(
            TicketRepositoryPort ticketRepository,
            CatalogoIncidenteRepositoryPort catalogoRepository,
            TicketAuditRepositoryPort auditRepository,
            ClockPort clockPort
    ) {
        this.ticketRepository = ticketRepository;
        this.catalogoRepository = catalogoRepository;
        this.auditRepository = auditRepository;
        this.clockPort = clockPort;
    }

    @Override
    public Mono<Ticket> handle(UpdateTicketCatalogCommand command) {
        return ticketRepository.findById(command.ticketId())
                .switchIfEmpty(Mono.error(new TicketNotFoundException(command.ticketId())))
                .flatMap(ticket -> catalogoRepository.findById(command.catalogoIncidenteId())
                        .switchIfEmpty(Mono.error(new CatalogoIncidenteNotFoundException(command.catalogoIncidenteId())))
                        .map(catalogo -> ticket.updateCatalog(
                                catalogo.id(),
                                catalogo.prioridadPorDefecto(),
                                clockPort.now()
                        )))
                .flatMap(ticketRepository::save)
                .flatMap(saved -> auditRepository.save(TicketAudit.create(
                                saved.getId(),
                                TicketAuditAction.CATALOGO_ACTUALIZADO,
                                "Catálogo actualizado",
                                command.actorUsername(),
                                UsuarioRol.valueOf(command.actorRol().toUpperCase()),
                                clockPort.now()
                        ))
                        .thenReturn(saved));
    }
}
