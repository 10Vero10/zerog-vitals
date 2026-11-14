# ZeroG Vitals: contrato de la API REST

> **Complementa la sección 4.5 del SPEC** y tiene su misma prioridad. Las reglas `BR-xx` están en `ZeroG_Vitals_Modelo_Datos.md`.
> Los controllers siguen la regla de **controladores limpios** (SPEC 4.4b): validan, llaman a **un** método del service y devuelven el DTO.
> Swagger UI: `/swagger-ui.html` · OpenAPI: `/v3/api-docs`. El frontend genera sus tipos desde ahí (`openapi-typescript`).

---

## 1. Convenciones

| Tema | Regla |
|---|---|
| Base | `/api` (sin versión en la URL durante la hackatón) |
| Formato | JSON, `Content-Type: application/json`, campos en **camelCase** |
| Fechas | ISO-8601 en **UTC**: `"2026-11-14T15:30:00Z"`. Si el cliente no envía `recordedAt`, el servidor usa su `Clock` (BR-19) |
| Unidades | En el nombre del campo: `heartRateBpm`, `spo2Percent`, `glucoseMgDl`… |
| Idioma | Encabezado `Accept-Language: es` o `en` (o `?lang=`). Los textos de contenido vuelven en ese idioma; los códigos (`level`, `indicator`) no se traducen |
| Paginación | `?page=0&size=20&sort=recordedAt,desc` → respuesta paginada `{ content, page, size, totalElements, totalPages }` |
| Rango de fechas | `?from=…&to=…` (ISO-8601) |
| Recursos | Sustantivos en plural y kebab-case. Sin verbos en la URL, salvo acciones de estado: `/acknowledge`, `/complete`, `/close` |
| Métodos | `GET` lee · `POST` crea · `PATCH` cambia de estado · `PUT` reemplaza (solo el perfil activo). **No hay `PUT` ni `DELETE` para datos de salud** (BR-01) |
| IDs | Numéricos (`id: 42`), los asigna el servidor. Los `POST` que pueden venir de la cola offline aceptan `clientRef` (UUID generado en el front): si se reenvía el mismo `clientRef`, la API devuelve el registro existente con `200` y no lo duplica (BR-22) |
| Identificación | **MVP:** sin login. El tripulante va en la ruta (`/crew/{crewMemberId}/…`). Las acciones del CMO envían `X-Crew-Member-Id` y el service verifica `isCmo` (no es seguridad: es un prototipo). **Los endpoints de emergencia nunca exigen identificación** |
| CORS | Orígenes de `CORS_ALLOWED_ORIGINS` (`config/CorsConfig`) |

### 1.1 Códigos HTTP

| Código | Cuándo |
|---|---|
| `200 OK` | Lectura o cambio de estado correcto |
| `201 Created` | Recurso creado, con el encabezado `Location` |
| `204 No Content` | Acción sin cuerpo de respuesta |
| `400 Bad Request` | JSON mal formado o validación fallida (rango físico, campo obligatorio) |
| `403 Forbidden` | Acción reservada al CMO sin serlo |
| `404 Not Found` | No existe el tripulante, la alerta, la sesión… |
| `409 Conflict` | Transición de estado inválida (por ejemplo, cerrar una emergencia ya cerrada, o una EVA con precaución sin aprobación) |
| `422 Unprocessable Entity` | Regla de negocio incumplida (por ejemplo, `recordedAt` en el futuro, o una lectura sin ningún valor) |
| `500` | Error inesperado (nunca devuelve el stack trace) |

### 1.2 Formato de error (siempre igual, desde `GlobalExceptionHandler`)

```json
{
  "code": "READING_OUT_OF_RANGE",
  "message": "spo2Percent must be between 50 and 100",
  "fields": [{ "field": "spo2Percent", "error": "must be <= 100" }],
  "timestamp": "2026-11-14T15:30:00Z",
  "path": "/api/crew/3/vitals"
}
```

**Catálogo de `ErrorCode`:** `VALIDATION_ERROR`, `READING_OUT_OF_RANGE`, `EMPTY_READING`, `FUTURE_TIMESTAMP`, `CREW_MEMBER_NOT_FOUND`, `ALERT_NOT_FOUND`, `EMERGENCY_NOT_FOUND`, `INVALID_STATE_TRANSITION`, `INVALID_PROTOCOL_STEP`, `CMO_REQUIRED`, `CMO_APPROVAL_REQUIRED`, `PROFILE_NOT_FOUND`, `INTERNAL_ERROR`.

---

## 2. Objetos comunes (DTOs de respuesta)

