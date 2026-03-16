package com.empresa.incidentes.infrastructure.mapper;

import com.empresa.incidentes.domain.model.Usuario;
import com.empresa.incidentes.domain.port.in.CreateUsuarioCommand;
import com.empresa.incidentes.domain.port.in.UpdateUsuarioCommand;
import com.empresa.incidentes.infrastructure.adapter.in.dto.CreateUsuarioRequest;
import com.empresa.incidentes.infrastructure.adapter.in.dto.UpdateUsuarioRequest;
import com.empresa.incidentes.infrastructure.adapter.in.dto.UsuarioResponse;
import org.mapstruct.Mapper;
import java.util.UUID;

@Mapper(componentModel = "spring")
public interface UsuarioApiMapper {

    CreateUsuarioCommand toCommand(CreateUsuarioRequest request);

    UpdateUsuarioCommand toUpdateCommand(UpdateUsuarioRequest request, UUID id);

    UsuarioResponse toResponse(Usuario usuario);
}
