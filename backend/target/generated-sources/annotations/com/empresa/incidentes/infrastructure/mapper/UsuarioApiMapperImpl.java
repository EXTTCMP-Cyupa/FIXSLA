package com.empresa.incidentes.infrastructure.mapper;

import com.empresa.incidentes.domain.model.Usuario;
import com.empresa.incidentes.domain.model.UsuarioRol;
import com.empresa.incidentes.domain.port.in.CreateUsuarioCommand;
import com.empresa.incidentes.infrastructure.adapter.in.dto.CreateUsuarioRequest;
import com.empresa.incidentes.infrastructure.adapter.in.dto.UsuarioResponse;
import java.time.Instant;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-03-15T11:14:09-0500",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.16 (Oracle Corporation)"
)
@Component
public class UsuarioApiMapperImpl implements UsuarioApiMapper {

    @Override
    public CreateUsuarioCommand toCommand(CreateUsuarioRequest request) {
        if ( request == null ) {
            return null;
        }

        String username = null;
        String nombre = null;
        UsuarioRol rol = null;
        String area = null;

        username = request.username();
        nombre = request.nombre();
        rol = request.rol();
        area = request.area();

        CreateUsuarioCommand createUsuarioCommand = new CreateUsuarioCommand( username, nombre, rol, area );

        return createUsuarioCommand;
    }

    @Override
    public UsuarioResponse toResponse(Usuario usuario) {
        if ( usuario == null ) {
            return null;
        }

        UUID id = null;
        String username = null;
        String nombre = null;
        UsuarioRol rol = null;
        String area = null;
        boolean activo = false;
        Instant creadoEn = null;
        Instant actualizadoEn = null;

        id = usuario.id();
        username = usuario.username();
        nombre = usuario.nombre();
        rol = usuario.rol();
        area = usuario.area();
        activo = usuario.activo();
        creadoEn = usuario.creadoEn();
        actualizadoEn = usuario.actualizadoEn();

        UsuarioResponse usuarioResponse = new UsuarioResponse( id, username, nombre, rol, area, activo, creadoEn, actualizadoEn );

        return usuarioResponse;
    }
}
