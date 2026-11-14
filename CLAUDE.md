# CLAUDE.md: ZeroG Vitals

> Stack confirmado en la hora 0 (14 de noviembre de 2026): Java 21 + Spring Boot 3 y React + TypeScript. Equipo de 3 y **MVP recortado** (SPEC 14.1).

## Proyecto

ZeroG Vitals es una **herramienta visual** para que los astronautas evalúen su propia salud durante misiones espaciales y reciban orientación sobre tratamientos, mejoras y emergencias. Es para el NASA Space Apps Challenge 2026, reto *"Create Health Monitoring Software for Astronauts on Space Missions"*, propuesto por la Agencia Espacial Brasileña.

- **Usuarios:** astronautas que **no son médicos**. Todo debe ser simple, claro y con un paso a la vez.
- **Offline-first:** el servidor representa el computador del hábitat, no un servidor en la Tierra. El frontend debe seguir funcionando aunque la API no responda. En el MVP recortado (SPEC 14.1) **solo la emergencia** funciona offline; el triaje básico offline en el front queda pospuesto.
- **Fuente de verdad:** `docs/ZeroG_Vitals_SPEC.md` (decisiones finales), `docs/ZeroG_Vitals_Modelo_Datos.md` (base de datos y reglas de negocio), `docs/ZeroG_Vitals_API_REST.md` (contrato de la API) y `docs/ZeroG_Vitals_Paquete_Contenido.md` (contenido y datos para los JSON).
- **Precedencia si algo se contradice:** este `CLAUDE.md` > SPEC > paquete de contenido > `docs/ZeroG_Vitals_Plan_Equipo.md`. El plan es **histórico**: no lo uses para decidir, solo como contexto si el SPEC te remite a él.

## Stack

- **Backend:** Java 21, Spring Boot 3, Maven (`mvnw`), Spring Web, Validation, Data JPA, Flyway, springdoc-openapi, Lombok (mínimo).
  - **NO agregar Spring Security** en el MVP: agregada sin configurar, bloquea todos los endpoints. El CORS va en `config/CorsConfig.java`. Security solo entra si se pide el PIN (Should).
  - **NO usar MapStruct:** los mappers son manuales (`XxxMapper` con métodos estáticos).
  - **NO agregar PWA, service worker ni `vite-plugin-pwa`:** el offline es `localStorage` + el intérprete de `src/engine`.
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Recharts, react-i18next, TanStack Query. Caché offline en `localStorage` (IndexedDB solo si se pide).
- **Usuarios:** selector de tripulante sin contraseña, con vista de CMO. **El botón y los endpoints de emergencia nunca requieren identificación.**
- **Base de datos:** PostgreSQL 16 en Docker.
- **Infraestructura:** `docker-compose.yml` con los servicios postgres, backend y frontend.

## Comandos

- Levantar todo: `docker compose up --build`
- Pruebas del backend: `cd backend && ./mvnw test`
- Frontend en desarrollo: `cd frontend && npm run dev`
- Build del frontend: `cd frontend && npm run build`
- Swagger: `http://localhost:8080/swagger-ui.html`

## Arquitectura (sección 4 del plan)

- **Patrón de paquetes (SPEC 4.2):** por capa, y **`domain` por funcionalidad** (`triage`, `emergency`, `eva`, `gamification`, `nutrition`, `report`, `model`). El service convierte entities ↔ `domain.model`; el dominio nunca ve una entity. Sufijos obligatorios y sin clases `Utils` ni `Helper`.
- **Paquetes por capa** en `backend/src/main/java/com/zerogvitals/`: `config`, `controller`, `dto/request`, `dto/response`, `entity`, `entity/enums`, `exception`, `mapper`, `repository`, `security`, `service`, `service/impl`, `domain`, `simulation`.
- **Regla de dependencias:**
  - Controller → Service → (Domain, Repository) → Entity.
  - El Controller **nunca** usa un Repository.
