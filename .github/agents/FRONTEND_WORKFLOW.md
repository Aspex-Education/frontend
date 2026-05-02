# Frontend AI Workflow

## 1. Principios generales
- Mantener simplicidad: máximo 4–6 archivos por feature (Componente TS, HTML, CSS, `.spec.ts`, Service/Signals, Model).
- Priorizar claridad sobre complejidad.
- **Framework:** Angular 19. Usar nueva sintaxis de Control Flow (`@if`, `@for`, `@defer`) en lugar de directivas clásicas (`*ngIf`, `*ngFor`).
- **UI:** PrimeNG acoplado a la versión con `@primeuix/themes`.
- **Estructura Estricta:** Mantener el estándar `core/`, `shared/`, `features/`. (El frontend respeta esta forma por defecto, los puertos y casos de uso quedan delegados al backend).

---

## 2. Flujo de desarrollo (por fases)

### Fase 1: Entendimiento
- Identificar:
  - Eventos de Usuario (Inputs de PrimeNG)
  - Salidas (Llamadas HTTP o Mutaciones de Signals)
  - Casos de borde / validaciones de formularios antes de enviar datos.

### Fase 2: Diseño mínimo
- Clasificar componentes: Componentes inteligentes (manejan servicios/estado) y componentes de presentación (Bindings puros).
- **Manejo de Estado:** Usar **Signals** para manejar el estado global o de feature. Limitar el uso de librerías complejas como NgRx. Un servicio basado en Signals inyectado suele ser suficiente.

### Fase 3: Testing primero (obligatorio)
Crear pruebas en `.spec.ts` junto o antes de la implementación:
- Probar flujos locales del componente (emisión de eventos).
- Mockear llamados HTTP rigurosamente usando las herramientas modernas de Angular.
- No hacer comentarios en los test (se explican solos mediante el `it('should...')`).

### Fase 4: Implementación
- Implementar lo mínimo en el controlador (`.ts`) para lograr el requerimiento.
- Apoyarse en PrimeNG y `@primeuix/themes` para agilizar maquetación. Reducir el CSS personalizado al mínimo indispensable.

### Fase 5: Refactor
- Revisar correcta inyección usando `inject()` en lugar de constructores (práctica recomendada en Angular 19).
- Verificar que no haya variables "mágicas" ni flujos RxJS sin gestionar adecuadamente (si hubiese código heredado o peticiones HTTP puras, combinarlas con signals mediante `toSignal`).

---

## 3. Reglas de Componentes (Frontend Patterns)
- **SOLID en el front:** Dividir bien los servicios. Si un endpoint pertenece a User, al servicio `UserService`. Validaciones complejas van en CustomValidators independientes.
- **Dependency Inversion:** Configurar inyecciones flexibles que favorezcan los tests.

---

## 4. Uso con IA (Copilot / Chat)
Siempre indicar:
> "Genera esta feature siguiendo FRONTEND_WORKFLOW.md, usando Angular 19, UI con PrimeNG, estado con Signals y tests incluidos sin comentarios."
