# 🚀 Proyecto ZeroG Vitals — NASA International Space Apps Challenge 2026

**Participante:** Verónica Giseth Padilla Maestre (ID: 159)

**Institución de Origen:** Universidad Popular del Cesar (UPC) — Ingeniería de Sistemas

**Equipo:** ZeroG Vitals

**Sede Presencial:** Institución Universitaria ITM, Campus Fraternidad (Medellín, Colombia)

**Fechas:** Sábado 14 y Domingo 15 de Noviembre de 2026 (48 horas continuas)

---

## 🌍 1. Contexto Global y Local de la Hackatón

### ¿Qué es el NASA Space Apps Challenge?
El **NASA International Space Apps Challenge** es la hackatón internacional de ciencia y tecnología más grande del mundo. Es una iniciativa liderada por la División de Ciencias de la Tierra de la **NASA** en colaboración con agencias espaciales aliadas a nivel mundial (como la ESA, JAXA, CSA, entre otras). 

* **Propósito:** Convocar a estudiantes, desarrolladores, ingenieros, científicos y creativos a resolver desafíos del mundo real utilizando datos abiertos (*open data*) de la NASA.
* **Dinámica:** Un maratón intensivo de **48 horas continuas** de desarrollo, diseño y resolución de problemas.
* **Organización Local (Medellín):** Liderada por la **Corporación UGAC** (Local Lead) en alianza con la **Institución Universitaria ITM** (Campus Fraternidad, centro cultural y observatorio astronómico).
* **Demografía Local:** La sede presencial de Medellín cuenta con **162 participantes aceptados** (distribuidos aproximadamente en 60% hombres y 40% mujeres), provenientes de diversas universidades e instituciones del país.

---

## 📄 2. Información General del Desafío

* **Nombre del Reto:** *Create Health Monitoring Software for Astronauts on Space Missions*
* **Categoría:** Exploración Humana y Software Médico Espacial
* **Autor del reto:** Agencia Espacial Brasileña (AEB). Lo presenta en el video oficial su presidente interino, Rodrigo Leonardi (video publicado el 3 de noviembre de 2026).
* **Plataforma Oficial:** NASA Space Apps Challenge (EarthData NASA)

### 🎬 Lo que pide el video oficial

> *"Imagina que estás a mitad de camino a Marte. Tu compañero siente un dolor agudo en el pecho y se desploma. ¿Qué deberías hacer?"*

* Ayudar a los astronautas a **evaluar su propia salud** y **guiarlos en emergencias**.
* Los astronautas **no son médicos**: explicar **cómo tomar cada medición**, **por qué importa** y **qué hacer** si un valor no es normal.
* Ir más allá: **recordar** a la tripulación que tome las medidas y **adaptarse al entorno** (nave espacial, estación espacial, base lunar).
* Fuentes sugeridas: el **Programa de Investigación Humana (HRP)** y el **Repositorio de Ciencia Abierta (OSDR)** de la NASA.
* Valor en la Tierra: herramientas de salud para **comunidades remotas** con poco acceso a servicios médicos.

📄 *El análisis completo del video y del enunciado oficial (7 nov) está en la sección 0 de `ZeroG_Vitals_Plan_Equipo.md` (0.1–0.8 video, 0.9 enunciado): requisitos, perfiles de misión, guías de medición, modo emergencia, módulos nuevos, prioridades MoSCoW y guion de la demo.*

### 💥 Factores de Riesgo Ambientales en Misiones Espaciales

El Programa de Investigación Humana (HRP) de la NASA identifica **cinco peligros** del vuelo espacial humano (según el enunciado oficial):

1. **Radiación espacial** (dosis acumulada y eventos solares).
2. **Aislamiento y confinamiento** (espacios reducidos compartidos y salud conductual).
3. **Distancia de la Tierra** (retraso en las comunicaciones y evacuación imposible o muy lenta).
4. **Campos de gravedad** (microgravedad, gravedad lunar o marciana: cambios cardiovasculares, óseos y musculares).
5. **Ambientes cerrados hostiles** (calidad del aire, CO₂, temperatura y microbiología del hábitat).

### 🏥 Afecciones y Problemas de Salud Provocados

* **Cambios en el sistema inmunológico:** Inmunosupresión, reactivación de virus latentes.
* **Pérdida de densidad ósea y masa muscular:** Desmineralización acelerada.
* **Eventos cardiovasculares:** Atrofia miocárdica, arritmias, alteración del volumen plasmático.
* **Problemas de salud conductual:** Estrés, desórdenes del sueño, ansiedad por confinamiento.
* **Nutrición inadecuada:** déficit calórico, deshidratación y alteraciones metabólicas (por ejemplo, resistencia a la insulina).