- **Controllers limpios (SPEC 4.4b):**
  - Cada método recibe el DTO validado (`@Valid`), llama a **un solo** método del service y devuelve el DTO de respuesta con el código HTTP correcto.
  - **3 a 6 líneas por método.**
  - Sin `if` de negocio, sin cálculos, sin `try/catch` (lo maneja `GlobalExceptionHandler`), sin mapear (el service devuelve el DTO ya mapeado).
  - Nunca importa `repository`, `entity` ni `domain`.
  - **`domain` es Java puro:** sin anotaciones de Spring, sin JPA y sin HTTP, y no lee la hora del sistema (la recibe como parámetro).
- **Las Entities nunca salen del backend.** La API solo devuelve DTOs (`record` con Bean Validation).
- **Errores:** todos pasan por `GlobalExceptionHandler` y devuelven `ErrorResponse { code, message }`.

## Reglas de salud (las más importantes)

1. **Nunca escribas umbrales, textos médicos ni pasos de protocolo directamente en el código.** Todo sale de `backend/src/main/resources/data/*.json`: `thresholds.json`, `measurement-guides.json`, `emergency-protocols.json`, `body-map.json`, `countermeasures.json`, `eva-criteria.json`, `mission-profiles.json`, `achievements.json`, `projection-rates.json`, `sources.json` y `features.json`.
2. **No inventes contenido médico.** Si falta un umbral, un texto o un paso, no lo completes por tu cuenta: avisa y deja un `TODO` marcado con ⚠️.
3. **Ningún texto puede indicar medicamentos ni dosis.** Solo remite al "protocolo de la misión o la indicación del CMO".
4. **Niveles:** `NORMAL`, `CAUTION`, `ALERT`, `CRITICAL`, `NO_DATA`.
   - Para comparar gravedad, usa el campo `severity` del enum (0–3), **nunca `ordinal()`**. `NO_DATA` tiene `severity = null` y no cuenta para el peor nivel.
   - **Un indicador sin lectura vigente es `NO_DATA`, nunca `NORMAL`.** La vigencia viene del campo `freshness` de `thresholds.json` (SPEC 5.1 punto 6).
   - Estado global = el peor nivel.
   - Persistencia: 2 lecturas para subir de nivel. Histéresis: 3 lecturas para bajar.
   - Ver las secciones 3.5 y 5.1 del plan.
5. **Cada resultado de triaje incluye `RuleTrace`** (D1): el valor, el umbral, la regla y el `sourceId`.
6. **Escalamiento:** `NONE` / `SELF` / `CREW_CMO` / `FLIGHT_SURGEON` (sección 0.9.5).
7. **La gamificación premia conductas, nunca resultados de salud** (sección 0.9.4).
8. Cada pantalla relevante muestra el aviso: *"Prototipo. No es un dispositivo médico."*

## Convenciones

- **Código, clases, variables, endpoints y columnas en inglés.** Comentarios breves en español solo donde aporten.
- **Textos de la interfaz:**
  - Siempre con i18n (`src/locales/es.json` y `en.json`), nunca escritos directamente en los componentes.
  - En los JSON de contenido, cada texto va como `{ "es": "...", "en": "..." }`.
- **Endpoints REST** bajo `/api/...`, sustantivos en plural y en kebab-case.
- **Enums** guardados como texto (`EnumType.STRING`).
- **Accesibilidad:**
  - El color del semáforo siempre va acompañado de un ícono o texto.
  - Botones grandes en las pantallas de emergencia.
  - Respetar `prefers-reduced-motion`.
- **Feature flags:** toda funcionalidad D1–D10 y opcional se puede apagar con `features.json`. Si está apagada, no se ve en la interfaz.

## Política de fuentes (paquete de contenido, secciones 0.1 a 0.5)

- **Todo el contenido está ligado a la NASA:** recursos del reto, NASA-STD-3001, briefs de OCHMO, NTRS y el Medical Checklist. No uses guías clínicas externas.
- Cada umbral lleva un `sourceId`. Si no tiene fuente NASA, lleva `"source": "CMO_CONFIGURABLE"`, y la interfaz lo muestra como *"límite configurado por el oficial médico de la misión"*.
- **Escalas oficiales que debes usar tal cual:**
  - Bedford 1–10 para la carga de trabajo (+ pregunta de aburrimiento);
  - mareo espacial 0–3 (Ninguno, Leve, Moderado, Severo);
  - Cuff Class 1–4 para la descompresión;
  - prueba de vigilancia de 3 min (formato del *Reaction Self Test*).
