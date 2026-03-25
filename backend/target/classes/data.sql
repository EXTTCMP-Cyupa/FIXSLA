DELETE FROM usuario_catalogo;
DELETE FROM ticket_audit;
DELETE FROM tickets;
DELETE FROM usuarios;
DELETE FROM catalogos_incidente;
DELETE FROM ubicaciones;

INSERT INTO ubicaciones (id, nombre, descripcion, activo, creado_en, actualizado_en)
VALUES
('aaaa0001-0000-0000-0000-000000000001', 'Sede Central', 'Edificio principal de la empresa', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('aaaa0001-0000-0000-0000-000000000002', 'Sede Norte', 'Oficinas zona norte', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('aaaa0001-0000-0000-0000-000000000003', 'Sede Sur', 'Oficinas zona sur', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('aaaa0001-0000-0000-0000-000000000004', 'Teletrabajo', 'Modalidad remota / trabajo desde casa', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO usuarios (id, username, nombre, rol, area, numero_contacto, activo, creado_en, actualizado_en)
VALUES
('292f2321-577a-a735-8389-4a0e4a801fc3', 'admin', 'Administrador Plataforma', 'ADMIN', 'Gobierno TI', NULL, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('960ee512-baed-be35-b1a6-60197298174e', 'tecnico.hw', 'Soporte Hardware', 'TECNICO', 'Hardware', NULL, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('e744b704-6258-d333-9c51-998c61d6396d', 'tecnico.sw', 'Soporte Software', 'TECNICO', 'Software', NULL, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('74d4bb58-a5a8-8739-9cf8-4d17e84ee689', 'colaborador.rrhh', 'Analista RRHH', 'COLABORADOR', 'Administrativa', NULL, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO catalogos_incidente (id, nombre, descripcion, prioridad_por_defecto, activo, creado_en, actualizado_en)
VALUES
('11111111-1111-1111-1111-111111111111', 'Hardware', 'Fallas de portátiles, impresoras y periféricos', 'ALTA', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('22222222-2222-2222-2222-222222222222', 'Accesos', 'Incidentes de usuarios, contraseñas y permisos', 'MEDIA', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('33333333-3333-3333-3333-333333333333', 'Software', 'Errores de aplicaciones corporativas', 'BAJA', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Asignación de catálogos a técnicos
INSERT INTO usuario_catalogo (usuario_id, catalogo_id) VALUES
('960ee512-baed-be35-b1a6-60197298174e', '11111111-1111-1111-1111-111111111111'),
('e744b704-6258-d333-9c51-998c61d6396d', '33333333-3333-3333-3333-333333333333');
