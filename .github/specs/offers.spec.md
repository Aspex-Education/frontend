# SPEC — Página de Oferta Laboral Confex

## Objetivo
Construir un módulo independiente dentro de la app Angular de Confex para mostrar ofertas laborales públicas y administrar ofertas desde un panel privado.

> El módulo no comparte header, sidebar ni autenticación con el resto de la plataforma. Debe ser standalone, lazy-loaded y diseñado para escalar hacia otros backends y servicios sin quedar atado únicamente a Firebase.

## Arquitectura y patrones

- Usar módulo de feature independiente `offers` con componentes standalone y rutas lazy.
- Aplicar separación de responsabilidades (SOLID): componentes presentan UI, servicios manejan lógica de negocio, repositorios abstraen acceso a datos y trackers abstraen analytics.
- Diseñar una capa de infraestructura agnóstica:
  - `OffersRepository` / `OffersDataService` como interfaz de dominio.
  - Implementaciones concretas pueden ser Firebase, HTTP API o cualquier otro origen de datos.
  - Los componentes y la UI no deben depender directamente de Firebase.
- Mantener el módulo preparado para integración futura con backend propio, microservicios o APIs externas.

## Modelo de dominio

Colección esperada: `ofertas_laborales`

Entidad `OfertaLaboral`
- id: string
- titulo: string
- descripcion: string
- ciudad: string
- telefono: string
- whatsapp: string    // sin prefijo +, ej. 573001234567
- activa: boolean
- destacada: boolean
- fechaCreacion: timestamp

> En el futuro puede añadirse metadata de autor, categoría, tags o backend-specific fields sin romper el contrato básico.

## Contratos y servicios

Interfaces clave:
- `OffersRepository`
  - `getOfferById(id: string): Promise<OfertaLaboral | null>`
  - `listActiveOffersByCity(city: string, excludeId: string, limit: number): Promise<OfertaLaboral[]>`
  - `listOffers(): Promise<OfertaLaboral[]>`
  - `createOffer(offer: OfertaLaboralInput): Promise<string>`
  - `updateOffer(id: string, offer: OfertaLaboralInput): Promise<void>`
  - `deleteOffer(id: string): Promise<void>`
  - `setOfferActive(id: string, active: boolean): Promise<void>`
- `AnalyticsTracker`
  - `trackEvent(name: string, params: Record<string, any>): void`

Servicios de infraestructura:
- `FirebaseOffersRepository` (implementación Firebase opcional)
- `HttpOffersRepository` (implementación future-ready para backend REST)
- `FirebaseAnalyticsTracker` o adaptador similar

## Módulo 1 — Vista pública `/oferta/:id`

### Comportamiento
- Cargar oferta por `id`.
- Si la oferta no existe o `activa === false`, mostrar pantalla de "Oferta no disponible".
- No mostrar navegación principal ni sidebar.
- Mantener un header mínimo con logo Confex.

### Secciones
1. Header mínimo
   - logo Confex (imagen)
   - sin menú ni navegación adicional
2. Card principal de la oferta
   - título
   - ciudad con ícono
   - descripción
   - botones:
     - `Contactar por WhatsApp` → abre `https://wa.me/{whatsapp}` en pestaña nueva
     - `Llamar` → abre `tel:{telefono}`
3. Sección `Más ofertas en tu ciudad`
   - consulta ofertas donde:
     - `ciudad == oferta.ciudad`
     - `activa == true`
     - `id != oferta.id`
   - tomar hasta 5 resultados aleatorios del listado disponible
   - cada card muestra:
     - título
     - botón `Ver oferta` que navega a `/oferta/{id}`
   - insertar un slot publicitario con clase `ad-slot` en la posición 3 de hasta 5 ofertas
     - placeholder visual con texto: `Próximamente anuncios`
     - cuando se integre AdSense, reemplazar con script de Google
4. Footer mínimo
   - `© 2025 Confex`
   - enlace a `Política de privacidad`
   - la página estática de privacidad debe existir y ser accesible para AdSense

