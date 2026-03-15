package com.empresa.incidentes.domain.model;

import com.empresa.incidentes.domain.exception.InvalidTicketTransitionException;

import java.time.Duration;
import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

public final class Ticket {

    private final UUID id;
    private final String codigo;
    private final String titulo;
    private final String descripcion;
    private final UUID solicitanteId;
    private final UUID tecnicoAsignadoId;
    private final UUID catalogoIncidenteId;
    private final TicketStatus estado;
    private final TicketPriority prioridad;
    private final Instant creadoEn;
    private final Instant actualizadoEn;
    private final Instant primeraRespuestaLimite;
    private final Instant resolucionLimite;
    private final Instant pendienteDesde;
    private final Duration slaPausadoAcumulado;

    private Ticket(
            UUID id,
            String codigo,
            String titulo,
            String descripcion,
            UUID solicitanteId,
            UUID tecnicoAsignadoId,
            UUID catalogoIncidenteId,
            TicketStatus estado,
            TicketPriority prioridad,
            Instant creadoEn,
            Instant actualizadoEn,
            Instant primeraRespuestaLimite,
            Instant resolucionLimite,
            Instant pendienteDesde,
            Duration slaPausadoAcumulado
    ) {
        this.id = Objects.requireNonNull(id, "El id del ticket es obligatorio");
        this.codigo = normalizeRequired(codigo, "El código del ticket es obligatorio");
        this.titulo = normalizeRequired(titulo, "El título del ticket es obligatorio");
        this.descripcion = normalizeRequired(descripcion, "La descripción del ticket es obligatoria");
        this.solicitanteId = Objects.requireNonNull(solicitanteId, "El solicitante es obligatorio");
        this.tecnicoAsignadoId = tecnicoAsignadoId;
        this.catalogoIncidenteId = Objects.requireNonNull(catalogoIncidenteId, "El catálogo es obligatorio");
        this.estado = Objects.requireNonNull(estado, "El estado del ticket es obligatorio");
        this.prioridad = Objects.requireNonNull(prioridad, "La prioridad del ticket es obligatoria");
        this.creadoEn = Objects.requireNonNull(creadoEn, "La fecha de creación es obligatoria");
        this.actualizadoEn = Objects.requireNonNull(actualizadoEn, "La fecha de actualización es obligatoria");
        this.primeraRespuestaLimite = Objects.requireNonNull(primeraRespuestaLimite, "El SLA de primera respuesta es obligatorio");
        this.resolucionLimite = Objects.requireNonNull(resolucionLimite, "El SLA de resolución es obligatorio");
        this.pendienteDesde = pendienteDesde;
        this.slaPausadoAcumulado = Objects.requireNonNull(slaPausadoAcumulado, "El tiempo de SLA pausado es obligatorio");
    }

    public static Ticket createNew(
            String codigo,
            String titulo,
            String descripcion,
            UUID solicitanteId,
            UUID catalogoIncidenteId,
            TicketPriority prioridad,
            Instant now,
            Instant primeraRespuestaLimite,
            Instant resolucionLimite
    ) {
        Instant timestamp = Objects.requireNonNull(now, "La fecha actual es obligatoria");
        return new Ticket(
                UUID.randomUUID(),
                codigo,
                titulo,
                descripcion,
                solicitanteId,
                null,
                catalogoIncidenteId,
                TicketStatus.NUEVO,
                prioridad,
                timestamp,
                timestamp,
                primeraRespuestaLimite,
                resolucionLimite,
                null,
                Duration.ZERO
        );
    }

            public static Ticket reconstruct(
                UUID id,
                String codigo,
                String titulo,
                String descripcion,
                UUID solicitanteId,
                UUID tecnicoAsignadoId,
                UUID catalogoIncidenteId,
                TicketStatus estado,
                TicketPriority prioridad,
                Instant creadoEn,
                Instant actualizadoEn,
                Instant primeraRespuestaLimite,
                Instant resolucionLimite,
                Instant pendienteDesde,
                Duration slaPausadoAcumulado
            ) {
            return new Ticket(
                id,
                codigo,
                titulo,
                descripcion,
                solicitanteId,
                tecnicoAsignadoId,
                catalogoIncidenteId,
                estado,
                prioridad,
                creadoEn,
                actualizadoEn,
                primeraRespuestaLimite,
                resolucionLimite,
                pendienteDesde,
                slaPausadoAcumulado
            );
            }

    public Ticket assignTechnician(UUID tecnicoId, Instant now) {
        return copy(
            Objects.requireNonNull(tecnicoId, "El técnico asignado es obligatorio"),
                estado,
                Objects.requireNonNull(now, "La fecha actual es obligatoria"),
                pendienteDesde,
                slaPausadoAcumulado
        );
    }

    public Ticket reassignTechnician(UUID tecnicoId, Instant now) {
        return assignTechnician(tecnicoId, now);
    }