### 🎯 Objetivo Exacto de la Solución (enunciado oficial, 7 de noviembre)

> *"Crear una **herramienta visual** que ayude a los astronautas a evaluar su propia salud durante misiones espaciales y que brinde **orientación sobre tratamientos y mejoras de salud**."*

Lo que debe hacer ZeroG Vitals:

1. **Autoevaluación guiada:** cómo medir, por qué importa, cómo afectan los peligros del espacio y qué hacer si el valor no es normal.
2. **Visualización clara:** mapa corporal interactivo, código de colores y gráficas dinámicas.
3. **Tratamientos y mejoras:** contramedidas por riesgo y un plan de mejora semanal.
4. **Escalamiento:** decir cuándo avisar al oficial médico de la tripulación y cuándo a los cirujanos de vuelo en Tierra.
5. **Emergencias:** guía paso a paso, por ejemplo para dolor en el pecho o colapso (escenario del video).
6. **Rutina y motivación:** recordatorios de medición y gamificación.
7. **Adaptación al entorno:** estación, nave, rover, base lunar o marciana. Operación *offline-first*.

**MVP (Must):** autoevaluación guiada (incluye glucosa y ánimo) · triaje con colores y escalamiento · **mapa corporal interactivo** · gráficas dinámicas · modo emergencia "dolor en el pecho / colapso" · contramedidas básicas · funcionamiento offline.

**Diferenciadores (agregados el 8 de noviembre)**, construidos por oleadas y con *feature flags*:

* **D1** Explicación "¿por qué estoy en este color?", con su fuente (Must).
* **D2** Lentes de los 5 peligros en el mapa corporal.
* **D3** Mapa de dolor y síntomas.
* **D4** Aptitud para caminata espacial (EVA): APTO / NO APTO.
* **D5** Voz manos libres en emergencias.
* **D6** Bilingüe español / inglés (la estructura es Must).
* **D7** Proyección de la misión: "¿qué pasa si…?".
* **D8** Alerta temprana por tendencia personal.
* **D9** Interfaz que se adapta al cansancio.
* **D10** Reporte SBAR para médicos en Tierra.

📄 *El detalle está en la sección 0.10 del plan. El estado de lo que falta está en la sección 0.11.*

---

## 🏗️ 3. Arquitectura Técnica y Estrategia de Desarrollo

### 💻 Stack Tecnológico (decidido el 3 de noviembre de 2026)

* **Frontend:** React + TypeScript + Vite + Tailwind CSS. La interfaz debe ser limpia, muy visible y fácil de usar bajo estrés o fatiga.
* **Backend:** **Java 21 + Spring Boot 3 + Maven** (sin Spring Security ni MapStruct en el MVP, para ganar tiempo), con paquetes por capa (config, controller, dto, entity, exception, mapper, repository, security, service) más `domain` y `simulation`.
* **Base de datos:** PostgreSQL 16, con Spring Data JPA y migraciones con Flyway.
* **Infraestructura:** Docker + docker-compose para levantar Postgres, la API y el front con un solo comando. Opcionalmente, una demo pública en Render + Neon.
* **Offline-first:** el servidor representa el computador del hábitat, no un servidor en la Tierra. Las reglas (umbrales, guías, protocolos y perfiles) viven en archivos JSON. El frontend los descarga, los guarda en localStorage y los interpreta, así que el modo emergencia funciona aunque la API no responda.
* **Asistente de desarrollo:** Claude (Anthropic), como apoyo en la arquitectura, la estructuración de la lógica y la generación de código.

### 🧱 Arquitectura en Capas (resumen)

| Capa | Responsabilidad |
|---|---|
| **Controller** | Rutas HTTP. Recibe la petición, valida y responde. No contiene lógica de negocio. |
| **DTO + Validación** | Objetos de entrada y salida de la API. Rechaza datos imposibles. |
| **Service** | Coordina cada caso de uso: guardar → triar → generar alertas. |
| **Dominio (motor de triaje)** | Reglas puras, sin base de datos ni HTTP. Se comparte con el frontend para el modo offline. |
| **Repository** | Consultas a PostgreSQL. |
| **Entity** | Tablas: CrewMember, VitalReading, EnvironmentReading, SelfAssessment, TriageResult, Alert y ThresholdOverride (opcional). |
| **Transversal** | Configuración de umbrales (`thresholds.json`), mappers y manejo global de errores. |

**Módulos:** crew, vitals, environment, self-assessment, triage, alerts y simulation.
📄 *El detalle está en la sección 4 de `ZeroG_Vitals_Plan_Equipo.md`: la estructura completa del repositorio (4.4), los endpoints, las entities, el flujo de una lectura y la implementación en Spring Boot.*

### 🤖 Uso de Inteligencia Artificial: todo el desarrollo con Claude

