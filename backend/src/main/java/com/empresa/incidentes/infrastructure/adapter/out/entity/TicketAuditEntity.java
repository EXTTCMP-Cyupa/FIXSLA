package com.empresa.incidentes.infrastructure.adapter.out.entity;

import com.empresa.incidentes.domain.model.TicketAuditAction;
import com.empresa.incidentes.domain.model.UsuarioRol;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.domain.Persistable;
import org.springframework.data.relational.core.mapping.Table;

import java.time.Instant;
import java.util.UUID;

@Table("ticket_audit")
public class TicketAuditEntity implements Persistable<UUID> {

        @Id
        private UUID id;
        private UUID ticketId;
        private TicketAuditAction accion;
        private String detalle;
        private String actorUsername;
        private UsuarioRol actorRol;
        private Instant fecha;

        @Transient
        private boolean newEntity = true;

        public TicketAuditEntity() {
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

        public UUID getTicketId() {
                return ticketId;
        }

        public void setTicketId(UUID ticketId) {
                this.ticketId = ticketId;
        }

        public TicketAuditAction getAccion() {
                return accion;
        }

        public void setAccion(TicketAuditAction accion) {
                this.accion = accion;
        }

        public String getDetalle() {
                return detalle;
        }

        public void setDetalle(String detalle) {
                this.detalle = detalle;
        }

        public String getActorUsername() {
                return actorUsername;
        }

        public void setActorUsername(String actorUsername) {
                this.actorUsername = actorUsername;
        }

        public UsuarioRol getActorRol() {
                return actorRol;
        }

        public void setActorRol(UsuarioRol actorRol) {
                this.actorRol = actorRol;
        }

        public Instant getFecha() {
                return fecha;
        }

        public void setFecha(Instant fecha) {
                this.fecha = fecha;
        }
}
