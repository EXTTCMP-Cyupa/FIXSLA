package com.empresa.incidentes.infrastructure.mapper;

import com.empresa.incidentes.domain.model.Ubicacion;
import com.empresa.incidentes.domain.port.in.CreateUbicacionCommand;
import com.empresa.incidentes.infrastructure.adapter.in.dto.CreateUbicacionRequest;
import com.empresa.incidentes.infrastructure.adapter.in.dto.UbicacionResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UbicacionApiMapper {
    CreateUbicacionCommand toCommand(CreateUbicacionRequest request);
    UbicacionResponse toResponse(Ubicacion ubicacion);
}
