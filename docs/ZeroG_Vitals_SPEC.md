# ZeroG Vitals: especificación final (SPEC)

> **Fuente de verdad para Claude Code.** Solo contiene decisiones finales.
> **Documentos complementarios (misma prioridad que este SPEC):** `ZeroG_Vitals_Modelo_Datos.md` (tablas, restricciones, reglas BR-01 a BR-21, flujos transaccionales, Flyway) y `ZeroG_Vitals_API_REST.md` (convenciones, códigos HTTP, errores, DTOs y endpoints). Para tablas y endpoints, **mandan esos dos documentos**.
> **Precedencia si algo se contradice:** `CLAUDE.md` > **este SPEC** > `ZeroG_Vitals_Paquete_Contenido.md` (contenido y datos) > `ZeroG_Vitals_Plan_Equipo.md` (histórico, **no usar para decidir**).
> Fecha: 13 de noviembre de 2026. Reto: NASA Space Apps Challenge 2026, *"Create Health Monitoring Software for Astronauts on Space Missions"* (propuesto por la Agencia Espacial Brasileña).

---

## 1. Producto

**Qué es:** una herramienta **visual** con la que los astronautas **evalúan su propia salud**, reciben **orientación sobre tratamientos y mejoras** y son **guiados en emergencias**, sin depender de la Tierra.

**Usuarios:** astronautas que **no son médicos**, más el oficial médico de la tripulación (**CMO**).

**Escenario de la demo:** camino a Marte, un compañero siente dolor en el pecho y se desploma. La comunicación con la Tierra tarda hasta 20 minutos.

**Principios innegociables:**
1. **Offline-first.** El servidor es el computador del hábitat. El frontend sigue funcionando (emergencia y triaje básico) aunque la API caiga.
2. **No diagnostica.** Orienta, registra, explica y escala. Aviso visible: *"Prototipo. No es un dispositivo médico."*
3. **Sin medicamentos ni dosis** en ningún texto. Siempre *"según el protocolo de la misión o la indicación del CMO"*.
4. **Contenido ligado a la NASA.** Todo umbral o texto clínico lleva un `sourceId` de la NASA, o `CMO_CONFIGURABLE`.
5. **El botón EMERGENCIA nunca pide identificación.**
6. **La gamificación premia conductas, nunca resultados de salud.**
7. **Cada estado se explica** ("¿por qué estoy en este color?"), con su regla y su fuente.

---

## 2. Alcance final

| Prioridad | Funcionalidades |
|---|---|
| **Must (MVP)** | Selector de tripulante sin contraseña + vista de CMO · autoevaluación guiada con fichas de medición · motor de triaje (colores, escalamiento, **explicación D1**) · **mapa corporal interactivo** (11 regiones, animado) · **gráficas dinámicas** · **emergencia P1** (dolor en el pecho / colapso) · contramedidas por indicador · offline (caché en `localStorage` + intérprete en el front) · **estructura bilingüe ES/EN (D6)** · *feature flags* |
| **Should-A** | D2 lentes de los 5 peligros · D3 mapa de dolor y síntomas · D4 aptitud (antes de la EVA, después de la EVA, transición de gravedad) · D5 voz manos libres · D11 prueba de vigilancia de 3 min · traducción completa al inglés |
| **Should** | Perfiles de misión · recordatorios · gamificación · dashboard de la tripulación · protocolos P2, P3 y P4 · plan de mejora semanal · reporte de emergencia a la Tierra · PIN de 4 dígitos con roles CREW / CMO |
| **Could-A** | D7 proyección "¿qué pasa si…?" · D8 tendencias personales · D9 modo cansancio · D10 reporte SBAR |
| **Could** | Fotos adjuntas · simulador con escenarios · modo replay con datos de OSDR · cola de comunicación con retraso · bitácora · inventario del kit médico · prueba de motricidad fina |
| **Won't** | Sensores reales o hardware · login completo · Cloudflare · **PWA / service worker** (decisión del 14 de noviembre: cuesta horas y no es necesario; el offline se resuelve con `localStorage` y el intérprete) · diagnósticos o análisis de imágenes con IA · frecuencia cardíaca por cámara · asistente conversacional · microservicios o arquitectura hexagonal completa |

**Oleadas:**
- **Ola 1 (MVP recortado, sección 14.1):** horas 0–32. **Hito:** demo de extremo a extremo hacia la **hora ~32** (equipo de 3; manda la sección 14).
- **Ola 2 (Should-A y Should):** horas 24–34.
- **Ola 3 (Could-A):** horas 30–38.
- **Corte:** en la **hora 38**, lo incompleto se apaga con su flag.
- **Congelamiento:** **hora 42**.

---

## 3. Stack

- **Backend:** Java 21, Spring Boot 3, Maven (`mvnw`), Spring Web, Validation, Data JPA, Flyway, springdoc-openapi, Lombok (mínimo).
  - ❌ **Sin Spring Security** en el MVP. El CORS va en `config/CorsConfig`. Security solo entra con el PIN (Should).
  - ❌ **Sin MapStruct:** mappers manuales.
- **Frontend:** React, TypeScript (`strict`), Vite, Tailwind CSS, Recharts, react-i18next, TanStack Query. Caché offline en `localStorage`. Tipos generados desde OpenAPI (`openapi-typescript`).
- **Base de datos:** PostgreSQL 16 en Docker.
- **Infraestructura:** `docker-compose.yml` con postgres, backend y frontend. CI en GitHub Actions: formato, lint, pruebas y build.
- **Calidad:** Spotless (google-java-format), ESLint + Prettier (+ el plugin de Tailwind), `.editorconfig`.

> **Si el equipo formado en la sede no sabe Java:** Node + TypeScript (NestJS), con las mismas capas y los mismos JSON. **Equipo de 1–2 personas:** solo frontend, con los motores en TS. Decisión en la hora 0.

---

## 4. Arquitectura

### 4.1 Capas y dependencias
`controller → service → (domain, repository) → entity`
- El Controller nunca usa un Repository.
- **`domain` es Java puro:** sin Spring, sin JPA, sin HTTP, sin `Instant.now()` (recibe un `Clock` o la hora como parámetro).
- Las Entities nunca salen del backend: la API devuelve DTOs (`record`).
- Errores: `GlobalExceptionHandler` + enum `ErrorCode` → `ErrorResponse { code, message }`.

### 4.2 Patrón de paquetes: por capa, con el dominio por funcionalidad

**Decisión:** **package-by-layer** (por capa), como la plantilla del equipo. Es lo que el equipo conoce y se entiende rápido en la hora 0. **Excepción:** dentro de `domain`, los subpaquetes van **por funcionalidad**, porque son motores independientes.