| DTO | Campos |
|---|---|
| `LevelDto` | `level` (`NORMAL`, `CAUTION`, `ALERT`, `CRITICAL`, `NO_DATA`) |
| `RuleTraceDto` | `indicator`, `value`, `unit`, `threshold`, `rule` (`THRESHOLD`, `BASELINE`, `COMBINATION`, `PERSISTENCE`, `HYSTERESIS`, `FATIGUE_FACTOR`), `readingsUsed`, `sourceId`, `sourceTitle`, `hrpRisk`, `explanation` (texto en el idioma pedido) |
| `RecommendationDto` | `code`, `text`, `priority`, `sourceIds[]` |
| `CrewStatusResponse` | `crewMemberId`, `name`, `evaluatedAt`, `globalLevel`, `escalation`, `wellnessScore`, `levelsByIndicator` (mapa), `bodyStatus` (mapa de región a nivel), `traces[]`, `recommendations[]` (máximo 3), `activeAlerts[]`, `fatigueFactors[]`, `suggestedProtocol` (o null), `missionProfileCode` |
| `AlertResponse` | `id`, `crewMemberId` (o null), `moduleCode` (o null), `indicator`, `level`, `escalation`, `message`, `status`, `createdAt`, `acknowledgedAt`, `resolvedAt` |

---

## 3. Endpoints del MVP (Must)

### 3.1 Tripulación
| Método | Ruta | Request | Respuesta | Reglas |
|---|---|---|---|---|
| `GET` | `/crew` | — | `CrewMemberSummary[]`: id, name, missionRole, agency, isCmo, photoUrl, globalLevel | Para el **selector de tripulante** |
| `GET` | `/crew/{id}` | — | `CrewMemberResponse`: datos, `baseline`, `baselineSource`, `careerDoseMsv`, `careerLimitPercent`, `calorieTargetKcal` (EER de la NASA) | — |
| `PATCH` | `/crew/{id}/baseline` | `UpdateBaselineRequest`: los campos de línea base (opcionales) | `CrewMemberResponse` | Solo el CMO (`X-Crew-Member-Id`) → `baselineSource = MANUAL` (BR-10) |

### 3.2 Signos vitales
| Método | Ruta | Request | Respuesta | Reglas |
|---|---|---|---|---|
| `POST` | `/crew/{id}/vitals` | `CreateVitalReadingRequest`: `recordedAt?`, `heartRateBpm?`, `hrvRmssdMs?`, `systolicMmHg?`, `diastolicMmHg?`, `spo2Percent?`, `bodyTemperatureCelsius?`, `respiratoryRateRpm?`, `glucoseMgDl?`, `glucoseContext?`, `posture?`, `source`, `reminderId?` | `201` + `VitalReadingResponse`: la lectura + `status: CrewStatusResponse` | Rangos físicos · al menos un valor (BR-03) · contexto si hay glucosa (BR-04) · **dispara el triaje** (BR-02) · puntos si viene de un recordatorio |
| `GET` | `/crew/{id}/vitals` | `?from&to&page&size` | Página de `VitalReadingResponse` | Para las **gráficas** |

### 3.3 Autoevaluación
| Método | Ruta | Request | Respuesta | Reglas |
|---|---|---|---|---|
| `POST` | `/crew/{id}/self-assessments` | `CreateSelfAssessmentRequest`: `sleepHours?`, `hoursAwake?`, `workHours?`, `mood?`, `morale?`, `fatigue?`, `stress?`, `bedfordWorkload?`, `bored?`, `exerciseMinutes?`, `hydrationLiters?`, `caloriesKcal?`, `appetite?`, `dizzinessGrade?`, `visionChange?`, `notes?`, `reminderId?` | `201` + `{ selfAssessment, status: CrewStatusResponse, pointsEarned }` | Rangos de las escalas NASA (Bedford 1–10, mareo 0–3) · triaje · **puntos por completarla, sin importar los valores** (BR-13) |
| `GET` | `/crew/{id}/self-assessments` | `?from&to&page&size` | Página | — |

### 3.4 Estado y mapa corporal
| Método | Ruta | Respuesta | Uso |
|---|---|---|---|
| `GET` | `/status` | `CrewStatusResponse[]` (toda la tripulación) | Vista del CMO |
| `GET` | `/crew/{id}/status` | `CrewStatusResponse` (incluye `traces` para D1) | Pantalla principal y `WhyPanel` |
| `GET` | `/crew/{id}/body-status` | `{ regions: [{ region, level, indicators[], topTrace }] }` | `BodyFigure` |
| `GET` | `/crew/{id}/triage-history` | Página de resultados (nivel global por fecha) | Gráfica de evolución |

### 3.5 Alertas
| Método | Ruta | Request | Respuesta | Reglas |
|---|---|---|---|---|
| `GET` | `/alerts` | `?status=ACTIVE&crewMemberId=` | `AlertResponse[]` | — |
| `PATCH` | `/alerts/{id}/acknowledge` | Encabezado `X-Crew-Member-Id` | `AlertResponse` | `ACTIVE → ACKNOWLEDGED`; si no, `409` (máquina de estados) |

