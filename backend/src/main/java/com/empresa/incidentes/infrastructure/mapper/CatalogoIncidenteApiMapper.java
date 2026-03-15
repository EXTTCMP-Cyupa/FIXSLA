package com.empresa.incidentes.infrastructure.mapper;

import com.empresa.incidentes.domain.model.CatalogoIncidente;
import com.empresa.incidentes.domain.port.in.CreateCatalogoIncidenteCommand;
import com.empresa.incidentes.infrastructure.adapter.in.dto.CatalogoIncidenteResponse;
import com.empresa.incidentes.infrastructure.adapter.in.dto.CreateCatalogoIncidenteRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CatalogoIncidenteApiMapper {

    CreateCatalogoIncidenteCommand toCommand(CreateCatalogoIncidenteRequest request);

    CatalogoIncidenteResponse toResponse(CatalogoIncidente catalogoIncidente);
}
