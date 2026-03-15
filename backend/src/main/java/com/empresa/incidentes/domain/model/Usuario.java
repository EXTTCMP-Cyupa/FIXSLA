package com.empresa.incidentes.domain.model;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Objects;
import java.util.List;
import java.util.UUID;

public record Usuario(
        UUID id,
        String username,
        String nombre,
        UsuarioRol rol,
        String area,
        List<UUID> catalogoIds,
        boolean activo,
        Instant creadoEn,
        Instant actualizadoEn
) {

    public Usuario {
        id = Objects.requireNonNull(id, "El id del usuario es obligatorio");
        username = normalizeRequired(username, "El username es obligatorio").toLowerCase();
        nombre = normalizeRequired(nombre, "El nombre es obligatorio");
        rol = Objects.requireNonNull(rol, "El rol es obligatorio");
        area = normalizeRequired(area, "El área es obligatoria");
        catalogoIds = catalogoIds != null ? List.copyOf(catalogoIds) : List.of();
        creadoEn = Objects.requireNonNull(creadoEn, "La fecha de creación es obligatoria");
        actualizadoEn = Objects.requireNonNull(actualizadoEn, "La fecha de actualización es obligatoria");
    }

    public static Usuario createNew(String username, String nombre, UsuarioRol rol, String area, List<UUID> catalogoIds, Instant now) {
        Instant timestamp = Objects.requireNonNull(now, "La fecha actual es obligatoria");
        String normalizedUsername = normalizeRequired(username, "El username es obligatorio").toLowerCase();
        return new Usuario(
                UUID.nameUUIDFromBytes(normalizedUsername.getBytes(StandardCharsets.UTF_8)),
                normalizedUsername,
                nombre,
                rol,
                area,
                catalogoIds,
                true,
                timestamp,
                timestamp
        );
    }

    public static Usuario reconstruct(
            UUID id,
            String username,
            String nombre,
            UsuarioRol rol,
            String area,
            List<UUID> catalogoIds,
            boolean activo,
            Instant creadoEn,
            Instant actualizadoEn
    ) {
        return new Usuario(id, username, nombre, rol, area, catalogoIds, activo, creadoEn, actualizadoEn);
    }

    private static String normalizeRequired(String value, String message) {
        if (value == null || value.trim().isBlank()) {
            throw new IllegalArgumentException(message);
        }
        return value.trim();
    }
}