```
com.zerogvitals
├── ZeroGVitalsApplication.java
├── config/          @Configuration y @ConfigurationProperties: CorsConfig, OpenApiConfig, RulesConfig, ClockConfig, SchedulingConfig
├── controller/      @RestController, uno por recurso: XxxController (limpios, SPEC 4.4b)
├── dto/
│   ├── request/     record + Bean Validation: CreateXxxRequest, UpdateXxxRequest
│   └── response/    record: XxxResponse, ErrorResponse
├── entity/          @Entity JPA: Xxx (sin lógica de negocio)
│   └── enums/       HealthLevel, Escalation, ReadingSource, AlertStatus…
├── repository/      interface XxxRepository extends JpaRepository<Xxx, Long>
├── mapper/          final class XxxMapper con métodos estáticos toResponse(...) y toEntity(...)
├── service/         interface XxxService (contrato)
│   └── impl/        @Service @Transactional: XxxServiceImpl (orquesta el caso de uso)
├── domain/          ⭐ Java PURO, sin Spring ni JPA. Subpaquetes por funcionalidad:
│   ├── triage/      TriageEngine, TriageContext, TriageOutcome, RuleTrace, EscalationPolicy,
│   │                BodyStatusCalculator, TrendDetector, FatigueRiskEvaluator
│   │   └── rules/   IndicatorRule (interface), BaselineRule, ThresholdRule, ScaleRule,
│   │                CombinationRule, PersistenceRule, HysteresisRule
│   ├── emergency/   EmergencyEngine, ProtocolDefinition, ProtocolStep
│   ├── eva/         EvaReadinessEvaluator
│   ├── gamification/ PointsCalculator, AchievementEvaluator
│   ├── nutrition/   CalorieTargetCalculator (EER de la NASA)
│   ├── report/      SbarReportBuilder
│   └── model/       objetos de valor compartidos: Reading, Thresholds, MissionContext…
├── exception/       GlobalExceptionHandler, ErrorCode, ResourceNotFoundException,
│                    BusinessRuleException, InvalidStateTransitionException
├── security/        (vacío en el MVP; solo con el PIN)
└── simulation/      (Could) SimulationRunner, scenarios/, replay/
```

**Reglas del patrón:**

| # | Regla |
|---|---|
| 1 | **Dependencias permitidas:** `controller → service → (domain, repository, mapper)` · `repository → entity` · `mapper → (entity, dto)` · `domain → domain.model`. **Nada importa `controller`.** **`domain` no importa nada** de `entity`, `repository`, `dto` ni Spring |
| 2 | **El service traduce:** convierte las entities a objetos de `domain.model`, llama al motor y guarda el resultado. El dominio nunca ve una entity JPA |
| 3 | **Sufijos obligatorios:** `Controller`, `Service` / `ServiceImpl`, `Repository`, `Mapper`, `Request`, `Response`, `Exception`, `Config`. Las entities no llevan sufijo (`VitalReading`, no `VitalReadingEntity`) |
| 4 | **Un archivo por clase pública.** Sin clases "utilitarias" genéricas (`Utils`, `Helper`): si algo se repite, va a `domain.model` o al mapper que corresponda |
| 5 | **Visibilidad:** las clases internas de un motor (por ejemplo, las reglas concretas) pueden ser *package-private* dentro de su subpaquete. Hacia afuera se expone solo el motor (`TriageEngine.evaluate(...)`) |
| 6 | **Pruebas en espejo:** `src/test/java/com/zerogvitals/` replica los mismos paquetes. Prioridad: `domain/**` (unitarias, sin Spring) → `controller/**` (MockMvc) |
| 7 | **Verificación automática (opcional, si sobra tiempo):** una prueba con **ArchUnit** que falla si se rompe la regla 1, por ejemplo si `domain` importa `jakarta.persistence` o `org.springframework` |

**¿Por qué no por funcionalidad en todo el backend?** El *package-by-feature* (`crew/`, `vitals/`, `emergency/`, cada uno con su controller, service y repository) escala mejor en proyectos grandes. Pero en 48 horas, con un equipo que se acaba de conocer y una plantilla por capas que ya funciona, **cambiarlo cuesta más de lo que aporta**. Los conflictos de Git se evitan igual, porque cada persona trabaja en archivos distintos de cada capa.

**Frontend (por funcionalidad, que es lo habitual en React):** `src/pages/` (pantallas) · `src/components/` (presentación) · `src/hooks/` y `src/services/` (datos) · `src/engine/` (intérprete offline) · `src/offline/` · `src/types/` (generados desde OpenAPI) · `src/locales/` · `src/styles/`.

### 4.3 Glosario obligatorio (nombres en el código)
`CrewMember` · `VitalReading` · `EnvironmentReading` · `SelfAssessment` · `Symptom` · `HealthLevel` (`NORMAL`, `CAUTION`, `ALERT`, `CRITICAL`, `NO_DATA`) · `TriageResult` (entity) / `TriageOutcome` (dominio) · `Indicator` (enum) · `MissionProfile` · `BodyRegion` · `SpaceHazard` (`RADIATION`, `ISOLATION`, `DISTANCE`, `GRAVITY`, `ENVIRONMENT`) · `Countermeasure` · `ProtocolStep` · `Escalation` (`NONE`, `SELF`, `CREW_CMO`, `FLIGHT_SURGEON`).

**Unidades en los nombres:** `heartRateBpm`, `spo2Percent`, `systolicMmHg`, `diastolicMmHg`, `glucoseMgDl`, `bodyTemperatureCelsius`, `respiratoryRateRpm`, `radiationDoseMsv`, `co2PartialPressureMmHg`, `sleepHours`, `exerciseMinutes`, `hydrationLiters`. **Fechas:** `Instant` en UTC con sufijo `At`.

### 4.3b Manejo del tiempo: guardar en UTC, mostrar en "hora de misión"

**Regla:** se **guarda y se transmite en UTC** y se **muestra y se razona en hora de misión**.

| Capa | Qué se usa |
|---|---|
| Base de datos | `TIMESTAMPTZ` (siempre UTC) |
| Java | `Instant` (nunca `LocalDateTime` para momentos) y un `Clock` inyectado |
| API | ISO-8601 con `Z` (`2026-11-14T15:30:00Z`) |
| Interfaz | **Hora de misión** según el perfil activo, más una segunda línea pequeña con la hora UTC |

**Por qué UTC:** en el espacio no hay zona horaria local. **La ISS opera con hora GMT/UTC.** Además, UTC no tiene horario de verano ni ambigüedades, y los datos de toda la tripulación, del hábitat y de la Tierra se pueden comparar directamente. Si se guardara la hora "local" de cada uno, ordenar la bitácora de una emergencia o calcular la persistencia daría errores.

**Hora de misión (se calcula, no se guarda):**

