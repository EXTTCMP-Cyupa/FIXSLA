DELETE FROM ticket_audit;
DELETE FROM tickets;
DELETE FROM usuarios;
DELETE FROM catalogos_incidente;

INSERT INTO usuarios (id, username, nombre, rol, area, activo, creado_en, actualizado_en)
VALUES
('292f2321-577a-a735-8389-4a0e4a801fc3', 'admin', 'Administrador Plataforma', 'ADMIN', 'Gobierno TI', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('960ee512-baed-be35-b1a6-60197298174e', 'tecnico.hw', 'Soporte Hardware', 'TECNICO', 'Hardware', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('e744b704-6258-d333-9c51-998c61d6396d', 'tecnico.sw', 'Soporte Software', 'TECNICO', 'Software', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('74d4bb58-a5a8-8739-9cf8-4d17e84ee689', 'colaborador.rrhh', 'Analista RRHH', 'COLABORADOR', 'Administrativa', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO catalogos_incidente (id, nombre, descripcion, prioridad_por_defecto, activo, creado_en, actualizado_en)
VALUES
('11111111-1111-1111-1111-111111111111', 'Hardware', 'Fallas de portátiles, impresoras y periféricos', 'ALTA', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('22222222-2222-2222-2222-222222222222', 'Accesos', 'Incidentes de usuarios, contraseñas y permisos', 'MEDIA', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('33333333-3333-3333-3333-333333333333', 'Software', 'Errores de aplicaciones corporativas', 'BAJA', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