* **Decisión:** todo el desarrollo se hará con **Claude (Anthropic)**: Claude Code para el código y Claude en el navegador para contenido, traducciones y el guion. El equipo **dirige, revisa, prueba y entiende** todo lo que se entrega.
* **Permisibilidad:** ⏳ confirmar en spaceappschallenge.org la política de uso de IA de 2026 (qué está permitido y cómo declararlo).
* **Requisito:** declaración transparente en el `README.md` (la plantilla está en la sección 0.13.6 del plan) y commits asistidos marcados con `Co-Authored-By: Claude`.
* **Preparación (sin código):** el plan, un borrador de `CLAUDE.md`, una biblioteca de prompts por oleada, el documento de contenido validado y la tabla de casos de prueba.
* **Riesgos clave:** caída del wifi (llevar datos móviles), límites de uso del plan y contenido médico inventado (todo sale de fuentes validadas).
* **Criterio de evaluación:** los jurados priorizan la lógica del triaje, el uso de datos de la NASA, la usabilidad de la interfaz y la efectividad del prototipo. El equipo debe poder explicar cada parte.

📄 *El detalle está en la sección 0.13 del plan.*

---

## 📊 4. Datos e Indicadores de Salud a Monitorear

### Indicadores Biométricos y Ambientales

* **Signos Vitales:** Frecuencia cardíaca (HR), variabilidad de la frecuencia cardíaca (HRV), presión arterial, saturación de oxígeno ($SpO_2$), temperatura corporal y **glucosa en sangre (mg/dL)**.
* **Parámetros Ambientales:** Dosis de radiación acumulada ($mSv$), concentración de $CO_2$, temperatura y humedad del hábitat.
* **Salud Conductual / Fisiológica:** Horas y calidad del sueño, **estado de ánimo (1–5)**, fatiga y estrés reportados, ingesta calórica, hidratación y **minutos de ejercicio**.
* **Entrada de datos:** teclado y clics (mediciones guiadas). Opcionalmente, fotos de cámara adjuntas, sin análisis automático. **No se requiere hardware.**

### Fuentes de Datos de la NASA

* *NASA Human Research Roadmap (HRR)*
* *NASA Open Data Portal (`data.nasa.gov`)*
* *NASA Open Science Data Repository (OSDR)* y *Life Sciences Data Archive (LSDA)*, que conviene revisar antes del evento.
* *NASA-STD-3001* (technical briefs de OCHMO): límites de CO₂, ambiente del hábitat y radiación.
* Datos simulados/sintéticos en formato JSON para pruebas offline durante la hackatón.
* ⏳ **Recursos oficiales del reto: llegan el 13 de noviembre.**

### 🚦 Funcionamiento por Defecto (resumen del triaje)

* **Cuatro niveles:** 🟢 Normal · 🟡 Precaución · 🟠 Alerta · 🔴 Crítico · ⚪ Sin datos.
* **Estado global = el peor nivel individual.** Si 3 o más indicadores están en Precaución, el estado sube a Alerta.
* **Persistencia:** Precaución y Alerta solo se activan con 2 lecturas consecutivas. Un Crítico de sensor se confirma con una nueva lectura, salvo los de radiación y CO₂, que alertan de inmediato. Para bajar de nivel se necesitan 3 lecturas consecutivas.
* **Valores clave con fuente NASA:**
  * CO₂ en cabina: máximo **3 mmHg** de promedio por hora (NASA-STD-3001 V2 6004).
  * Temperatura del hábitat: **20–25 °C**; humedad: **30–60 %** (zona de desempeño).
  * Radiación: límite de carrera de **600 mSv**, máximo de **250 mSv** por evento solar y unos **0.5 mSv/día** típicos en la ISS.
* ⚠️ Los rangos de signos vitales son clínicos estándar y **faltan validar con fuentes citables**.
* ⚠️ Los umbrales son referenciales para el prototipo y **no constituyen un diagnóstico médico**.

📄 *Las tablas completas de umbrales, las reglas L1–L12 y los casos de prueba están en las secciones 3 y 5 de `ZeroG_Vitals_Plan_Equipo.md`.*

---

## 🛠️ 5. Normativa Logística y Reglas del Evento

### 📍 Datos de la Sede Presencial

