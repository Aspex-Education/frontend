# Plan Angular: Auth y Templates

Este documento resume el flujo que debe implementar el frontend Angular contra el backend actual de ASPEX.

## Objetivo

- Centralizar la autenticación en `AuthService`
- Inyectar el access token automáticamente con un `HttpInterceptor`
- Renovar el token con refresh cookie HttpOnly
- Crear templates sin enviar `userId` desde el frontend
- Listar templates del usuario usando `userId` en query param por ahora

## Contrato actual del backend

### auth-service

- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/refresh`
- `POST /api/auth/validate`
- `POST /api/auth/logout`

El login y el registro devuelven el access token en el body y setean `refreshToken` como cookie HttpOnly.

### template-service

- `POST /api/templates`
- `GET /api/templates`
- `GET /api/templates/{id}`
- `PUT /api/templates/{id}`
- `DELETE /api/templates/{id}`

`POST /api/templates` extrae el `userId` desde el JWT.
`GET /api/templates` todavía acepta `userId` como query param opcional.

## Flujo recomendado en Angular

### 1. Login

- Llamar a `POST /api/auth/login`
- Usar `withCredentials: true`
- Guardar el access token en el frontend
- Confirmar en DevTools que existe la cookie `refreshToken`

### 2. Interceptor

- Leer el access token desde una única fuente central
- Agregar `Authorization: Bearer <token>` a las requests protegidas
- Mantener `withCredentials: true` para que el navegador envíe la cookie refresh

### 3. Refresh automático

- Capturar `401`
- Llamar a `POST /api/auth/refresh` con `withCredentials: true`
- Guardar el nuevo access token
- Reintentar la request original una sola vez
- Si refresh falla, limpiar sesión y mandar al login

### 4. Logout

- Llamar a `POST /api/auth/logout` con `withCredentials: true`
- Limpiar access token local
- Limpiar estado de usuario
- Redirigir al login

### 5. Crear templates

- No enviar `userId` desde Angular.
- **Limpieza de DTOs:** La propiedad `userId` fue eliminada por completo de la interfaz `CreateTemplateRequest` en `template.model.ts` para forzar que el payload vaya limpio en tiempo de compilación.
- **Componentes:** El ensamblaje manual del request en componentes (como `template-create-listado.component.ts`) ya no envía placeholders ni ids mockeados.
- El backend procesa todo esto de forma segura porque ya lo obtiene desde el claim `userId` del JWT de autenticación.

### 6. Listar templates

- Por ahora, usar `GET /api/templates?userId=<uuid>` para el usuario actual
- Mantener esta integración hasta revisar el contrato futuro

## Validación manual

- Login debe guardar access token y cookie `refreshToken`
- Requests a templates deben incluir `Authorization`
- Un `401` debe disparar refresh y reintento
- Crear template no debe mandar `userId`
- Listar templates puede seguir usando `userId` en query param por ahora
- Logout debe eliminar sesión local y dejar la cookie borrada por backend

## Pendiente futuro

Issue sugerido:

- Migrar el listado de templates para que el backend derive el usuario desde el JWT y el frontend ya no tenga que enviar `userId` en query param

Este cambio se puede revisar más adelante cuando se actualice el contrato frontend-backend.