- **Signos vitales:** primero la desviación de la **línea base personal** (🟡 15 %, 🟠 30 %); los límites críticos absolutos son `CMO_CONFIGURABLE`.
- **El ritmo del metrónomo de RCP es configurable.** Nunca lo escribas directamente en el código.

## Código limpio (sección 0.14 del plan)

- **Glosario obligatorio** (0.14.2): `CrewMember`, `VitalReading`, `EnvironmentReading`, `SelfAssessment`, `Symptom`, `HealthLevel`, `TriageOutcome`, `Indicator`, `MissionProfile`, `BodyRegion`, `SpaceHazard`, `Countermeasure`, `ProtocolStep`. No inventes sinónimos.
- **Unidades en los nombres:** `heartRateBpm`, `spo2Percent`, `glucoseMgDl`, `radiationDoseMsv`, `co2PartialPressureMmHg`. Fechas con `Instant` en UTC y nombres que terminen en `At`. **Se guarda en UTC y se muestra en hora de misión** (SPEC 4.3b). Los conteos "por día" usan el día de misión, que empieza al despertar del tripulante. El nadir circadiano se calcula respecto al horario de sueño de cada tripulante. Nunca uses `LocalDateTime` para momentos.
- **Backend:**
  - Inyección por constructor con campos `final`. DTOs como `record`. Nunca `@Data` en entities.
  - Repositories con `Optional` y services con `orElseThrow`. Errores con el enum `ErrorCode`.
  - `@ConfigurationProperties` en lugar de `@Value`. `open-in-view=false` y `ddl-auto=validate`: el esquema lo maneja Flyway.
  - Los JSON de reglas se validan al arrancar (*fail fast*). El tiempo se inyecta con `Clock`.
  - Logs con SLF4J, sin datos de salud en INFO.
- **Dominio:**
  - Reglas con *Strategy* (`IndicatorRule`). Sin `if` ni `switch` gigantes.
  - Agregar un indicador = una entrada en el JSON.
  - Métodos de unas 30 líneas como máximo.
- **Frontend:**
  - TS `strict` y sin `any`.
  - TanStack Query para los datos del servidor.
  - Tipos generados desde OpenAPI, nunca escritos a mano.
  - Colores del semáforo como *design tokens* y un solo `LevelBadge`.
  - Componentes de presentación sin llamadas a la API. Alias `@/` en los imports.
- **Antes de crear una clase, componente o utilidad nuevos, busca si ya existe uno y reutilízalo.**
- **Antes de cada commit:** `./mvnw spotless:apply` y `npm run lint -- --fix`. Sin código comentado ni imports sin usar.
- **Definición de "terminado":** checklist de la sección 0.14.8 del plan.

## Pruebas

- **Los motores de `domain`** (triaje, emergencia, EVA, tendencias) se escriben **con las pruebas primero**, a partir de la tabla de casos de la sección 5.2 del plan (JUnit 5, pruebas parametrizadas).
- **Ningún cambio en `domain`** se da por terminado si `./mvnw test` falla.
- **Nombres de prueba** que describen el comportamiento (`shouldReturnCautionWhenSpo2Is93ForTwoReadings`). Usa *fixtures* en lugar de objetos repetidos.

## Forma de trabajo

- **Tareas pequeñas.** Antes de un cambio grande, propón un plan corto y espera la confirmación.
- **No modifiques archivos fuera del alcance del pedido.**
- **Nunca leas, muestres ni subas `.env`**, contraseñas o tokens. Usa `.env.example` como referencia.
- **Commits:**
  - Pequeños, en formato `feat: ...`, `fix: ...`, `docs: ...` o `test: ...`.
  - Con la línea `Co-Authored-By: Claude` en el mensaje.
- **Si algo falla después de dos intentos,** explica el problema y propón simplificarlo o apagarlo con su flag.
