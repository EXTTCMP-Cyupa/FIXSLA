package com.empresa.incidentes.infrastructure.adapter.in;

import com.empresa.incidentes.domain.model.UsuarioRol;
import com.empresa.incidentes.domain.port.in.CreateUsuarioUseCase;
import com.empresa.incidentes.domain.port.in.ListUsuariosQuery;
import com.empresa.incidentes.domain.port.in.ListUsuariosUseCase;
import com.empresa.incidentes.domain.port.in.UpdateMyContactCommand;
import com.empresa.incidentes.domain.port.in.UpdateMyContactUseCase;
import com.empresa.incidentes.domain.port.in.UpdateUsuarioUseCase;
import com.empresa.incidentes.domain.port.out.UsuarioRepositoryPort;
import com.empresa.incidentes.infrastructure.adapter.in.dto.CreateUsuarioRequest;
import com.empresa.incidentes.infrastructure.adapter.in.dto.UpdateMyContactRequest;
import com.empresa.incidentes.infrastructure.adapter.in.dto.UpdateUsuarioRequest;
import com.empresa.incidentes.infrastructure.adapter.in.dto.UsuarioResponse;
import com.empresa.incidentes.infrastructure.mapper.UsuarioApiMapper;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/usuarios")
public class UsuarioController {

    private final CreateUsuarioUseCase createUsuarioUseCase;
    private final UpdateUsuarioUseCase updateUsuarioUseCase;
    private final UpdateMyContactUseCase updateMyContactUseCase;
    private final ListUsuariosUseCase listUsuariosUseCase;
    private final UsuarioRepositoryPort usuarioRepository;
    private final UsuarioApiMapper mapper;

    public UsuarioController(
            CreateUsuarioUseCase createUsuarioUseCase,
            UpdateUsuarioUseCase updateUsuarioUseCase,
            UpdateMyContactUseCase updateMyContactUseCase,
            ListUsuariosUseCase listUsuariosUseCase,
            UsuarioRepositoryPort usuarioRepository,
            UsuarioApiMapper mapper
    ) {
        this.createUsuarioUseCase = createUsuarioUseCase;
        this.updateUsuarioUseCase = updateUsuarioUseCase;
        this.updateMyContactUseCase = updateMyContactUseCase;
        this.listUsuariosUseCase = listUsuariosUseCase;
        this.usuarioRepository = usuarioRepository;
        this.mapper = mapper;
    }

    @GetMapping("/me")
    public Mono<UsuarioResponse> getMe(Authentication authentication) {
        return usuarioRepository.findByUsername(authentication.getName())
                .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado")))
                .map(mapper::toResponse);
    }

    @PatchMapping("/me/contacto")
    public Mono<UsuarioResponse> updateMyContact(
            Authentication authentication,
            @RequestBody UpdateMyContactRequest request
    ) {
        return updateMyContactUseCase.handle(
                new UpdateMyContactCommand(authentication.getName(), request.numeroContacto())
        ).map(mapper::toResponse);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<UsuarioResponse> create(@Valid @RequestBody CreateUsuarioRequest request) {
        return createUsuarioUseCase.handle(mapper.toCommand(request)).map(mapper::toResponse);
    }

    @PatchMapping("/{usuarioId}")
    public Mono<UsuarioResponse> update(
            @PathVariable java.util.UUID usuarioId,
            @Valid @RequestBody UpdateUsuarioRequest request
    ) {
        return updateUsuarioUseCase.handle(mapper.toUpdateCommand(request, usuarioId)).map(mapper::toResponse);
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
