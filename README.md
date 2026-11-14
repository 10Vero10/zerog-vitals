# ZeroG Vitals

> **Herramienta visual para que los astronautas evalúen su propia salud, reciban orientación y sean guiados en emergencias, sin depender de la Tierra.**
> *Visual health self-assessment tool for astronauts, offline-first, linked to NASA HRP risks.*

NASA International Space Apps Challenge 2026 · Reto *"Create Health Monitoring Software for Astronauts on Space Missions"* (Agencia Espacial Brasileña) · Sede Medellín (ITM).

> ⚠️ **Prototipo. No es un dispositivo médico.** No diagnostica ni indica medicamentos: orienta, registra, explica y escala según el protocolo de la misión o la indicación del oficial médico de la tripulación (CMO).

---

## El problema

*"Imagina que estás a mitad de camino a Marte. Tu compañero siente un dolor agudo en el pecho y se desploma. ¿Qué deberías hacer?"*

La comunicación con la Tierra tarda hasta 20 minutos y los astronautas no son médicos. ZeroG Vitals les explica **cómo medir**, **por qué importa en el espacio** y **qué hacer** si un valor no es normal, y los guía paso a paso en una emergencia, incluso sin conexión.

## Capturas

*(Se agregan al final de la hackatón.)*

## Funcionalidades (MVP)

- Selector de tripulante sin contraseña y vista del CMO.
- Autoevaluación guiada con fichas de medición.
- Triaje con colores (🟢 Normal · 🟡 Precaución · 🟠 Alerta · 🔴 Crítico · ⚪ Sin datos), escalamiento y explicación **"¿por qué estoy en este color?"** con su regla y su fuente NASA.
- Mapa corporal interactivo de 11 regiones.
- Gráficas de sueño y frecuencia cardíaca frente a la línea base personal.
- Emergencia **P1** (dolor en el pecho o colapso) paso a paso, con metrónomo y bitácora; **funciona sin conexión**.
- Contramedidas por indicador.
- Español e inglés. Funcionalidades opcionales detrás de *feature flags*.

## Cómo correrlo

Requisitos: Docker Desktop.

```bash
cp .env.example .env
```

```bash
docker compose up --build
```

| Servicio | URL |
|---|---|
| Frontend | http://localhost:3000 |
| API | http://localhost:8080/api |
| Swagger | http://localhost:8080/swagger-ui.html |

**Desarrollo diario** (más rápido): levanta solo la base de datos con Docker y corre el backend y el frontend en local.

```bash
docker compose up postgres
```

```bash
cd backend && ./mvnw spring-boot:run
```

```bash
cd frontend && npm install && npm run dev
```

## Arquitectura

```
frontend (React + TS)  ──HTTP /api──►  backend (Spring Boot 3, Java 21)  ──JPA──►  PostgreSQL 16
   │  caché offline (localStorage)          controller → service → (domain, repository) → entity
   └─ intérprete de protocolos (src/engine)  reglas y contenido en resources/data/*.json
```

- **Offline-first:** el servidor representa el computador del hábitat. El frontend descarga `GET /api/config` y lo guarda en `localStorage`; la emergencia sigue funcionando aunque la API caiga.
- **`domain` en Java puro** (sin Spring ni JPA), verificado con ArchUnit.
- **Sin umbrales ni textos en el código:** todo sale de JSON con su `sourceId` de la NASA, o `CMO_CONFIGURABLE`.
- Detalle en [`docs/ZeroG_Vitals_SPEC.md`](docs/ZeroG_Vitals_SPEC.md), [`docs/ZeroG_Vitals_Modelo_Datos.md`](docs/ZeroG_Vitals_Modelo_Datos.md) y [`docs/ZeroG_Vitals_API_REST.md`](docs/ZeroG_Vitals_API_REST.md).

## Fuentes NASA

- Riesgos del **Programa de Investigación Humana (HRP)** de la NASA (*Human Research Roadmap*), por ejemplo *"Earth independent human-systems operation"* y *"Risk of performance decrements and adverse health outcomes resulting from sleep loss, circadian desynchronization, and work overload"*.
- **NASA-STD-3001** y *technical briefs* de la **OCHMO** (CO₂, ambiente del hábitat, radiación, sueño).
- *NASA Open Science Data Repository (OSDR)*.

La lista completa, con un identificador por fuente, está en [`docs/ZeroG_Vitals_Paquete_Contenido.md`](docs/ZeroG_Vitals_Paquete_Contenido.md) (sección 9).

## Uso de Inteligencia Artificial

Este proyecto se desarrolló con **Claude (Anthropic)** como asistente durante la hackatón:

- **Planificación y arquitectura:** apoyo en el diseño de la arquitectura en capas, el modelo de datos y las reglas de triaje (antes del evento, solo en documentos).
- **Generación de código:** la mayor parte del código del backend (Spring Boot) y del frontend (React) se generó con Claude Code a partir de instrucciones del equipo. Cada cambio fue revisado y probado por un integrante antes del commit. Los commits asistidos llevan la marca `Co-Authored-By: Claude`.
- **Contenido:** apoyo en la redacción y traducción de las guías de medición, protocolos y contramedidas. Los umbrales y pasos médicos provienen de las fuentes citadas en `docs/` y fueron verificados por el equipo.
- **Lo que hizo el equipo:** la definición del problema, las decisiones de diseño, la validación del contenido de salud, la revisión y prueba del código, la interfaz, el pitch y el video.
- **Limitaciones:** ZeroG Vitals es un prototipo. No es un dispositivo médico ni reemplaza el criterio de profesionales de la salud.

## Equipo

| Integrante | Rol |
|---|---|
| Verónica Padilla (UPC) | Líder técnica · base de datos · motor de triaje · emergencia |
| Elimar Álvarez | Backend: API, servicios y contenido · pitch |
| Rafael Valencia | Frontend: autoevaluación, mapa corporal y gráficas · video |

## Licencia

[MIT](LICENSE) © 2026 ZeroG Vitals team.
