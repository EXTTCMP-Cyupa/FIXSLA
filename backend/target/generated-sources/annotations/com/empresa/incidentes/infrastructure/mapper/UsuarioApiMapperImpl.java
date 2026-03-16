package com.empresa.incidentes.infrastructure.mapper;

import com.empresa.incidentes.domain.model.Usuario;
import com.empresa.incidentes.domain.model.UsuarioRol;
import com.empresa.incidentes.domain.port.in.CreateUsuarioCommand;
import com.empresa.incidentes.domain.port.in.UpdateUsuarioCommand;
import com.empresa.incidentes.infrastructure.adapter.in.dto.CreateUsuarioRequest;
import com.empresa.incidentes.infrastructure.adapter.in.dto.UpdateUsuarioRequest;
import com.empresa.incidentes.infrastructure.adapter.in.dto.UsuarioResponse;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-03-15T19:02:51-0500",
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
        List<UUID> catalogoIds = null;

        username = request.username();
        nombre = request.nombre();
        rol = request.rol();
        area = request.area();
        List<UUID> list = request.catalogoIds();
        if ( list != null ) {
            catalogoIds = new ArrayList<UUID>( list );
        }

        CreateUsuarioCommand createUsuarioCommand = new CreateUsuarioCommand( username, nombre, rol, area, catalogoIds );

        return createUsuarioCommand;
    }

    @Override
    public UpdateUsuarioCommand toUpdateCommand(UpdateUsuarioRequest request, UUID id) {
        if ( request == null && id == null ) {
            return null;
        }

        String nombre = null;
        UsuarioRol rol = null;
        String area = null;
        Boolean activo = null;
        List<UUID> catalogoIds = null;
        if ( request != null ) {
            nombre = request.nombre();
            rol = request.rol();
            area = request.area();
            activo = request.activo();
            List<UUID> list = request.catalogoIds();
            if ( list != null ) {
                catalogoIds = new ArrayList<UUID>( list );
            }
        }
        UUID id1 = null;
        id1 = id;

        UpdateUsuarioCommand updateUsuarioCommand = new UpdateUsuarioCommand( id1, nombre, rol, area, activo, catalogoIds );

        return updateUsuarioCommand;
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
        List<UUID> catalogoIds = null;
        boolean activo = false;
        Instant creadoEn = null;
        Instant actualizadoEn = null;

        id = usuario.id();
        username = usuario.username();
        nombre = usuario.nombre();
        rol = usuario.rol();
        area = usuario.area();
        List<UUID> list = usuario.catalogoIds();
        if ( list != null ) {
            catalogoIds = new ArrayList<UUID>( list );
        }
        activo = usuario.activo();
        creadoEn = usuario.creadoEn();
        actualizadoEn = usuario.actualizadoEn();

        UsuarioResponse usuarioResponse = new UsuarioResponse( id, username, nombre, rol, area, catalogoIds, activo, creadoEn, actualizadoEn );

        return usuarioResponse;
    }
}
