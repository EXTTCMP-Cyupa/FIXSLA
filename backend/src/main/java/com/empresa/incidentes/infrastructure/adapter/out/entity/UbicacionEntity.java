package com.empresa.incidentes.infrastructure.adapter.out.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.domain.Persistable;
import org.springframework.data.relational.core.mapping.Table;

import java.time.Instant;
import java.util.UUID;

@Table("ubicaciones")
public class UbicacionEntity implements Persistable<UUID> {

    @Id
    private UUID id;
    private String nombre;
    private String descripcion;
    private Boolean activo;
    private Instant creadoEn;
    private Instant actualizadoEn;

    @Transient
    private boolean newEntity;

    public UbicacionEntity() {
    }

    @Override
    public UUID getId() { return id; }

    @Override
    public boolean isNew() { return newEntity; }

    public void setNewEntity(boolean newEntity) { this.newEntity = newEntity; }
    public void setId(UUID id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }

    public Instant getCreadoEn() { return creadoEn; }
    public void setCreadoEn(Instant creadoEn) { this.creadoEn = creadoEn; }

    public Instant getActualizadoEn() { return actualizadoEn; }
    public void setActualizadoEn(Instant actualizadoEn) { this.actualizadoEn = actualizadoEn; }
}