| Perfil | Reloj que se muestra |
|---|---|
| `STATION`, `LUNAR_TRANSIT`, `LUNAR_BASE`, `MARS_TRANSIT` | **UTC** (como en la ISS) |
| `MARS_BASE`, `ROVER` en Marte | **Reloj de sol marciano:** "Sol N, hh:mm" con días de 24.6597 h (S33), contados desde la fecha de aterrizaje del perfil (`missionEpochAt`) |

**Lo que NO se calcula con la medianoche UTC:**
1. **"Día" de la misión:** la autoevaluación diaria, las rachas de la gamificación, los "días seguidos sin descanso" y el plan semanal se cuentan por **día de misión** (día UTC o sol), **empezando al despertar del tripulante**, no a la medianoche.
2. **Nadir circadiano (1–7 a. m.):** se calcula **respecto al horario de sueño de cada tripulante** (NASA-STD-3001, V1 6001), no respecto a UTC. Cada `CrewMember` tiene `sleepStartTime` y `sleepDurationHours` (por defecto, 8.5 h) en hora de misión.
3. **Recordatorios:** se programan en hora de misión ("al despertar", "antes de dormir") y se guardan convertidos a UTC.

**Demo en Medellín:** la interfaz puede mostrar además la **hora de Colombia (UTC−5)** en el panel del CMO, solo como referencia para el público. No se guarda.

### 4.4 Entities
| Entity | Campos principales |
|---|---|
| CrewMember | id, name, missionRole, age, sex, bodyMassKg, heightM, activityFactor, currentModule, isCmo, careerDoseMsv, **sleepStartTime**, **sleepDurationHours** (8.5), createdAt |
| VitalReading | id, crewMemberId, recordedAt, heartRateBpm, hrvRmssdMs, systolicMmHg, diastolicMmHg, spo2Percent, bodyTemperatureCelsius, respiratoryRateRpm, glucoseMgDl, glucoseContext (`FASTING`, `POST_MEAL`, `RANDOM`), source (`SENSOR`, `GUIDED_MANUAL`, `SIMULATED`) |
| EnvironmentReading | id, module, recordedAt, co2PartialPressureMmHg, cabinTemperatureCelsius, cabinHumidityPercent, radiationDoseRateMsvPerDay, solarEventActive |
| SelfAssessment | id, crewMemberId, recordedAt, sleepHours, mood (1–5), morale (1–5, opcional), fatigue (1–10), stress (1–10), bedfordWorkload (1–10), bored (bool), exerciseMinutes, hydrationLiters, caloriesKcal, appetite (1–5), dizzinessGrade (0–3), visionChange (bool), notes |
| Symptom | id, crewMemberId, recordedAt, bodyRegion, intensity (0–10), type, onsetAt, associated (lista) |
| TriageResult | id, crewMemberId, evaluatedAt, globalLevel, escalation, levelsByIndicator (JSON), traces (JSON), wellnessScore, recommendations (JSON) |
| Alert | id, crewMemberId o module, indicator, level, message, status (`ACTIVE`, `ACKNOWLEDGED`, `RESOLVED`), createdAt, acknowledgedAt, resolvedAt |
| MissionProfile | id, code, gravityG, commDelaySeconds, evacuationTime, radiationFactorVsIss, cabinPressure (`NORMAL`, `REDUCED`), dayLengthHours, **missionEpochAt** (inicio de la misión o aterrizaje, para contar días o soles), medicalEquipment (lista), active |
| EmergencySession / EmergencyStepLog | sesión: id, patientId (puede ser nulo), protocol, status, startedAt, endedAt · paso: sessionId, stepId, answer, recordedAt, vitals (JSON) |
| Reminder | id, crewMemberId, task, dueAt, status (`PENDING`, `DONE`, `SNOOZED`, `MISSED`), doneAt |
| EvaAssessment | id, crewMemberId, type (`PRE_EVA`, `POST_EVA`, `GRAVITY_TRANSITION`), result (`FIT`, `FIT_WITH_CAUTION`, `NOT_FIT`, `NEEDS_ASSISTANCE`), failedCriteria (JSON), cmoApproval, recordedAt |
| CrewProgress / CrewAchievement | puntos, racha, nivel / código, obtenida el |
| ImprovementGoal | crewMemberId, week, countermeasureCode, target, progress, status |

### 4.4b Controladores limpios (regla obligatoria)

**El controller solo traduce HTTP ↔ service. No piensa.** Cada método:
1. Recibe el request (`@PathVariable`, `@RequestParam`, `@RequestBody @Valid`).
2. Llama a **un solo** método del service.
3. Devuelve el **DTO de respuesta** con el código HTTP correcto (`200`, `201` + `Location`, `204`).

| ✅ Sí | ❌ No |
|---|---|
| `@RestController` + `@RequestMapping("/api/…")` + `@RequiredArgsConstructor` (inyección por constructor, campos `final`) | `@Autowired` en campos |
| DTOs `record` validados con `@Valid` | Validar a mano con `if` |
| **El service devuelve el DTO de respuesta ya mapeado** (el mapper se usa en el service) | Mapear Entity ↔ DTO en el controller, o devolver Entities |
| Métodos de **3 a 6 líneas** | `if` de negocio, cálculos, umbrales, bucles |
| Errores con excepciones que maneja `GlobalExceptionHandler` | `try/catch` en el controller |
| `@Tag` y `@Operation(summary = "…")` cortos para Swagger | Documentación larga dentro del código |
| Nombres REST: sustantivos en plural, kebab-case | Verbos en la URL (`/getStatus`) |
| Un controller por recurso (sección 4.5) | Controllers "dios" con todo mezclado |
| Paginación con `Pageable` en los historiales | Listas sin límite |

**Ejemplo de referencia** (el estilo esperado, no código final):

```java
@RestController
@RequestMapping("/api/crew/{crewMemberId}/vitals")
@RequiredArgsConstructor
@Tag(name = "Vitals")
public class VitalReadingController {

    private final VitalReadingService vitalReadingService;

    @PostMapping
    @Operation(summary = "Register a vital reading and re-run triage")
    public ResponseEntity<VitalReadingResponse> register(@PathVariable Long crewMemberId,
                                                         @Valid @RequestBody CreateVitalReadingRequest request) {
        VitalReadingResponse response = vitalReadingService.register(crewMemberId, request);
        return ResponseEntity.created(URI.create("/api/crew/%d/vitals/%d".formatted(crewMemberId, response.id())))
                             .body(response);
    }

    @GetMapping
    @Operation(summary = "Vital reading history")
    public Page<VitalReadingResponse> history(@PathVariable Long crewMemberId, Pageable pageable) {
        return vitalReadingService.findHistory(crewMemberId, pageable);
    }
}
```

**Prueba rápida:** si un controller importa algo de `repository`, `entity` o `domain`, o tiene un `if` que no sea de HTTP, **está mal**: esa lógica va al service.

