package com.empresa.incidentes.infrastructure.adapter.out.entity;

import com.empresa.incidentes.domain.model.TicketPriority;
import com.empresa.incidentes.domain.model.TicketStatus;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.domain.Persistable;
import org.springframework.data.relational.core.mapping.Table;

import java.time.Instant;
import java.util.UUID;

@Table("tickets")
public class TicketEntity implements Persistable<UUID> {

    @Id
    private UUID id;
    private String codigo;
    private String titulo;
    private String descripcion;
    private UUID solicitanteId;
    private UUID tecnicoAsignadoId;
    private UUID catalogoIncidenteId;
    private UUID ubicacionId;
    private String numeroContacto;
    private TicketStatus estado;
    private TicketPriority prioridad;
    private Instant creadoEn;
    private Instant actualizadoEn;
    private Instant primeraRespuestaLimite;
    private Instant resolucionLimite;
    private Instant pendienteDesde;
    private Long slaPausadoSegundos;

    @Transient
    private boolean newEntity;

    public TicketEntity() {
    }

    public TicketEntity(
            UUID id,
            String codigo,
            String titulo,
            String descripcion,
            UUID solicitanteId,
            UUID tecnicoAsignadoId,
            UUID catalogoIncidenteId,
            UUID ubicacionId,
            String numeroContacto,
            TicketStatus estado,
            TicketPriority prioridad,
            Instant creadoEn,
            Instant actualizadoEn,
            Instant primeraRespuestaLimite,
            Instant resolucionLimite,
            Instant pendienteDesde,
            Long slaPausadoSegundos,
            boolean newEntity
    ) {
        this.id = id;
        this.codigo = codigo;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.solicitanteId = solicitanteId;
        this.tecnicoAsignadoId = tecnicoAsignadoId;
        this.catalogoIncidenteId = catalogoIncidenteId;
        this.ubicacionId = ubicacionId;
        this.numeroContacto = numeroContacto;
        this.estado = estado;
        this.prioridad = prioridad;
        this.creadoEn = creadoEn;
        this.actualizadoEn = actualizadoEn;
        this.primeraRespuestaLimite = primeraRespuestaLimite;
        this.resolucionLimite = resolucionLimite;
        this.pendienteDesde = pendienteDesde;
        this.slaPausadoSegundos = slaPausadoSegundos;
        this.newEntity = newEntity;
    }

    @Override
    public UUID getId() {
        return id;
    }

    @Override
    public boolean isNew() {
        return newEntity;
    }

    public void setNewEntity(boolean newEntity) {
        this.newEntity = newEntity;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public UUID getSolicitanteId() {
        return solicitanteId;
    }

    public void setSolicitanteId(UUID solicitanteId) {
        this.solicitanteId = solicitanteId;
    }

    public UUID getTecnicoAsignadoId() {
        return tecnicoAsignadoId;
    }

    public void setTecnicoAsignadoId(UUID tecnicoAsignadoId) {
        this.tecnicoAsignadoId = tecnicoAsignadoId;
    }

    public UUID getCatalogoIncidenteId() {
        return catalogoIncidenteId;
    }

    public void setCatalogoIncidenteId(UUID catalogoIncidenteId) {
        this.catalogoIncidenteId = catalogoIncidenteId;
    }

    public UUID getUbicacionId() {
        return ubicacionId;
    }

    public void setUbicacionId(UUID ubicacionId) {
        this.ubicacionId = ubicacionId;
    }

    public String getNumeroContacto() {
        return numeroContacto;
    }

    public void setNumeroContacto(String numeroContacto) {
        this.numeroContacto = numeroContacto;
    }

    public TicketStatus getEstado() {
        return estado;
    }

    public void setEstado(TicketStatus estado) {
        this.estado = estado;
    }

    public TicketPriority getPrioridad() {
        return prioridad;
    }

    public void setPrioridad(TicketPriority prioridad) {
        this.prioridad = prioridad;
    }

    public Instant getCreadoEn() {
        return creadoEn;
    }

    public void setCreadoEn(Instant creadoEn) {
        this.creadoEn = creadoEn;
    }

    public Instant getActualizadoEn() {
        return actualizadoEn;
    }

    public void setActualizadoEn(Instant actualizadoEn) {
        this.actualizadoEn = actualizadoEn;
    }

    public Instant getPrimeraRespuestaLimite() {
        return primeraRespuestaLimite;
    }

    public void setPrimeraRespuestaLimite(Instant primeraRespuestaLimite) {
        this.primeraRespuestaLimite = primeraRespuestaLimite;
    }

    public Instant getResolucionLimite() {
        return resolucionLimite;
    }

    public void setResolucionLimite(Instant resolucionLimite) {
        this.resolucionLimite = resolucionLimite;
    }

    public Instant getPendienteDesde() {
        return pendienteDesde;
    }

    public void setPendienteDesde(Instant pendienteDesde) {
        this.pendienteDesde = pendienteDesde;
    }

    public Long getSlaPausadoSegundos() {
        return slaPausadoSegundos;
    }

    public void setSlaPausadoSegundos(Long slaPausadoSegundos) {
        this.slaPausadoSegundos = slaPausadoSegundos;
    }
}