    public Ticket startProgress(Instant now) {
        validateTransition(TicketStatus.EN_PROCESO);
        return copy(
                tecnicoAsignadoId,
                TicketStatus.EN_PROCESO,
                Objects.requireNonNull(now, "La fecha actual es obligatoria"),
                null,
                slaPausadoAcumulado
        );
    }

    public Ticket markPending(Instant now) {
        validateTransition(TicketStatus.PENDIENTE);
        Instant timestamp = Objects.requireNonNull(now, "La fecha actual es obligatoria");
        return copy(
                tecnicoAsignadoId,
                TicketStatus.PENDIENTE,
                timestamp,
                timestamp,
                slaPausadoAcumulado
        );
    }

    public Ticket resumeFromPending(Instant now) {
        validateCurrentState(TicketStatus.PENDIENTE);
        Instant timestamp = Objects.requireNonNull(now, "La fecha actual es obligatoria");
        Duration pausaActual = pendienteDesde == null
                ? Duration.ZERO
                : Duration.between(pendienteDesde, timestamp);

        return copy(
                tecnicoAsignadoId,
                TicketStatus.EN_PROCESO,
                timestamp,
                null,
                slaPausadoAcumulado.plus(pausaActual.isNegative() ? Duration.ZERO : pausaActual)
        );
    }

    public Ticket resolve(Instant now) {
        validateTransition(TicketStatus.RESUELTO);
        return copy(
                tecnicoAsignadoId,
                TicketStatus.RESUELTO,
                Objects.requireNonNull(now, "La fecha actual es obligatoria"),
                null,
                slaPausadoAcumulado
        );
    }

    public Ticket cancel(Instant now) {
        validateTransition(TicketStatus.CANCELADO);
        return copy(
                tecnicoAsignadoId,
                TicketStatus.CANCELADO,
                Objects.requireNonNull(now, "La fecha actual es obligatoria"),
                null,
                slaPausadoAcumulado
        );
    }

    public boolean canTransitionTo(TicketStatus nextStatus) {
        return state().canTransitionTo(nextStatus);
    }

    public UUID getId() {
        return id;
    }

    public String getCodigo() {
        return codigo;
    }

    public String getTitulo() {
        return titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public UUID getSolicitanteId() {
        return solicitanteId;
    }

    public UUID getTecnicoAsignadoId() {
        return tecnicoAsignadoId;
    }

    public UUID getCatalogoIncidenteId() {
        return catalogoIncidenteId;
    }

    public TicketStatus getEstado() {
        return estado;
    }

    public TicketPriority getPrioridad() {
        return prioridad;
    }

    public Instant getCreadoEn() {
        return creadoEn;
    }

    public Instant getActualizadoEn() {
        return actualizadoEn;
    }

    public Instant getPrimeraRespuestaLimite() {
        return primeraRespuestaLimite;
    }

    public Instant getResolucionLimite() {
        return resolucionLimite;
    }

    public Instant getPendienteDesde() {
        return pendienteDesde;
    }

    public Duration getSlaPausadoAcumulado() {
        return slaPausadoAcumulado;
    }

    private TicketState state() {
        return switch (estado) {
            case NUEVO -> NuevoTicketState.INSTANCE;
            case EN_PROCESO -> EnProcesoTicketState.INSTANCE;
            case PENDIENTE -> PendienteTicketState.INSTANCE;
            case RESUELTO -> ResueltoTicketState.INSTANCE;
            case CANCELADO -> CanceladoTicketState.INSTANCE;
        };
    }

    private Ticket copy(
            UUID newTecnicoAsignadoId,
            TicketStatus newEstado,
            Instant newActualizadoEn,
            Instant newPendienteDesde,
            Duration newSlaPausadoAcumulado
    ) {
        return new Ticket(
                id,
                codigo,
                titulo,
                descripcion,
                solicitanteId,
                newTecnicoAsignadoId,
                catalogoIncidenteId,
                newEstado,
                prioridad,
                creadoEn,
                newActualizadoEn,
                primeraRespuestaLimite,
                resolucionLimite,
                newPendienteDesde,
                newSlaPausadoAcumulado
        );
    }

    private void validateTransition(TicketStatus nextStatus) {
        if (!canTransitionTo(nextStatus)) {
            throw new InvalidTicketTransitionException(
                    "Transición inválida del estado " + estado + " al estado " + nextStatus
            );
        }
    }

    private void validateCurrentState(TicketStatus expected) {
        if (estado != expected) {
            throw new InvalidTicketTransitionException(
                    "El ticket debe estar en estado " + expected + " pero se encuentra en " + estado
            );
        }
    }

    private static String normalizeRequired(String value, String message) {
        String normalized = value == null ? null : value.trim();
        if (normalized == null || normalized.isBlank()) {
            throw new IllegalArgumentException(message);
        }
        return normalized;
    }
}
