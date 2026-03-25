package com.empresa.incidentes.domain.port.in;

import com.empresa.incidentes.domain.model.UsuarioRol;

import java.util.List;
import java.util.UUID;

public record UpdateUsuarioCommand(
        UUID id,
        String nombre,
        UsuarioRol rol,
        String area,
        String numeroContacto,
        Boolean activo,
        List<UUID> catalogoIds
) {
}
