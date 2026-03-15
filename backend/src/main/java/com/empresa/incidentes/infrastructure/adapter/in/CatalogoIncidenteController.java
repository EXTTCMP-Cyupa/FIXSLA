package com.empresa.incidentes.infrastructure.adapter.in;

import com.empresa.incidentes.domain.port.in.CreateCatalogoIncidenteUseCase;
import com.empresa.incidentes.domain.port.in.GetCatalogoIncidenteByIdUseCase;
import com.empresa.incidentes.domain.port.in.ListCatalogoIncidenteQuery;
import com.empresa.incidentes.domain.port.in.ListCatalogoIncidenteUseCase;
import com.empresa.incidentes.infrastructure.adapter.in.dto.CatalogoIncidenteResponse;
import com.empresa.incidentes.infrastructure.adapter.in.dto.CreateCatalogoIncidenteRequest;
import com.empresa.incidentes.infrastructure.mapper.CatalogoIncidenteApiMapper;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/catalogos")
public class CatalogoIncidenteController {

    private final CreateCatalogoIncidenteUseCase createCatalogoUseCase;
    private final GetCatalogoIncidenteByIdUseCase getCatalogoUseCase;
    private final ListCatalogoIncidenteUseCase listCatalogoUseCase;
    private final CatalogoIncidenteApiMapper mapper;

    public CatalogoIncidenteController(
            CreateCatalogoIncidenteUseCase createCatalogoUseCase,
            GetCatalogoIncidenteByIdUseCase getCatalogoUseCase,
            ListCatalogoIncidenteUseCase listCatalogoUseCase,
            CatalogoIncidenteApiMapper mapper
    ) {
        this.createCatalogoUseCase = createCatalogoUseCase;
        this.getCatalogoUseCase = getCatalogoUseCase;
        this.listCatalogoUseCase = listCatalogoUseCase;
        this.mapper = mapper;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<CatalogoIncidenteResponse> create(@Valid @RequestBody CreateCatalogoIncidenteRequest request) {
        return createCatalogoUseCase.handle(mapper.toCommand(request))
                .map(mapper::toResponse);
    }

    @GetMapping("/{catalogoId}")
    public Mono<CatalogoIncidenteResponse> getById(@PathVariable UUID catalogoId) {
        return getCatalogoUseCase.handle(catalogoId)
                .map(mapper::toResponse);
    }

    @GetMapping
    public Flux<CatalogoIncidenteResponse> list(@RequestParam(defaultValue = "true") boolean soloActivos) {
        return listCatalogoUseCase.handle(new ListCatalogoIncidenteQuery(soloActivos))
                .map(mapper::toResponse);
    }
}