### 3.6 Emergencias (**sin identificación**)
| Método | Ruta | Request | Respuesta | Reglas |
|---|---|---|---|---|
| `POST` | `/emergencies` | `StartEmergencyRequest`: `protocol` (`P1`, `P2`, `P3`, `P4`), `patientId?`, `reportedById?`, `moduleCode?` | `201` + `EmergencyStepResponse`: `sessionId`, `step` (id, type, text, opciones), `gravityVariant`, `metronomeBpm` (`CMO_CONFIGURABLE`) | Abre la sesión `OPEN`; avisa a la tripulación (BR-08) |
| `POST` | `/emergencies/{id}/steps` | `EmergencyAnswerRequest`: `stepId`, `answer` (`YES`, `NO`, `DONE`, `SKIPPED`), `vitals?` | `EmergencyStepResponse` (el siguiente paso) o `{ finished: true }` | El `stepId` debe ser el paso actual; si no, `409 INVALID_PROTOCOL_STEP` · bitácora con hora · un 🔴 crea alerta + mensaje a la Tierra (BR-18) |
| `PATCH` | `/emergencies/{id}/close` | `{ status: CLOSED o CANCELLED, outcomeNote? }` | `EmergencySessionResponse` | Solo desde `OPEN` |
| `GET` | `/emergencies/{id}` | — | Sesión + bitácora completa | — |

### 3.7 Contenido y configuración (lectura)
| Método | Ruta | Respuesta | Uso |
|---|---|---|---|
| `GET` | `/config` | **Todos** los JSON en un solo paquete: `{ rulesVersion, thresholds, guides, protocols, bodyMap, countermeasures, evaCriteria, achievements, missionProfiles, sources, features }` | **Caché offline** del front (`localStorage`) + intérprete de `src/engine` |
| `GET` | `/guides`, `/guides/{indicator}` | Fichas de medición | `MeasurementGuide` |
| `GET` | `/countermeasures` | Catálogo | Recomendaciones |
| `GET` | `/sources` | Fuentes + riesgos del HRP | `WhyPanel` |
| `GET` | `/features` | Mapa de *feature flags* | Ocultar lo desactivado |
| `GET` | `/health` | `{ status: "UP", rulesVersion }` | Verificar que el servidor responde (modo offline) |

---

## 4. Endpoints de las Olas 2 y 3

| Prioridad | Método y ruta | Notas |
|---|---|---|
| Should-A · D3 | `POST /crew/{id}/symptoms` · `GET /crew/{id}/symptoms` · `PATCH /symptoms/{id}/resolve` | Pecho ≥ 7, o pecho + falta de aire o sudor → `suggestedProtocol: "P1"` |
| Should-A · D4 | `POST /crew/{id}/eva-assessments` (`type`: `PRE_EVA`, `POST_EVA`, `GRAVITY_TRANSITION`) · `GET /crew/{id}/eva-assessments/latest` · `PATCH /eva-assessments/{id}/approve` (CMO) | `FIT_WITH_CAUTION` sin aprobación → `409 CMO_APPROVAL_REQUIRED` (BR-15) |
| Should-A · D11 | `POST /crew/{id}/vigilance-tests` · `GET /crew/{id}/vigilance-tests` | Devuelve `scorePercent` frente a la línea base |
| Should | `GET /mission-profiles` · `GET /mission-profiles/active` · `PUT /mission-profiles/active` `{ code }` | Re-evalúa a toda la tripulación (BR-07) |
| Should | `POST /environment` · `GET /environment/latest` · `GET /environment?module&from&to` | Dosis acumulada (BR-09) y alerta por módulo |
| Should | `GET /crew/{id}/reminders` · `PATCH /reminders/{id}/complete` · `PATCH /reminders/{id}/snooze` | Máquina de estados (BR-12) |
| Should | `GET /crew/{id}/progress` · `GET /achievements` | Gamificación |
| Should | `GET /crew/{id}/improvement-goals` | Plan semanal |
| Could-A · D8 | `GET /crew/{id}/trends` | `TrendSignal[]` |
| Could-A · D10 | `GET /emergencies/{id}/report?format=sbar` · `GET /alerts/{id}/report?format=sbar` | Reporte SBAR |
| Could | `GET /earth-queue` | Mensajes con su `deliverAt` |
| Could | `GET /simulation/scenarios` · `POST /simulation/scenarios/{name}/start` · `POST /simulation/stop` | Simulador |

---

## 5. Ejemplo de flujo completo (demo)

1. `GET /config` → el front lo guarda en `localStorage`.
2. `GET /crew` → el selector muestra a los 4 tripulantes.
3. `GET /crew/2/status` → el cerebro aparece en 🟡 (poco sueño); `traces[0]` explica la regla y la fuente.
4. `POST /crew/3/self-assessments` → `201`, con `pointsEarned: 5`.
5. `POST /emergencies { "protocol": "P1", "patientId": 4 }` → `201`, paso `P1-02`.
6. `POST /emergencies/7/steps { "stepId": "P1-02", "answer": "NO" }` → paso `P1-04`… y así hasta el final.
7. **Wifi apagado:** el front sigue el árbol desde `localStorage` con su intérprete y, al volver la conexión, envía los pasos que quedaron en cola.
