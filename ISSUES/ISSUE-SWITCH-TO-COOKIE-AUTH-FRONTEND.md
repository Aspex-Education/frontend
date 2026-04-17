Título: Migrar frontend para usar HttpOnly cookie refresh flow (frontend)

Resumen
-------
Cuando el backend implemente refresh tokens en cookies HttpOnly, el frontend debe migrar para no almacenar refresh tokens en storage y para usar el flujo más seguro. Este issue describe las tareas necesarias en el frontend para integrarse con ese backend.

Tareas
------
1. Comunicación y configuración
   - Asegurar que todas las llamadas que necesiten enviar/recibir cookies usan `withCredentials: true` (Angular: `HttpClient` opciones o configurar interceptor para `withCredentials`).
   - Añadir documentación en README sobre la necesidad de `withCredentials` y configuración CORS.

2. Cambios en `AuthService` y `TokenStorageService`
   - Dejar de persistir refresh tokens en `localStorage`/`sessionStorage`.
   - Mantener (o crear) un almacenamiento en memoria opcional para access token (expira al cerrar pestaña). Alternativa: backend devuelve access token en respuesta y frontend lo mantiene en memoria.
   - `TokenStorageService` debe ser refactorizado: si el proyecto decide NO usar storage para access token, documentar y preparar para eliminar persistance.

3. Implementar flujo de refresh
   - Crear/ajustar interceptor que, al recibir 401 por expiración del access token, llame a `/api/auth/refresh` con `withCredentials:true` para obtener un nuevo access token.
   - El endpoint `/api/auth/refresh` usará la cookie HttpOnly para autenticar y devolverá el nuevo access token en el cuerpo.
   - Reintentar la petición original tras obtener nuevo access token.

4. Login/Register
   - `login()` debe llamar `/api/auth/login` con `withCredentials:true`. Backend establecerá cookie HttpOnly (refresh token) y deberá devolver access token (o permitir obtenerlo con `/auth/refresh`).
   - `register()` seguirá su flujo; tras registro automático, llamar a `login()` o a `/auth/refresh` según contrato.

5. Logout
   - `AuthService.logout()` debe llamar `/api/auth/logout` con `withCredentials:true` para que backend invalide el refresh token y borre la cookie.
   - Limpiar cualquier access token en memoria y redirigir a `/auth/login`.

6. Pruebas
   - E2E: login, refresh automático al expirar access token, logout y acceso protegido a `/home`.
   - Unit tests para interceptor y `AuthService`.

7. Documentación y despliegue
   - Añadir notas en README sobre cambios necesarios en el servidor (Set-Cookie, CORS) y en el cliente (`withCredentials`).
   - Coordinar despliegue: desplegar backend primero en modo compatible, luego cambiar frontend.

Checklist
---------
- [ ] Configurar HttpClient con `withCredentials` en todas llamadas auth
- [ ] Implementar interceptor de refresh y reintento
- [ ] Eliminar persistencia insegura de refresh tokens en storage
- [ ] Actualizar `AuthService` para manejar access token en memoria
- [ ] Tests E2E y unitarios actualizados
- [ ] Documentación y guía de migración

Responsable: [equipo/frontend]
Prioridad: Alta
