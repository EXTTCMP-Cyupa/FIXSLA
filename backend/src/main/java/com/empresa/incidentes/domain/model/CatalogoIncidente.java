package com.empresa.incidentes.domain.model;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

public record CatalogoIncidente(
        UUID id,
        String nombre,
        String descripcion,
        TicketPriority prioridadPorDefecto,
        boolean activo,
        Instant creadoEn,
        Instant actualizadoEn
) {

    public CatalogoIncidente {
        Objects.requireNonNull(id, "El id del catálogo es obligatorio");
        Objects.requireNonNull(prioridadPorDefecto, "La prioridad por defecto es obligatoria");
        creadoEn = Objects.requireNonNull(creadoEn, "La fecha de creación es obligatoria");
        actualizadoEn = Objects.requireNonNull(actualizadoEn, "La fecha de actualización es obligatoria");

        nombre = normalizeRequired(nombre, "El nombre del catálogo es obligatorio");
        descripcion = normalizeNullable(descripcion);
    }

    public static CatalogoIncidente createNew(
            String nombre,
            String descripcion,
            TicketPriority prioridadPorDefecto,
            Instant now
    ) {
        Instant timestamp = Objects.requireNonNull(now, "La fecha actual es obligatoria");
        return new CatalogoIncidente(
                UUID.randomUUID(),
                nombre,
                descripcion,
                prioridadPorDefecto,
                true,
                timestamp,
                timestamp
        );
    }

            public static CatalogoIncidente reconstruct(
                UUID id,
                String nombre,
                String descripcion,
                TicketPriority prioridadPorDefecto,
                boolean activo,
                Instant creadoEn,
                Instant actualizadoEn
            ) {
            return new CatalogoIncidente(
                id,
                nombre,
                descripcion,
                prioridadPorDefecto,
                activo,
                creadoEn,
                actualizadoEn
            );
            }

    public CatalogoIncidente activate(Instant now) {
        return new CatalogoIncidente(
                id,
                nombre,
                descripcion,
                prioridadPorDefecto,
                true,
                creadoEn,
                Objects.requireNonNull(now, "La fecha actual es obligatoria")
        );
    }

    public CatalogoIncidente deactivate(Instant now) {
        return new CatalogoIncidente(
                id,
                nombre,
                descripcion,
                prioridadPorDefecto,
                false,
                creadoEn,
                Objects.requireNonNull(now, "La fecha actual es obligatoria")
        );
    }

    public CatalogoIncidente update(String nuevoNombre, String nuevaDescripcion, TicketPriority nuevaPrioridad, Instant now) {
        return new CatalogoIncidente(
                id,
                nuevoNombre,
                nuevaDescripcion,
                Objects.requireNonNull(nuevaPrioridad, "La prioridad por defecto es obligatoria"),
                activo,
                creadoEn,
                Objects.requireNonNull(now, "La fecha actual es obligatoria")
        );
    }

    private static String normalizeRequired(String value, String message) {
        String normalized = normalizeNullable(value);
        if (normalized == null || normalized.isBlank()) {
            throw new IllegalArgumentException(message);
        }
        return normalized;
    }

    private static String normalizeNullable(String value) {
        return value == null ? null : value.trim();
    }
}
