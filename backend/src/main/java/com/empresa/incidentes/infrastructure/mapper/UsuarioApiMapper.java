package com.empresa.incidentes.infrastructure.mapper;

import com.empresa.incidentes.domain.model.Usuario;
import com.empresa.incidentes.domain.port.in.CreateUsuarioCommand;
import com.empresa.incidentes.infrastructure.adapter.in.dto.CreateUsuarioRequest;
import com.empresa.incidentes.infrastructure.adapter.in.dto.UsuarioResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UsuarioApiMapper {

    CreateUsuarioCommand toCommand(CreateUsuarioRequest request);

    UsuarioResponse toResponse(Usuario usuario);
}
