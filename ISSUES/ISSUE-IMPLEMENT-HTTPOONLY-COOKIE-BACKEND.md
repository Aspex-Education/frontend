Título: Implementar flujo de autenticación con HttpOnly cookies (backend)

Resumen
-------
Implementar en el backend un flujo de autenticación que utilice cookies HttpOnly para el refresh token y un access token de corta vida para las llamadas API. Esto mitigará el riesgo de robo de tokens por XSS y permitirá una gestión segura de sesiones.

Requisitos funcionales
---------------------
1. Al iniciar sesión (/api/auth/login):
   - Backend devuelve un access token (JWT) en el cuerpo de la respuesta (opcional) y establece un refresh token en una cookie HttpOnly.
   - La cookie debe tener atributos: `HttpOnly; Secure; SameSite=Strict` (o `Lax` según necesidad de cross-site), y un `Path=/` y `Max-Age` adecuado.

2. Endpoint de refresh (/api/auth/refresh):
   - Usa la cookie HttpOnly de refresh token enviada automáticamente por el navegador.
   - Valida y rota el refresh token (issue new refresh token + revoke old one) y devuelve un nuevo access token en el cuerpo.

3. Logout (/api/auth/logout):
   - Revocar el refresh token en servidor.
   - Instruir al cliente para limpiar el access token (el backend puede devolver Set-Cookie con cookie vacía y Max-Age=0 para limpiar la cookie HttpOnly si aplica).

4. Seguridad y gestión de tokens:
   - Rotación de refresh tokens para prevenir replay attacks.
   - Persistencia segura de refresh tokens en DB (hash si es posible).
   - Implementar mecanismo para invalidar/expirar refresh tokens (revocación manual y automática).

5. CORS y cookies:
   - Ajustar `Access-Control-Allow-Credentials: true` y permitir el origen del frontend en CORS.
   - Configurar `Set-Cookie` para que el navegador envíe la cookie en peticiones fetch/xhr (client debe usar fetch with credentials: 'include' o axios with credentials).

6. Opcional (recomendado):
   - Proveer un endpoint que devuelva información del usuario autenticado (`/api/auth/me`) usando el access token.
   - Registrar eventos de login/logout y rotación de refresh tokens para auditoría.

Pruebas
-------
- Test de login: cookie HttpOnly presente con atributos correctos y access token devuelto.
- Test de refresh: al llamar /api/auth/refresh con cookie válida devuelve nuevo access token y cookie de refresh rotada.
- Test de logout: refresh token revocado y cookie eliminada.

Notas técnicas y migración
-------------------------
- Este cambio requiere coordinación con frontend: la app deberá usar `fetch/HttpClient` con `withCredentials:true` y no almacenar el refresh token en storage.
- Durante la migración, puede mantener soporte backward-compatible para clientes que esperan tokens en JSON, pero planear eliminarlo.

Impacto en el sistema
---------------------
- Mejora significativa contra robo de tokens vía XSS (refresh token HttpOnly no accesible desde JS).
- Requiere actualizar la forma en que el frontend refresca access tokens y los almacena.

Responsable: [equipo/backend]
Prioridad: Alta

Checklist de implementación
---------------------------
- [ ] Endpoint /api/auth/login sets HttpOnly refresh cookie
- [ ] Endpoint /api/auth/refresh validates and rotates refresh token
- [ ] Endpoint /api/auth/logout revokes refresh token and clears cookie
- [ ] CORS configured with credentials support for allowed origins
- [ ] Tests unitarios e integración para login/refresh/logout
- [ ] Documentación para frontend (cómo enviar credenciales y endpoints)