### 4.5 Endpoints (`/api`)
- **crew:** `GET /crew` · `GET /crew/{id}` · `PATCH /crew/{id}/baseline`
- **vitals:** `POST /crew/{id}/vitals` · `GET /crew/{id}/vitals?from&to&page&size`
- **environment:** `POST /environment` · `GET /environment/latest` · `GET /environment?module&from&to`
- **self-assessments:** `POST /crew/{id}/self-assessments` · `GET /crew/{id}/self-assessments`
- **symptoms:** `POST /crew/{id}/symptoms` · `GET /crew/{id}/symptoms`
- **triage:** `GET /status` · `GET /crew/{id}/status` (incluye `traces`) · `GET /crew/{id}/triage-history` · `GET /crew/{id}/body-status` · `GET /crew/{id}/trends`
- **alerts:** `GET /alerts?status=ACTIVE` · `PATCH /alerts/{id}/acknowledge`
- **emergencies (sin identificación):** `POST /emergencies` · `POST /emergencies/{id}/steps` · `PATCH /emergencies/{id}/close` · `GET /emergencies/{id}/report?format=sbar`
- **eva:** `POST /crew/{id}/eva-assessments` · `GET /crew/{id}/eva-assessments/latest`
- **mission-profiles:** `GET /mission-profiles` · `GET` y `PUT /mission-profiles/active`
- **guides / countermeasures / sources / achievements / features:** `GET` de cada uno
- **config (offline):** `GET /config` (todos los JSON de reglas y contenido en un solo paquete)
- **progress:** `GET /crew/{id}/progress`
- **reminders:** `GET /crew/{id}/reminders` · `PATCH /reminders/{id}/complete` · `PATCH /reminders/{id}/snooze`
- **simulation (Could):** `GET /simulation/scenarios` · `POST /simulation/scenarios/{name}/start` · `POST /simulation/stop`
- **health:** `GET /health`

---

## 5. Lógica del dominio

### 5.1 Triaje
1. **Nivel por indicador**, según el `mode` del umbral (sección 6.1):
   - `BASELINE` (signos vitales): desviación de la línea base personal → 🟡 ≥ 15 %, 🟠 ≥ 30 % sostenida. **Crítico** = límite absoluto `CMO_CONFIGURABLE`.
   - `ABSOLUTE`: límites con fuente NASA (CO₂, cabina, sueño, hidratación, ejercicio, radiación, hipotermia < 35 °C).
   - `SCALE`: escalas oficiales (Bedford, mareo 0–3, Cuff Class 1–4, ánimo 1–5).
2. **Estado global = el peor nivel.** Si hay **3 o más 🟡** al mismo tiempo, sube a 🟠.
3. **Combinaciones:**
   - SpO₂ en 🟡 + CO₂ del módulo en 🟠 → **alerta ambiental del módulo**.
   - FC alta + HRV baja + estrés ≥ 7 → recomendación de salud conductual.
   - Evento solar activo → 🔴 + P3.
   - Pecho ≥ 7 en el mapa de dolor, o pecho + falta de aire o sudor → 🔴 + ofrecer P1.
4. **Persistencia:** 🟡 y 🟠 exigen **2 lecturas seguidas**. 🔴 de sensor se confirma con **1 lectura nueva en menos de 30 s**. La radiación y el CO₂ críticos no esperan.
5. **Histéresis:** para bajar de nivel hacen falta **3 lecturas seguidas** en el nivel inferior.
6. **Sin datos (`NO_DATA`):** un indicador **sin lectura vigente** queda en ⚪ `NO_DATA`, **nunca en `NORMAL`**. La vigencia depende de **cómo se mide** (campo `freshness` en `thresholds.json`):

   | Origen | Vigencia por defecto |
   |---|---|
   | Sensor continuo o simulado (`SENSOR`, `SIMULATED`) | 10 min |
   | Medición guiada (`GUIDED_MANUAL`) | Según la frecuencia de su ficha: diaria → **26 h**; semanal → **8 días**; "con síntomas" → no vence por tiempo |
   | Autoevaluación | 24 h (de día de misión) |
   | Ambiente del módulo | 5 min (además genera una **alerta técnica** "sensor sin datos") |
   | Línea base `PENDING` | Los indicadores `BASELINE` usan solo los límites absolutos hasta tener línea base |

   **Cómo participa en el estado global:**
   - `NO_DATA` **no tiene gravedad** (`severity = null`): no sube ni baja el estado global.
   - El global es el peor de los niveles **con datos**.
   - Si **todos** los indicadores clave (FC, SpO₂, presión, temperatura y sueño) están en `NO_DATA`, el global es `NO_DATA`.
   - Escalamiento `SELF`: *"No hay lectura reciente de X: mide ahora"*, con un botón a su ficha.
   - Se ve ⚪ con el ícono "?" en la tarjeta, en la región del mapa corporal (si todos sus indicadores están sin datos) y en la explicación ("sin lectura desde hace X h").
   - **Nunca genera alertas al CMO por sí solo**, salvo la alerta técnica del ambiente.
7. **Radiación por perfil:** el nivel se calcula según el múltiplo de la tasa esperada del perfil (`radiationFactorVsIss` × ~0.5 mSv/día).
   - Dosis de carrera: 🟡 ≥ 50 %, 🟠 ≥ 75 %, 🔴 ≥ 90 % de **600 mSv**.
   - Dosis acumulada += tasa del módulo × tiempo en el módulo.
8. **Riesgo de fatiga (NASA, S32):** cada factor suma 🟡; con 2 o más → 🟠 + modo cansancio + sugerir D11.
   - Factores: vigilia > 16 h · sueño < 6 h durante 3 días o más · jornada > 12 h · más de 6 días sin descanso · EVA hoy.
9. **Escalamiento:** 🟢 `NONE` · 🟡 `SELF` · 🟠 `CREW_CMO` · 🔴 `FLIGHT_SURGEON` (+ toda la tripulación).
10. **`RuleTrace`** en cada nivel: indicador, valor, umbral, regla (`THRESHOLD`, `BASELINE`, `COMBINATION`, `PERSISTENCE`, `HYSTERESIS`), lecturas usadas, `sourceId` y `hrpRisk`.
11. **Alertas:** una activa por par (tripulante, indicador). Si sube de nivel, se escala esa misma. Se resuelve sola con histéresis. Las ambientales se crean una vez por módulo.
12. **Recomendaciones:** se ordenan por nivel y luego por prioridad clínica (respiración > cardiovascular > radiación > CO₂ > temperatura > conducta). Se muestran **como máximo 3**.
13. **Puntaje de bienestar** (solo visual): 100 − 25 por cada 🔴 − 10 por cada 🟠 − 4 por cada 🟡, con mínimo 0.
14. **Línea base:** promedio de las primeras 7 lecturas en reposo, o el valor del perfil. Se puede editar.

