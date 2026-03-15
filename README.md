# FIXSLA

Sistema de Gestión de Incidentes con backend reactivo en Spring Boot WebFlux y frontend en React + TypeScript.

## Estructura
- `backend/`: API hexagonal con WebFlux, R2DBC, MapStruct y JWT base.
- `frontend/`: portal React para autenticación, dashboard y creación de tickets.

## Base de datos en Docker
1. Desde la raíz del proyecto, ejecutar `docker compose up -d postgres`
2. La base PostgreSQL quedará disponible en `localhost:5432`
3. Credenciales por defecto:
	- Base: `incidentesdb`
	- Usuario: `incidentes`
	- Clave: `incidentes123`

## Ejecutar backend
1. Levantar PostgreSQL: `docker compose up -d postgres`
2. Ir a `backend/`
3. Ejecutar `mvn spring-boot:run`
4. API disponible en `http://localhost:8080`

### Perfil local sin Docker (opcional)
- Ejecutar backend con `APP_PROFILE=local` para usar H2 en memoria.

## Ejecutar frontend
1. Ir a `frontend/`
2. Ejecutar `npm install`
3. Ejecutar `npm run dev`
4. Portal disponible en `http://localhost:5173`

## Login demo
- Usuario: `tecnico@empresa.com`
- Clave: `123456`
- Rol: `TECH`
