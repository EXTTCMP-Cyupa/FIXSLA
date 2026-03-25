package com.empresa.incidentes.domain.port.in;

import com.empresa.incidentes.domain.model.UsuarioRol;
import java.util.List;
import java.util.UUID;

public record CreateUsuarioCommand(
        String username,
        String nombre,
        UsuarioRol rol,
        String area,
        String numeroContacto,
        List<UUID> catalogoIds
) {
}