### Tracking y eventos
- Registrar eventos de analytics mediante `AnalyticsTracker`, no vía dependencia directa de Firebase en el componente.
- Eventos públicos:
  - `oferta_vista` → al cargar la página
  - `clic_whatsapp` → al hacer clic en WhatsApp
  - `clic_llamar` → al hacer clic en Llamar
  - `clic_oferta_relacionada` → al hacer clic en "Ver oferta" de la lista relacionada
- Parámetros comunes:
  - `oferta_id`
  - `ciudad`
  - `titulo`

> La implementación actual puede usar Firebase Analytics, pero la interfaz debe ser reemplazable por otro tracker en el futuro.

## Módulo 2 — Panel admin `/admin/ofertas`

### Seguridad y acceso
- Autenticación ligera en frontend con contraseña simple.
- Mostrar formulario de acceso si no hay flag válido en `sessionStorage`.
- Comparar contra constante del environment: `CONFEX_ADMIN_PASS = 'Confex2026'`.
- Si la contraseña es correcta, guardar un flag en `sessionStorage` y permitir entrada.
- No usar JWT ni Firebase Auth. Es un control de acceso mínimo para uso personal.

### Funcionalidades del panel
- Listado de todas las ofertas con columnas:
  - título
  - ciudad
  - estado (`activa` / `inactiva`)
  - fecha de creación
  - acciones: editar, eliminar, toggle activa/inactiva
- Formulario crear/editar:
  - campos:
    - título
    - descripción
    - ciudad
    - teléfono
    - whatsapp
    - activa
    - destacada
  - si la ruta es `/admin/ofertas/nueva`, crear nueva oferta
  - si la ruta es `/admin/ofertas/:id`, cargar oferta existente y editar
- Toggle directo de `activa/inactiva` desde el listado
- Eliminar con confirmación explícita
- No registrar eventos de analytics desde el panel admin

### Vistas y rutas
- `/admin/ofertas` → `AdminOfertasComponent` (listado)
- `/admin/ofertas/nueva` → `OfertaFormComponent` (nuevo)
- `/admin/ofertas/:id` → `OfertaFormComponent` (edición)

## Estilos y UX
- Usar el CSS existente de Confex: variables, componentes y sistema visual.
- No usar Tailwind.
- La página pública debe sentirse integrada con Confex, pero libre de la chrome de la app principal.
- El admin puede tener layout propio sencillo, con navegación mínima de administración.

## Rutas Angular a declarar
- `/oferta/:id` → `OfertaPublicaComponent` (standalone, lazy-loaded)
- `/admin/ofertas` → `AdminOfertasComponent` (standalone, lazy-loaded)
- `/admin/ofertas/nueva` → `OfertaFormComponent`
- `/admin/ofertas/:id` → `OfertaFormComponent` (modo edición)

## Recomendaciones de implementación futura
- Mantener la lógica de datos en un `OffersModule` o `offers` feature folder.
- Evitar llamadas directas a Firebase en componentes y guards.
- Usar adaptadores para que un backend REST, GraphQL o serverless pueda reemplazar Firebase sin cambiar la UI.
- Exponer una configuración de `environment` para cambiar el proveedor de datos si se agrega otra fuente.
- Diseñar los servicios con inyección de dependencias para facilitar pruebas unitarias.
- Preparar la página de `privacy-policy` como recurso estático independiente.

## Notas adicionales
- La colección `ofertas_laborales` puede ser el origen de datos actual, pero el módulo debe funcionar con cualquier repositorio compatible.
- El panel admin es un MVP de gestión interna, no un sistema de autenticación de producción.
- El placeholder de anuncios debe ser visible siempre en la sección de ofertas relacionadas para no romper el layout.

---

### Resumen de componentes clave
- `OfertaPublicaComponent`
- `OfertaNoDisponibleComponent`
- `OfertaRelacionadaCardComponent`
- `AdminOfertasComponent`
- `OfertaFormComponent`
- `OffersRepository` / `OffersDataService`
- `AnalyticsTracker`
- `AuthAdminGuard` / `AdminAuthService`
- `PrivacyPolicyComponent`
