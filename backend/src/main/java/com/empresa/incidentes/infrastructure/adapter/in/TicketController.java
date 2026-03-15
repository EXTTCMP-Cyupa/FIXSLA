package com.empresa.incidentes.infrastructure.adapter.in;

import com.empresa.incidentes.domain.model.TicketPriority;
import com.empresa.incidentes.domain.model.Ticket;
import com.empresa.incidentes.domain.model.UsuarioRol;
import com.empresa.incidentes.domain.model.TicketStatus;
import com.empresa.incidentes.domain.port.in.AssignTicketTechnicianCommand;
import com.empresa.incidentes.domain.port.in.AssignTicketTechnicianUseCase;
import com.empresa.incidentes.domain.port.in.CreateTicketCommand;
import com.empresa.incidentes.domain.port.in.CreateTicketUseCase;
import com.empresa.incidentes.domain.port.in.GetTicketByIdUseCase;
import com.empresa.incidentes.domain.port.in.ListTicketAuditUseCase;
import com.empresa.incidentes.domain.port.in.ListTicketsQuery;
import com.empresa.incidentes.domain.port.in.ListTicketsUseCase;
import com.empresa.incidentes.domain.port.in.UpdateTicketStatusUseCase;
import com.empresa.incidentes.infrastructure.adapter.in.dto.AssignTicketTechnicianRequest;
import com.empresa.incidentes.infrastructure.adapter.in.dto.TicketAuditResponse;
import com.empresa.incidentes.infrastructure.adapter.in.dto.CreateTicketRequest;
import com.empresa.incidentes.infrastructure.adapter.in.dto.TicketResponse;
import com.empresa.incidentes.infrastructure.adapter.in.dto.UpdateTicketStatusRequest;
import com.empresa.incidentes.infrastructure.mapper.TicketAuditApiMapper;
import com.empresa.incidentes.infrastructure.mapper.TicketApiMapper;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tickets")
public class TicketController {

    private final CreateTicketUseCase createTicketUseCase;
    private final GetTicketByIdUseCase getTicketByIdUseCase;
    private final ListTicketsUseCase listTicketsUseCase;
    private final UpdateTicketStatusUseCase updateTicketStatusUseCase;
    private final AssignTicketTechnicianUseCase assignTicketTechnicianUseCase;
    private final ListTicketAuditUseCase listTicketAuditUseCase;
    private final TicketApiMapper mapper;
    private final TicketAuditApiMapper auditMapper;

    public TicketController(
            CreateTicketUseCase createTicketUseCase,
            GetTicketByIdUseCase getTicketByIdUseCase,
            ListTicketsUseCase listTicketsUseCase,
            UpdateTicketStatusUseCase updateTicketStatusUseCase,
            AssignTicketTechnicianUseCase assignTicketTechnicianUseCase,
            ListTicketAuditUseCase listTicketAuditUseCase,
            TicketApiMapper mapper,
            TicketAuditApiMapper auditMapper
    ) {
        this.createTicketUseCase = createTicketUseCase;
        this.getTicketByIdUseCase = getTicketByIdUseCase;
        this.listTicketsUseCase = listTicketsUseCase;
        this.updateTicketStatusUseCase = updateTicketStatusUseCase;
        this.assignTicketTechnicianUseCase = assignTicketTechnicianUseCase;
        this.listTicketAuditUseCase = listTicketAuditUseCase;
        this.mapper = mapper;
        this.auditMapper = auditMapper;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
        public Mono<TicketResponse> create(@Valid @RequestBody CreateTicketRequest request, Authentication authentication) {
        CreateTicketCommand baseCommand = mapper.toCommand(request);
        CreateTicketCommand command = isColaborador(authentication)
            ? new CreateTicketCommand(
            baseCommand.codigo(),
            baseCommand.titulo(),
            baseCommand.descripcion(),
            userId(authentication),
            baseCommand.catalogoIncidenteId()
        )
            : baseCommand;

        return createTicketUseCase.handle(command)
                .map(mapper::toResponse);
    }

    @GetMapping("/{ticketId}")
        public Mono<TicketResponse> getById(@PathVariable UUID ticketId, Authentication authentication) {
        return getTicketByIdUseCase.handle(ticketId)
            .flatMap(ticket -> validateCollaboratorOwnership(ticket, authentication))
                .map(mapper::toResponse);
    }

    @GetMapping
    public Flux<TicketResponse> list(
            @RequestParam(required = false) TicketStatus estado,
            @RequestParam(required = false) TicketPriority prioridad,
            @RequestParam(required = false) UUID solicitanteId,
            @RequestParam(required = false) UUID tecnicoAsignadoId,
                @RequestParam(required = false) UUID catalogoIncidenteId,
                Authentication authentication
    ) {
            UUID effectiveSolicitanteId = isColaborador(authentication)
                ? userId(authentication)
                : solicitanteId;

        return listTicketsUseCase.handle(new ListTicketsQuery(
                        estado,
                        prioridad,
                    effectiveSolicitanteId,
                        tecnicoAsignadoId,
                        catalogoIncidenteId
                ))
                .map(mapper::toResponse);
    }

    @PatchMapping("/{ticketId}/status")
    public Mono<TicketResponse> updateStatus(@PathVariable UUID ticketId, @Valid @RequestBody UpdateTicketStatusRequest request) {
        return updateTicketStatusUseCase.handle(mapper.toCommand(ticketId, request))
                .map(mapper::toResponse);
    }

        @PatchMapping("/{ticketId}/assignee")
        public Mono<TicketResponse> assignTechnician(
            @PathVariable UUID ticketId,
            @Valid @RequestBody AssignTicketTechnicianRequest request,
            Authentication authentication
        ) {
        return assignTicketTechnicianUseCase.handle(new AssignTicketTechnicianCommand(
                ticketId,
                request.tecnicoAsignadoId(),
                authentication.getName(),
                actorRol(authentication).name()
            ))
            .map(mapper::toResponse);
        }

        @GetMapping("/{ticketId}/auditoria")
        public Flux<TicketAuditResponse> listAudit(@PathVariable UUID ticketId, Authentication authentication) {
        return getTicketByIdUseCase.handle(ticketId)
            .flatMap(ticket -> validateCollaboratorOwnership(ticket, authentication))
            .flatMapMany(ticket -> listTicketAuditUseCase.handle(ticketId))
            .map(auditMapper::toResponse);
        }

    private Mono<Ticket> validateCollaboratorOwnership(Ticket ticket, Authentication authentication) {
        if (!isColaborador(authentication)) {
            return Mono.just(ticket);
        }

        if (!userId(authentication).equals(ticket.getSolicitanteId())) {
            return Mono.error(new AccessDeniedException("No tienes permisos para consultar este ticket"));
        }
        return Mono.just(ticket);
    }

    private boolean isColaborador(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> "ROLE_COLABORADOR".equals(authority.getAuthority()));
    }

    private UUID userId(Authentication authentication) {
        return UUID.nameUUIDFromBytes(authentication.getName().toLowerCase().getBytes(StandardCharsets.UTF_8));
    }

    private UsuarioRol actorRol(Authentication authentication) {
        if (authentication.getAuthorities().stream().anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()))) {
            return UsuarioRol.ADMIN;
        }
        if (authentication.getAuthorities().stream().anyMatch(a -> "ROLE_TECNICO".equals(a.getAuthority()))) {
            return UsuarioRol.TECNICO;
        }
        return UsuarioRol.COLABORADOR;
    }
}