### 5.2 Mapa corporal
`BodyStatusCalculator` → el nivel de cada región es el peor de sus indicadores (`body-map.json`).
**Regiones:** `MIND`, `EYES`, `INNER_EAR`, `HEART`, `LUNGS`, `BLOOD`, `BONES`, `MUSCLES`, `SPINE`, `KIDNEYS`, `WHOLE_BODY`.

### 5.3 Emergencias
`EmergencyEngine` recorre el árbol de `emergency-protocols.json`: protocolo + paso + respuesta → siguiente paso. Hay variantes por gravedad del perfil.
- **P1:** dolor en el pecho o colapso (estructura del Medical Checklist de la NASA).
- **P2:** respiración o hipoxia.
- **P3:** evento solar.
- **P4:** descompresión (Cuff Class 1–4 + chequeo neurológico).

El frontend tiene **el mismo intérprete en TS** (`src/engine`) leyendo el JSON en caché. Se abre la bitácora con la hora de cada paso. El metrónomo de RCP es `CMO_CONFIGURABLE`.

### 5.4 Aptitud (D4)
`EvaReadinessEvaluator` con `eva-criteria.json`, que tiene 3 tipos (paquete de contenido, sección 7):
- `PRE_EVA` → `FIT`, `FIT_WITH_CAUTION` o `NOT_FIT`. Incluye mareo ≥ 2 y EVA en el nadir circadiano (1–7 a. m.) → `NOT_FIT`.
- `POST_EVA` → si hay síntomas, abre P4.
- `GRAVITY_TRANSITION` → `FIT`, `NEEDS_ASSISTANCE` o `NOT_FIT`, para salir de la nave por sus propios medios.

### 5.5 Tendencias (D8)
`TrendDetector`: promedio de 3 días frente a la línea base. **No cambia el color**; alimenta la explicación y el plan semanal.

| Indicador | Se marca tendencia si… |
|---|---|
| FC en reposo | Varía ±10 % o más |
| Presión | Varía ±10 % o más |
| Sueño | Baja 1 h o más |
| Ánimo | Baja 1 punto o más |
| Glucosa en ayunas | Sube 15 % o más |
| Ejercicio | Baja 20 % o más |

### 5.6 Gamificación
`PointsCalculator` y `AchievementEvaluator`: puntos, niveles e insignias (paquete de contenido, sección 8).
- **Nunca** se suman ni restan puntos por valores de salud.
- Reportar un síntoma **suma** puntos.

### 5.7 Objetivo calórico
Ecuación EER de la NASA (paquete de contenido, sección 0.4), con el 100 % del requerimiento calculado.

---

## 6. Archivos de configuración (`resources/data/`)

> **Al arrancar**, se valida cada archivo (*fail fast*). Si falta un `sourceId` o un campo obligatorio, **la app no arranca** y dice qué falta.
> Todos los textos se escriben como `{ "es": "...", "en": "..." }`.
> **El contenido sale del paquete de contenido. No se inventa.**

| Archivo | Estructura mínima | Contenido en el paquete |
|---|---|---|
| `thresholds.json` | `[{ indicator, unit, mode: BASELINE\|ABSOLUTE\|SCALE, baseline?:{cautionPct, alertPct}, bands?:{normal, caution, alert, critical}, persistence, hysteresis, maxLevel?, freshness:{ sensorMinutes, guidedHours }, sourceId, hrpRisk[], profileOverrides? }]` | Secciones 2 y 2.1 + plan 3.3 (ambiente) |
| `mission-profiles.json` | `[{ code, name, gravityG, commDelaySeconds, evacuationTime, radiationFactorVsIss, cabinPressure, dayLengthHours, medicalEquipment[] }]` | Sección 7 de este SPEC |
| `measurement-guides.json` | `[{ indicator, what, equipment, steps[], commonErrors[], whyInSpace, hazards{}, actionsByLevel{}, escalation, prevention[], frequency, hrpRisk[], sourceIds[] }]` | Sección 3 (F01–F16) |
| `emergency-protocols.json` | `[{ code, title, trigger, steps:[{ id, type: INFO\|QUESTION\|ACTION\|MEASURE\|TIMER, text, yes?, no?, next?, gravityVariants? }] }]` | Sección 5 (P1–P4) |
| `body-map.json` | `[{ region, name, function, indicators[], hazards:{RADIATION, ISOLATION, DISTANCE, GRAVITY, ENVIRONMENT}, countermeasures[], hrpRisk[] }]` | Sección 4 |
| `countermeasures.json` | `[{ code, text, risks[], when, sourceIds[] }]` | Sección 6 |
| `eva-criteria.json` | `{ PRE_EVA:[criterio], POST_EVA:[…], GRAVITY_TRANSITION:[…] }` | Sección 7 |
| `achievements.json` | `{ points:{…}, levels:[…], badges:[…], crewMission }` | Sección 8 |
| `projection-rates.json` | `{ boneLossPctPerMonth:{ withExercise, without }, phases:[{ name, days, radiationFactor }], careerLimitMsv: 600 }` | Paquete y plan R6/R7 ⚠️ (tasa con ejercicio: `CMO_CONFIGURABLE`) |
| `sources.json` | `[{ id, title, org, url?, year?, type }]` + `hrpRisks:[{ code, short, formal }]` | Secciones 1.2 y 9 |
| `features.json` | `{ D1:true, D2:false, … }` | — |

---

## 7. Perfiles de misión

| code | Gravedad | Retraso (un sentido) | Radiación (× ISS) | Cabina | Día | Nota |
|---|---|---|---|---|---|---|
| `STATION` | 0 g | ~0 s | 1.0 | NORMAL | 24 h | Consulta a la Tierra posible |
| `LUNAR_TRANSIT` | 0 g | 1.3 s | 2–3 (se usa 2.5) | NORMAL o REDUCED | 24 h | — |
| `LUNAR_BASE` | 0.16 g | 1.3 s | 1.5 | REDUCED | 24 h | "Moon Base, polo sur lunar" |
| `MARS_TRANSIT` | 0 g | hasta 1.200 s | 2–3 (se usa 2.5) | REDUCED | 24 h | Autonomía total. **Perfil por defecto de la demo** |
| `MARS_BASE` | 0.38 g | hasta 1.200 s | 1.0 | REDUCED | **24.6597 h** (24 h 39 min 35 s) | — |
| `ROVER` | La del cuerpo celeste | La del cuerpo celeste | La de la superficie | — | — | Con 🟠 o 🔴: "regresar a la base" |

**Fuentes:** factores de radiación (podcast de la NASA, S07) · 20 min (R7, R10) · 0.38 g y día marciano (S33).

---

## 8. Frontend

