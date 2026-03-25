package com.empresa.incidentes.domain.model;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

public record Ubicacion(
        UUID id,
        String nombre,
        String descripcion,
        boolean activo,
        Instant creadoEn,
        Instant actualizadoEn
) {

    public Ubicacion {
        Objects.requireNonNull(id, "El id de la ubicación es obligatorio");
        creadoEn = Objects.requireNonNull(creadoEn, "La fecha de creación es obligatoria");
        actualizadoEn = Objects.requireNonNull(actualizadoEn, "La fecha de actualización es obligatoria");
        nombre = normalizeRequired(nombre, "El nombre de la ubicación es obligatorio");
        descripcion = descripcion != null ? descripcion.trim() : null;
    }

    public static Ubicacion createNew(String nombre, String descripcion, Instant now) {
        Instant timestamp = Objects.requireNonNull(now, "La fecha actual es obligatoria");
        return new Ubicacion(UUID.randomUUID(), nombre, descripcion, true, timestamp, timestamp);
    }

    public static Ubicacion reconstruct(UUID id, String nombre, String descripcion,
            boolean activo, Instant creadoEn, Instant actualizadoEn) {
        return new Ubicacion(id, nombre, descripcion, activo, creadoEn, actualizadoEn);
    }

    public Ubicacion update(String newNombre, String newDescripcion, boolean newActivo, Instant now) {
        return new Ubicacion(id, newNombre, newDescripcion, newActivo,
                creadoEn, Objects.requireNonNull(now, "La fecha actual es obligatoria"));
    }

    private static String normalizeRequired(String value, String message) {
        if (value == null || value.trim().isBlank()) {
            throw new IllegalArgumentException(message);
        }
        return value.trim();
    }
}