* **Lugar:** ITM Campus Fraternidad (Calle 54A # 30-01, Centro Cultural, Medellín).
* **Horario:** Inicio Sábado 14 de Noviembre a las 9:00 a.m. (Duración: 48 horas continuas).
* **Acreditación:** Manilla/brazalete Tyvek inviolable o escarapela con *lanyard* oficial.

### 🛡️ Política para Participantes Menores de Edad

* Al ser menor de edad (16 años), la organización **autoriza el registro y acompañamiento presencial de un docente tutor / profesor acompañante de la UPC** como acudiente responsable dentro del campus.
* Se restringe el acceso únicamente a visitantes generales o familiares no acreditados.

### 🎒 Elementos Indispensables para Llevar

1. Documento de identidad (Tarjeta de Identidad / Cédula).
2. Computador portátil con cargador y extensión / multitoma eléctrica (con JDK 21, IntelliJ IDEA, Node LTS, Docker Desktop, Git y VS Code ya instalados y probados).
3. Sleeping bag o cobija (si se planea descansar en la zona habilitada del campus).
4. Kit de aseo personal y ropa cómoda.

---

## 📌 6. Entregables Oficiales de la Hackatón

Para completar la entrega del proyecto el domingo antes del cierre de la plataforma global:

1. **Repositorio de GitHub Público:** Código fuente estructurado, historial de commits durante las 48h y archivo `README.md` detallado.
2. **Video de Presentación (Pitch):** video corto que muestra el prototipo en funcionamiento. ⏳ *La duración y el formato exactos están por confirmar en los lineamientos oficiales de 2026. En ediciones anteriores se pedía un video de unos 30 segundos o una presentación corta.*
3. **Ficha del Proyecto:** Formulario completado en la plataforma `spaceappschallenge.org` bajo el equipo **ZeroG Vitals**.

---

## 👥 7. Organización del Equipo (se forma en la sede, de 1 a 6 integrantes)

> ✅ **Equipo (3 integrantes, actualizado el 14 de noviembre):** Verónica Padilla (líder técnica, base de datos, motor de triaje y emergencia de punta a punta), Elimar Álvarez (backend: API, servicios, contenido JSON y guion del pitch) y Rafael Valencia (frontend: base, autoevaluación, mapa corporal, gráficas y video). Alcance: **MVP recortado** (sección 14.1 del SPEC).

> **Situación:** Verónica llega sin equipo y lo formará en el ITM. Antes del evento **no se escribe código**: se prepara el plan y el contenido. Los roles se asignan en la hora 0 con una encuesta de habilidades, y **el alcance se ajusta al tamaño del equipo** (sección 0.12 del plan).

| # | Rol | Puntos clave |
|---|---|---|
| 1 | **Líder técnico / DevOps** | Repositorio, docker-compose, revisión de PRs, integración y control del tiempo. |
| 2 | **Backend: API y base de datos** | Controllers, DTOs, Repositories, Entities y migraciones. |
| 3 | **Backend: motor de triaje y simulador** | Reglas del dominio, escenarios de demo y casos de prueba. |
| 4 | **Frontend: dashboard** | Tarjetas con semáforo, gráficas y panel de alertas. |
| 5 | **Frontend / UX: autoevaluación** | Diseño en Figma, formulario de autoevaluación, recomendaciones y accesibilidad. |
| 6 | **Datos NASA, documentación y pitch** | Validación de umbrales, README con declaración de uso de IA, video y ficha del proyecto. |

* **Con 5 personas:** el rol 6 se reparte entre los roles 1, 3 y 5.
* **Con 4 personas:** A = Líder + README · B = Backend completo · C = Frontend + simulador · D = UX + datos NASA + video.
* **Cronograma de las 48 h:** setup (0–2 h) → MVP (2–12 h) → demo de extremo a extremo (hora 24) → pulido (24–36 h) → documentación y video (36–44 h; el código se congela en la hora 42) → envío (44–48 h).

---

## 📅 8. Plan de Preparación (sin código hasta el 14 de noviembre)

| Fechas | Objetivo | Estado |
|---|---|---|
| 1–3 nov | Confirmar integrantes y roles, decidir el lenguaje del backend (✅ Java + Spring Boot) e instalar el entorno | ⏳ |
| 4–7 nov | Validar los umbrales de signos vitales con fuentes y aprobar las reglas L1–L12 | ⏳ |
| 8–10 nov | Tabla de unos 30 casos de prueba, especificación de escenarios y catálogo de recomendaciones | ⏳ |
| 11–12 nov | Guion de la demo, bocetos de interfaz y logística de viaje a Medellín | ⏳ |
| 13 nov | Recibir los recursos NASA: inventario → lectura en paralelo → reunión de decisión → congelar el alcance | ⏳ |
| 14–15 nov | **Hackatón: 48 h de desarrollo** | — |

**Principio clave:** los recursos del 13 de noviembre solo deben cambiar configuración y datos (umbrales, fuentes, datasets en modo *replay*), nunca la arquitectura.

---

## 📎 9. Documentos Relacionados

* **`ZeroG_Vitals_Plan_Equipo.md`:** especificación detallada del stack, roles, tablas completas de umbrales, arquitectura en capas, reglas de lógica, casos de prueba, protocolo del 13 de noviembre y fuentes.