- **Pantalla inicial:** selector de tripulante (fotos o nombres) + **botón EMERGENCIA** siempre visible.
- **Páginas:** `BodyMap` (principal), `SelfAssessment`, `Emergency`, `EvaCheck`, `Charts`, `Alerts`, `Progress`, `MissionProfile`, `CrewDashboard` (CMO).
- **Componentes clave:** `BodyFigure` (SVG clicable, el corazón late a la FC y los pulmones a la FR), `BodyRegionPanel`, `LevelBadge` (color + ícono + texto, **único** en toda la app), `WhyPanel`, `MeasurementGuide`, `VitalChart`, `EmergencyStep`, `CprMetronome`, `HazardLensBar`, `PainMap`, `VigilanceTest`, `LanguageSwitcher`.
- **Design tokens** en `tailwind.config`: `level-normal`, `level-caution`, `level-alert`, `level-critical`, `level-nodata`.
- **Accesibilidad:** `aria-label` en las regiones del SVG, foco visible, `prefers-reduced-motion`, botones grandes en la emergencia.
- **Offline:** descargar `GET /api/config` al iniciar y guardarlo en `localStorage`. El intérprete de `src/engine` cubre la emergencia y el triaje básico. Los registros pendientes van a una cola que se sincroniza (**solo se agregan, nunca se editan**).
- **Componentes de presentación sin llamadas a la API.** Los datos se piden con TanStack Query en `hooks/` y `services/`.

---

## 9. Calidad

- **Pruebas primero** en `domain`, a partir de los casos T01–T48 del paquete (sección 10) → JUnit 5 parametrizado. Meta: ~80 % de cobertura en `domain`.
- **Definición de "terminado":**
  - CI en verde;
  - sin textos escritos en el código (usa i18n);
  - sin umbrales en el código (usa JSON);
  - sin `any` ni `System.out`;
  - con los nombres del glosario;
  - si está incompleto, detrás de su flag;
  - sin secretos;
  - revisado por una persona;
  - commit con `Co-Authored-By: Claude`.
- **Revisiones:** `/code-review` en las horas 12, 24 y 36 · `/simplify` en las horas 24 y 38 · `/security-review` en la hora 38.
- **README final** con la declaración de uso de IA (plan 0.13.6).

---

## 10. Orden de trabajo (pedidos a Claude)

| # | Hora | Pedido |
|---|---|---|
| P0 | 0 | **Configuración del repositorio (sección 13)** + estructura (4.2) + i18n y flags. Verificar con `docker compose up` y con el CI en verde |
| P1 | 1 | Flyway V1 + entities, enums y repositories del MVP |
| P2 | 2 | Paquete de contenido → `resources/data/*.json` (sección 6) en ES y EN + `RulesConfig` con validación *fail fast* |
| P3 | 3 | `domain.triage` con pruebas T01–T48 primero; `RuleTrace` y `Escalation` |
| P4 | 6 | Controllers, DTOs, mappers y services del MVP + Swagger + `GET /config` |
| P5 | 8 | Front base: cliente de API, tipos de OpenAPI, i18n, flags, selector de tripulante, `SelfAssessment` + `MeasurementGuide` + `WhyPanel` |
| P6 | 12 | `BodyFigure` en SVG + `BodyRegionPanel` + animaciones |
| P7 | 16 | `domain.emergency` + pantalla P1 + metrónomo + bitácora + intérprete offline |
| P8 | 20 | Gráficas, contramedidas, caché offline. **Demo de extremo a extremo en la hora 24** |
| P9 | 24+ | Ola 2, un pedido por funcionalidad |
| P10 | 30+ | Ola 3 |
| P11 | 38 | Revisión final + README + apagar con su flag lo incompleto |

---

## 11. Demo (unos 2 min) y frases para el pitch

> **Guion ajustado al MVP recortado** (equipo de 3, sección 14.1). Solo usa funciones que están en el alcance.

**Guion de la demo:**
1. Perfil **"Tránsito a Marte"** activo (fijo en el MVP, retraso de 20 min). Selector de tripulante → Carlos.
2. **Mapa corporal:** el cerebro de Carlos aparece en 🟡 por **poco sueño en las últimas 2 noches** (la semilla de demo trae varios días de datos, sección 7 del modelo de datos) → **"¿por qué?"** muestra la regla, la persistencia y la fuente NASA.
3. **Gráfica de sueño y FC** de los últimos días, con su línea base.
4. **Autoevaluación guiada** de Yuki: la ficha explica cómo medir la SpO₂ y por qué importa en el espacio → el mapa corporal se actualiza.
5. Elena se desploma: **EMERGENCIA** (sin identificarse) → **P1** paso a paso, con el metrónomo y la bitácora con hora.
6. **Apagar el wifi** y repetir P1: la emergencia sigue funcionando sin conexión.
7. Cierre: la **lista del CMO** muestra el estado de toda la tripulación y el reporte de la emergencia en cola hacia la Tierra.

*Si se alcanza D3 (mapa de dolor), se agrega antes del paso 5: Elena reporta dolor en el pecho ≥ 7 → la app sugiere P1.*

**Frases (con su fuente):**
- *"La NASA está desarrollando herramientas de apoyo a la decisión clínica y asistentes virtuales para que las tripulaciones respondan a anomalías lejos de la Tierra"* (R10). ZeroG Vitals es un prototipo de esa idea.
- Riesgo oficial del HRP: *"Earth independent human-systems operation"* (HRP-15).
- *"La radiación no se ve ni se siente. ZeroG Vitals la hace visible."* (R3)
- *"Nuestra prueba de vigilancia replica el formato del Reaction Self Test que la NASA usa en la ISS"* (S32).
- *"Los límites clínicos los define el equipo médico de vuelo; ZeroG Vitals los aplica, los explica y escala"* (NASA-STD-3001, S30).
- **Cierre:** la misma herramienta, offline y para personas que no son médicos, sirve a comunidades rurales de Colombia (La Guajira, Sierra Nevada, Cesar).

---

## 12. Abierto o por confirmar

- Reglas oficiales del evento: qué se puede preparar antes, formato del video y política de IA.
- Pestaña *Resources*: si hay datasets de OSDR (modo replay).
- Límites `CMO_CONFIGURABLE` (FC, presión, SpO₂, FR, glucosa, ritmo de RCP, prueba ortostática, lapso de D11) → valores de demostración que se declaran como tales.
- Figura SVG del cuerpo: dibujarla o usar una con licencia abierta (y citarla).

---

## 13. Configuración del repositorio

> El repositorio se crea en la **hora 0** del evento (nada de código antes). Esta sección le dice a Claude **exactamente** qué generar en el pedido P0.

### 13.1 GitHub

