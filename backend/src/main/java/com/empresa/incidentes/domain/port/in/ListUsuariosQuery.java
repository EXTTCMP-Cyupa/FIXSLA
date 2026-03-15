package com.empresa.incidentes.domain.port.in;

import com.empresa.incidentes.domain.model.UsuarioRol;

public record ListUsuariosQuery(
        UsuarioRol rol,
        String area
) {
}
