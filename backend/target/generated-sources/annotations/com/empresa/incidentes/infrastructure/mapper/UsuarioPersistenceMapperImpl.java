package com.empresa.incidentes.infrastructure.mapper;

import com.empresa.incidentes.domain.model.Usuario;
import com.empresa.incidentes.infrastructure.adapter.out.entity.UsuarioEntity;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-03-15T17:41:57-0500",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.16 (Oracle Corporation)"
)
@Component
public class UsuarioPersistenceMapperImpl implements UsuarioPersistenceMapper {

    @Override
    public UsuarioEntity toEntity(Usuario usuario) {
        if ( usuario == null ) {
            return null;
        }

        UsuarioEntity usuarioEntity = new UsuarioEntity();

        usuarioEntity.setId( usuario.id() );
        usuarioEntity.setUsername( usuario.username() );
        usuarioEntity.setNombre( usuario.nombre() );
        usuarioEntity.setRol( usuario.rol() );
        usuarioEntity.setArea( usuario.area() );
        usuarioEntity.setActivo( usuario.activo() );
        usuarioEntity.setCreadoEn( usuario.creadoEn() );
        usuarioEntity.setActualizadoEn( usuario.actualizadoEn() );

        usuarioEntity.setNewEntity( true );

        return usuarioEntity;
    }
}