| Ajuste | Valor |
|---|---|
| Nombre | `zerog-vitals` |
| Visibilidad | **Público** (es un entregable oficial del reto) |
| Descripción | "Visual health self-assessment tool for astronauts, offline-first, linked to NASA HRP risks. NASA Space Apps Challenge 2026" |
| Temas (*topics*) | `nasa-space-apps-2026`, `space-health`, `astronauts`, `spring-boot`, `react`, `offline-first` |
| Licencia | **MIT** |
| Rama por defecto | `main` |
| Funciones | Issues ✅ · Projects ✅ · Wiki ❌ · Discussions ❌ |
| Colaboradores | Se invita a cada integrante en la hora 0 con su usuario de GitHub (rol *Write*). El líder es *Admin* |
| Secretos | **Ninguno en el repositorio.** Si se usa Render o Neon (opcional), las credenciales van en esos servicios, nunca en GitHub |
| Dependabot | **Apagado** durante la hackatón (evita PR de ruido) |

### 13.2 Ramas y flujo (simplificado para 48 h)

> Reemplaza el flujo `main` / `develop` / `feature` del plan: con 48 h, una rama `develop` es una capa extra que no aporta.

- **`main`:** protegida y **siempre demostrable**.
- **Ramas cortas:** `feat/<area>-<tema>`, `fix/<tema>`, `docs/<tema>`, `content/<tema>`. Ejemplos: `feat/front-body-map`, `content/protocolos-p1-p4`.
- **Merge:** solo por **PR con *squash merge***, borrando la rama después.
- **Protección de `main`:**
  - PR obligatorio;
  - **CI en verde** obligatorio;
  - **1 aprobación** (si el equipo es de 1–2 personas, se quita y el líder revisa);
  - sin *force push*.
- **Etiquetas de versión:** `v0.1-mvp` (hora ~32, demo de extremo a extremo) · `v1.0-entrega` (hora 42, congelamiento). *(Sin `v0.2-ola2`: con 3 personas la Ola 2 queda fuera del plan.)*

### 13.3 Commits

- **Formato:** `feat: …`, `fix: …`, `test: …`, `docs: …`, `content: …`, `chore: …`, `refactor: …`, en inglés y en imperativo.
- **Si Claude ayudó,** el commit termina con la línea `Co-Authored-By: Claude`.
- **Commits pequeños y frecuentes:** los jurados revisan el historial de las 48 h.

### 13.4 Archivos de la raíz

| Archivo | Contenido |
|---|---|
| `README.md` | Nombre y frase · problema (escenario del reto) · capturas o GIF · funcionalidades · **cómo correrlo** (`docker compose up`) · arquitectura (diagrama de capas) · **fuentes NASA** (riesgos del HRP, NASA-STD-3001, OCHMO) · **declaración de uso de IA** (plan 0.13.6) · aviso "no es un dispositivo médico" · equipo y créditos · licencia |
| `CLAUDE.md` | El borrador preparado |
| `LICENSE` | MIT, con el año 2026 y "ZeroG Vitals team" |
| `.gitignore` | `.env` · `.idea/` · `*.iml` · `.vscode/` (excepto `extensions.json`) · `.DS_Store` · `backend/target/` · `backend/uploads/` · `backend/datasets/` · `frontend/node_modules/` · `frontend/dist/` · `*.log` · `coverage/` |
| `.gitattributes` | `* text=auto eol=lf` · `*.cmd text eol=crlf` · `mvnw text eol=lf` · `*.png *.jpg *.ico binary`. **Los SVG se tratan como texto** (el `BodyFigure` se edita a mano y así Git muestra sus diferencias) |
| `.editorconfig` | UTF-8, finales de línea LF, línea final y sin espacios sobrantes; sangría de **4** en Java y de **2** en TS, TSX, JSON, YAML y Markdown |
| `.env.example` | Ver 13.6. **El `.env` real nunca se sube** |
| `docker-compose.yml` | Ver 13.5 |
| `.github/workflows/ci.yml` | Ver 13.7 |
| `.github/pull_request_template.md` | Ver 13.8 |
| `.github/CODEOWNERS` (opcional) | `backend/` → responsable del backend · `frontend/` → responsable del frontend · `backend/src/main/resources/data/` y `docs/` → responsable del contenido |
| `docs/` | SPEC, paquete de contenido, plan (histórico), `decisiones.md` (registro de decisiones, una línea por decisión) y capturas para el README |

### 13.5 Docker Compose

| Servicio | Imagen o build | Puerto | Detalles |
|---|---|---|---|
| `postgres` | `postgres:16` | 5432 | Base `zerogvitals`; volumen `pgdata`; *healthcheck* con `pg_isready` |
| `backend` | Build de `backend/Dockerfile` (multietapa: Maven + JRE 21) | 8080 | `depends_on: postgres` (cuando esté *healthy*); variables desde `.env`; perfil `dev` |
| `frontend` | Build de `frontend/Dockerfile` (multietapa: Node build + servidor estático) | 3000 → 80 | `VITE_API_URL` en el build |

- En desarrollo diario se puede levantar solo `postgres` con Docker y correr el backend y el frontend en local, que es más rápido: `./mvnw spring-boot:run` y `npm run dev` (puerto 5173).

### 13.6 Variables de entorno (`.env.example`, sin secretos reales)

| Variable | Ejemplo | Uso |
|---|---|---|
| `POSTGRES_DB` | `zerogvitals` | Base de datos |
| `POSTGRES_USER` | `zerog` | Usuario de la base |
| `POSTGRES_PASSWORD` | `change-me` | Contraseña local (solo desarrollo) |
| `SPRING_PROFILES_ACTIVE` | `dev` | Perfil de Spring |
| `DB_URL` | `jdbc:postgresql://postgres:5432/zerogvitals` | Conexión del backend |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173,http://localhost:3000` | CORS (`config/CorsConfig`) |
| `VITE_API_URL` | `http://localhost:8080/api` | URL de la API para el frontend |
| `DEFAULT_MISSION_PROFILE` | `MARS_TRANSIT` | Perfil inicial de la demo |
| `SIMULATION_SPEED` | `30` | Velocidad del tiempo simulado (Could) |

### 13.7 CI (GitHub Actions, `ci.yml`)

- **Cuándo corre:** en cada `pull_request` y en cada `push` a `main`. Con `concurrency` para cancelar las corridas viejas.
- **Job `backend`:** `actions/setup-java` (Temurin 21, caché de Maven) → `./mvnw -B spotless:check verify` (compila, prueba y genera el reporte de JaCoCo).
- **Job `frontend`:** `actions/setup-node` (LTS, caché de npm) → `npm ci` → `npm run lint` → `npm run typecheck` → `npm run build`.
- **Opcional, si sobra tiempo:** un job que construye las imágenes de Docker.
- **Regla:** si falla, no hay merge (protección de `main`).

### 13.8 Plantilla de PR (`pull_request_template.md`)

- **Qué cambia y por qué** (enlace a la sección del SPEC).
- **Cómo probarlo** (pasos).
- **Captura** (si toca la interfaz).
- **Checklist de "terminado"** (SPEC, sección 9):
  - [ ] CI en verde
  - [ ] Sin textos en el código (usa i18n)
  - [ ] Sin umbrales en el código (usa JSON con `sourceId`)
  - [ ] Nombres del glosario y unidades en los nombres
  - [ ] Controllers limpios (sección 4.4b): una llamada al service, sin lógica, sin `try/catch`
  - [ ] Si está incompleto, detrás de su *feature flag*
  - [ ] Sin secretos ni `.env`
  - [ ] Revisado por una persona
  - [ ] Commits con `Co-Authored-By: Claude` cuando aplica

