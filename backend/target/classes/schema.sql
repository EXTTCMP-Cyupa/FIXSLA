CREATE TABLE IF NOT EXISTS catalogos_incidente (
    id UUID PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    descripcion VARCHAR(500),
    prioridad_por_defecto VARCHAR(20) NOT NULL,
    activo BOOLEAN NOT NULL,
    creado_en TIMESTAMP NOT NULL,
    actualizado_en TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS ubicaciones (
    id UUID PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion VARCHAR(500),
    activo BOOLEAN NOT NULL,
    creado_en TIMESTAMP NOT NULL,
    actualizado_en TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY,
    username VARCHAR(80) NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    rol VARCHAR(20) NOT NULL,
    area VARCHAR(120) NOT NULL,
    numero_contacto VARCHAR(50),
    activo BOOLEAN NOT NULL,
    creado_en TIMESTAMP NOT NULL,
    actualizado_en TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL,
    titulo VARCHAR(180) NOT NULL,
    descripcion VARCHAR(1000) NOT NULL,
    solicitante_id UUID NOT NULL,
    tecnico_asignado_id UUID,
    catalogo_incidente_id UUID NOT NULL,
    ubicacion_id UUID,
    numero_contacto VARCHAR(50),
    estado VARCHAR(20) NOT NULL,
    prioridad VARCHAR(20) NOT NULL,
    creado_en TIMESTAMP NOT NULL,
    actualizado_en TIMESTAMP NOT NULL,
    primera_respuesta_limite TIMESTAMP NOT NULL,
    resolucion_limite TIMESTAMP NOT NULL,
    pendiente_desde TIMESTAMP,
    sla_pausado_segundos BIGINT NOT NULL,
    CONSTRAINT fk_ticket_catalogo FOREIGN KEY (catalogo_incidente_id) REFERENCES catalogos_incidente(id),
    CONSTRAINT fk_ticket_tecnico FOREIGN KEY (tecnico_asignado_id) REFERENCES usuarios(id),
    CONSTRAINT fk_ticket_ubicacion FOREIGN KEY (ubicacion_id) REFERENCES ubicaciones(id)
);

CREATE TABLE IF NOT EXISTS ticket_audit (
    id UUID PRIMARY KEY,
    ticket_id UUID NOT NULL,
    accion VARCHAR(50) NOT NULL,
    detalle VARCHAR(500) NOT NULL,
    actor_username VARCHAR(80) NOT NULL,
    actor_rol VARCHAR(20) NOT NULL,
    fecha TIMESTAMP NOT NULL,
    CONSTRAINT fk_ticket_audit_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id)
);

    CREATE TABLE IF NOT EXISTS usuario_catalogo (
        usuario_id UUID NOT NULL,
        catalogo_id UUID NOT NULL,
        PRIMARY KEY (usuario_id, catalogo_id),
        CONSTRAINT fk_uc_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
        CONSTRAINT fk_uc_catalogo FOREIGN KEY (catalogo_id) REFERENCES catalogos_incidente(id)
    );

ALTER TABLE usuarios
    ADD COLUMN IF NOT EXISTS numero_contacto VARCHAR(50);

ALTER TABLE tickets
    ADD COLUMN IF NOT EXISTS ubicacion_id UUID,
    ADD COLUMN IF NOT EXISTS numero_contacto VARCHAR(50);
