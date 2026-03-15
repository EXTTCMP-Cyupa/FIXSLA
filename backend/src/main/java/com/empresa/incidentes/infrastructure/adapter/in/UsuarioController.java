package com.empresa.incidentes.infrastructure.adapter.in;

import com.empresa.incidentes.domain.model.UsuarioRol;
import com.empresa.incidentes.domain.port.in.CreateUsuarioUseCase;
import com.empresa.incidentes.domain.port.in.ListUsuariosQuery;
import com.empresa.incidentes.domain.port.in.ListUsuariosUseCase;
import com.empresa.incidentes.infrastructure.adapter.in.dto.CreateUsuarioRequest;
import com.empresa.incidentes.infrastructure.adapter.in.dto.UsuarioResponse;
import com.empresa.incidentes.infrastructure.mapper.UsuarioApiMapper;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/usuarios")
public class UsuarioController {

    private final CreateUsuarioUseCase createUsuarioUseCase;
    private final ListUsuariosUseCase listUsuariosUseCase;
    private final UsuarioApiMapper mapper;

    public UsuarioController(
            CreateUsuarioUseCase createUsuarioUseCase,
            ListUsuariosUseCase listUsuariosUseCase,
            UsuarioApiMapper mapper
    ) {
        this.createUsuarioUseCase = createUsuarioUseCase;
        this.listUsuariosUseCase = listUsuariosUseCase;
        this.mapper = mapper;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<UsuarioResponse> create(@Valid @RequestBody CreateUsuarioRequest request) {
        return createUsuarioUseCase.handle(mapper.toCommand(request)).map(mapper::toResponse);
    }

    @GetMapping
    public Flux<UsuarioResponse> list(
            @RequestParam(required = false) UsuarioRol rol,
            @RequestParam(required = false) String area
    ) {
        return listUsuariosUseCase.handle(new ListUsuariosQuery(rol, area))
                .map(mapper::toResponse);
    }
}
