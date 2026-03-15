package com.empresa.incidentes.domain.port.in;

import com.empresa.incidentes.domain.model.UsuarioRol;

public record CreateUsuarioCommand(
        String username,
        String nombre,
        UsuarioRol rol,
        String area
) {
}