### 13.9 Tablero del proyecto (GitHub Projects)

- **Columnas:** `Backlog` → `En progreso` → `En revisión` → `Hecho`.
- **Etiquetas:** `ola-1`, `ola-2`, `ola-3`, `backend`, `frontend`, `contenido`, `demo`, `bug`, `bloqueante`.
- **Una issue por pedido** de la sección 10 (P0–P11) y por funcionalidad (D1–D11, P1–P4), con su responsable.
- En la **hora 0**, Claude puede crear las issues del MVP con `gh issue create`, si el equipo lo aprueba.

---

## 14. Equipo (actualizado el 14 de noviembre: 3 integrantes)

**Tamaño: 3 integrantes** (Lina dejó el equipo). Según la estimación del plan (0.16.4 y 0.16.5), con 3 personas **el MVP completo queda muy justo (hacia la hora ~40)**. Por eso **se recorta el MVP** y **la Ola 2 queda fuera del plan**.

### 14.1 Alcance para 3 personas

| Se mantiene (MVP recortado) | Se recorta o se pospone |
|---|---|
| Selector de tripulante + vista simple del CMO (una lista con el estado de cada uno) | Dashboard completo del CMO → lista simple |
| Autoevaluación guiada con fichas de medición + `WhyPanel` (D1) | — |
| Motor de triaje completo (con pruebas) | — |
| **Mapa corporal** (11 regiones, colores y panel; animación del corazón y los pulmones) | Animaciones extra → solo si sobra tiempo |
| **Emergencia P1** completa (pasos, metrónomo, bitácora) **+ funcionamiento offline de la emergencia** | **Triaje básico offline en el front** → se pospone (sin conexión solo funciona la emergencia, que es lo que se demuestra) |
| Gráficas de **2 indicadores** (sueño y FC) con su línea base | Gráficas de todos los indicadores |
| Contramedidas por indicador (texto de la ficha) | Plan de mejora semanal |
| Estructura bilingüe + traducción al inglés generada por Claude | — |
| *Feature flags* | — |
| **Ola 2:** nada planeado. Si el MVP está listo antes de la hora 32, se intenta **D3 (mapa de dolor)** | P2–P4, D2, D4, D5, D11, gamificación, perfiles en vivo, recordatorios |

**Hitos:** P0 + CI en verde (hora 2) · entities y contrato de la API (hora 4) · **demo de extremo a extremo (hora ~32, `v0.1-mvp`)** · corte (hora 38) · congelamiento (hora 42, `v1.0-entrega`).

### 14.2 Reparto (lo más pesado para Verónica, como lo pidió)

| Integrante | Rol | Responsable de | Carga estimada |
|---|---|---|---|
| **Verónica Padilla** | **Líder técnica + base de datos + triaje + emergencia de punta a punta** | **Repositorio:** `.github/`, `docker-compose.yml`, `config/` (excepto `RulesConfig`), revisión e integración de **todos** los PR · **Base de datos:** `db/migration/`, `entity/`, `entity/enums/`, `repository/` · **Dominio:** `domain/triage` + `domain/emergency` + `test/domain/` · **Emergencia en el front:** pantalla P1 (`pages/Emergency`, `EmergencyStep`, `CprMetronome`, bitácora) + intérprete offline del protocolo (`src/engine`, `src/offline`) · README y declaración de uso de IA | **~32 h** (setup 4 · BD 4 · triaje 8 · motor de emergencia 3 · pantalla P1 7 · offline 3 · revisión de PR 3) |
| **Elimar Álvarez** | **Backend: API, servicios y contenido** + **guion del pitch** | `controller/`, `dto/`, `mapper/`, `service/` + `service/impl/`, `exception/`, Swagger, `GET /config` · **Contenido:** `resources/data/*.json` (convierte el paquete de contenido y su traducción) + `config/RulesConfig` (validación *fail fast*) · **Pitch:** guion y diapositivas de apoyo (hora 34+) | **~22 h** (API 6 · services e integración 6 · contenido JSON 4 · pitch 6) |
| **Rafael Valencia** | **Frontend: base, autoevaluación, mapa corporal y gráficas** + **video** | Base del front (cliente de API, tipos de OpenAPI, i18n, flags, rutas, `LevelBadge`, *design tokens*), selector de tripulante, vista simple del CMO, `SelfAssessment` + `MeasurementGuide` + `WhyPanel`, **`BodyFigure` (SVG) + `BodyRegionPanel`**, `Charts` · **Video:** grabación y edición (hora 36+) | **~29 h** (base 4 · autoevaluación 6 · mapa corporal 8 · gráficas 2 · selector y CMO 2 · integración 3 · video 4) |

> ⚠️ **Advertencia honesta:** ~32 h de trabajo productivo es **más de lo que rinde una persona en 48 h** con descansos (~30 h). Para que funcione:
> 1. Claude genera la mayor parte del código y tú revisas.
> 2. Si a la hora 24 la emergencia o el triaje van atrasados, **el intérprete offline pasa a Elimar** (él terminará antes) o se simplifica.
> 3. **Duerme al menos 2 bloques de 3–4 h.** Una líder agotada en la hora 40 pone en riesgo la entrega más que una función de menos.

**Acuerdos del equipo:**
- **Contrato primero:** Verónica entrega las entities y los repositories en la **hora 2**. Elimar publica los DTOs y endpoints del MVP en Swagger en la **hora 4**. Rafael genera los tipos y trabaja con datos falsos hasta entonces.
- **Solo Verónica toca `db/migration/`.** Elimar pide las columnas o consultas nuevas.
- **Una persona por carpeta**, cada una con su sesión de Claude Code y su propia cuenta (para repartir los límites de uso).
- **Revisión de avance cada 6 horas** (10 min). **Turnos de descanso:** nunca duermen los 3 a la vez.
- **Ensayo de la demo y del pitch** entre los 3 en la hora 38–40, **con el wifi apagado**.

**CODEOWNERS (opcional):**

| Ruta | Responsable |
|---|---|
| `backend/src/main/resources/db/`, `entity/`, `repository/`, `domain/triage/`, `domain/emergency/`, `.github/`, `docker-compose.yml` | Verónica |
| `backend/` (resto: `controller/`, `dto/`, `mapper/`, `service/`, `exception/`, `resources/data/`) | Elimar |
| `frontend/src/pages/Emergency`, `src/engine`, `src/offline` | Verónica |
| `frontend/` (resto) | Rafael |
| `docs/` | Verónica |
