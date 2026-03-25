package com.empresa.incidentes.infrastructure.adapter.in;

import com.empresa.incidentes.domain.port.in.CreateUbicacionUseCase;
import com.empresa.incidentes.domain.port.in.ListUbicacionesUseCase;
import com.empresa.incidentes.domain.port.in.UpdateUbicacionCommand;
import com.empresa.incidentes.domain.port.in.UpdateUbicacionUseCase;
import com.empresa.incidentes.infrastructure.adapter.in.dto.CreateUbicacionRequest;
import com.empresa.incidentes.infrastructure.adapter.in.dto.UbicacionResponse;
import com.empresa.incidentes.infrastructure.adapter.in.dto.UpdateUbicacionRequest;
import com.empresa.incidentes.infrastructure.mapper.UbicacionApiMapper;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/ubicaciones")
public class UbicacionController {

    private final CreateUbicacionUseCase createUbicacionUseCase;
    private final UpdateUbicacionUseCase updateUbicacionUseCase;
    private final ListUbicacionesUseCase listUbicacionesUseCase;
    private final UbicacionApiMapper mapper;

    public UbicacionController(
            CreateUbicacionUseCase createUbicacionUseCase,
            UpdateUbicacionUseCase updateUbicacionUseCase,
            ListUbicacionesUseCase listUbicacionesUseCase,
            UbicacionApiMapper mapper
    ) {
        this.createUbicacionUseCase = createUbicacionUseCase;
        this.updateUbicacionUseCase = updateUbicacionUseCase;
        this.listUbicacionesUseCase = listUbicacionesUseCase;
        this.mapper = mapper;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<UbicacionResponse> create(@Valid @RequestBody CreateUbicacionRequest request) {
        return createUbicacionUseCase.handle(mapper.toCommand(request)).map(mapper::toResponse);
    }

    @PatchMapping("/{ubicacionId}")
    public Mono<UbicacionResponse> update(
            @PathVariable UUID ubicacionId,
            @Valid @RequestBody UpdateUbicacionRequest request
    ) {
        return updateUbicacionUseCase.handle(new UpdateUbicacionCommand(
                ubicacionId, request.nombre(), request.descripcion(), request.activo()
        )).map(mapper::toResponse);
    }

    @GetMapping
    public Flux<UbicacionResponse> list() {
        return listUbicacionesUseCase.handle().map(mapper::toResponse);
    }
}
