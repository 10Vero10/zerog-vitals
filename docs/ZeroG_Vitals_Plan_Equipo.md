# 🛰️ ZeroG Vitals: Plan de Equipo y Especificación Funcional

> ⚠️ **Documento HISTÓRICO** (31 oct – 13 nov). Contiene decisiones que luego se reemplazaron. **La fuente de verdad es `ZeroG_Vitals_SPEC.md`** y, para el contenido, `ZeroG_Vitals_Paquete_Contenido.md`.

> Documento de preparación previo a la hackatón (sin código).
> Todo el código se escribirá dentro de las 48 h del evento (14 y 15 de noviembre de 2026).

---

## 0. Lo que pide el video oficial del reto (publicado el 3 de noviembre)

> **Autor del reto:** Agencia Espacial Brasileña (AEB), presentado por Rodrigo Leonardi, presidente interino.
> **Escenario del video:** *"Estás a mitad de camino a Marte. Tu compañero siente un dolor agudo en el pecho y se desploma. ¿Qué está pasando? ¿Qué deberías hacer?"*

### 0.1 Requisitos del video y cómo los cubre el plan

| # | Lo que dice el video | ¿Estaba en el plan? | Qué cambia |
|---|---|---|---|
| R1 | Ayudar a los astronautas a **evaluar su propia salud** | ✅ Parcial (autoevaluación y triaje) | Se mantiene. La autoevaluación pasa a ser el **flujo principal**, no un formulario secundario. |
| R2 | **Orientación sobre qué hacer en una emergencia** | ❌ No | ➕ **Nuevo módulo `emergency`:** protocolos paso a paso (sección 0.4). |
| R3 | "Los astronautas **no son médicos**" | ⚠️ Implícito | Todo el lenguaje debe ser sencillo, sin jerga médica, con un paso por pantalla. |
| R4 | Explicar **cómo tomar cada medición** | ❌ No | ➕ **Nuevo módulo `guidance`:** guía de medición por indicador (sección 0.3). |
| R5 | Explicar **por qué importa** cada medición | ❌ No | Cada guía incluye "por qué importa en el espacio", ligado a un riesgo del Programa de Investigación Humana (HRP). |
| R6 | Explicar **qué hacer si un valor no es normal** | ✅ Parcial (sección 3.6) | Se amplía el catálogo de recomendaciones: una por indicador y por nivel. |
| R7 | **Recordar** a la tripulación que tome las medidas | ❌ No | ➕ **Nuevo módulo `reminders`:** agenda de mediciones por tripulante. |
| R8 | Adaptarse a **nave espacial, estación espacial o base lunar** | ❌ No | ➕ **Nuevo módulo `mission-profile`:** perfiles de entorno (sección 0.2). |
| R9 | Usar el **Programa de Investigación Humana (HRP)** de la NASA | ✅ Sí (Human Research Roadmap) | Citar los riesgos del HRP en cada guía de medición. |
| R10 | Usar el **Repositorio de Ciencia Abierta (OSDR)** de la NASA | ✅ Sí (sección 5.3) | Se confirma el modo *replay* y la inspiración para escenarios. |
| R11 | Aplicación en la Tierra: **comunidades remotas** con poco acceso a salud | ❌ No | ➕ Ángulo para el pitch (sección 0.7). |

### 0.2 Perfiles de misión (entornos)

El mismo software se comporta distinto según dónde esté la tripulación. Un perfil cambia la gravedad, la autonomía, los umbrales de radiación y los pasos de emergencia.

| Perfil | Gravedad | Retraso de comunicación con la Tierra (un sentido) | Evacuación a la Tierra | Radiación (factor frente a la ISS, R6) | Consecuencia en la app |
|---|---|---|---|---|---|
| **Estación espacial (órbita baja, tipo ISS)** | Microgravedad | Casi en tiempo real | Horas | **1×** (referencia: ~0.5 mSv/día) | Se puede consultar a la Tierra; la app apoya. |
| **Nave en tránsito a la Luna** | Microgravedad | ~1.3 s | ~3 días | **2–3×** (espacio profundo) | Consulta posible; la evacuación es lenta. |
| **Base en la superficie lunar** | 1/6 g (0.16 g) | ~1.3 s | ~3 días | **~1.5×** | RCP en el suelo; el polvo lunar es un riesgo extra. |
| **Nave en tránsito a Marte** (escenario del video) | Microgravedad | **Hasta 20 min** (NASA, R7) | **Imposible (meses)** | **2–3×**. Es la fase de **mayor dosis** de la misión | **Autonomía total:** la app es la única guía inmediata. |
| **Base en Marte** (opcional) | 0.38 g (~1/3 g) | Hasta 20 min (R7) | Imposible | **~1×** (la atmósfera y el planeta protegen) | Autonomía total. |

Los **factores de radiación** vienen de la NASA (recurso R6, podcast HWHAP ep. 57, 2018): en la Luna, unas 1.5 veces la tasa de la ISS; en el espacio profundo, de 2 a 3 veces; en la superficie de Marte, una tasa parecida a la de la ISS. La tasa base de la ISS (~0.5 mSv/día) viene de PTB y PMC (sección 7). *Actualizado el 13 de noviembre: reemplaza los valores anteriores marcados con ⚠️.* Los retrasos y tiempos de evacuación siguen ⚠️ por verificar.

**Impactos en la lógica:**
- **Radiación:** el umbral Normal de dosis diaria **depende del perfil**. En tránsito a Marte, una tasa de 2 a 3 veces la de la ISS es lo esperado, no una alerta. La regla pasa a ser: nivel según el múltiplo de la tasa base del perfil (por ejemplo, Precaución con más de 1.5× y Crítico con más de 10× o un evento solar).
- **Emergencias:** los pasos de RCP y de inmovilización cambian según la gravedad del perfil.
- **Mensajes:** con un retraso de minutos, la app no dice "llame a control de misión"; dice "avise al oficial médico de la tripulación (CMO) y envíe el reporte. La respuesta tardará unos 40 min (ida y vuelta)".
- **Entity nueva:** `MissionProfile` (nombre, gravedad, retraso, tiempo de evacuación, tasa base de radiación, equipo médico disponible). Se cambia en vivo durante la demo.

### 0.3 Guías de medición (módulo `guidance`)

Cada indicador tiene una **ficha de guía** guardada como configuración (`measurement-guides.json`). Rol 6 redacta el contenido y Rol 5 lo diseña.

| Campo de la ficha | Ejemplo: SpO₂ (saturación de oxígeno) |
|---|---|
| **Qué es** (en una frase) | Cuánto oxígeno lleva tu sangre. |
| **Equipo** | Oxímetro de pulso (pinza en el dedo). |
| **Cómo medir (pasos)** | 1. Quédate quieto 1 minuto. 2. Fija los pies o el cuerpo (en microgravedad). 3. Pon la pinza en el dedo índice, sin esmalte. 4. Espera a que el número deje de cambiar (unos 30 s). 5. Ingresa el valor o confirma la lectura automática. |
| **Errores comunes** | Mover la mano, tener los dedos fríos, colocar mal el sensor. |
| **Por qué importa en el espacio** | Una falla del soporte vital, la acumulación de CO₂ o un problema pulmonar bajan el oxígeno, y la hipoxia afecta el juicio sin que lo notes. (Riesgo del HRP relacionado: atmósfera de la cabina y condiciones médicas en la misión.) |
| **Valores normales** | 95–100 % |
| **Qué hacer si no es normal** | Según el nivel de la sección 3.2 y las recomendaciones de la sección 3.6. |
| **Frecuencia recomendada** | Diaria en reposo, y de inmediato si hay síntomas. Alimenta el módulo `reminders`. |

**Otra ficha de ejemplo: presión arterial en microgravedad.**
1. Descansa 5 minutos con los pies fijos en los anclajes.
2. Ponte el brazalete en el brazo izquierdo, a la altura del corazón.
3. No hables durante la medición.
4. Toma 2 lecturas con 1 minuto de diferencia y registra el promedio.

**Por qué importa:** en el espacio los líquidos se desplazan hacia la cabeza y el corazón se adapta; al volver a la gravedad hay riesgo de mareo y desmayo (intolerancia ortostática).

**Fichas mínimas para el MVP:** FC, SpO₂, presión arterial, temperatura, frecuencia respiratoria, sueño, fatiga y estrés.
**Opcional:** visión y dolor de cabeza, relacionados con el SANS (síndrome neuro-ocular asociado al vuelo espacial).

### 0.4 Modo emergencia (módulo `emergency`)

> ⚠️ **Advertencia obligatoria en la app, el README y el pitch:** el modo emergencia es una **guía de primeros auxilios y de coordinación**. No diagnostica ni reemplaza al oficial médico ni los protocolos médicos de la misión. Los medicamentos del kit solo se usan **según el protocolo de la misión o la indicación del CMO**; la app no da dosis por su cuenta.

**Requisitos de interfaz para la emergencia:**
- Un **botón EMERGENCIA** visible en todas las pantallas, que se activa con un toque.
- **Un paso por pantalla**, con letra grande, alto contraste y respuestas Sí/No.
- Funciona **100 % offline**.
- **Metrónomo de RCP** a 100–120 compresiones por minuto, con sonido y señal visual.
- **Bitácora automática** con la hora de cada paso, los signos vitales tomados y las decisiones. Al final genera el reporte para la Tierra.
- Alerta a toda la tripulación del módulo.

**Protocolos para el MVP** (máximo 3, bien hechos):

| Protocolo | Disparador | Resumen del árbol de decisión |
|---|---|---|
| **P1. Dolor en el pecho / colapso** (escenario del video) | Botón de emergencia, autoevaluación con dolor torácico, o triaje con FC o SpO₂ críticos | Ver el árbol de abajo. |
| **P2. Dificultad para respirar / hipoxia** | SpO₂ crítica o síntoma reportado | ¿Hay alarma de la cabina (CO₂, humo, presión)? → Sí: protocolo ambiental y máscaras. No: postura, oxígeno del kit, medir SpO₂ cada minuto y escalar al CMO. |
| **P3. Tormenta solar / radiación** | Aviso de evento solar (SPE) o dosis diaria mayor que el umbral crítico del perfil | 1) Ir al **área más blindada** (refugio). 2) Si el hábitat lo permite, reacomodar las **bolsas de agua** alrededor del refugio: el agua y el polietileno son buenos blindajes (R6). 3) Llevar el dosímetro y registrar el tiempo en el refugio. 4) Seguimiento de **síntomas de síndrome de radiación aguda**: náuseas, vómito, enrojecimiento o quemadura de la piel, fatiga. Si aparecen, 🔴 y aviso a los médicos de vuelo. 5) No programar EVA durante el evento. **Sin medicamentos:** las contramedidas farmacológicas son investigación de la NASA, no indicaciones (R2, R6). |

**Árbol de P1, dolor en el pecho o colapso (borrador conceptual que Rol 6 debe validar con fuentes de primeros auxilios):**

```
[EMERGENCIA activada] ──► Alertar a la tripulación + CMO · iniciar bitácora
        │
        ▼
¿El entorno es seguro? (alarmas de humo, CO₂ o despresurización)
   └─ No ──► Protocolo ambiental primero (máscaras, mover al compañero a un módulo seguro)
        │ Sí
        ▼
¿La persona responde?
   ├─ NO ──► ¿Respira normalmente?
   │           ├─ NO ──► RCP según el perfil:
   │           │          · Microgravedad: fijar al compañero en la superficie o restricción médica;
   │           │            métodos para ingravidez (Evetts-Russomano, "handstand") ⚠️ verificar
   │           │          · Luna / Marte: RCP en el suelo, adaptada a la baja gravedad
   │           │          · Metrónomo de 100–120/min · usar el desfibrilador si el kit lo tiene
   │           └─ SÍ ──► Posición segura o fijación · O₂ · SpO₂ y FC continuas · reevaluar cada 2 min
   │
   └─ SÍ, con dolor en el pecho ──► Preguntas guiadas: ¿cuándo empezó?, ¿cómo es el dolor?,
                 ¿se extiende al brazo o la mandíbula?, ¿falta el aire?, ¿hay sudor o náuseas?
                 ──► Medir FC, presión, SpO₂ y ECG si hay equipo
                 ──► Reposo · O₂ si la SpO₂ está baja · kit médico SOLO según el protocolo o el CMO
                 ──► Reevaluar cada 5 min · si pierde la conciencia, pasar a la rama "NO responde"
        │
        ▼
[Generar reporte] ──► Cola de mensajes a la Tierra (con el retraso del perfil)
```

**Dato útil para el pitch:** el método Evetts-Russomano de RCP en microgravedad fue desarrollado con la participación de la investigadora brasileña **Thais Russomano**. El reto lo propone la Agencia Espacial Brasileña. ⚠️ Rol 6 debe verificar este dato antes de usarlo.

### 0.5 Cambios en la arquitectura (sección 4)

**Módulos nuevos:**

| Módulo | Controller (endpoints) | Service | Entity o configuración |
|---|---|---|---|
| **mission-profile** | `GET /api/mission-profiles` · `GET /api/mission-profiles/active` · `PUT /api/mission-profiles/active` | cambiar el perfil activo y recalcular el triaje | `MissionProfile` (tabla) |
| **guidance** | `GET /api/guides` · `GET /api/guides/{indicator}` | entregar las fichas según el perfil activo | `measurement-guides.json` (configuración) |
| **reminders** | `GET /api/crew/{id}/reminders` · `PATCH /api/reminders/{id}/complete` · `PATCH /api/reminders/{id}/snooze` | generar recordatorios a partir de la frecuencia de cada guía; marcar como vencido | `Reminder` (tabla) |
| **emergency** | `POST /api/emergencies` · `POST /api/emergencies/{id}/steps` · `PATCH /api/emergencies/{id}/close` · `GET /api/emergencies/{id}/report` | abrir una sesión, registrar cada paso o respuesta, avanzar por el árbol y generar el reporte | `EmergencySession` + `EmergencyStepLog` (tablas) · `emergency-protocols.json` (configuración) |
| **earth-comms** (opcional) | `GET /api/earth-queue` | encolar reportes y entregarlos con el retraso del perfil | `EarthMessage` (tabla) |

**Cambios en lo que ya existía:**
- `VitalReading` agrega el campo `source`: `SENSOR` / `GUIDED_MANUAL` (medido con la guía) / `SIMULATED`.
- **Dominio:** junto al motor de triaje (`domain.triage`) se agrega el motor de emergencias (`domain.emergency`), también puro. Recibe el protocolo, el paso actual y la respuesta, y devuelve el siguiente paso. Los árboles están en `emergency-protocols.json`, y el frontend tiene un intérprete de ese mismo JSON, así que el modo emergencia funciona aunque la API se caiga (sección 1).
- **Umbrales de radiación:** se calculan respecto a la tasa base del perfil activo (sección 0.2).

### 0.6 Nuevas prioridades del MVP (MoSCoW)

| Prioridad | Funcionalidades |
|---|---|
| **Must** (sin esto no hay entrega) | Autoevaluación guiada con fichas de medición (incluye glucosa y ánimo) · motor de triaje con colores, escalamiento y **explicación de cada estado (D1)** · **mapa corporal interactivo** · **gráficas dinámicas** · **modo emergencia P1** (dolor en el pecho / colapso) · contramedidas básicas por indicador · funcionamiento offline · **estructura bilingüe (D6)** · *feature flags* · **selector de tripulante sin contraseña** (vista CMO para toda la tripulación) |
| **Should-A** | **Lentes de peligros (D2)** · **mapa de dolor (D3)** · **aptitud para EVA, después de la EVA y transición de gravedad (D4)** · **voz manos libres (D5)** · traducción completa al inglés (D6) · **prueba de vigilancia de 3 min (D11)** |
| **Should** | Selector de perfil de misión (estación, Luna, Marte, rover) · recordatorios · **gamificación** · dashboard de la tripulación · protocolos P2 y P3 · plan de mejora semanal · reporte de emergencia para la Tierra · **PIN de 4 dígitos + roles CREW / CMO** (con Spring Security) |
| **Could-A** | **Proyección "¿qué pasa si…?" (D7)** · **tendencias personales (D8)** · **modo cansancio (D9)** · **reporte SBAR (D10)** |
| **Could** | Adjuntar fotos (cámara) · simulador con escenarios · modo replay con datos de OSDR · cola de comunicación con retraso · fichas de SANS y visión |
| **Won't** (en estas 48 h) | Integración con sensores reales · login completo con usuario, contraseña y registro · **autenticación con Cloudflare** (depende de internet y contradice el *offline-first*) · diagnósticos automáticos o análisis de imágenes con IA · frecuencia cardíaca por cámara (rPPG) · asistente conversacional |

> *Actualizado el 8 de noviembre con las funcionalidades diferenciadoras (sección 0.10).*

### 0.7 Ajustes en el pitch y la demo

**Guion de la demo (unos 2 min), empezando con el escenario del video:**
1. *"Estamos a mitad de camino a Marte. La comunicación con la Tierra tarda 20 minutos..."* Se muestra el perfil "Tránsito a Marte" activo.
2. **Mapa corporal:** la astronauta ve su figura. Todo está en verde menos el cerebro (amarillo: durmió 5.5 h). Al hacer clic aparece la explicación y la contramedida.
3. Llega un recordatorio y hace su autoevaluación guiada (presión, glucosa y ánimo). La app le explica cómo medir y por qué importa. Gana puntos y mantiene su racha.
4. **Gráfica dinámica:** su sueño de los últimos 7 días y el plan de mejora sugerido.
5. Su compañero reporta dolor en el pecho y pulsa EMERGENCIA. El corazón del mapa se pone en rojo y la app muestra el protocolo P1 paso a paso, con el metrónomo de RCP. El aviso llega al CMO y queda en cola para los cirujanos de vuelo en Tierra.
6. Se cambia el perfil a "Rover en la Luna" y se ve cómo cambian las recomendaciones ("regresar a la base").

**Aplicación en la Tierra (cierre del pitch):** la misma herramienta, sin depender de internet y pensada para personas que no son médicos, sirve a **comunidades rurales y remotas de Colombia**: zonas apartadas de La Guajira, la Sierra Nevada o el Cesar, donde el centro de salud puede estar a horas de distancia. Un perfil "Comunidad remota" reutiliza las guías y los protocolos.

### 0.8 Ajustes en los roles

| Rol | Responsabilidades que se agregan |
|---|---|
| **Rol 3** (triaje) | Paquete `domain.emergency` (motor de emergencias) y perfiles de misión en la lógica. |
| **Rol 4** (dashboard) | Pantalla del modo emergencia (un paso por pantalla, metrónomo, bitácora). |
| **Rol 5** (UX) | Flujo de autoevaluación guiada con las fichas y los recordatorios. |
| **Rol 6** (datos y pitch) | **Mayor carga de contenido:** redactar y validar las fichas de medición y los protocolos de emergencia con fuentes. Con 4 o 5 integrantes, conviene que dos personas compartan este contenido antes del evento. |

---

### 0.9 Enunciado oficial del reto (publicado el 7 de noviembre)

> **Objetivo oficial:** *"Crear una **herramienta visual** que ayude a los astronautas a evaluar su propia salud durante misiones espaciales y que brinde **orientación sobre tratamientos y mejoras de salud**."*
> El enunciado **no pide hardware**: los datos pueden entrar por teclado, clics o imágenes de cámara.

#### 0.9.1 Lo que agrega el enunciado y qué cambia en el plan

| # | Lo que dice el enunciado | ¿Estaba en el plan? | Qué cambia |
|---|---|---|---|
| E1 | Es una **herramienta visual**: el diseño de la interfaz es clave, con animaciones e interactividad | ⚠️ Parcial | La interfaz pasa a ser criterio central. ➕ **Mapa corporal interactivo** (0.9.3). |
| E2 | Ejemplo explícito: **figura humana con partes del cuerpo clicables** que muestran su función y su estado de salud | ❌ No | ➕ **Must.** Es la pieza visual principal de la demo. |
| E3 | Indicadores sugeridos: **presión arterial, FC, glucosa en sangre, temperatura, horas de sueño y estado de ánimo** | ⚠️ Faltaban **glucosa** y **ánimo** | ➕ Se agregan glucosa (mg/dL) y ánimo (escala 1–5) a las secciones 3.2 y 3.4. |
| E4 | Peligro adicional: **nutrición inadecuada** | ✅ Parcial (calorías e hidratación) | Se refuerza con las contramedidas de nutrición (0.9.6). |
| E5 | **Orientación sobre tratamientos y mejoras de salud**, no solo alertas | ⚠️ Parcial (recomendaciones por nivel) | ➕ **Catálogo de contramedidas y plan de mejora** (0.9.6). |
| E6 | Entrada por **teclado, clics o imágenes de cámara** (por ejemplo, ultrasonido) | ⚠️ Teclado y clics sí; cámara no | ➕ **Could:** adjuntar fotos a una medición, sin análisis automático (0.9.8). |
| E7 | Para cada indicador: ¿se puede medir en el espacio?, ¿por qué hace falta el examen?, ¿cómo lo afectan los peligros?, **¿cuándo se avisa a la tripulación o a los cirujanos de vuelo en Tierra?**, ¿cómo se previene? | ⚠️ Parcial (guías de 0.3) | ➕ Las fichas de medición agregan esos campos. ➕ **Regla de escalamiento** explícita (0.9.5). |
| E8 | Entornos: nave espacial, estación espacial, **rover**, base en otro planeta o luna | ⚠️ Faltaba el rover | ➕ Perfil **Rover presurizado** (0.9.7). |
| E9 | **Pedir mediciones** de forma periódica como parte de la rutina | ✅ Módulo `reminders` | Se mantiene y se conecta con la gamificación. |
| E10 | **Gamificación** para motivar las tareas de salud | ❌ No | ➕ **Módulo `gamification`** (0.9.4). |
| E11 | **Gráficas dinámicas** de cómo cambian los indicadores en el tiempo | ✅ Recharts | Pasa a **Must**, con animación y comparación con la línea base. |
| E12 | **Código de colores** para leer el estado de un vistazo | ✅ Semáforo | Se mantiene. Se agrega forma o ícono además del color, por accesibilidad. |
| E13 | No suponer que los astronautas saben evaluarse: **instrucciones y explicaciones simples** | ✅ Guías (0.3) | Se mantiene. |
| E14 | Se pueden usar recursos del HRP de la NASA **y de otras agencias espaciales** | ✅ Parcial | Se pueden citar la ESA, JAXA, CSA y la AEB. La pestaña oficial *Resources* puede sumar más antes del evento. |
| E15 | Los **cinco peligros** del HRP: radiación, aislamiento y confinamiento, **distancia de la Tierra**, campos de gravedad y ambientes cerrados hostiles | ⚠️ Estaban mal listados en el documento principal | Se corrige el documento principal. Se pueden usar como "lentes" del mapa corporal. |

#### 0.9.2 Indicadores nuevos

> ⚠️ Son rangos de referencia para el prototipo y **deben validarse con fuentes** (Rol 6). No constituyen un diagnóstico.

| Indicador | 🟢 Normal | 🟡 Precaución | 🟠 Alerta | 🔴 Crítico | Notas |
|---|---|---|---|---|---|
| **Glucosa en sangre (mg/dL)** | 70–140 | 141–180 o 60–69 | 181–250 o 54–59 | > 250 o < 54 | Se registra el **contexto**: en ayunas, después de comer o aleatoria. En ayunas, lo normal es 70–99. Menos de 70 es hipoglucemia y menos de 54 es hipoglucemia significativa (criterio de la ADA). En vuelo espacial se ha observado resistencia a la insulina, así que vale la pena vigilarla. Se mide con glucómetro capilar. |
| **Estado de ánimo (1–5)** | 4–5 😀🙂 | 3 😐 | 2 🙁 (o 3 durante 3 días seguidos) | 1 😣 (o 2 durante 2 días seguidos) | Escala con emojis, un toque al día. Opcionalmente, 2 preguntas breves de tamizaje (ánimo bajo y pérdida de interés). En Alerta o Crítico se sugiere hablar con el CMO o con apoyo psicológico. |
| **Ejercicio (min/día)** | ≥ 90 | 60–89 | < 60 durante 2 días seguidos | — (el máximo es Alerta) | ✅ En la ISS se hacen **1.5 h diarias** de ejercicio de resistencia y aeróbico, **6–7 días por semana** (NASA, R14). El umbral Normal (90 min o más) coincide con esa rutina. |

#### 0.9.3 Mapa corporal interactivo (Must)

Es una **figura humana en SVG** con regiones clicables. Cada región se colorea con el **peor nivel** de sus indicadores y tiene animaciones sutiles: el corazón late a la FC actual y los pulmones "respiran" a la FR actual.

| Región | Indicadores que la colorean | Al hacer clic se muestra… |
|---|---|---|
| **Cerebro / mente** | Ánimo, estrés, fatiga, sueño | Función · cómo afectan el aislamiento y la distancia · contramedidas (sueño, contacto con la familia) |
| **Ojos** | (Opcional) visión y dolor de cabeza | SANS (síndrome neuro-ocular del vuelo espacial) |
| **Corazón** | FC, HRV, presión arterial | Desplazamiento de líquidos en microgravedad y adaptación cardiovascular |
| **Pulmones** | SpO₂, FR, CO₂ de la cabina | Atmósfera de la cabina y riesgo de hipoxia |
| **Sangre / metabolismo** | Glucosa, ingesta calórica, hidratación | Nutrición inadecuada y resistencia a la insulina |
| **Huesos** | Minutos de ejercicio (indirecto) | Pérdida ósea de **1 a 1.5 % de densidad mineral por mes** en vuelo (✅ NASA, R7) y ejercicio de resistencia |
| **Músculos** | Minutos de ejercicio | Atrofia muscular y contramedidas |
| **Riñones** | Hidratación | Riesgo de cálculos renales en el espacio (por la pérdida ósea y la poca hidratación) |
| **Piel / todo el cuerpo** | Dosis de radiación diaria y acumulada, temperatura | Radiación y su efecto en el sistema inmune |
| **Espalda / columna** ➕ (recurso R10) | Dolor de espalda (mapa de dolor D3) | Los astronautas reportan dolor de espalda en vuelo; la NASA lo vigila con ultrasonido de columna |
| **Oído interno / equilibrio** ➕ (recurso R1) | Mareo y desorientación autorreportados (0–10) | El peligro **Campos de gravedad** afecta al oído interno. Al cambiar de gravedad (despegue, llegada a Marte, regreso a la Tierra) aparecen mareo, desorientación y problemas de equilibrio |

**Configuración:** `body-map.json` guarda por región el id, el nombre, la función, el efecto de cada peligro, los indicadores vinculados y las guías relacionadas.
**Endpoint:** `GET /api/crew/{id}/body-status` devuelve el nivel por región. Lo calcula `domain.triage.BodyStatusCalculator`.

#### 0.9.4 Gamificación (Should)

**Principio clave:** se premian las **conductas** (medirse, cumplir la rutina, hacer ejercicio), **nunca los resultados de salud**. Si se premiaran los valores "buenos", el astronauta podría ocultar síntomas para no perder puntos.

| Elemento | Regla propuesta |
|---|---|
| **Puntos** | +10 por cada recordatorio cumplido a tiempo · +5 por autoevaluación completa · +15 por completar el ejercicio diario · +20 por leer una guía nueva |
| **Racha** | Días seguidos con la rutina completa. Una medición tardía no rompe la racha si se completa el mismo día. |
| **Insignias** | "Primera medición" · "Racha de 7 días" · "Explorador del cuerpo" (abrió las 9 regiones del mapa) · "Sueño reparador" (5 noches de 7 h o más) · "Hidratado" · "Reportero honesto" (reportó un síntoma; premia la transparencia) |
| **Misión de la tripulación** | Meta **cooperativa**, no competitiva. Por ejemplo: "La tripulación completa 95 % de las mediciones esta semana". |
| **Nivel** | Rangos temáticos: Cadete → Especialista → Comandante de salud. |

**Entities:** `CrewProgress` (puntos, racha, nivel), `CrewAchievement` (insignia y fecha) y el catálogo `achievements.json`.
**Endpoints:** `GET /api/crew/{id}/progress` · `GET /api/achievements`.
**Paquete de dominio:** `domain.gamification.PointsCalculator`, puro.

#### 0.9.5 Regla de escalamiento: ¿a quién se avisa?

Responde a la pregunta del enunciado: *"¿Cuándo amerita un resultado la atención de la tripulación o de los cirujanos de vuelo en Tierra?"*

| Nivel | Destino del aviso | Qué ve el astronauta |
|---|---|---|
| 🟢 Normal | Nadie | "Todo en orden" y un consejo de prevención |
| 🟡 Precaución | **El mismo astronauta** (autocuidado) | Acción de autocuidado y la medición se repite en X horas |
| 🟠 Alerta | **Oficial médico de la tripulación (CMO)** | Se notifica al CMO dentro de la app y se pide una autoevaluación completa |
| 🔴 Crítico | **CMO + toda la tripulación + cirujanos de vuelo en Tierra** | Protocolo de emergencia. El reporte se pone en cola hacia la Tierra con el retraso del perfil |

`TriageOutcome` agrega el campo `escalation`: `NONE`, `SELF`, `CREW_CMO` o `FLIGHT_SURGEON`.

#### 0.9.6 Tratamientos y mejoras de salud: catálogo de contramedidas

El enunciado pide **orientación sobre tratamientos y mejoras**, no solo avisos. Se agrega `countermeasures.json`, organizado por riesgo:

| Riesgo | Contramedidas (ejemplos que Rol 6 debe validar) |
|---|---|
| Pérdida ósea y muscular | Ejercicio de resistencia y aeróbico diario · calcio y vitamina D en la dieta · registrar los minutos de ejercicio |
| Cardiovascular | Ejercicio aeróbico · hidratación · medir la presión antes de actividades exigentes |
| Nutrición inadecuada | Cumplir el objetivo calórico · variedad en la dieta · hidratación de unos 2 L/día |
| Sueño | Horario regular · controlar la luz de la cabina · evitar pantallas antes de dormir · siestas cortas planificadas |
| Salud conductual | Contacto programado con la familia · tiempo libre · respiración guiada · hablar con el CMO o con apoyo psicológico |
| Radiación | Refugio durante eventos solares · revisar el dosímetro · registrar el tiempo fuera del blindaje |
| Glucosa alta o baja | Baja: ingerir carbohidratos de absorción rápida y volver a medir en 15 min. Alta: hidratarse, volver a medir y avisar al CMO si persiste. Medicamentos **solo según el protocolo de la misión** |

**Plan de mejora semanal:** el sistema revisa las **tendencias** de los últimos 7 días (por ejemplo, el promedio de sueño o el ejercicio) y propone 1 a 3 metas concretas. Cada meta cumplida suma puntos de gamificación.

#### 0.9.7 Perfil nuevo: rover presurizado

| Perfil | Gravedad | Retraso con la Tierra | Distancia a la base | Consecuencia en la app |
|---|---|---|---|---|
| **Rover presurizado** (Luna o Marte) | 0.16 g o 0.38 g | El del cuerpo celeste | Horas de viaje | Equipo médico mínimo, espacio reducido. En Alerta o Crítico, la recomendación clave es **regresar a la base**. |

#### 0.9.8 Entrada por cámara (Could)

- Adjuntar una **foto** a una medición o autoevaluación: la pantalla de un dispositivo, una herida o lesión de piel, o una imagen de ultrasonido.
- La foto se guarda junto al registro y se envía en el reporte a la Tierra. **No hay análisis automático ni diagnóstico por IA.**
- **Entity:** `MeasurementAttachment` (tipo, ruta, notas). Las imágenes se guardan en `backend/uploads/`, la carpeta de la plantilla original, que vuelve a usarse para esto.

#### 0.9.9 Fichas de medición: campos que se agregan (actualiza la 0.3)

Cada ficha de `measurement-guides.json` suma estos campos:
- **¿Se puede medir en el espacio?** Con qué equipo y qué limitaciones tiene.
- **¿Por qué hace falta?** El riesgo del HRP relacionado.
- **¿Cómo lo afecta cada peligro?** Radiación, aislamiento y confinamiento, distancia, gravedad y ambiente cerrado.
- **¿Cuándo escalar?** Según la regla de 0.9.5.
- **¿Cómo se previene?** Enlace a las contramedidas de 0.9.6.

---

### 0.10 Funcionalidades diferenciadoras (agregadas el 8 de noviembre)

> **Objetivo:** que ZeroG Vitals destaque frente a otros equipos que resuelven el mismo reto.
> Son 10 funcionalidades de esfuerzo bajo y medio. **No todas son obligatorias:** se construyen por oleadas (0.10.11) y las que no estén listas a la hora 38 se ocultan con un *feature flag*.

#### Resumen

| ID | Funcionalidad | Esfuerzo | Criterios a los que aporta | Prioridad | Responsable |
|---|---|---|---|---|---|
| **D1** | Explicación "¿por qué estoy en este color?", con su fuente | Bajo | Validez, presentación | **Must** (va dentro del motor desde el inicio) | Rol 3 + Rol 6 |
| **D2** | Lentes de los 5 peligros en el mapa corporal | Bajo | Relevancia, creatividad | Should-A | Rol 5 + Rol 6 |
| **D3** | Mapa de dolor y síntomas | Bajo | Impacto, relevancia | Should-A | Rol 5 + Rol 2 |
| **D4** | Aptitud para caminata espacial (EVA): APTO / NO APTO | Bajo–medio | Relevancia, creatividad, impacto | Should-A | Rol 3 + Rol 4 |
| **D5** | Voz manos libres en emergencias | Bajo–medio | Presentación, impacto | Should-A | Rol 4 |
| **D6** | Bilingüe español / inglés | Bajo (si se hace desde la hora 0) | Presentación (jurados globales) | **Must** (estructura) · Should-A (traducción completa) | Rol 5 + Rol 6 |
| **D7** | "¿Qué pasa si…?": proyección de la misión | Medio | Creatividad, presentación | Could-A | Rol 4 + Rol 6 |
| **D8** | Alerta temprana por tendencia personal | Medio | Validez, impacto | Could-A | Rol 3 |
| **D9** | Interfaz que se adapta al cansancio | Medio | Creatividad | Could-A | Rol 5 |
| **D10** | Reporte SBAR para médicos en Tierra | Medio | Validez, relevancia | Could-A | Rol 2 + Rol 3 |
| **D11** ➕ (13 nov, R10) | Prueba de vigilancia de 3 min: tiempo de reacción y lapsos como medida objetiva de fatiga | Bajo–medio | Validez, creatividad, relevancia | Should-A | Rol 5 + Rol 3 |

#### 0.10.1 D1. Explicación de cada estado ("¿por qué?")

- **Qué hace:** al tocar un indicador o una región del cuerpo se ve un texto así: *"SpO₂ de 93 % en 2 lecturas seguidas → 🟡 Precaución. Normal: 95 % o más. Regla: persistencia (2 lecturas). Fuente: [nombre de la fuente]."*
- **Dominio:** `domain.triage.RuleTrace` guarda el indicador, el valor, el umbral cruzado, la regla aplicada (umbral, combinación, persistencia o histéresis), las lecturas que se consideraron y el id de la fuente. `TriageOutcome` agrega la lista de `traces`.
- **Configuración:** cada umbral de `thresholds.json` lleva un `sourceId`. El nuevo `sources.json` es el catálogo de fuentes (título, organización, URL y año) y se basa en la matriz de trazabilidad (5.2).
- **API:** `GET /api/crew/{id}/status` incluye las explicaciones. `GET /api/sources` devuelve el catálogo.
- **Frontend:** componente `WhyPanel`. El intérprete offline también genera una explicación simple: el valor, el umbral y la fuente.

#### 0.10.2 D2. Lentes de los 5 peligros

- **Qué hace:** una barra con 5 botones (☢️ Radiación · 🧍 Aislamiento y confinamiento · 🌍 Distancia · 🪐 Gravedad · 🏭 Ambiente cerrado). Al tocar uno, se iluminan las regiones del cuerpo que ese peligro afecta, con un texto corto y una animación.
- **Configuración:** `body-map.json` agrega por región un objeto `hazards` con el efecto de cada peligro en ES y EN.
- **Backend:** no requiere lógica nueva; sale de la configuración.
- **Frontend:** componente `HazardLensBar` y un modo "lente" en `BodyFigure`.

#### 0.10.3 D3. Mapa de dolor y síntomas

- **Qué hace:** el astronauta toca la zona del cuerpo donde siente algo y registra:
  - la intensidad (0–10);
  - el tipo (opresivo, punzante, ardor, cólico, hormigueo, otro);
  - desde cuándo lo siente;
  - síntomas asociados (falta de aire, sudor, náuseas, mareo).
- **Reglas de triaje** (validar con Rol 6):
  - Intensidad 4–6 → 🟡. Intensidad 7 o más → 🟠.
  - **Pecho con intensidad 7 o más, o pecho con falta de aire o sudor → 🔴 y se ofrece el protocolo P1.**
- **Entity:** `Symptom` (id, crewMemberId, timestamp, bodyRegion, intensidad, tipo, inicio, síntomas asociados, notas).
- **API:** `POST /api/crew/{id}/symptoms` · `GET /api/crew/{id}/symptoms`.
- **Frontend:** componente `PainMap`, que reutiliza `BodyFigure` en "modo síntoma".

#### 0.10.4 D4. Aptitud para caminata espacial (EVA)

- **Qué hace:** antes de una EVA (o de una salida en rover), un checklist de unos 2 minutos devuelve:
  - 🟢 **APTO**;
  - 🟡 **APTO CON PRECAUCIÓN** (requiere el visto bueno del CMO);
  - 🔴 **NO APTO**.

  Cada resultado indica qué criterios fallaron.
- **Criterios propuestos** (`eva-criteria.json`). ⚠️ Son una propuesta del equipo: los criterios reales de la NASA no son públicos en detalle. Cada uno se marca como supuesto en la matriz de trazabilidad.
  - Sueño de 6 h o más en las últimas 24 h.
  - SpO₂ de 95 % o más.
  - Presión menor que 140/90.
  - FC en reposo entre 50 y 100.
  - Temperatura menor que 37.6 °C.
  - Glucosa entre 70 y 180.
  - Ánimo de 3 o más y fatiga de 5 o menos.
  - Ningún síntoma de intensidad 4 o más.
  - Ninguna alerta activa.
  - Dosis de radiación diaria que no esté en Alerta.
- **Dominio:** `domain.eva.EvaReadinessEvaluator`, puro.
- **Entity:** `EvaAssessment` (crewMemberId, timestamp, resultado, criterios que fallaron en JSON, aprobación del CMO).
- **API:** `POST /api/crew/{id}/eva-assessments` · `GET /api/crew/{id}/eva-assessments/latest`.
- **Frontend:** componente `EvaChecklist`, con un resultado grande, visible y animado.

#### 0.10.5 D5. Voz manos libres en emergencias

- **Qué hace:**
  - La app **lee en voz alta** cada paso del protocolo.
  - **Cuenta las compresiones** de RCP sincronizada con el metrónomo ("uno, dos, tres…").
  - Avisa los cambios de paso.
- **Comandos de voz (opcional):** "siguiente", "sí", "no" y "repetir".
- **Tecnología:** Web Speech API del navegador. `speechSynthesis` suele funcionar **sin internet**. `SpeechRecognition` en Chrome **requiere conexión**, así que va detrás de un *feature flag* y siempre se pueden usar los botones.
- **Backend:** no requiere nada; los textos salen de los protocolos (ES y EN).
- **Frontend:** componente `VoiceGuide`, con botón para silenciar.

#### 0.10.6 D6. Bilingüe español / inglés

- **Frontend:** `react-i18next`, con los archivos `src/locales/es.json` y `src/locales/en.json`. **Ningún texto se escribe directamente en los componentes, desde la hora 0.**
- **Backend:** los JSON de contenido (guías, protocolos, contramedidas, mapa corporal, insignias) guardan cada texto como `{ "es": "...", "en": "..." }`. El idioma se elige con el encabezado `Accept-Language` o con `?lang=`.
- **Uso:** español por defecto. La demo para jurados globales, el video y la ficha van en inglés.

#### 0.10.7 D7. "¿Qué pasa si…?": proyección de la misión

- **Qué hace:** un control deslizante de días de misión (de 0 a unos 1.100 días: la NASA estima unos **3 años** para una misión a Marte, con hasta 2 años en la superficie; recurso R1) con dos curvas:
  1. **Pérdida ósea estimada (%)**, con y sin ejercicio de resistencia.
  2. **Dosis de radiación acumulada (mSv)** frente al **límite de carrera de 600 mSv**, según el perfil, con y sin uso del refugio en eventos solares.

  Los interruptores de las contramedidas cambian las curvas en vivo.
- **Configuración:** `projection-rates.json`, con las tasas por perfil y por contramedida. ⚠️ Rol 6 debe validar cada tasa con su fuente.
- **Implementación:** **solo en el frontend**, con fórmulas simples y la configuración descargada. Así funciona offline y no necesita endpoint.
- **Frontend:** componentes `ProjectionSlider` y `ProjectionChart`, con Recharts animado.

#### 0.10.8 D8. Alerta temprana por tendencia personal

- **Qué hace:** compara el **promedio de los últimos 3 días** con la **línea base personal** (los primeros 7 días o el perfil del tripulante). Muestra una señal **↗ / ↘ Tendencia** aunque el indicador siga en verde.
- **Reglas propuestas:**

  | Indicador | Se marca tendencia si… |
  |---|---|
  | FC en reposo | Varía 10 % o más |
  | Presión | Varía 10 % o más |
  | Sueño | El promedio baja 1 h o más |
  | Ánimo | El promedio baja 1 punto o más |
  | Glucosa en ayunas | Sube 15 % o más |
  | Ejercicio | El promedio baja 20 % o más |

- **Efecto:** **no cambia el color** del indicador. Es información que alimenta el plan de mejora semanal (0.9.6) y aparece en la explicación (D1).
- **Dominio:** `domain.triage.TrendDetector` produce `TrendSignal` (indicador, dirección, % de cambio y días).
- **API:** `GET /api/crew/{id}/trends`.
- **Simulador:** escenario nuevo `slow-drift`, con 10 días simulados donde la FC sube lentamente y el sueño baja.

#### 0.10.9 D9. Interfaz que se adapta al cansancio

- **Cuándo se activa:** fatiga de 7 o más, estrés de 7 o más, sueño de menos de 5 h, horario nocturno de la misión, o a mano.
- **Qué cambia:**
  - Se oculta la navegación secundaria.
  - Letra y botones más grandes.
  - Una acción por pantalla.
  - Textos en su versión corta (cada texto de i18n tiene una variante `short`).
  - Animaciones reducidas.
- **Frontend:** `FatigueModeProvider` (contexto de React) y un indicador visible "Modo descanso activo".

#### 0.10.10 D10. Reporte SBAR para médicos en Tierra

- **Qué hace:** al cerrar una emergencia o una alerta, genera un reporte con el formato clínico estándar **SBAR**:
  - **S**ituación: qué pasa ahora.
  - **A**ntecedentes: perfil del tripulante, perfil de misión y alertas previas.
  - **E**valuación: signos vitales con su hora, síntomas, pasos del protocolo y fotos.
  - **R**ecomendación o solicitud: qué se pide a los médicos en Tierra.

  Incluye una **estimación del tamaño** del mensaje y queda en la cola hacia la Tierra con el retraso del perfil.
- **Dominio:** `domain.report.SbarReportBuilder`, puro.
- **API:** `GET /api/emergencies/{id}/report?format=sbar` · `GET /api/alerts/{id}/report?format=sbar`.
- **Frontend:** componente `SbarReportView`, con versión imprimible.

#### 0.10.11 Feature flags y oleadas de construcción

- **Feature flags:** `resources/data/features.json` define cada funcionalidad D1–D10 y las opcionales como activa o inactiva. `GET /api/features` las entrega y el frontend oculta lo que esté desactivado. **Una funcionalidad a medias nunca se muestra en la demo.**

| Oleada | Horas | Contenido |
|---|---|---|
| **Ola 1: MVP** | 0–24 | Todo lo **Must** de 0.6, más **D1** (dentro del motor) y la estructura de **D6** (i18n). |
| **Ola 2: Should-A** | 24–34 | D2, D3, D4, D5, traducción al inglés (D6), perfiles de misión, recordatorios y gamificación. |
| **Ola 3: Could-A** | 30–38 | D7, D8, D9 y D10, según el tiempo y quién esté libre. |
| **Corte** | **Hora 38** | Lo que no funcione de punta a punta se desactiva con su flag. |
| **Congelamiento** | Hora 42 | Solo correcciones de errores, video y entrega. |

### 0.11 Estado del plan (recuento del 8 de noviembre)

> Quedan **5 días** antes de los recursos (13 nov) y **6** antes del evento (14 nov).

#### ✅ Completo y decidido

- Stack (Java 21 + Spring Boot 3, React + TS, PostgreSQL, Docker) y estrategia offline basada en JSON.
- Arquitectura en capas, estructura del repositorio y responsables por paquete.
- Niveles de estado, regla del peor nivel, persistencia e histéresis (3.5 y 5.1, pendiente de aprobación del equipo).
- Umbrales ambientales con fuente NASA: CO₂, temperatura, humedad y radiación.
- Regla de escalamiento (0.9.5), prioridades MoSCoW, oleadas y *feature flags*.
- Protocolo para el día de llegada de los recursos (5.4).

#### ⚠️ Incompleto (existe, pero falta trabajo)

| Elemento | Qué hay | Qué falta | Responsable |
|---|---|---|---|
| Umbrales de signos vitales, glucosa, ánimo y ejercicio | Rangos propuestos | **Validar con fuentes citables** y cargarlos en `sources.json` | Rol 6 |
| Perfiles de misión | 6 perfiles con valores de referencia | Verificar la radiación en la Luna y Marte, los tiempos de evacuación y los retrasos | Rol 6 |
| Fichas de medición | 2 ejemplos (SpO₂ y presión) | 9 fichas más (FC, temperatura, FR, glucosa, sueño, ánimo, fatiga y estrés, ejercicio e hidratación), con los campos de 0.9.9, en ES y EN | Rol 6 + apoyo |
| Protocolo P1 (dolor en el pecho / colapso) | Árbol en borrador | Validar con fuentes de primeros auxilios. Verificar los métodos de RCP en microgravedad y el dato sobre Thais Russomano | Rol 6 |
| Protocolos P2 y P3 | Una fila de resumen cada uno | Árbol completo paso a paso | Rol 6 + Rol 3 |
| Reglas L1–L12 | Valores propuestos | **Que Verónica las decida** (ver 0.12.1) | Verónica |
| Casos de prueba | 8 de ejemplo | Llegar a unos 40: los 30 previstos más casos de D3, D4 y D8 | Rol 3 |
| Escenarios de simulación | 1 ejemplo (CO₂) | Especificar `nominal`, `fatigue`, `hypoxia`, `solar-storm`, `chest-pain` y `slow-drift` | Rol 3 |
| Gamificación | Puntos e insignias | Umbrales de cada nivel (Cadete → Comandante) y texto de las insignias | Rol 5 + Rol 6 |
| Contramedidas | Tabla por riesgo | Textos finales y fuentes | Rol 6 |
| Guion de la demo | Versión de 6 pasos (0.7) | Agregar D3, D4 y D5, el apagado del wifi en vivo y la versión en inglés | Rol 6 |
| Fuentes (sección 7) | NASA-STD-3001, radiación e ISS | Fuentes de glucosa (ADA), ejercicio, pérdida ósea, radiación en la Luna y Marte, RCP en microgravedad y SBAR | Rol 6 |
| Sincronización offline | Concepto (IndexedDB + cola) | Definir qué pasa si un mismo registro se edita offline y online (propuesta: los registros solo se agregan, nunca se editan) | Rol 1 |
| Calendario 4–7 nov (5.5) | Tareas planificadas | **Sin confirmar si se hicieron.** Si no, quedan atrasadas | Líder |

#### ❌ No existe todavía

| Elemento | Por qué importa | Responsable |
|---|---|---|
| **Integrantes del equipo** | Se forman en la sede (0.12). Se prepara el pitch de reclutamiento y el kit de bienvenida | Verónica (en el evento) |
| **Contenido de los JSON:** `body-map.json`, `countermeasures.json`, `achievements.json`, `eva-criteria.json`, `projection-rates.json`, `sources.json`, `features.json` y los textos en inglés | Son el "cerebro" de la app. Escribirlos antes como **documento de contenido** (no como código) ahorra muchas horas | Rol 6 + todos |
| **Bocetos de las pantallas** (mapa corporal, autoevaluación, emergencia, EVA, proyección) | Sin bocetos, el front improvisa durante el evento | Rol 5 |
| **Guía visual:** paleta del semáforo accesible (color + ícono), tipografía y estilo | Coherencia visual: el reto es una "herramienta visual" | Rol 5 |
| **Figura humana en SVG** | Es la pieza central. Hay que decidir si se dibuja en el evento o se usa una figura con licencia abierta (verificando la licencia y citándola) | Rol 5 |
| **Modelo de datos detallado** (columnas, tipos y llaves) | Hace falta para el primer script de Flyway en la hora 1 | Rol 2 |
| **Contrato de la API** con los campos de cada request y response | Permite trabajar front y back en paralelo desde la hora 1 | Rol 2 + Rol 4 |
| **Plantilla del README** con la declaración de uso de IA | Es un requisito obligatorio | Rol 1 |
| **Licencia del repositorio** (se recomienda MIT) | Proyecto abierto y público | Rol 1 |
| **Plan del video** en inglés (guion, tomas, quién graba y narra) | Es un entregable oficial | Rol 6 |
| **Nombre y logo** | Presentación | Rol 5 |
| **Plan de contingencia** (wifi caído, Docker que falla en un portátil, alguien que se enferma) | 48 h sin margen | Líder |
| **Confirmar las reglas oficiales:** qué se puede preparar antes, el formato del video y los criterios de evaluación | Evita una descalificación | Líder |
| **Revisar la pestaña *Resources*** del reto | Pueden haber agregado recursos | Rol 6 |

#### 🎯 Prioridades para esta semana (8–12 nov). Lo hace Verónica, solo documentos

> En la sección 0.11, la columna "Responsable" indica **quién lo hará durante el evento**. **Antes del evento todo lo prepara Verónica.**

1. **8–9 nov:** confirmar las reglas oficiales (qué se puede preparar antes y el formato del video) y el registro del equipo en la plataforma. Decidir las reglas L1–L12.
2. **9–10 nov:** documento de contenido (fichas de medición, mapa corporal y lentes, protocolo P1, contramedidas, criterios de EVA) y validación de fuentes.
3. **10–11 nov:** bocetos de pantallas en papel, guía visual, modelo de datos y contrato de la API (como documentos).
4. **11–12 nov:** casos de prueba, escenarios, plantilla del README, guion de la demo y del video, plan de contingencia, pitch de reclutamiento y kit de bienvenida.
5. **12 nov:** revisar el portátil propio (JDK 21, Node, Docker, IntelliJ, VS Code) y la logística del viaje.
6. **13 nov:** recursos oficiales (protocolo 5.4).
---

### 0.12 Situación real: el equipo se forma en el evento (actualizado el 8 de noviembre)

> **Condiciones:**
> - Verónica llega **sin equipo** y lo formará en la sede (ITM, Medellín).
> - **No se escribe código antes del evento.**
> - Lo que se lleva preparado es **el plan**: este documento y el contenido en texto.
> - Los recursos oficiales se habilitan el **13 de noviembre**.

#### 0.12.1 Qué cambia

| Antes | Ahora |
|---|---|
| Roles asignados antes del evento | Los roles se asignan en la **primera hora del evento**, según las habilidades de quienes se unan (0.12.4) |
| Lo pendiente lo repartían "Rol 2", "Rol 6", etc. | **Hasta el 13 de noviembre todo lo prepara Verónica**, con apoyo de Claude. Solo documentos, nada de código |
| Las reglas L1–L12 las aprobaba el equipo | **Verónica las decide ahora** como líder del plan. El equipo puede ajustarlas en la hora 0 si alguien aporta un argumento con fuente |
| El stack estaba decidido | Java + Spring Boot se mantiene **si Verónica lidera el backend**. Si el equipo no sabe Java, se aplica la regla de decisión de 0.12.5 |
| El tamaño del alcance era fijo | **El alcance depende del tamaño del equipo** (0.12.3) |

#### 0.12.2 Papel de Verónica

- **Líder del proyecto (Rol 1):** trae el plan, presenta la visión y decide cuando hay empate.
- **Rol técnico:** el que mejor domine. Por la plantilla de proyecto que maneja, lo natural es **backend en Spring Boot (Rol 2 o Rol 3)**.
- Si llegan perfiles técnicos fuertes, puede pasar a **Rol 3 (motor de triaje) + Rol 6 (contenido)**, porque es quien mejor conoce el contenido del plan.

#### 0.12.3 Alcance según cuántas personas se unan

| Equipo final | Qué se construye | Qué se deja fuera |
|---|---|---|
| **1–2 personas** | MVP reducido: autoevaluación guiada, triaje con colores y explicación (D1), mapa corporal simple, emergencia P1 y estructura bilingüe. **Se puede simplificar a un solo servicio** (ver 0.12.5) | Gamificación, recordatorios, perfiles, Ola 3 |
| **3 personas** | MVP completo, más D3 (mapa de dolor) y D4 (aptitud para EVA) | D2, D5, D7–D10 y P2–P3 |
| **4 personas** | MVP + Ola 2 completa (D2–D5) + perfiles de misión | Ola 3 (D7–D10) |
| **5–6 personas** | Todo el plan, incluida la Ola 3 según el tiempo | Lo que no esté listo a la hora 38 |

**Reparto según el tamaño:**
- **2 personas:** A = backend + motor + contenido · B = frontend completo + video.
- **3 personas:** A = backend + motor (Verónica) · B = frontend: mapa corporal y autoevaluación · C = frontend: emergencia, gráficas, contenido y video.
- **4 a 6 personas:** según la sección 2.

#### 0.12.4 Formación del equipo en la sede

**1. Pitch de reclutamiento (unos 60 segundos), para decirlo en voz alta o mostrarlo en el celular:**
> *"Hola, soy Verónica, de Ingeniería de Sistemas de la UPC. Voy por el reto de salud para astronautas: imaginen a alguien camino a Marte cuyo compañero se desploma, sin médico y con 20 minutos de retraso para hablar con la Tierra. Ya traigo el plan completo: arquitectura, reglas de salud con fuentes de la NASA, pantallas y la idea central, un mapa del cuerpo interactivo que te dice cómo estás, por qué y qué hacer. Busco gente de frontend (React), diseño UX, backend (Java o Node) y alguien que sepa contar historias para el video. ¿Te unes?"*

**2. Perfiles que se buscan, en orden de prioridad:**
1. **Frontend (React)**, porque el reto es una "herramienta visual".
2. **Diseño UI/UX** (Figma, SVG, animación).
3. **Backend** (idealmente Java/Spring; si no, Node).
4. **Contenido, salud o comunicación** (alguien de medicina, enfermería o biología es un plus enorme para validar el contenido) y pitch o video en inglés.

**3. Encuesta rápida de habilidades (5 min, en la hora 0):** cada persona dice del 1 al 5 su nivel en React, Java/Spring, Node, SQL, Docker, diseño/Figma, inglés hablado y edición de video. Con eso se asignan los roles de la sección 2.

**4. Kit de bienvenida (15 min):** Verónica muestra a los nuevos integrantes:
- el problema (el escenario del video);
- la demo soñada (0.7);
- el MVP (0.6);
- el mapa del repositorio (4.4);
- qué hace cada rol.

Este documento es la referencia; nadie tiene que leerlo completo en la hora 0.

**5. Registro en la plataforma:** confirmar que el equipo "ZeroG Vitals" está creado en spaceappschallenge.org e **invitar a los nuevos integrantes ahí**. Verificar el procedimiento y el plazo de inscripción de integrantes.

#### 0.12.5 Regla de decisión del stack en la hora 0

| Situación del equipo | Decisión |
|---|---|
| Verónica u otra persona domina Spring Boot | **Java + Spring Boot** (el plan tal como está) |
| Nadie domina Java, pero sí Node | **Node + TypeScript (NestJS o Express)**. La arquitectura en capas y los JSON no cambian; solo cambia el lenguaje del backend. Ver las equivalencias de la sección 4.8 |
| Equipo de 1–2 personas o con poca experiencia en backend | **Solo frontend** (React + TS) con IndexedDB como base de datos y los motores en TypeScript. Es *offline-first* puro y se gana tiempo. El backend con Postgres pasa a Could |

En todos los casos se reutiliza lo que más vale del plan: **los JSON de contenido, las reglas, las pantallas y los casos de prueba**. Esa es la ventaja de llevar el plan preparado.

---

### 0.13 Desarrollo asistido por Claude (decidido el 8 de noviembre)

> **Decisión:** todo el desarrollo de las 48 h se hará **con Claude** como asistente: Claude Code en el editor o la terminal, y Claude en el navegador o la app.
> El equipo humano **dirige, revisa, prueba y entiende** todo lo que se entrega. Claude escribe y propone; las personas deciden y responden por el resultado.

#### 0.13.1 Reglas que se deben confirmar antes del evento

- [ ] Leer en spaceappschallenge.org la **política de uso de IA de 2026**: qué está permitido, cómo declararlo y si hay restricciones sobre imágenes, video o voces generadas con IA.
- [ ] Confirmar que la **declaración de uso de IA** va en el README y, si lo piden, en la ficha del proyecto.

#### 0.13.2 Herramientas y cuentas

| Qué | Para qué | Antes del evento |
|---|---|---|
| **Claude Code** (extensión de VS Code o IntelliJ, o en la terminal) | Generar y modificar el código del repositorio, correr pruebas, hacer commits | Instalarlo y probarlo en el portátil **con un proyecto de prueba ajeno al reto** (por ejemplo, un "hola mundo" de Spring Boot que se borra después) |
| **Claude en el navegador o la app** | Contenido, traducciones, revisión de textos, guion del video | Ya disponible |
| **Plan de suscripción** | 48 h de uso intenso | **Revisar los límites de uso de tu plan.** Si se agotan a mitad del evento, se pierde ritmo. Cada integrante que use Claude debería tener su propia cuenta |
| **Internet de respaldo** | Claude necesita conexión y el wifi de la sede puede saturarse con 162 personas | Datos móviles o un plan para compartir datos desde el celular |

#### 0.13.3 Qué se lleva preparado para trabajar con Claude (solo documentos)

| Documento | Para qué sirve |
|---|---|
| **Este plan** (`docs/ZeroG_Vitals_Plan_Equipo.md`) | Es el contexto completo. Claude lo lee y genera código coherente con la arquitectura |
| **Borrador de `CLAUDE.md`** (archivo `CLAUDE_borrador.md`) | Instrucciones permanentes para Claude Code: stack, estructura, convenciones, reglas de salud y qué no hacer. En la hora 0 se copia a la raíz del repo como `CLAUDE.md` |
| **Biblioteca de prompts por oleada** (0.13.4) | Pedidos listos para cada funcionalidad, en orden. Ahorra tiempo y evita olvidos |
| **Documento de contenido** (fichas, protocolos, mapa corporal, contramedidas…) | Claude lo convierte a JSON en minutos. **El contenido lo validan personas, con fuentes** |
| **Tabla de casos de prueba** (5.2) | Claude genera las pruebas JUnit a partir de la tabla. Así se verifica lo que escribe |

#### 0.13.4 Biblioteca de prompts (orden de trabajo)

> Cada pedido hace referencia a la sección del plan. Claude Code ya tiene el plan y el `CLAUDE.md` en el repositorio.

| # | Hora | Pedido a Claude (resumen) |
|---|---|---|
| P0 | 0 | "Lee `CLAUDE.md` y `docs/ZeroG_Vitals_Plan_Equipo.md`. Crea la estructura del repositorio de la sección 4.4 (sin lógica todavía): proyecto Spring Boot con las dependencias de la sección 1, frontend con Vite + React + TS + Tailwind + react-i18next, `docker-compose.yml`, `.gitignore`, `.env.example`, licencia MIT y README base. Configura los estándares de 0.14.1 (Spotless, ESLint + Prettier, TS strict, `.editorconfig`, CI y plantilla de PR). Verifica que `docker compose up` levante todo." |
| P1 | 1 | "Crea la migración inicial de Flyway y las entities de la sección 4.5 para el MVP (CrewMember, VitalReading, SelfAssessment, TriageResult, Alert, EmergencySession, EmergencyStepLog, Symptom) y sus repositories." |
| P2 | 2 | "Convierte el documento de contenido en `resources/data/*.json`, con textos `{es, en}`, y crea `RulesConfig` para cargarlos." |
| P3 | 3 | "Implementa `domain.triage` (TriageEngine, reglas de 3.5 y 5.1, RuleTrace para D1, EscalationPolicy de 0.9.5) **primero con las pruebas** de la tabla 5.2 y luego el código hasta que pasen." |
| P4 | 6 | "Crea los controllers, DTOs, mappers y services del MVP según la sección 4.6, con validación, `GlobalExceptionHandler` y Swagger." |
| P5 | 8 | "Frontend: cliente de API, tipos, i18n, *feature flags*, página de autoevaluación guiada con las fichas de medición y `WhyPanel`." |
| P6 | 12 | "Frontend: `BodyFigure` en SVG con las 9 regiones de 0.9.3, colores por nivel, animación del corazón y los pulmones, y panel por región." |
| P7 | 16 | "Implementa `domain.emergency` y la pantalla de emergencia P1 (0.4): un paso por pantalla, metrónomo y bitácora. Agrega el intérprete offline en `frontend/src/engine`." |
| P8 | 20 | "Gráficas dinámicas, contramedidas, caché offline en localStorage y prueba del modo offline." |
| P9 | 24+ | Ola 2: un pedido por cada funcionalidad (D2, D3, D4, D5, perfiles, recordatorios, gamificación), siempre citando su sección. |
| P10 | 30+ | Ola 3: D7–D10 según el tiempo. |
| P11 | 38 | "Revisa el repositorio: errores, código sin usar, textos sin traducir, secretos expuestos y flags de funcionalidades incompletas. Genera el README final con la sección de uso de IA." |

#### 0.13.5 Reglas de trabajo con Claude

1. **Una tarea pequeña por pedido**, citando la sección del plan. Nada de "haz toda la app".
2. **Pruebas primero en la lógica de salud:** los motores de triaje, emergencia y EVA se validan con la tabla de casos antes de darlos por buenos.
3. **Una persona revisa cada cambio antes del commit:** lee el diff, corre la app y prueba el flujo.
4. **Commits pequeños y frecuentes,** con la atribución de IA en el mensaje (por ejemplo, `Co-Authored-By: Claude`) para que el historial sea transparente.
5. **El contenido de salud no lo inventa Claude:** sale del documento de contenido validado con fuentes. Si Claude propone un umbral o un paso médico nuevo, se marca ⚠️ hasta verificarlo.
6. **Nunca pegar secretos** (contraseñas, `.env` o tokens) en los prompts.
7. **Todos deben entender lo que se entrega:** los jurados pueden preguntar cómo funciona el triaje o por qué se eligió un umbral. Antes del pitch, cada integrante le pide a Claude que le explique su parte y la explica en voz alta.
8. **Si Claude se traba en un error más de 15 minutos,** se cambia de enfoque: se simplifica o se apaga la funcionalidad con su flag.

#### 0.13.6 Declaración de uso de IA (plantilla para el README)

> **Uso de Inteligencia Artificial**
> Este proyecto se desarrolló con **Claude (Anthropic)** como asistente durante la hackatón:
> - **Planificación y arquitectura:** apoyo en el diseño de la arquitectura en capas, el modelo de datos y las reglas de triaje (antes del evento, solo en documentos).
> - **Generación de código:** la mayor parte del código del backend (Spring Boot) y del frontend (React) se generó con Claude Code a partir de instrucciones del equipo. Cada cambio fue revisado y probado por un integrante antes del commit. Los commits asistidos llevan la marca `Co-Authored-By: Claude`.
> - **Contenido:** apoyo en la redacción y traducción de las guías de medición, protocolos y contramedidas. Los umbrales y pasos médicos provienen de las fuentes citadas en `docs/` y fueron verificados por el equipo.
> - **Lo que hizo el equipo:** la definición del problema, las decisiones de diseño, la validación del contenido de salud, la revisión y prueba del código, la interfaz, el pitch y el video.
> - **Limitaciones:** ZeroG Vitals es un prototipo. No es un dispositivo médico ni reemplaza el criterio de profesionales de la salud.

#### 0.13.7 Riesgos y cómo mitigarlos

| Riesgo | Mitigación |
|---|---|
| Se cae el wifi de la sede | Datos móviles de respaldo. Mientras tanto, trabajar en lo que no necesita a Claude: pruebas manuales, guion, bocetos |
| Se agotan los límites de uso del plan | Repartir el trabajo entre las cuentas de los integrantes. Priorizar los pedidos de la Ola 1 |
| Claude genera código que nadie entiende | Regla 7. Pedir explicaciones y comentarios en las partes clave |
| Claude "inventa" contenido médico | Regla 5. Todo el contenido sale del documento validado |
| Código inconsistente entre integrantes | Un solo `CLAUDE.md` en el repo. Todos trabajan sobre la misma arquitectura (4.4) |
| Los jurados cuestionan el uso de IA | Declaración transparente (0.13.6), historial de commits limpio y un equipo que domina su solución |

---

### 0.14 Código limpio: estándares del proyecto (agregado el 8 de noviembre)

> **Por qué importa más con Claude:** Claude escribe rápido, pero en sesiones distintas tiende a repetir código, inventar patrones nuevos, mezclar nombres (por ejemplo, `crew` vs `astronaut`) y dejar imports o clases sin usar. Lo que evita ese desorden son **reglas explícitas en `CLAUDE.md`** y **herramientas automáticas** que revisan el código, no la buena voluntad.
> **Equilibrio:** es una hackatón de 48 h. Aquí va solo lo que **cuesta poco y ahorra mucho**. La columna "Cuándo" indica cuándo se configura.

#### 0.14.1 Automático: se configura en la hora 0 y después no cuesta nada

| Herramienta | Qué hace | Cuándo |
|---|---|---|
| **Spotless + google-java-format** (Maven) | Formatea todo el Java igual. `./mvnw spotless:apply` corrige y `spotless:check` falla en CI si algo no está formateado | Hora 0 (P0) |
| **ESLint + Prettier** (+ `prettier-plugin-tailwindcss`) | Formato y errores comunes en TS/React; ordena las clases de Tailwind | Hora 0 (P0) |
| **TypeScript en modo `strict`** y **prohibido `any`** | Los errores se detectan al escribir, no en la demo | Hora 0 (P0) |
| **`.editorconfig`** | Mismos espacios, finales de línea y codificación en todos los editores (IntelliJ y VS Code) | Hora 0 (P0) |
| **CI en GitHub Actions** | En cada PR: formato, lint, `./mvnw test` y `npm run build`. **Si falla, no se hace merge** | Hora 0–2 |
| **Plantilla de PR con checklist** (0.14.8) | Recuerda lo que hay que revisar antes del merge | Hora 0 |
| **Tipos del frontend generados desde OpenAPI** (`openapi-typescript`) | Los tipos TS se generan automáticamente desde Swagger. **No se escriben a mano**, así el front y el back nunca se desincronizan | Hora 6–8, cuando ya existan los controllers |

#### 0.14.2 Lenguaje común (glosario español → código)

Un solo nombre por concepto en todo el código. Claude debe usar **exactamente** estos nombres.

| Concepto (español) | Nombre en el código | No usar |
|---|---|---|
| Tripulante | `CrewMember` / `crewMember` | astronaut, user, patient |
| Lectura de signos vitales | `VitalReading` | measurement, vitals, sample |
| Lectura ambiental | `EnvironmentReading` | sensorData, habitatReading |
| Autoevaluación | `SelfAssessment` | survey, checkin, form |
| Síntoma | `Symptom` | pain, complaint |
| Nivel (Normal / Precaución / Alerta / Crítico / Sin datos) | `HealthLevel.NORMAL / CAUTION / ALERT / CRITICAL / NO_DATA` | WARNING, DANGER, OK, strings |
| Resultado del triaje | `TriageResult` (entity) / `TriageOutcome` (dominio) | status, evaluation |
| Indicador | `Indicator` (enum: `HEART_RATE`, `SPO2`, `GLUCOSE`…) | metric, param, strings sueltos |
| Oficial médico de la tripulación | `CMO` / `crewMedicalOfficer` | doctor, medic |
| Cirujano de vuelo en Tierra | `flightSurgeon` | groundDoctor |
| Perfil de misión | `MissionProfile` | environment, mode, context |
| Región del cuerpo | `BodyRegion` | bodyPart, zone, organ |
| Peligro del espacio | `SpaceHazard` (enum de 5 valores) | risk, threat |
| Contramedida | `Countermeasure` | treatment, tip, advice |
| Paso de un protocolo | `ProtocolStep` | node, stage |

#### 0.14.3 Nombres

- **Sufijos por capa:** `XxxController`, `XxxService` / `XxxServiceImpl`, `XxxRepository`, `XxxMapper`, `CreateXxxRequest` / `UpdateXxxRequest`, `XxxResponse`, `XxxException`.
- **La unidad va en el nombre** de todo valor numérico de salud o del ambiente: `heartRateBpm`, `spo2Percent`, `systolicMmHg`, `glucoseMgDl`, `bodyTemperatureCelsius`, `radiationDoseMsv`, `co2PartialPressureMmHg`, `sleepHours`, `exerciseMinutes`, `hydrationLiters`. Así nunca se confunden mmHg con ppm, ni °C con °F.
- **Fechas:** `Instant` en UTC, con nombres terminados en `At` (`recordedAt`, `createdAt`, `resolvedAt`). En la API van en formato ISO-8601.
- **Booleanos:** `isActive`, `hasSymptoms`, `requiresConfirmation`.
- **Métodos con verbo:** `evaluate`, `registerReading`, `findLatestByCrewMember`. Nada de `process`, `handle` o `doStuff`.
- **Constantes** en `UPPER_SNAKE_CASE`. Sin abreviaturas raras (`hr` no; `heartRate` sí).
- **Frontend:** componentes en `PascalCase.tsx`, hooks `useXxx.ts`, un componente por archivo. Imports con el alias `@/` en lugar de rutas `../../..`.

#### 0.14.4 Backend (Spring Boot)

1. **Inyección por constructor** con campos `final`. Nunca `@Autowired` en campos.
2. **DTOs como `record`.** En las entities, Lombok mínimo (`@Getter`, `@Setter`, `@NoArgsConstructor`). **Nunca `@Data` en entities**, porque genera `equals`/`hashCode` problemáticos con JPA.
3. **JPA:**
   - Relaciones `LAZY` por defecto.
   - Evitar relaciones bidireccionales si no se necesitan.
   - `spring.jpa.open-in-view=false`.
   - `spring.jpa.hibernate.ddl-auto=validate`: **el esquema lo maneja solo Flyway**.
4. **Sin `null` entre capas:** los repositories devuelven `Optional` y los services usan `orElseThrow(() -> new ResourceNotFoundException(...))`.
5. **Catálogo de errores:** el enum `ErrorCode` (`CREW_MEMBER_NOT_FOUND`, `READING_OUT_OF_RANGE`, `INVALID_PROTOCOL_STEP`…) se mapea a un código HTTP en `GlobalExceptionHandler`. **Nunca se devuelve un stack trace al cliente.**
6. **Configuración tipada** con `@ConfigurationProperties`, no `@Value` repartidos por el código.
7. **Validación de los JSON de reglas al arrancar** (*fail fast*): si `thresholds.json` o un protocolo están incompletos o mal formados, la aplicación **no arranca** y dice exactamente qué falta. Así un error de contenido nunca aparece en plena demo.
8. **El tiempo se inyecta:** se usa un `java.time.Clock` como bean, y el dominio recibe la hora como parámetro. Así las pruebas y el tiempo simulado son reproducibles.
9. **Logs con SLF4J,** nunca `System.out`. Los valores de salud de un tripulante no se escriben en logs de nivel INFO (privacidad).
10. **Historiales paginados** (`page`, `size`) y respuestas con la misma forma en toda la API.

#### 0.14.5 Dominio: motores sin `if` gigantes

- **Una interfaz por tipo de regla:** `IndicatorRule` con el método `evaluate(context) → RuleResult`. Cada regla es una clase pequeña:
  - `RangeRule` es genérica y sirve para todos los indicadores por rangos, leyendo `thresholds.json`;
  - `PersistenceRule`, `HysteresisRule` y `CombinationRule`.
- **`TriageEngine` solo orquesta:** aplica las reglas, toma el peor nivel y arma las explicaciones. Agregar un indicador nuevo = **una entrada en el JSON**, no un `if` nuevo.
- **El motor de emergencias es un recorrido del árbol del JSON.** No hay un `switch` por protocolo.
- **Métodos de unas 30 líneas como máximo y clases con una sola responsabilidad.** Si Claude genera un método largo, se le pide dividirlo.
- **Sin números ni textos mágicos:** los umbrales están en los JSON, los nombres en los enums y los textos en i18n.

#### 0.14.6 Frontend (React)

1. **TanStack Query** para los datos del servidor (caché, reintentos, carga y error), en lugar de `useEffect` con `fetch` repetido en cada componente.
2. **Separación clara:**
   - `pages/` arma las pantallas;
   - `components/` es presentación pura (recibe *props* y no llama a la API);
   - `hooks/` y `services/` manejan los datos.
3. **Colores del semáforo como *design tokens*** en `tailwind.config` (`level-normal`, `level-caution`, `level-alert`, `level-critical`, `level-nodata`). Se definen **una sola vez**, nunca con códigos hexadecimales repetidos.
4. **Un componente reutilizable por concepto:** `LevelBadge` (color + ícono + texto) se usa en todas partes. No se arma un semáforo distinto en cada pantalla.
5. **Ningún texto escrito directamente** en los componentes: todo pasa por i18n.
6. **Accesibilidad:** HTML semántico, `aria-label` en las regiones del SVG del cuerpo, foco visible y respeto a `prefers-reduced-motion`.

#### 0.14.7 Pruebas

- **Nombres que describen el comportamiento:** `shouldReturnCautionWhenSpo2Is93ForTwoReadings()`, con la estructura *given / when / then*.
- **Constructores de datos de prueba** (`VitalReadingFixtures.normal().withSpo2(93)`), para no repetir objetos gigantes en cada prueba.
- **Meta de cobertura solo para `domain`** (alrededor de 80 %, medida con JaCoCo). En controllers y frontend basta con probar los flujos principales a mano y con algunas pruebas de los endpoints.

#### 0.14.8 Definición de "terminado" y checklist de PR

Un cambio está **terminado** cuando:
- [ ] Hace lo que pide su sección del plan y se probó en la app.
- [ ] Pasa formato, lint, pruebas y build (el CI está en verde).
- [ ] No tiene textos escritos directamente (usa i18n), ni umbrales en el código (usa JSON), ni `any`, ni `System.out`.
- [ ] Usa los nombres del glosario (0.14.2) y lleva las unidades en los nombres.
- [ ] No deja código comentado, imports sin usar ni archivos huérfanos.
- [ ] Si está incompleto, está detrás de su *feature flag*.
- [ ] No incluye secretos ni `.env`.
- [ ] Una persona lo revisó, y el commit sigue el formato `feat:` / `fix:` / `test:` / `docs:` con la atribución de IA.

#### 0.14.9 Revisión de calidad con Claude Code durante el evento

Claude Code trae comandos que ayudan a mantener el código limpio. Se usan en puntos fijos del cronograma:

| Momento | Comando | Para qué |
|---|---|---|
| Hora 12, hora 24 y hora 36 | `/code-review` | Buscar errores en lo que se acaba de construir |
| Hora 24 y hora 38 | `/simplify` | Eliminar código duplicado, simplificar y reutilizar |
| Hora 38 | `/security-review` | Revisar exposición de secretos, validación de entradas y CORS |

**Regla para Claude:** antes de crear una clase, un componente o una utilidad nuevos, **buscar si ya existe uno** y reutilizarlo.

#### 0.14.10 Documentación mínima (que también suma puntos)

- **Comentarios que explican el *porqué*, no el *qué*.** Por ejemplo: `// Histéresis: se exigen 3 lecturas para bajar de nivel y evitar que el semáforo parpadee (regla L3)`.
- **Javadoc solo en la API pública del `domain`.**
- **Registro de decisiones** (`docs/decisiones.md`): una línea por cada decisión importante, con la fecha y el motivo. Por ejemplo: "Java + Spring Boot porque…", "las reglas viven en JSON porque…". Le muestra a los jurados que el diseño fue pensado.

#### 0.14.11 Lo que NO se hace (sobreingeniería en 48 h)

- Microservicios, arquitectura hexagonal completa, CQRS o colas de mensajes.
- Interfaces con una sola implementación **fuera de `service`** (la plantilla del equipo ya las usa ahí, y se respeta).
- Cobertura de pruebas del 100 % o pruebas automáticas de la interfaz.
- Patrones de diseño "por si acaso". Solo el *Strategy* de las reglas (0.14.5), que sí se justifica.

---

### 0.15 Recursos oficiales del 13 de noviembre: inventario y efecto en el plan

> Protocolo 5.4. Cada recurso tiene una ficha: qué trae, qué confirma, qué cambia y qué acciones genera.

#### R1. "5 Hazards of Human Spaceflight" (NASA, página actualizada el 12 de junio de 2026)

**Qué trae:** la descripción oficial de los 5 peligros del Programa de Investigación Humana, con un video por peligro.

| Peligro | Lo que dice la NASA (resumen) | Qué confirma o cambia en el plan |
|---|---|---|
| **1. Radiación espacial** | Invisible al ojo humano y "uno de los aspectos más peligrosos del vuelo espacial" | ✅ Confirma el seguimiento de la dosis y el protocolo P3. **Para la interfaz:** como es invisible, la app debe *hacerla visible* (lente de radiación D2, proyección D7) |
| **2. Aislamiento y confinamiento** | Hay respuestas de comportamiento en grupos aislados durante mucho tiempo. Las tripulaciones deben ser elegidas, entrenadas y **apoyadas** para trabajar en equipo por meses o años | ✅ Confirma el ánimo, el estrés y la misión **cooperativa** de la gamificación. ➕ **Could:** pregunta de convivencia en la autoevaluación ("¿cómo está tu relación con la tripulación?", 1–5) |
| **3. Distancia de la Tierra** | Marte está en promedio a **140 millones de millas (unos 225 millones de km)**. La misión dura **unos 3 años**, frente a los 3 días de un viaje a la Luna. Instrucciones, suministros y **atención médica** son cada vez más difíciles de recibir. **La planificación y la autosuficiencia son clave** | ✅ **Confirma la tesis central de ZeroG Vitals:** autonomía médica y *offline-first*. Es una frase oficial para el pitch. 🔄 La proyección D7 se extiende a unos 1.100 días |
| **4. Campos de gravedad** | En Marte se viviría con **3/8 de la gravedad terrestre durante hasta 2 años**. Músculos, huesos, **oído interno** y órganos se adaptan a cada nueva carga gravitacional | ✅ Confirma los perfiles de gravedad (0.2) y las regiones de hueso y músculo. ➕ **Región nueva en el mapa corporal: oído interno / equilibrio** (mareo y desorientación). ➕ **Idea:** checklist de **transición de gravedad** (al llegar a Marte o volver a la Tierra) que reutiliza el de EVA (D4): equilibrio, mareo y presión de pie y acostado |
| **5. Ambientes cerrados hostiles** | La nave es casa y máquina a la vez. Factores de habitabilidad: **temperatura, presión, iluminación, ruido, microbios** y vigilar la **respuesta inmune** | ✅ Confirma el CO₂, la temperatura y la humedad. ➕ **Could:** indicadores ambientales de **ruido** e **iluminación** y presión de la cabina. ⚠️ Los umbrales deben salir de NASA-STD-3001; no se inventan |

**Acciones que genera:**
- [x] Se agregó la región **oído interno / equilibrio** al mapa corporal (0.9.3).
- [x] Se extendió el rango de la proyección D7 a unos 1.100 días.
- [ ] Redactar el texto de los **lentes D2** a partir de estas descripciones oficiales, citando R1 en `sources.json`.
- [ ] Agregar el **mareo y la desorientación (0–10)** a la autoevaluación, ligados a la nueva región.
- [ ] Buscar en NASA-STD-3001 los límites de **ruido, iluminación y presión** de la cabina antes de agregarlos como indicadores (Could).
- [ ] Usar en el pitch la frase oficial *"Planning and self-sufficiency will be key to successful deep space missions"*, citando a la NASA.
- [ ] **Diseño:** la página usa un color por peligro (radiación morado, aislamiento azul, distancia amarillo, gravedad rojo, ambiente verde). Los lentes D2 pueden usar una paleta propia por peligro. **No copiar las ilustraciones ni usar el logo de la NASA.** Dibujar íconos propios y citar la fuente del contenido.
- [ ] La página remite a los **riesgos de salud del HRP ligados a los 5 peligros**. Revisarlos en el siguiente recurso si está disponible.

#### R2–R6. Paquete de radiación espacial (5 documentos de la NASA)

| ID | Documento | Fecha |
|---|---|---|
| R2 | *Space Radiation Won't Stop NASA's Human Exploration* (artículo del HRP) | 2017, actualizado en oct. de 2023 |
| R3 | *Hazard: Space Radiation* (página del peligro) | Actualizada en jun. de 2025 |
| R4 | *Space Radiation* (JSC: monitoreo y laboratorio de radiobiofísica) | Actualizada el 13 de mar. de 2026 |
| R5 | *Space Radiation Element* (riesgos del HRP) | Actualizada en may. de 2025 |
| R6 | *Houston We Have a Podcast* ep. 57, "Hazard 1: Radiation" (Dra. Zarana Patel), con transcripción | 2018 |

**Datos clave con su fuente:**

| Dato | Fuente | Uso en ZeroG Vitals |
|---|---|---|
| En la ISS se recibe **más de 10 veces** la radiación natural de la Tierra | R2 | Texto del lente de radiación (D2) y de la ficha |
| La radiación **no se ve ni se siente** | R3 | Justifica *hacerla visible* en la interfaz (D2, D7, barra de dosis) |
| Tipos: **rayos cósmicos galácticos (GCR)**, que vienen de supernovas y son difíciles de blindar, y **eventos de partículas solares (SPE)** y eyecciones de masa coronal, frente a los que **sí sirve refugiarse** | R2, R3, R6 | Protocolo P3. Dos lógicas distintas: acumulación crónica (GCR) y evento agudo (SPE) |
| **4 riesgos de salud:** 1) cáncer (el que más pesa en el límite de exposición); 2) sistema nervioso central (efectos cognitivos y de conducta, durante la misión y después); 3) cardiovascular y tejidos degenerativos (**cataratas**, sistema inmune, respiratorio y digestivo, envejecimiento prematuro); 4) **síndrome de radiación aguda** por eventos solares (quemaduras de piel, náuseas), que el blindaje controla bien | R4, R5, R6 | **Lente de radiación en el mapa corporal:** todo el cuerpo (cáncer), cerebro (SNC), corazón y vasos, ojos (cataratas), sangre e inmunidad, piel y sistema digestivo (síndrome agudo) |
| **Factores de dosis:** Luna ~1.5× ISS; espacio profundo 2–3× ISS; superficie de Marte ≈ ISS | R6 | Perfiles de misión (0.2) y proyección D7 |
| Misión a Marte de unos 3 años: **~9 meses de viaje en cada sentido** y más de un año en la superficie. La dosis total es **unas 10 veces** la de las misiones actuales en la ISS y **"empuja" los límites de exposición** | R6 (y R1) | Proyección D7: con estos datos, la curva **se acerca o supera** el límite de carrera de 600 mSv. Ese es el momento "wow": activar las contramedidas cambia la curva. La mayor dosis se recibe **en el viaje**, no en la superficie |
| Unidades: el **gray (Gy)** mide la dosis absorbida; el **sievert (Sv)** mide el efecto biológico (por ejemplo, 0.5 Gy de radiación espacial pueden equivaler a ~1.2 Sv) | R6 | La app muestra **mSv**. El `WhyPanel` y la ficha explican la diferencia en una frase |
| Posible umbral de enfermedad cardíaca cerca de **0.5 Gy**, todavía en estudio | R6 | Solo como texto educativo en la ficha. **No se usa como umbral de triaje** |
| La NASA monitorea 24/7 (SRAG). Los **dosímetros personales pasivos** (TLD, OSLD, PNTD) **se analizan en Tierra**; también hay monitores de área en tiempo real (TEPC, RAM, CPDS) | R4 | **Mejora de validez:** la app **estima** la dosis personal con el monitor de área del módulo × el tiempo en ese módulo (regla L8). Lo dice así, con honestidad, en la ficha y en el pitch |
| Blindajes: el **agua y el polietileno** son buenos. Ante un evento solar, se puede reacomodar el agua alrededor del refugio. Contra los GCR: menos tiempo en el espacio y blindaje del vehículo | R6 | Protocolo P3 y contramedidas de radiación (0.9.6) |
| Contramedidas **en investigación:** antiinflamatorios y antioxidantes (por ejemplo, aspirina) | R6 | ❌ **La app NO los recomienda.** Son investigación, no indicaciones. Esto refuerza la regla de "sin medicamentos" |
| "El cuerpo vive una **respuesta de cuerpo completo**": los peligros pueden sumarse o potenciarse entre sí | R6 | Respalda el mapa corporal integrado y las reglas de combinación (3.5). Es una buena frase para el pitch |
| Las cataratas son el efecto de la radiación que **sí se ha observado** en astronautas. El SANS (problemas de visión) tiene causas inciertas | R6 | Ficha de la región **ojos**: cataratas (radiación, a largo plazo) y SANS (gravedad y líquidos, durante la misión) |

**Acciones que genera:**
- [x] Perfiles de misión (0.2) con los **factores de radiación de la NASA**, en lugar de los valores ⚠️ anteriores.
- [x] Protocolo P3 actualizado: refugio, agua como blindaje, síntomas de síndrome agudo, sin EVA y sin medicamentos.
- [ ] **Barra "% del límite de carrera"** (600 mSv) en el perfil del tripulante y en la región "todo el cuerpo". Es simple y muy visual (Should).
- [ ] **Síntomas de radiación en el mapa de dolor (D3):** náuseas, vómito y enrojecimiento de la piel. Si aparecen después de un evento solar, 🔴.
- [ ] **Proyección D7:** usar las fases de la misión (viaje de ida ~270 días a 2–3×, superficie ~500 días a ~1×, regreso ~270 días a 2–3×) y las contramedidas "refugio en eventos solares" y "viaje más corto".
- [ ] Redactar el **lente de radiación (D2)** y la ficha "dosis de radiación" con estos datos, citando R2–R6 en `sources.json`.
- [ ] Agregar al glosario de la interfaz: **GCR, SPE, Gy, Sv y dosímetro**, explicados en una frase cada uno.
- [ ] Pitch: *"La radiación no se ve ni se siente. ZeroG Vitals la hace visible."*

#### R7. Páginas oficiales de los otros 4 peligros (nasa.gov/hrp, consultadas el 13 de noviembre)

| Peligro | Datos nuevos con fuente | Qué cambia en ZeroG Vitals |
|---|---|---|
| **Aislamiento y confinamiento** | **Falta de sueño, desajuste del ritmo circadiano y sobrecarga de trabajo** agravan el aislamiento y pueden bajar el desempeño y la salud. La NASA busca **monitorear la salud conductual y detectar factores de riesgo temprano**. Investiga la **terapia de luz** para el ritmo circadiano. El **diario personal** (*journaling*) es una herramienta que usan los científicos del comportamiento | ✅ Confirma el ánimo, el sueño y las tendencias (D8). ➕ **Could: bitácora diaria opcional** (2–3 líneas de texto o voz) en la autoevaluación, privada por defecto. ➕ Contramedida: **horario de luz** de la cabina para el ritmo circadiano |
| **Distancia de la Tierra** | Retraso de comunicación de **hasta 20 minutos en cada sentido**. Riesgo de fallas de equipo o **emergencias médicas**. Hay que **racionar** comida y suministros. Los astronautas deben enfrentar situaciones **con mínimo apoyo** desde la Tierra. La **fatiga de menú** (comer siempre lo mismo) puede tener consecuencias serias | 🔄 Perfiles de Marte: retraso de **hasta 20 min** (antes "4–24 min"). ✅ Confirma el modo emergencia y la autonomía. ➕ Pregunta opcional de **apetito** en la autoevaluación, ligada a la nutrición |
| **Campos de gravedad** | Mareo, pérdida ósea y muscular y problemas de visión. En una misión a Marte hay **3 campos de gravedad**: ingravidez en el viaje (**unos 6 meses**), **~1/3 g** en Marte y readaptación a la Tierra. Las transiciones afectan la orientación, la coordinación ojo-mano, el **equilibrio** y la marcha; pueden causar **mareo espacial**, **aturdimiento y desmayo**. Pérdida ósea de **1–1.5 % por mes**. Los líquidos suben a la cabeza y presionan los ojos. Riesgo de **cálculos renales** por deshidratación y pérdida de calcio. La NASA hace **pruebas de aptitud al aterrizar** | ✅ **Verifica** la pérdida ósea y los cálculos renales del mapa corporal (se quitan los ⚠️). ✅ Justifica la región **oído interno / equilibrio** (R1). ➕ **Checklist de transición de gravedad** (al aterrizar en Marte o volver a la Tierra): mareo, equilibrio, presión acostado y de pie (por el riesgo de desmayo). Reutiliza el motor de EVA (D4); pasa a **Should-A** como parte de D4. 🔄 D7: viaje de **6 a 9 meses** según la fuente (R7 dice 6, R6 dice 9). Se usa 6 por defecto, con control para cambiarlo |
| **Ambientes cerrados hostiles** | Los microbios cambian en el espacio y **pasan más fácil de persona a persona**. Pueden subir las hormonas del estrés y alterarse el sistema inmune: más **alergias** o enfermedades. Habitabilidad: temperatura, espacio, **ruido** e **iluminación** | ✅ Confirma la temperatura del cuerpo y del hábitat. ➕ Síntomas de **alergia y erupción en la piel** en el mapa de dolor (D3) |

#### R8. Riesgos oficiales del HRP (nasa.gov/hrp/risks)

La NASA define **17 riesgos específicos**. **Mejora clave de validez:** cada indicador, región del cuerpo y contramedida de ZeroG Vitals se liga a **un riesgo oficial**, y el `WhyPanel` (D1) lo muestra. Así ninguna función está "inventada".

| Riesgo oficial del HRP | Qué cubre ZeroG Vitals |
|---|---|
| Respuestas alteradas del **sistema inmune** (reactivación de virus latentes, erupciones) | Temperatura, síntoma "erupción en la piel" (D3), región sangre e inmunidad |
| Función **sensoriomotora y vestibular** alterada (mareo, coordinación, marcha) | Región oído interno, mareo (0–10), checklist de transición de gravedad |
| **Adaptaciones cardiovasculares** | FC, HRV, presión arterial, región corazón |
| **Enfermedad por descompresión** (al pasar de la nave al traje) | ➕ **Chequeo después de una EVA**: dolor en articulaciones, hormigueo, picazón en la piel y mareo → 🟠/🔴 y aviso al CMO |
| Interacciones **huésped-microorganismo** | Síntomas digestivos y de la piel (D3) |
| **Hipoxia** (incluida la hipoxia leve por los protocolos de EVA) | SpO₂, protocolo P2, criterios de EVA (D4) |
| **Alimentación y nutrición inadecuadas** | Calorías, hidratación, glucosa, apetito |
| **Lesiones y menor desempeño en EVA** (O₂ bajo, CO₂ alto, fatiga cognitiva) | Aptitud para EVA (D4), CO₂ de la cabina, fatiga |
| **Menor capacidad cardiorrespiratoria y musculoesquelética** | Minutos de ejercicio, regiones hueso y músculo, contramedidas |
| **SANS** (cambios en ojos y cerebro) | Región ojos (opcional: visión y dolor de cabeza) |
| **Cambios óseos** inducidos por el vuelo | Región huesos, ejercicio, calcio y vitamina D, proyección D7 |
| **Cambios de conducta y trastornos psiquiátricos** | Ánimo, estrés, bitácora (Could), D8 |
| **Trabajo en equipo inadecuado** | Pregunta de convivencia (Could), misión cooperativa (gamificación) |
| **Sueño inadecuado y horarios irregulares** | Sueño, modo cansancio (D9), horario de luz |
| **Apoyo inadecuado a la operación de sistemas** (la tripulación necesita la información correcta en el momento correcto) | **Es la razón de ser de ZeroG Vitals:** guías, protocolos y explicaciones en el momento justo. **Frase para el pitch** |
| **Lesiones por cargas dinámicas** (aterrizaje) | Checklist de transición de gravedad y mapa de dolor después del aterrizaje |
| **Cánceres inducidos por radiación** | Dosis acumulada, barra de % del límite de carrera, proyección D7 |

**Acciones que genera R7 + R8:**
- [x] Perfiles de Marte con un retraso de **hasta 20 min** y pérdida ósea **verificada**.
- [ ] Agregar a `sources.json` un campo `hrpRisk` por indicador, región y contramedida, siguiendo la tabla anterior. El `WhyPanel` lo muestra: *"Relacionado con: Riesgo de adaptaciones cardiovasculares (NASA HRP)"*.
- [ ] **D4 ampliado (Should-A):** tres checklists con el mismo motor:
  1. aptitud **antes** de la EVA;
  2. chequeo **después** de la EVA (descompresión);
  3. **transición de gravedad** (aterrizaje o regreso).
- [ ] **D3 ampliado:** síntomas de erupción, alergia, dolor articular, hormigueo y picazón, además de náuseas, vómito y enrojecimiento (R2–R6).
- [ ] **Could:** bitácora diaria, pregunta de convivencia, pregunta de apetito y horario de luz.
- [ ] **Pendiente:** el sitio spaceappschallenge.org no se puede abrir desde esta sesión (problema con su certificado). Si la pestaña *Resources* tiene recursos que no estén aquí (datasets de OSDR, recursos de otras agencias), hay que pasarlos por captura o PDF.

#### R9. *NASA Scientists Join White House Cancer Initiative* (NASA, 27 de octubre de 2022)

**Qué trae:** el equipo del Elemento de Radiación Espacial del HRP colabora con la iniciativa *Cancer Moonshot*. Buscan indicadores tempranos de cáncer (biomarcadores), nuevas pruebas de tamizaje para el **programa de vigilancia de salud de los astronautas**, medicamentos y suplementos para reducir el riesgo (**en investigación**) y **evaluaciones de riesgo personalizadas** con *tissue chips*.

**Relevancia para ZeroG Vitals:** baja a media. El cáncer es un riesgo **a largo plazo**: no se mide durante la misión ni genera alertas de triaje.

| Dato | Uso |
|---|---|
| El cáncer es un **riesgo a largo plazo** por la exposición a la radiación | Respalda que la app **acumule y muestre la dosis** (barra de % del límite de carrera), sin presentarse como detector de cáncer |
| La NASA busca **evaluaciones de riesgo personalizadas** (cada persona es distinta) | Respalda el enfoque de **línea base personal** y las tendencias (D8) |
| La investigación espacial busca beneficiar **también a pacientes en la Tierra** | Refuerza el cierre del pitch: aplicación en comunidades remotas de Colombia |
| Medicamentos y suplementos contra el riesgo de cáncer: **en investigación** | ❌ La app no recomienda medicamentos ni suplementos (confirma la regla) |

**Acción:** citar R9 en `sources.json` solo como contexto del riesgo "Cánceres inducidos por radiación". No genera cambios funcionales.

> **Recurso relacionado que conviene revisar:** la portada de nasa.gov destaca *"CHAPEA Mission 2 Crew Reflects After 378 Days on Simulated Mars"* (noviembre de 2026). Es una simulación de un año en Marte, muy relevante para el aislamiento, el sueño, la nutrición y el trabajo en equipo.

#### R10. *The Human Body in Space* (NASA HRP, 2021): el recurso más completo

Explica los 5 peligros con el acrónimo oficial **RIDGE** (*Radiation, Isolation, Distance, Gravity, hostile Environments*) y, para cada uno, **"The Key"**: lo que la NASA ya hace para contrarrestarlo.

| Peligro | Datos nuevos con fuente | Qué cambia en ZeroG Vitals |
|---|---|---|
| **Radiación** | Tres fuentes: partículas atrapadas en el campo magnético, partículas solares y rayos cósmicos galácticos. Los riesgos son **sobre todo a largo plazo**. La estrategia actual es **blindaje, monitoreo y procedimientos operativos**, como usar la carga de la nave como blindaje | ✅ Confirma P3 y la barra de dosis. Para el pitch: *"blindaje, monitoreo y procedimientos: ZeroG Vitals cubre el monitoreo y los procedimientos"* |
| **Aislamiento** | Tripulaciones **internacionales y multiculturales**. El sueño se altera por los ciclos de luz y oscuridad, el **ruido**, el estrés y el **día marciano, 37 minutos más largo**. Cambios de moral y motivación: extrañar a la familia, no poder ayudar en emergencias familiares. **Lo que hace la NASA:** actigrafía (movimiento y luz para medir el sueño), **iluminación LED** para el ritmo circadiano, **autotest de vigilancia y atención de 10 minutos** para medir el efecto de la fatiga, **diarios** como espacio seguro para desahogarse, realidad virtual relajante, **actividades con sentido** (aprender un idioma o habilidades médicas) y huertos espaciales | ➕ **D11 (nuevo, Should-A): prueba de vigilancia de 3 minutos.** Versión corta del autotest de la NASA: en la pantalla aparece un estímulo y el astronauta toca lo más rápido posible. Mide el **tiempo de reacción** y los **lapsos** (respuestas lentas). Es una medida **objetiva** de fatiga, no autorreportada. ✅ Respalda el bilingüe (D6), la bitácora y el modo cansancio (D9). ➕ **Reloj de misión con sol marciano:** en el perfil de Marte, los recordatorios usan el día marciano (24 h 37 min, según R10) |
| **Distancia** | La Luna está **1.000 veces más lejos** que la ISS. En Marte, la tripulación debe **resolver problemas en equipo sin control de misión** y llevar toda la comida, el equipo y los medicamentos. Los astronautas reciben entrenamiento médico, se hacen **ultrasonidos entre ellos** y pueden hacer pruebas de laboratorio. **La NASA desarrolla una arquitectura de datos médicos para herramientas de apoyo a la decisión clínica y asistentes virtuales** que ayuden a responder rápido a anomalías | ✅ **Valida la idea completa de ZeroG Vitals:** es justo una herramienta de apoyo a la decisión clínica para la tripulación. **Es la frase más fuerte para el pitch.** ✅ Respalda adjuntar imágenes de ultrasonido (Could, 0.9.8) |
| **Gravedad** | **Intolerancia ortostática** al volver a la gravedad: no se puede mantener la presión al ponerse de pie, lo que causa mareo y desmayo. La pérdida ósea de 1–1.5 % por mes queda **confirmada**; también hay pérdida muscular. Los líquidos suben a la cabeza y afectan la visión; se usan **manguitos de compresión en los muslos**. Se reporta **dolor de espalda**. La NASA usa pruebas de tareas funcionales (equilibrio después del aterrizaje), **pruebas de motricidad fina** y **autoevaluaciones periódicas de condición física**. Medicamentos en estudio: citrato de potasio y bisfosfonatos. El análisis de **orina** ayuda a prevenir cálculos renales. El ejercicio aeróbico y de resistencia protege el corazón, los huesos, los músculos y la mente, y mejora el ánimo y el equilibrio. **"Compañeros de entrenamiento generados por software"** para motivar el ejercicio | ➕ **Prueba ortostática en el checklist de transición de gravedad (D4):** presión y FC acostado y después de 1 a 3 min de pie. Señal de alerta si la sistólica baja **20 mmHg o más** o la diastólica **10 mmHg o más** (criterio clínico estándar de hipotensión ortostática, ⚠️ validar con fuente). ➕ **Región espalda / columna** en el mapa corporal. ✅ **Los compañeros de entrenamiento por software validan la gamificación** (0.9.4): es una idea que la NASA ya considera. ❌ Los medicamentos en estudio **no se recomiendan** |
| **Ambiente cerrado** | Los microbios cambian y pasan más fácil entre personas. Las hormonas del estrés suben y el sistema inmune se altera (alergias). Se vigila la calidad del aire (**formaldehído, amoníaco, monóxido de carbono**), el control térmico, la reactivación de virus latentes (con sangre y saliva) y se toman muestras con hisopos. Se cambian filtros, se limpian superficies y se trata el agua. Vacuna de la gripe y **cuarentena** antes de la misión. Iluminación LED parecida a la natural | ✅ Confirma los síntomas de alergia y erupción (D3). ➕ **Could:** recordatorios de **tareas de higiene del hábitat** (filtros, superficies) dentro de la rutina gamificada. ⚠️ Contaminantes del aire: solo si hay umbrales oficiales (NASA-STD-3001); no se inventan |

**Para el pitch (citando R10):** *"La NASA está desarrollando herramientas de apoyo a la decisión clínica y asistentes virtuales para que las tripulaciones respondan rápido a anomalías médicas lejos de la Tierra. ZeroG Vitals es un prototipo de esa idea."*

#### R11. Páginas de contexto: *Humans in Space*, *Astronauts*, *Artemis* y *Space Station Research* (nasa.gov, noviembre de 2026)

| Dato | Uso en ZeroG Vitals |
|---|---|
| **Artemis II** (abril de 2026): unos 10 días alrededor de la Luna con 4 tripulantes (NASA y CSA), récord de distancia: **252.756 millas** de la Tierra | Contexto del pitch (el enunciado lo menciona). Escenario de demo opcional: perfil "Tránsito lunar" |
| **Artemis III** (2027): demostración en órbita baja. **Artemis IV** (2028): primer alunizaje del programa. **Moon Base** cerca del **polo sur lunar** | El perfil "Base lunar" se puede llamar **"Moon Base (polo sur lunar)"** para que sea actual |
| La **Expedición 75** (julio de 2026 a primavera de 2027) prueba **herramientas de salud con realidad aumentada e IA** en la ISS | **Para el pitch:** la NASA está probando ahora mismo herramientas de salud digitales a bordo. ZeroG Vitals va en esa dirección |
| En la ISS suele haber **7 tripulantes** de varios países | Tripulación de demo de **4 a 7** personas, multinacional. Respalda el bilingüe |
| La página de la ISS no trae datos de salud específicos | Sin cambios |

#### R12. Video *Hazards of Human Spaceflight | Hazard 1: Space Radiation* (NASA Video, 3:19)

> Transcripción obtenida con el asistente de YouTube (fuente secundaria). Al citarla, conviene verificar contra el video.

| Dato | Uso |
|---|---|
| En la ISS se recibe unas **10 veces más radiación** que en la Tierra, pero mucho menos que en el espacio profundo | Confirma R2 y R6 |
| Efectos en el **sistema nervioso central**: función cognitiva alterada, **menor función motora** y cambios de conducta | Lente de radiación (D2): región cerebro. Relaciona la radiación con la prueba de vigilancia (D11) |
| Peligros: **náuseas, vómito, anorexia (pérdida de apetito), fatiga**, cataratas y enfermedad cardíaca y circulatoria | ➕ Después de un evento solar, la app pregunta por **apetito y fatiga** además de náuseas y vómito (protocolo P3 y D3) |
| El HRP estudia **biomarcadores** y **contramedidas biológicas** | Contexto. Sin medicamentos en la app |

**Acciones que generan R10–R12:**
- [x] Región **espalda / columna** en el mapa corporal. **D11** y la prueba ortostática agregadas a las prioridades (Should-A).
- [ ] Especificar D11: 3 min, estímulos a intervalos aleatorios de 2–10 s, mediana del tiempo de reacción y lapsos (> 500 ms, ⚠️ criterio a validar). Se compara con la **línea base personal** (D8), no con un valor universal. Resultado: 🟢/🟡/🟠 y entra en la aptitud para EVA.
- [ ] Reloj de misión con **sol marciano** en el perfil de Marte (recordatorios y tendencias).
- [ ] Agregar a `sources.json` las frases y datos de R10 ligados a los riesgos del HRP (R8).
- [ ] Guion del pitch: frase de apoyo a la decisión clínica (R10) y la Expedición 75 (R11).

#### R13. Videos *Hazards of Human Spaceflight* 2 a 5 (NASA Video)

> Transcripciones y resúmenes obtenidos con el asistente de YouTube (Gemini): **fuente secundaria**. Confirman casi todo lo de R7 y R10; abajo solo va lo **nuevo**.

| Video | Lo nuevo | Qué cambia en ZeroG Vitals |
|---|---|---|
| **2. Aislamiento y confinamiento** (2:54) | Los problemas de conducta en grupos encerrados mucho tiempo son **inevitables, sin importar el entrenamiento**. Riesgos: baja del **ánimo, la moral y la interacción interpersonal**, y posible **trastorno del sueño**. El viaje alterna **cargas de trabajo pesadas y periodos de aburrimiento**. La falta de comida fresca y variada aumenta la **monotonía** y puede causar **deficiencias nutricionales**. Los problemas individuales pueden generar **fallas de comunicación en el equipo**. Factores clave: **iluminación, movimiento, sueño y compañeros** | ➕ **Indicador nuevo en la autoevaluación: carga de trabajo (1–5)**, desde "aburrimiento" (1) hasta "sobrecarga" (5). Lo normal es el centro (3); **los dos extremos** dan 🟡 y, si se repiten 3 días, 🟠. Es una regla en forma de U, distinta a las demás: buen ejemplo para la explicación D1. ➕ **Moral o motivación** como pregunta opcional junto al ánimo. ✅ Confirma la pregunta de convivencia (Could) y la bitácora |
| **3. Distancia de la Tierra** (≈3 min) | La Luna está a ~238.855 millas y Marte a ~140 millones. **No habrá reabastecimiento.** Los astronautas deben manejar **emergencias médicas y fallas de equipo por su cuenta**. El HRP trabaja en **preparación médica** (qué eventos pueden ocurrir y qué habilidades, procedimientos y **equipo** se necesitan), **ultrasonido** como herramienta de diagnóstico y medicamentos resistentes al espacio | ✅ Confirma el modo emergencia y la autonomía. ➕ **Could: inventario del kit médico por perfil** (qué equipo hay a bordo: oxímetro, tensiómetro, glucómetro, desfibrilador, ultrasonido, oxígeno). Los protocolos **muestran solo los pasos posibles con el equipo disponible**. Usa el campo "equipo médico disponible" que ya tiene `MissionProfile` (0.2) |
| **4. Campos de gravedad** (3:05) | Tres campos: Tierra, espacio profundo (viaje de **6 meses**) y Marte (**3/8 de g**). Las transiciones afectan la coordinación ojo-mano, el equilibrio, la orientación, la marcha, los músculos, los huesos y el corazón. Densidad ósea: **~1 % por mes**. El HRP investiga 5 áreas: **motricidad fina**, distribución de líquidos, protocolos de ejercicio y aptitud física, **visión** y respuesta a medicamentos | ✅ Confirma el checklist de transición de gravedad y 0.38 g en Marte. ➕ **Could: ampliar D11 con una prueba de motricidad fina** (tocar objetivos en pantalla con precisión), junto a la de reacción. Juntas forman una "prueba cognitivo-motora". ✅ Respalda la región ojos y visión |
| **5. Ambientes cerrados hostiles** (3:05) | Hay que vigilar **temperatura, luz, presión, ruido y calidad del aire**. Se toman muestras de microbios de la nave y de la tripulación. El estrés altera el sistema inmune y se usan **análisis de sangre y orina**. La **iluminación LED** simula ciclos naturales de luz. **Cerrar el ciclo:** reciclar CO₂ y orina para que la nave sea autosostenible | ✅ Confirma los indicadores ambientales actuales y los opcionales (ruido, luz, presión). ✅ Respalda el horario de luz (Could). Sin cambios funcionales nuevos |

**Dato a unificar: la duración del día marciano.** Las fuentes de la NASA dicen que es "37 minutos" (R10) o "38 minutos" (video 2) más largo. El valor estándar del **sol marciano** es de **24 h 39 min 35 s** (⚠️ verificar con fuente). En `mission-profiles.json` se usa ese valor exacto, y la interfaz dice "unos 40 minutos más que un día terrestre".

**Acciones que genera R13:**
- [x] ~~Carga de trabajo 1–5~~ → reemplazada por la **escala Bedford de la NASA** + pregunta de aburrimiento (paquete de contenido, sección 0.4). Agregar **moral (1–5, opcional)** a la autoevaluación y a `thresholds.json`, ligados al riesgo "Cambios de conducta" y al de "Sueño inadecuado y horarios irregulares" (R8).
- [ ] Could: **inventario del kit médico** por perfil; los protocolos se adaptan al equipo disponible.
- [ ] Could: prueba de **motricidad fina** como extensión de D11.
- [ ] Usar el sol marciano de 24 h 39 min 35 s en el reloj de misión.

#### R14. Páginas de los 17 riesgos del HRP (nasa.gov/reference, consultadas el 13 de noviembre)

Cada página trae "¿cuáles son los riesgos?", "¿qué se puede hacer?", un dato curioso y la **descripción formal del riesgo**. Las descripciones formales se copian tal cual a `sources.json`, en el campo `hrpRisk`.

| Riesgo | Datos clave (NASA) | Qué cambia en ZeroG Vitals |
|---|---|---|
| **Sistema inmune** | Radiación, microgravedad y mal sueño alteran el sistema inmune. Pueden **despertar virus latentes** (herpes labial, **culebrilla**) y causar alergias. En la ISS se han reportado **herpes labial, erupciones, alergias atípicas e infecciones**. Se vigilan muestras de sangre, saliva y orina | ➕ D3: síntomas **herpes labial o ampollas**, **dolor o ampollas en franja** (posible culebrilla), **alergia atípica** e **infección** (fiebre). Si aparecen: 🟡/🟠 y aviso al CMO |
| **Sensoriomotor y vestibular** | Los cambios de gravedad causan mareo y desorientación, y afectan las tareas, el **manejo de vehículos** y las EVA. **La mayoría de los astronautas se marean** en el espacio, y marearse en la Tierra **no predice** el mareo espacial. Se estudia la desorientación justo después de aterrizar | ✅ Región oído interno. ➕ **Criterio de EVA y rover (D4):** mareo moderado o fuerte → NO APTO para EVA o para conducir el rover |
| **Adaptaciones cardiovasculares** | Riesgo de **coágulos**, **arritmias**, enfermedad cardiovascular y **presión baja con desmayo al aterrizar**. Contramedidas: ejercicio, dieta, **prendas de compresión** en la parte baja del cuerpo y **beber bastante líquido antes del aterrizaje**. Para Marte habrá **entrenamiento reforzado en emergencias cardiovasculares**. La baja gravedad vuelve el corazón **más esférico** | ✅ Respalda el protocolo P1 (emergencia cardiovascular) y la prueba ortostática. ➕ Checklist de transición de gravedad: recordar **hidratación y prendas de compresión** antes del aterrizaje (contramedidas sin medicamentos). ➕ D3: **hinchazón y dolor en una pierna, un brazo o el cuello** (posible coágulo) → 🟠 aviso al CMO. ➕ Texto educativo de la región corazón |
| **Enfermedad por descompresión** | Al pasar de la nave al traje de menor presión, el nitrógeno forma burbujas. Hay **dolor fuerte** y, en casos graves, problemas **para respirar** o síntomas **parecidos a un derrame cerebral**. Protocolo actual: **terminar la EVA de forma segura pero rápida y volver al ambiente presurizado**. Se previene con la **prerrespiración** de oxígeno | ➕ **Protocolo P4: síntomas durante o después de una EVA (Should).** 1) Terminar la EVA de forma segura pero rápida. 2) Volver al hábitat presurizado. 3) Avisar al CMO. 4) Síntomas graves (falta de aire, debilidad o confusión parecidas a un derrame) → 🔴. Usa el motor de emergencias existente |
| **Interacción con microorganismos** | Cambian los microbios de la piel y del intestino. Algunos microbios se vuelven **más virulentos**. Se limita el contacto con grupos grandes **dos semanas antes del lanzamiento** | ✅ Síntomas digestivos y de piel (D3). Sin cambios nuevos |
| **Hipoxia** | Las naves de espacio profundo tendrán la **cabina parcialmente despresurizada** para reducir la prerrespiración. Eso aumenta el riesgo de **hipoxia leve**: **confusión, dolor de cabeza, problemas de visión y de sueño**. Se parece al **mal de altura** y la NASA lo considera de **riesgo relativamente bajo** | ➕ `MissionProfile` agrega el campo **presión de cabina** (normal o reducida). ⚠️ **No se inventan umbrales nuevos de SpO₂:** con cabina reducida, la ficha explica que la SpO₂ puede ser algo menor y la app **cruza la SpO₂ con los síntomas** de hipoxia leve. ➕ Pregunta rápida de síntomas de hipoxia leve en la autoevaluación |
| **Alimentación y nutrición** | Las comidas deben ser aceptables, seguras, nutritivas, duraderas y **variadas para evitar la fatiga de menú**. La ISS tiene **más de 200 alimentos y bebidas**. Se redujo el sodio. La tripulación elige sus comidas preferidas | ✅ Confirma la pregunta de apetito y el registro de calorías. Sin cambios nuevos |
| **Lesiones y desempeño en EVA** | En la Luna y Marte, las EVA serán **más frecuentes y largas**. Hay protocolos de prerrespiración. **El ejercicio ayuda a soportar el peso del traje** en superficie. Récord de EVA: **8 h 56 min** | ➕ Criterio de EVA (D4): cumplimiento del ejercicio en los últimos 7 días. Chequeo después de la EVA: dolor o lesión en el mapa de dolor |
| **Capacidad cardiorrespiratoria y musculoesquelética** | En la ISS: **1.5 h al día de ejercicio, 6–7 días por semana**, más **autoevaluaciones periódicas de condición física**. Pérdida media de fuerza y capacidad aeróbica: **10–12 %**. Entre el **12 y el 38 %** pierde más del 20 %. Mayor riesgo de **caídas** en las transiciones de gravedad. **Mucha variación entre personas** | ✅ **Verifica el umbral de ejercicio.** ✅ Respalda la línea base personal (D8). ➕ Checklist de transición de gravedad: advertencia de **riesgo de caídas** los primeros días |
| **SANS** | Los líquidos suben a la cabeza: inflamación del nervio óptico, pliegues en la retina, aplanamiento del ojo e inflamación del cerebro. **Cerca del 70 %** de los astronautas de la ISS tiene algo de inflamación detrás del ojo. El riesgo aumenta con misiones más largas | ✅ Región ojos con un dato oficial. ➕ Pregunta opcional "¿notas cambios en tu visión?" → aviso al CMO (sin diagnóstico) |
| **Cambios óseos** | Pérdida de **1–1.5 % por mes** en huesos de carga (columna, caderas), en misiones de 4 a 6 meses. Riesgo de **fracturas** y **osteoporosis prematura**. Escáneres antes y después del vuelo. La columna se estira: la estatura puede **aumentar hasta 3 %** | ✅ Confirma la región huesos y D7. ✅ Explica el dolor de espalda (región columna). ❌ Los bisfosfonatos no se recomiendan |
| **Conducta y trastornos psiquiátricos** | Aislamiento y confinamiento aumentan el riesgo de **ansiedad y depresión**, que afectan el **sueño, la moral y la toma de decisiones**. Autocuidado: **diario personal** y cultivar vegetales. Las **ventanas** reducen la monotonía. La **privacidad** es prioridad: espacio del tamaño de un **apartamento tipo estudio** durante años | ✅ Confirma el ánimo, la moral y la bitácora. ➕ Could: **"ventana a la Tierra"**, un momento breve de relajación con imagen y respiración guiada, como contramedida |
| **Trabajo en equipo** | Retrasos de comunicación, más aislamiento, recursos limitados y un espacio más pequeño que la ISS: hay que **resolver conflictos**. Ejercicios de **trabajo en equipo** antes de la misión | ✅ Confirma la pregunta de convivencia y la misión cooperativa de la gamificación |
| **Sueño y horarios irregulares** | Sobrecarga de trabajo, ciclos irregulares de luz y oscuridad y sueño interrumpido. En la ISS hay **16 amaneceres al día**. Contramedidas: LED que simula el ciclo terrestre, estudio de la **luz y la cafeína**, y **tiempo designado para relajación y autocuidado** para evitar el agotamiento | ✅ Confirma la carga de trabajo (R13). ➕ Could: pregunta de **cafeína** (tazas al día y hora de la última). ➕ Contramedida: **bloque diario de autocuidado** como tarea de la rutina gamificada |
| **Apoyo a la operación de sistemas** | Hoy la tripulación depende de **asistencia en tiempo real** cuando hay problemas. En misiones lejanas tendrá que resolverlos **sin control de misión**. La NASA busca **sistemas fáciles de usar** para trabajar de forma independiente. Descripción formal: *"Risk of adverse mission outcomes due to Earth independent human-systems operation"* | ✅ **Es la razón de ser de ZeroG Vitals:** una herramienta fácil de usar, offline y paso a paso para operar **sin depender de la Tierra**. Frase del pitch con la descripción formal |
| **Lesiones por cargas dinámicas** | Riesgo de lesiones al **aterrizar**, por la transición de gravedad, la desorientación y la pérdida ósea. En la Tierra hay equipos que ayudan a salir de la nave. **En la Luna y Marte, la tripulación tendrá que salir por sí misma y funcionar de forma autónoma poco después de aterrizar** | ➕ El checklist de transición de gravedad (D4) incluye **"¿puedes salir de la nave por tus propios medios?"**: equilibrio, mareo, presión de pie y dolor (mapa de dolor) → APTO / CON AYUDA / NO APTO |
| **Cánceres inducidos por radiación** | Más radiación que en la Tierra: riesgo de **cáncer** y de **trastornos degenerativos** (corazón, vasos, ojos) y efectos en el **sistema nervioso central** (desempeño cognitivo). Hay instrumentos de medición en la ISS. Se investigan medicamentos y **evaluaciones de riesgo personalizadas**. Las misiones a la Luna y Marte salen de la **magnetósfera**. Descripción formal: *"Risk of radiation carcinogenesis"* | ✅ Confirma R2–R6 y R9: barra de % del límite de carrera y lente de radiación. Sin cambios nuevos |

**Acciones que genera R14:**
- [x] Umbral de ejercicio **verificado** (1.5 h/día, 6–7 días/semana).
- [ ] **P4 (descompresión)** como protocolo Should, con el motor de emergencias existente.
- [ ] D3: herpes labial o ampollas, posible culebrilla, alergia atípica, infección, hinchazón con dolor en una extremidad o el cuello (coágulo) y síntomas graves de descompresión.
- [ ] D4: mareo moderado o fuerte → NO APTO para EVA o rover. Cumplimiento del ejercicio. En la transición de gravedad: hidratación, prendas de compresión y advertencia de caídas.
- [ ] `MissionProfile`: campo **presión de cabina**. La SpO₂ se cruza con los síntomas de hipoxia leve (sin umbrales nuevos inventados).
- [ ] Could: cafeína, bloque de autocuidado, "ventana a la Tierra" y pregunta de visión.
- [ ] `sources.json`: copiar la **descripción formal** de cada riesgo en el campo `hrpRisk`.

#### Resumen del inventario de recursos (13 de noviembre)

| Tema | Recursos | Estado |
|---|---|---|
| Los 5 peligros (páginas oficiales) | R1, R3, R7 | ✅ Revisados |
| Radiación (artículos, laboratorio, riesgos, podcast, video) | R2–R6, R9, R12 | ✅ Revisados |
| Riesgos oficiales del HRP (17) | R8 | ✅ Revisados y ligados a la app |
| *The Human Body in Space* | R10 | ✅ Revisado (el recurso más valioso) |
| Contexto: Artemis, astronautas, ISS | R11 | ✅ Revisados |
| Videos de los peligros 2–5 | R13 | ✅ Revisados (fuente secundaria) |
| Pestaña *Resources* de spaceappschallenge.org | — | ⚠️ No se puede abrir desde esta sesión. Confirmar con capturas si hay recursos adicionales (datasets de OSDR, otras agencias) |
| Páginas de los **17** riesgos del HRP | R14 | ✅ Revisadas (todas) |
| Video *Journaling* y artículo de CHAPEA | — | Opcionales |

---

### 0.16 Estado del plan y estimación de tiempo (13 de noviembre, noche antes del evento)

#### 0.16.1 Registro de cambios del plan (31 oct – 13 nov)

**➕ Agregado**

| Fecha | Qué se agregó | Sección |
|---|---|---|
| 1 nov | Stack, roles, umbrales por defecto, arquitectura en capas, reglas L1–L12, protocolo del 13 de noviembre | 1–5 |
| 3 nov | Requisitos del video: **modo emergencia** (P1–P3), **guías de medición**, **recordatorios**, **perfiles de misión** y aplicación en la Tierra | 0.1–0.8 |
| 3 nov | Estructura del repositorio basada en la plantilla del equipo (Spring Boot), con `domain` y `simulation` | 4.4 |
| 7 nov | Enunciado oficial: **mapa corporal interactivo**, glucosa, ánimo y ejercicio, **gamificación**, escalamiento, contramedidas, rover y cámara | 0.9 |
| 8 nov | **Diferenciadores D1–D10**, oleadas y *feature flags* · recuento del estado · equipo formado en la sede · desarrollo con Claude y `CLAUDE.md` · estándares de código limpio | 0.10–0.14 |
| 13 nov | Recursos oficiales R1–R14. A partir de ellos: **D11** (prueba de vigilancia), **P4** (descompresión), D4 con 3 checklists (antes y después de la EVA, transición de gravedad con prueba ortostática y salida autónoma), regiones **oído interno** y **espalda**, **carga de trabajo**, presión de cabina, sol marciano, factores de radiación de la NASA y **ligado de todo a los 17 riesgos oficiales del HRP** | 0.15 |

**🔄 Cambiado**

| Antes | Ahora | Motivo |
|---|---|---|
| Backend en TypeScript (recomendado) | **Java 21 + Spring Boot 3** | Plantilla y dominio del equipo |
| Motor de triaje compartido en TS | **Reglas en JSON** + intérprete en el front | Backend en Java |
| Radiación por perfil con valores ⚠️ | **Factores de la NASA** (Luna 1.5×, espacio profundo 2–3×, Marte ≈ ISS) | R6 |
| Retraso con Marte de 4–24 min | **Hasta 20 min** | R7, R10 |
| Proyección D7 de 0–900 días | **0–1.100 días**, viaje de 6 meses por defecto | R1, R7 |
| Ejercicio "~2 h/día" | **1.5 h/día, 6–7 días/semana** (verificado) | R14 |
| Pérdida ósea ⚠️ | **1–1.5 %/mes** (verificado) | R7, R10, R14 |
| Dashboard y simulador como Must | Dashboard **Should**; simulador **Could** | El enunciado prioriza la herramienta visual de autoevaluación |
| Los 5 peligros mal listados en el documento principal | Corregidos (RIDGE) | Enunciado y R1 |

**❌ Eliminado o descartado**

| Qué | Motivo |
|---|---|
| Mezclar Java y TypeScript en el backend, y Prisma | Un solo lenguaje |
| `neon.ts` y el `package.json` de la raíz | Innecesarios con Spring |
| Arquitectura hexagonal completa | Sobreingeniería en 48 h (se conserva el dominio aislado) |
| Autenticación con Cloudflare | Depende de internet y contradice el *offline-first* |
| Hardware y sensores reales, frecuencia cardíaca por cámara, asistente conversacional | El reto pide software; riesgo alto en 48 h (Won't) |
| Recomendar medicamentos o suplementos | Son investigación de la NASA, no indicaciones médicas |

#### 0.16.2 Qué falta (en teoría) antes de empezar a programar

| Prioridad | Pendiente | Esfuerzo estimado | ¿Bloquea el MVP? |
|---|---|---|---|
| 🔴 | **Paquete de contenido** listo para convertir a JSON: fichas de medición (hay 2 de unas 14), árboles P1–P4, `body-map.json` (11 regiones con lentes), contramedidas, criterios de D4, insignias y `sources.json` con `hrpRisk` | 8–12 h (3–4 h con Claude + revisión) | **Sí.** Sin esto, Claude inventaría contenido médico |
| 🔴 | **Tabla de casos de prueba** (hay 8 de unos 45) | 2–3 h (1 h con Claude) | Sí, para el motor de triaje |
| 🔴 | **Confirmar las reglas** (qué se puede preparar antes, formato del video, política de IA) y revisar la pestaña *Resources* (datasets de OSDR) | 30 min | Sí (riesgo de descalificación) |
| 🟠 | Aprobar las reglas **L1–L12** | 30 min | No; tienen valores por defecto |
| 🟠 | **Validar con fuentes:** rangos de signos vitales, glucosa, prueba ortostática (20/10 mmHg), lapso de la prueba de vigilancia (500 ms), duración del sol marciano | 2 h | No (van marcados con ⚠️) |
| 🟠 | **Bocetos** de 5 pantallas y **figura humana en SVG** | 2–3 h | No, pero ahorra mucho tiempo al front |
| 🟡 | Modelo de datos detallado y contrato de la API | 1–2 h | No (Claude lo genera en la hora 1 desde 4.5 y 4.6) |
| 🟡 | Guion del pitch y del video en inglés · plan de contingencia | 1–2 h | No (se hace en la hora 36+) |
| ✅ | Portátil listo, Claude Code probado, **datos móviles de respaldo** | 1 h | Sí, el día del evento |

#### 0.16.3 Estimación de esfuerzo (horas-persona, desarrollando con Claude)

> ⚠️ Estimación orientativa con un margen de **±30 %**. Supone que el **paquete de contenido llega preparado**. Si no, hay que sumar **10–15 h-persona** al MVP.

| Bloque | Componentes | h-persona |
|---|---|---|
| **MVP (Ola 1)** | Setup, Docker, CI, i18n y flags (4) · modelo de datos y migraciones (4) · contenido → JSON (3) · motor de triaje con pruebas, D1 y escalamiento (8) · API del MVP (6) · base del frontend (4) · autoevaluación guiada (6) · **mapa corporal SVG animado** (8) · gráficas (3) · **emergencia P1** con metrónomo y bitácora (7) · contramedidas (2) · offline (5) · integración y datos de demo (6) | **≈ 72** |
| **Ola 2 (Should-A + Should)** | D2 (3) · D3 (5) · D4 con 3 checklists (7) · D5 (3) · traducción al inglés (3) · perfiles (4) · recordatorios (4) · gamificación (6) · P2, P3 y P4 (4) · D11 (4) | **≈ 43** |
| **Ola 3 (Could-A)** | D7 (5) · D8 (5) · D9 (3) · D10 (4) | **≈ 17** |
| **Fuera del código** | Ensayo de la demo, README, video y ficha del proyecto | **≈ 12** |
| **Plan completo** (sin los Could sueltos) | | **≈ 144** |

#### 0.16.4 ¿Alcanzan las 48 horas?

**Capacidad real por persona:** unas **30 h productivas**. Se descuentan el sueño (unas 8–10 h en turnos), las comidas, la apertura, la formación del equipo y el kit de bienvenida. Cuanta más gente, más tiempo se va en coordinación.

| Integrantes | Capacidad útil para código* | Qué se alcanza | Veredicto |
|---|---|---|---|
| **1** | ~22 h | Solo el **MVP reducido**, en la variante solo frontend (0.12.5): autoevaluación, triaje con D1, mapa corporal simple y P1 | ❌ El plan no alcanza; el MVP reducido sí, con esfuerzo |
| **2** | ~45 h | MVP reducido completo y parte del MVP normal | ⚠️ Ajustado: el MVP completo no entra |
| **3** | ~69 h | **MVP casi completo** (72 h). Sin Ola 2 | ⚠️ Justo: hay que recortar algo pequeño del MVP (por ejemplo, el offline avanzado) |
| **4** | ~94 h | MVP + **la mitad de la Ola 2** (por ejemplo D3, D4, D5 y la traducción) | ✅ Bien |
| **5** | ~115 h | MVP + **casi toda la Ola 2** | ✅ Muy bien |
| **6** | ~136 h | MVP + Ola 2 + **parte de la Ola 3** | ✅ Casi el plan completo |

\* Capacidad útil = integrantes × 30 h × (1 − coordinación) − 12 h fuera del código.

**Conclusión:**
- Las 48 h **alcanzan para un MVP sólido con 3 o más personas**.
- **El plan completo (~144 h) no entra con ningún tamaño de equipo** sin quitar horas de sueño, y eso no se recomienda. Para eso existen las oleadas y los *feature flags*: se construye en orden de prioridad y se apaga lo que no esté listo a la hora 38.
- **Los dos factores que más tiempo ahorran:** llegar con el **paquete de contenido** listo (10–15 h-persona) y con la **figura SVG** resuelta.

#### 0.16.4b Política de fuentes: ligados a la NASA (decisión del 13 de noviembre)

- **Solo** recursos del reto (HRP), otros documentos oficiales de la NASA (NASA-STD-3001, OCHMO) y de otras agencias espaciales. **Nada de guías clínicas externas.**
- **Signos vitales:** Precaución y Alerta según la **desviación de la línea base personal** (15 % y 30 %, propuesta del equipo), en línea con la variabilidad individual que describe la NASA. Los límites críticos absolutos son **valores de demostración configurables por el CMO** (`CMO_CONFIGURABLE`).
- **Emergencias:** guías de coordinación para una tripulación **entrenada**. La RCP y los pasos clínicos remiten al entrenamiento médico de la misión, y el metrónomo es configurable.
- **Pitch:** *"Los límites clínicos los define el equipo médico de vuelo. ZeroG Vitals los aplica, los explica y escala; todo lo demás está ligado a los riesgos oficiales del HRP de la NASA."*
- **Detalle:** sección 0 del paquete de contenido.

#### 0.16.4c Más datos con respaldo NASA (búsqueda del 13 de noviembre)

Se revisaron la colección de *technical briefs* de OCHMO (nasa.gov/ochmo) y **NASA-STD-3001 Vol. 1 Rev. C**. Quedan con fuente NASA:
- **Sueño:** 7–9 h; 8.5 h de periodo de sueño; nadir circadiano de 1 a 7 a. m.
- **Hidratación:** 2.5 L/día.
- **Calorías:** ecuación EER.
- **Carga de trabajo:** escala Bedford.
- **Mareo espacial:** escala oficial 0–3.
- **Descompresión:** Tipo I y II.
- **Coágulos y visión.**
- **Hipotermia:** menos de 35 °C.
- **Límites relativos a la línea base:** la norma misma los usa (≥ 80 % de fuerza, ≥ 95 % de densidad ósea).

**Siguen sin fuente NASA:** los límites críticos de FC, presión, SpO₂, FR y glucosa (`CMO_CONFIGURABLE`, porque la norma remite a "valores clínicamente aceptados"), la prueba ortostática, el lapso de la prueba de vigilancia y el ritmo de RCP.

**Detalle:** sección 0.4 del paquete de contenido.

#### 0.16.4d Búsqueda nocturna (13 de noviembre): más respaldo NASA

- **D11:** es la versión de ZeroG Vitals del **Reaction Self Test** que la NASA usa en la ISS (prueba de 3 min, ayuda personalizada contra la fatiga). Agrega **factores de fatiga** con fuente NASA (S32).
- **Sol marciano:** 24 h 39 min 35 s (NASA NSSDC, S33).
- **P1:** estructura del procedimiento *CHEST PAIN* del **Medical Checklist** de la NASA.
- **P4:** escala **Cuff Class 1–4** de la NASA y chequeo neurológico (S34).
- **Detalle:** sección 0.5 del paquete de contenido.

#### 0.16.5 Línea de tiempo estimada (con Claude y el stack simplificado del 13 de noviembre)

> Las horas-persona de 0.16.3 **ya suponen desarrollo con Claude**. Sin Claude, el mismo alcance tomaría unas **2 a 3 veces más**. Con el stack simplificado (sin Security ni MapStruct, con `localStorage`), el MVP baja a unas **68 h-persona**. La tabla muestra **en qué hora del evento** quedaría listo cada bloque.

| Integrantes | MVP listo en… | Ola 2 | Ola 3 | Resultado probable a la hora 42 (congelamiento) |
|---|---|---|---|---|
| **1** | MVP reducido (~25 h-persona) hacia la **hora ~40** | — | — | MVP reducido, justo |
| **2** | MVP reducido hacia la **hora ~22**; el MVP completo no termina | — | — | MVP reducido + parte del MVP |
| **3** | **Hora ~40** | — | — | MVP completo, muy justo |
| **4** | **Hora ~31** | ~1/3 a la hora 38 | — | MVP + D3, D4 y la traducción |
| **5** | **Hora ~26** | ~3/4 a la hora 38 | — | MVP + casi toda la Ola 2 |
| **6** | **Hora ~22** | Completa hacia la hora ~36 | Un poco | MVP + Ola 2 + algo de la Ola 3 |

**Por qué Claude no lo hace todo "instantáneo":** Claude escribe el código en minutos, pero el tiempo se va en **revisar, probar, integrar front y back, corregir errores, decidir el diseño y validar el contenido**. Además hay riesgos externos: el **wifi** de la sede y los **límites de uso** del plan de Claude.

**Cómo acelerar al máximo:**
1. Llegar con el **paquete de contenido** listo (−10 a −15 h-persona).
2. **Una sesión de Claude Code por persona**, cada una en su propio módulo o carpeta (4.4), con el mismo `CLAUDE.md`. Así se trabaja en paralelo sin choques.
3. **Una persona integra** (Rol 1): revisa los PR, une ramas y mantiene la demo funcionando.
4. Seguir la **biblioteca de prompts** (0.13.4) en orden. Nada de Could antes de tener el MVP.
5. Tener resuelta la **figura SVG** del cuerpo antes de la hora 8.

---

## 1. Stack tecnológico (decisión tomada el 3 de noviembre)

> **Ajuste del 13 de noviembre (para ganar tiempo):** se quitan **Spring Security** del MVP (vuelve solo con el PIN) y **MapStruct** (mappers manuales), y se usa **`localStorage`** en lugar de IndexedDB para la caché offline. Siguen siendo **2 lenguajes**: Java y TypeScript, más SQL para Flyway.
>
> **Identificación de usuarios:** en el MVP, **selector de tripulante sin contraseña** con vista de CMO. Como Should, **PIN de 4 dígitos + roles CREW / CMO**. El login completo queda como Won't. **El botón EMERGENCIA nunca pide identificación.**

> **Decisión:** el backend será **Java 21 con Spring Boot 3** (Maven), siguiendo la estructura de proyecto que el equipo ya conoce (sección 4.4). Así se cumple la regla de **un solo lenguaje en el backend**.

| Capa | Tecnología | Motivo |
|---|---|---|
| Frontend | **React + TypeScript + Vite + Tailwind CSS** | TypeScript detecta errores al escribir. Vite arranca en segundos. |
| Backend | **Java 21 + Spring Boot 3 + Maven (wrapper `mvnw`)** | El equipo ya domina esta estructura por capas. Spring Web, Validation y Data JPA. **Spring Security solo si se implementa el PIN (Should)**: agregada sin configurar, bloquea todos los endpoints. |
| Base de datos | **PostgreSQL 16** | Sólida, relacional y buena para series de tiempo de telemetría. |
| Migraciones | **Flyway** | El esquema de la base de datos queda versionado en archivos SQL dentro del repo. |
| Mappers | **Manuales** (un método `from()` en cada DTO o una clase `XxxMapper` simple). ❌ Sin MapStruct | Con Lombok, MapStruct suele dar problemas al compilar, y con Claude los mappers manuales salen en segundos. |
| Documentación de la API | **springdoc-openapi (Swagger UI)** | Los jurados y el frontend ven y prueban todos los endpoints en `/swagger-ui.html`. |
| Infraestructura | **Docker + docker-compose** | Levanta Postgres, la API y el front con un solo comando. |
| Gráficas | **Recharts** | Fácil de usar para mostrar vitales en el tiempo. |
| Demo pública (opcional) | **Render** (backend y front) + **Neon** (Postgres en la nube) | Un enlace en vivo para los jurados. El modo principal sigue siendo local, porque el servidor representa el computador del hábitat. |

### Cómo se resuelve el modo offline con un backend en Java

Con un backend en TypeScript, el motor de triaje se podía copiar tal cual al navegador. Con Java eso no es posible, así que se resuelve así:

1. **Las reglas viven en archivos JSON, no en código:** `thresholds.json`, `emergency-protocols.json`, `measurement-guides.json` y `mission-profiles.json`. El backend los lee desde `resources/data/`.
2. **Al iniciar, el frontend descarga esa configuración** (`GET /api/config`) y la guarda en **`localStorage`** (son pocos JSON). IndexedDB solo si después se guardan muchos registros offline.
3. **El frontend tiene un intérprete pequeño en TypeScript:**
   - Recorre los árboles de emergencia del JSON. Con eso **el modo emergencia funciona 100 % sin servidor**.
   - Aplica un triaje básico de respaldo: el nivel de cada indicador según los umbrales y la regla del peor nivel.
4. **El backend en Java tiene el motor completo:** persistencia, histéresis, combinaciones, alertas y el historial.

Así las reglas están en un solo lugar (los JSON) y no hay dos motores que mantener en paralelo.

### Arquitectura de alto nivel

```
┌──────────────────────────────┐    REST/JSON    ┌─────────────────────────────────┐
│  Frontend (React + TS)       │ ◄─────────────► │  Backend (Java 21 + Spring Boot)│
│  - Autoevaluación guiada     │                 │  - Controllers / Services       │
│  - Modo emergencia           │                 │  - Motor de triaje (domain)     │
│  - Dashboard                 │                 │  - Motor de emergencias (domain)│
│  - Intérprete offline de los │                 │  - Simulador de datos           │
│    JSON (respaldo)           │                 │  - Lee resources/data/*.json    │
│  - localStorage (caché)      │                 └───────────────┬─────────────────┘
└──────────────────────────────┘                                 │
                                                 ┌───────────────▼─────────────────┐
                                                 │  PostgreSQL 16 (Docker)         │
                                                 └─────────────────────────────────┘
          Todo se levanta con:  docker compose up
```

**Concepto clave para el pitch:** el servidor representa el computador del hábitat o la nave, no un servidor en la Tierra. La app no depende de comunicación con la Tierra.

---

## 2. Roles del equipo

> *Los roles se asignan en la hora 0 del evento, según la encuesta de habilidades (0.12.4). Para equipos de 1 a 3 personas, ver 0.12.3.*

### Roles definidos (para 6 personas)

| # | Rol | Responsabilidades principales | Entregables clave |
|---|---|---|---|
| **1** | **Líder técnico / DevOps** | Crear el repo y las ramas, el `docker-compose`, revisar PRs, integrar front y back, resolver bloqueos y vigilar el tiempo. | Repo funcionando en la hora 2, entorno Docker estable, demo integrada al final. |
| **2** | **Backend: API y base de datos** | Modelo de datos (tripulante, lectura, alerta, autoevaluación), migraciones y endpoints REST. | API documentada (lista de endpoints en el README) y base de datos con datos semilla. |
| **3** | **Backend: motor de triaje y simulador** | Implementar las reglas de la sección 3, la puntuación global y el generador de datos sintéticos (normales y anómalos). | Módulo `triage` probado y escenarios de demo (astronauta sano, con fatiga, con hipoxia, tormenta solar). |
| **4** | **Frontend: dashboard** | Vista principal: tarjetas de vitales con semáforo, gráficas en el tiempo y panel de alertas. | Dashboard conectado a la API. |
| **5** | **Frontend / UX: autoevaluación** | Diseño en Figma, formulario de autoevaluación (fatiga, estrés, sueño, síntomas), recomendaciones de acción y accesibilidad (alto contraste, botones grandes). | Mockups en las primeras 4 h, flujo de autoevaluación y guía de estilo. |
| **6** | **Datos NASA, documentación y pitch** | Validar los umbrales con fuentes NASA, escribir el README (incluida la declaración de uso de IA), grabar y editar el video y llenar la ficha en spaceappschallenge.org. | README completo, video final y ficha del proyecto enviada. |

### Cómo repartir si son menos

| Tamaño | Reparto |
|---|---|
| **6 personas** | Un rol por persona (tabla anterior). |
| **5 personas** | El rol 6 (documentación y pitch) se reparte: el **rol 1** escribe el README y el **rol 5** hace el video. La validación de datos NASA pasa al **rol 3**. |
| **4 personas** | **A:** Líder + DevOps + README. **B:** Backend completo (API, base de datos y motor de triaje). **C:** Frontend dashboard + simulador de datos en el cliente. **D:** UX + autoevaluación + datos NASA + video. |

### Reglas de trabajo en equipo
- **Ramas:** `main` (siempre demostrable), `develop` y `feature/<nombre>`. Se integra con PR revisado por el líder.
- **Commits frecuentes y descriptivos**, porque los jurados revisan el historial de las 48 h. Formato: `feat: ...`, `fix: ...`, `docs: ...`.
- **Contratos primero:** en la hora 1 se acuerdan los tipos y endpoints (sección 4). Así front y back trabajan en paralelo con datos falsos.
- **Revisión de avance (stand-up) cada 6 horas** (unos 10 minutos): qué hice, qué sigue y qué me bloquea.
- **Turnos de descanso:** que nunca duerman todos a la vez y que nadie pase más de unas 20 h sin dormir.

### Cronograma sugerido de las 48 h

| Bloque | Horas | Objetivo |
|---|---|---|
| 0 | 0–2 | Kickoff, repo, Docker, i18n (D6) y *feature flags* desde el inicio, contratos de datos, migración inicial de Flyway. |
| 1 | 2–12 | MVP: API + BD + motor de triaje con explicaciones (D1) + autoevaluación guiada + mapa corporal básico. |
| 2 | 12–24 | Modo emergencia P1, gráficas, contramedidas y offline. **Hito: demo de extremo a extremo del MVP (hora 24).** |
| 3 | 24–34 | **Ola 2:** D2, D3, D4, D5, traducción al inglés, perfiles, recordatorios y gamificación. |
| 3b | 30–38 | **Ola 3** (quien esté libre): D7, D8, D9 y D10. **Corte a la hora 38:** lo que no funcione se apaga con su flag. |
| 4 | 38–44 | Pulido, ensayo de la demo (con wifi apagado), README, declaración de uso de IA y video. **Se congela el código en la hora 42.** |
| 5 | 44–48 | Envío de la ficha, revisión final y margen para imprevistos. |

---

## 3. Funcionamiento por defecto: rangos y estado de salud

> ⚠️ **Advertencia para el README y el pitch:** estos umbrales son referenciales y se usan para el prototipo. No constituyen un diagnóstico médico. En una misión real, los médicos de vuelo personalizan los umbrales para cada tripulante.

### 3.1 Niveles de estado

| Nivel | Color | Significado | Acción del sistema |
|---|---|---|---|
| **NORMAL** | 🟢 Verde | Dentro del rango esperado. | Solo registra. |
| **PRECAUCIÓN** | 🟡 Amarillo | Desviación leve. Vigilar. | Muestra una recomendación de autocuidado y sube la frecuencia de medición. |
| **ALERTA** | 🟠 Naranja | Desviación significativa. | Pide una autoevaluación inmediata y avisa al oficial médico de la tripulación (CMO). |
| **CRÍTICO** | 🔴 Rojo | Riesgo inmediato. | Alarma visual y sonora, protocolo de emergencia en pantalla y aviso a toda la tripulación. |

### 3.2 Signos vitales (rangos clínicos de adulto en reposo)

| Indicador | 🟢 Normal | 🟡 Precaución | 🟠 Alerta | 🔴 Crítico |
|---|---|---|---|---|
| **Frecuencia cardíaca (lpm)** | 60–100 | 50–59 o 101–110 | 40–49 o 111–130 | < 40 o > 130 |
| **SpO₂ (%)** | ≥ 95 | 92–94 | 88–91 | < 88 |
| **Presión sistólica (mmHg)** | 90–129 | 130–139 | 140–179 o 80–89 | ≥ 180 o < 80 |
| **Presión diastólica (mmHg)** | 60–84 | 85–89 | 90–119 | ≥ 120 |
| **Temperatura corporal (°C)** | 36.1–37.5 | 37.6–38.0 o 35.5–36.0 | 38.1–39.0 o 35.0–35.4 | > 39.0 o < 35.0 |
| **Glucosa en sangre (mg/dL)** ➕ | 70–140 | 141–180 o 60–69 | 181–250 o 54–59 | > 250 o < 54 |
| **Frecuencia respiratoria (rpm)** | 12–20 | 21–24 o 10–11 | 25–29 o 8–9 | ≥ 30 o < 8 |
| **HRV (RMSSD)** | ≥ 90 % de la línea base personal | 70–89 % | 50–69 % | < 50 % |

**Notas:**
- **HRV:** no existe un valor universal. Se compara contra la **línea base del propio tripulante**, que se calcula con las primeras lecturas simuladas o con datos previos al vuelo. Una caída sostenida indica estrés o fatiga.
- **Microgravedad:** en el espacio la sangre se desplaza hacia la cabeza y el volumen de plasma baja. Es común que la frecuencia cardíaca y la presión en reposo cambien levemente. Este punto es bueno para el pitch: los umbrales son **configurables por tripulante**.
- La presión en cabina de la ISS es similar a la del nivel del mar, así que los rangos de SpO₂ terrestres son aplicables.

### 3.3 Parámetros ambientales (basados en NASA-STD-3001)

| Indicador | 🟢 Normal | 🟡 Precaución | 🟠 Alerta | 🔴 Crítico | Fuente / nota |
|---|---|---|---|---|---|
| **CO₂ en cabina (ppCO₂, promedio de 1 h)** | ≤ 2.5 mmHg | 2.6–3.0 mmHg | 3.1–5.0 mmHg | > 5.0 mmHg | NASA-STD-3001 Vol. 2 Rev D (V2 6004) limita el promedio de 1 h a **3 mmHg**. La conversión aproximada es 1 mmHg ≈ 1.300 ppm a nivel del mar. |
| **Temperatura del hábitat (°C)** | 20–25 | 18–19.9 o 25.1–27 | 16–17.9 o 27.1–30 | < 16 o > 30 | Zona de desempeño 20–25 °C; límite operativo de salud 18–27 °C. |
| **Humedad relativa (%)** | 30–60 | 25–29 o 61–75 | 20–24 o 76–80 | < 20 o > 80 | Zona de desempeño 30–60 %. |
| **Dosis de radiación diaria (mSv/día)** | ≤ 0.5 | 0.51–1.0 | 1.01–10 | > 10 (posible evento solar) | En la ISS la dosis típica es de unos 0.5 mSv/día (rango de 0.2 a 1). |
| **Dosis de radiación acumulada en la carrera (mSv)** | < 300 (< 50 %) | 300–449 (50–74 %) | 450–539 (75–89 %) | ≥ 540 (≥ 90 %) | **Límite de carrera de la NASA: 600 mSv** (igual para todas las edades y sexos). |
| **Dosis por evento solar (mSv)** | — | — | ≥ 100 | ≥ 250 | Límite de 250 mSv por evento de partículas solares (SPE). |

### 3.4 Salud conductual y fisiológica (autoevaluación)

| Indicador | 🟢 Normal | 🟡 Precaución | 🟠 Alerta | 🔴 Crítico |
|---|---|---|---|---|
| **Horas de sueño (últimas 24 h)** | ≥ 7 | 6–6.9 | 4–5.9 | < 4 (o < 5 durante 3 días seguidos) |
| **Fatiga autorreportada (escala 1–10)** | 1–3 | 4–6 | 7–8 | 9–10 |
| **Estrés autorreportado (escala 1–10)** | 1–3 | 4–6 | 7–8 | 9–10 |
| **Hidratación (L/día)** | ≥ 2.0 | 1.5–1.9 | 1.0–1.4 | < 1.0 |
| **Ingesta calórica (% del objetivo personal)** | 90–110 % | 75–89 % | 50–74 % | < 50 % |
| **Estado de ánimo (1–5)** ➕ | 4–5 | 3 | 2 (o 3 durante 3 días seguidos) | 1 (o 2 durante 2 días seguidos) |
| **Ejercicio (min/día)** ➕ | ≥ 90 | 60–89 | < 60 durante 2 días seguidos | — |

- La NASA programa unas **8.5 h** de periodo de sueño en la ISS, pero los astronautas suelen dormir unas 6 h. Por eso la falta de sueño es un riesgo frecuente.
- La escala de fatiga y estrés del 1 al 10 es una simplificación para la demo. Si sobra tiempo, se puede citar una escala validada (por ejemplo, Samn-Perelli para fatiga, de 7 puntos).

### 3.5 Lógica de clasificación global

1. **Cada indicador** recibe un nivel (Normal = 0, Precaución = 1, Alerta = 2, Crítico = 3).
2. **Estado global del tripulante = el peor nivel individual.** Un solo indicador crítico vuelve crítico el estado global. Así nunca se oculta un riesgo con un promedio.
3. **Reglas de escalamiento por combinación:**
   - 3 o más indicadores en Precaución al mismo tiempo → el estado global sube a **Alerta**.
   - SpO₂ en Precaución **y** CO₂ de cabina en Alerta → **Alerta ambiental** (posible problema del sistema de soporte vital, afecta a toda la tripulación).
   - Frecuencia cardíaca alta + HRV baja + estrés ≥ 7 → recomendación de salud conductual.
   - Dosis diaria > 10 mSv → **protocolo de tormenta solar**: ir al refugio blindado.
4. **Persistencia (evita falsas alarmas):** Precaución y Alerta solo se activan si la condición se mantiene en **2 lecturas consecutivas** o en al menos 5 minutos. Crítico se activa de inmediato.
5. **Puntaje de bienestar (0–100) para el dashboard:** `100 − (suma de niveles ponderados)`. Es solo visual; la decisión siempre la toma la regla del peor nivel.

### 3.6 Acciones recomendadas por defecto (ejemplos)

| Situación | Recomendación en pantalla |
|---|---|
| SpO₂ baja | "Respire profundo durante 2 minutos. Verifique que el sensor esté bien colocado. Si persiste, use oxígeno suplementario y avise al CMO." |
| CO₂ alto | "Revise el estado del sistema de eliminación de CO₂. Muévase a un módulo con mejor ventilación. Posibles síntomas: dolor de cabeza y dificultad para concentrarse." |
| Sueño insuficiente | "Priorice el sueño en el próximo ciclo. Evite tareas críticas si es posible. Reduzca la exposición a pantallas antes de dormir." |
| Frecuencia cardíaca alta en reposo | "Deténgase y descanse 10 minutos. Hidrátese. Se repetirá la medición automáticamente." |
| Evento de radiación | "Diríjase al refugio de radiación de inmediato. Lleve su dosímetro." |
| Estrés alto | "Ejercicio de respiración guiada (4-7-8). Considere una llamada privada de apoyo psicológico en la próxima ventana de comunicación." |

---

## 4. Arquitectura en capas del backend y contratos de datos

> Esta sección es una descripción, no código. Se acuerda en la hora 0 y se implementa durante el evento.

### 4.1 Capas: ajustes al modelo clásico

El modelo clásico es Controller → Service → Repository → Entity. Para ZeroG Vitals lo ajusté así:

| Cambio | Capa | Por qué |
|---|---|---|
| ➕ **Agregada** | **DTO + Validación** | Evita exponer las tablas de la base de datos en la API y rechaza datos imposibles (por ejemplo, SpO₂ = 140) antes de que lleguen a la lógica. |
| ➕ **Agregada** | **Dominio: motor de triaje** | Es la parte más importante del proyecto. Se separa del Service para que sea **pura**: sin base de datos ni HTTP, solo reglas. Eso permite probarla sola, compartirla con el frontend para el modo offline y explicarla fácilmente a los jurados. |
| ➕ **Agregada (transversal)** | **Config, Mappers y manejo de errores** | Los umbrales viven en un archivo de configuración, no repartidos por el código. Los errores se manejan en un solo lugar. |
| ➕ **Agregado (módulo)** | **Simulador** | Hace el papel de los sensores. Envía datos a través del Service, como lo haría un dispositivo real. |
| ❌ **No incluida** | Arquitectura hexagonal completa (puertos y adaptadores), colas de mensajes, microservicios | Son demasiado para 48 h. Un monolito modular bien separado es suficiente y se ve profesional. |

### 4.2 Diagrama de capas

```
          ┌──────────────────────────────────────────────────────────┐
 HTTP ──► │ 1. CONTROLLER     Recibe la petición, valida y responde  │
          ├──────────────────────────────────────────────────────────┤
          │ 2. DTO + VALIDACIÓN   Objetos de entrada y salida de API │
          ├──────────────────────────────────────────────────────────┤
          │ 3. SERVICE        Orquesta el caso de uso (guardar →     │
          │                   triar → generar alertas)               │
          ├───────────────────────────────┬──────────────────────────┤
          │ 4. DOMINIO (TRIAJE)           │ 5. REPOSITORY            │
          │    Reglas puras, sin BD       │    Acceso a datos        │
          │    (reglas leídas de JSON)    │    (Spring Data JPA)     │
          │                               ├──────────────────────────┤
          │                               │ 6. ENTITY                │
          │                               │    Tablas de PostgreSQL  │
          └───────────────────────────────┴──────────────────────────┘
   Transversal: Config (umbrales) · Mappers (Entity ↔ DTO) · Manejo global de errores · Logs
```

**Regla de dependencias (obligatoria):**
- El Controller solo habla con el Service, nunca con el Repository.
- El Service usa el Dominio y el Repository.
- **El Dominio no depende de nada:** ni del framework, ni de la base de datos, ni de HTTP.
- Las Entities nunca salen del backend. Al frontend solo llegan DTOs.

### 4.3 Responsabilidades de cada capa

| Capa | ✅ Sí hace | ❌ No hace | Responsable |
|---|---|---|---|
| **Controller** | Define rutas y verbos HTTP, lee parámetros, llama a **un** método del Service y devuelve el código HTTP correcto (200, 201, 400, 404). | No calcula estados, no consulta la BD y no contiene `if` de negocio. | Rol 2 |
| **DTO + Validación** | Define la forma de lo que entra (`CreateVitalReadingDto`) y lo que sale (`CrewStatusDto`), con rangos físicamente posibles (por ejemplo, FC entre 20 y 250). | No decide si un valor es "peligroso"; eso es trabajo del triaje. Solo rechaza datos imposibles o mal formados. | Rol 2 |
| **Service** | Coordina el caso de uso: guarda la lectura, busca el contexto (línea base, ambiente y triaje anterior), llama al Dominio, guarda el resultado, crea o cierra alertas y maneja transacciones. | No contiene los umbrales ni las reglas médicas, ni SQL directo. | Rol 2 (Rol 3 en triaje y simulación) |
| **Dominio (Triaje)** | Recibe datos y devuelve el nivel por indicador, el estado global, las recomendaciones y las reglas combinadas y de persistencia (sección 3.5). | No guarda nada, no conoce la BD ni HTTP y no lee la hora del sistema (la recibe como dato). | **Rol 3** |
| **Repository** | Hace consultas: últimas N lecturas de un tripulante, historial por rango de fechas, alertas activas, última lectura ambiental de un módulo. | No aplica lógica de negocio. | Rol 2 |
| **Entity** | Mapea las tablas y sus relaciones. | No contiene lógica ni se envía directamente al frontend. | Rol 2 |
| **Config** | Guarda los umbrales en un archivo versionado (`thresholds.json`), las variables de entorno y la conexión a la BD. | — | Rol 1 y Rol 3 |
| **Mappers** | Convierten Entity ↔ DTO. | — | Rol 2 |
| **Manejo de errores** | Un único punto que convierte excepciones en respuestas JSON uniformes (`{ code, message }`). | — | Rol 1 |

### 4.4 Estructura del repositorio (adaptada de la plantilla del equipo)

Se mantiene la estructura que el equipo ya usa: un **monorepo** con `backend/` (Spring Boot, paquetes por capa) y `frontend/` (React). Respecto a la plantilla:
- **Se agregan** los paquetes `domain` (motores puros) y `simulation`, y la carpeta `resources/data` con los JSON de reglas.
- **Se adapta** `uploads/`, que pasa a ser `datasets/` para importar datos de OSDR.
- **Se reduce** `security` al mínimo.

```
zerog-vitals/
├── .github/
│   ├── workflows/
│   │   └── ci.yml                         → en cada PR: backend (mvnw test) + frontend (npm run build)
│   └── pull_request_template.md           → qué cambia, cómo probarlo, captura de pantalla
│
├── backend/
│   ├── .mvn/                              → wrapper de Maven
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/zerogvitals/
│   │   │   │   ├── config/
│   │   │   │   │   ├── CorsConfig.java                 → permite el origen del frontend
│   │   │   │   │   ├── OpenApiConfig.java              → Swagger UI para los jurados
│   │   │   │   │   ├── RulesConfig.java                → carga los JSON de resources/data al iniciar
│   │   │   │   │   ├── SchedulingConfig.java           → @EnableScheduling (simulador y recordatorios)
│   │   │   │   │   └── DataSeeder.java                 → tripulación ficticia y perfiles de misión iniciales
│   │   │   │   │
│   │   │   │   ├── controller/
│   │   │   │   │   ├── CrewController.java
│   │   │   │   │   ├── VitalReadingController.java
│   │   │   │   │   ├── EnvironmentReadingController.java
│   │   │   │   │   ├── SelfAssessmentController.java
│   │   │   │   │   ├── TriageController.java           → /api/status, historial de triaje
│   │   │   │   │   ├── AlertController.java
│   │   │   │   │   ├── MissionProfileController.java
│   │   │   │   │   ├── GuideController.java            → fichas de medición guiada
│   │   │   │   │   ├── BodyMapController.java          → GET /api/crew/{id}/body-status  [0.9.3]
│   │   │   │   │   ├── GamificationController.java     → puntos, rachas e insignias       [0.9.4]
│   │   │   │   │   ├── CountermeasureController.java   → contramedidas y plan de mejora   [0.9.6]
│   │   │   │   │   ├── AttachmentController.java       → (Could) fotos adjuntas           [0.9.8]
│   │   │   │   │   ├── SymptomController.java          → mapa de dolor                    [D3]
│   │   │   │   │   ├── EvaReadinessController.java     → aptitud para EVA                 [D4]
│   │   │   │   │   ├── TrendController.java            → tendencias personales            [D8]
│   │   │   │   │   ├── ReportController.java           → reportes SBAR                    [D10]
│   │   │   │   │   ├── SourceController.java           → catálogo de fuentes              [D1]
│   │   │   │   │   ├── FeatureFlagController.java      → GET /api/features                [0.10.11]
│   │   │   │   │   ├── ReminderController.java
│   │   │   │   │   ├── EmergencyController.java
│   │   │   │   │   ├── ConfigController.java           → GET /api/config (JSON para el modo offline del front)
│   │   │   │   │   ├── SimulationController.java
│   │   │   │   │   └── EarthCommsController.java       → (opcional) cola de reportes a la Tierra
│   │   │   │   │
│   │   │   │   ├── dto/
│   │   │   │   │   ├── request/   → CreateVitalReadingRequest, CreateEnvironmentReadingRequest,
│   │   │   │   │   │                CreateSelfAssessmentRequest, UpdateBaselineRequest,
│   │   │   │   │   │                StartEmergencyRequest, EmergencyAnswerRequest,
│   │   │   │   │   │                ChangeMissionProfileRequest, StartScenarioRequest
│   │   │   │   │   └── response/  → CrewMemberResponse, VitalReadingResponse, CrewStatusResponse,
│   │   │   │   │                    TriageResultResponse, AlertResponse, GuideResponse,
│   │   │   │   │                    ReminderResponse, EmergencyStepResponse, EmergencyReportResponse,
│   │   │   │   │                    MissionProfileResponse, OfflineConfigResponse, ErrorResponse
│   │   │   │   │
│   │   │   │   ├── entity/
│   │   │   │   │   ├── CrewMember.java
│   │   │   │   │   ├── VitalReading.java
│   │   │   │   │   ├── EnvironmentReading.java
│   │   │   │   │   ├── SelfAssessment.java             → agrega: ánimo (1–5) y minutos de ejercicio
│   │   │   │   │   ├── CrewProgress.java               → puntos, racha y nivel             [0.9.4]
│   │   │   │   │   ├── CrewAchievement.java            → insignias obtenidas               [0.9.4]
│   │   │   │   │   ├── ImprovementGoal.java            → metas del plan semanal            [0.9.6]
│   │   │   │   │   ├── MeasurementAttachment.java      → (Could) fotos adjuntas            [0.9.8]
│   │   │   │   │   ├── Symptom.java                    → síntomas por región del cuerpo    [D3]
│   │   │   │   │   ├── EvaAssessment.java              → evaluaciones de aptitud para EVA  [D4]
│   │   │   │   │   ├── TriageResult.java
│   │   │   │   │   ├── Alert.java
│   │   │   │   │   ├── MissionProfile.java
│   │   │   │   │   ├── Reminder.java
│   │   │   │   │   ├── EmergencySession.java
│   │   │   │   │   ├── EmergencyStepLog.java
│   │   │   │   │   ├── EarthMessage.java               → (opcional)
│   │   │   │   │   ├── ThresholdOverride.java          → (opcional)
│   │   │   │   │   └── enums/     → HealthLevel (NORMAL, CAUTION, ALERT, CRITICAL, NO_DATA),
│   │   │   │   │                    ReadingSource (SENSOR, GUIDED_MANUAL, SIMULATED),
│   │   │   │   │                    AlertStatus, EmergencyStatus, ProtocolCode (P1, P2, P3),
│   │   │   │   │                    EnvironmentType (STATION, LUNAR_TRANSIT, LUNAR_BASE, MARS_TRANSIT, MARS_BASE)
│   │   │   │   │
│   │   │   │   ├── exception/
│   │   │   │   │   ├── GlobalExceptionHandler.java     → @RestControllerAdvice
│   │   │   │   │   ├── ResourceNotFoundException.java
│   │   │   │   │   ├── InvalidReadingException.java
│   │   │   │   │   └── InvalidProtocolStepException.java
│   │   │   │   │
│   │   │   │   ├── mapper/        → CrewMemberMapper, VitalReadingMapper, EnvironmentReadingMapper,
│   │   │   │   │                    SelfAssessmentMapper, TriageResultMapper, AlertMapper,
│   │   │   │   │                    ReminderMapper, EmergencyMapper, MissionProfileMapper
│   │   │   │   │
│   │   │   │   ├── repository/    → una interfaz JpaRepository por cada entity
│   │   │   │   │                    (CrewMemberRepository, VitalReadingRepository, ...)
│   │   │   │   │
│   │   │   │   ├── security/                          → ⏸️ VACÍO en el MVP (sin Spring Security). Solo si se hace el PIN (Should):
│   │   │   │   │   └── SecurityConfig.java             → PIN por tripulante (BCrypt) + roles CREW / CMO. /api/emergencies siempre abierto
│   │   │   │   │                                         (el CORS del MVP va en config/CorsConfig.java, sin Security)
│   │   │   │   │                                         Descartado: Cloudflare Access (requiere internet; decisión del 12 nov)
│   │   │   │   │
│   │   │   │   ├── service/
│   │   │   │   │   ├── CrewService.java, VitalReadingService.java, EnvironmentReadingService.java,
│   │   │   │   │   │   SelfAssessmentService.java, TriageService.java, AlertService.java,
│   │   │   │   │   │   MissionProfileService.java, GuideService.java, ReminderService.java,
│   │   │   │   │   │   EmergencyService.java, EarthCommsService.java
│   │   │   │   │   └── impl/      → la implementación (@Service) de cada interfaz
│   │   │   │   │
│   │   │   │   ├── domain/                              ← NUEVO: lógica pura, sin Spring ni BD
│   │   │   │   │   ├── triage/
│   │   │   │   │   │   ├── TriageEngine.java            → recibe el contexto y devuelve el resultado
│   │   │   │   │   │   ├── TriageContext.java           → lecturas, línea base, perfil y triaje anterior
│   │   │   │   │   │   ├── TriageOutcome.java           → niveles, estado global, puntaje y recomendaciones
│   │   │   │   │   │   ├── Thresholds.java              → modelo de thresholds.json
│   │   │   │   │   │   ├── BodyStatusCalculator.java    → nivel por región del mapa corporal [0.9.3]
│   │   │   │   │   │   ├── EscalationPolicy.java        → NONE / SELF / CREW_CMO / FLIGHT_SURGEON [0.9.5]
│   │   │   │   │   │   ├── RuleTrace.java               → explicación de cada nivel          [D1]
│   │   │   │   │   │   ├── TrendDetector.java           → tendencias frente a la línea base  [D8]
│   │   │   │   │   │   └── rules/   → VitalSignRules, EnvironmentRules, BehavioralRules,
│   │   │   │   │   │                  CombinationRules (3.5), PersistenceRules (histéresis, L3)
│   │   │   │   │   ├── emergency/
│   │   │   │   │   │   ├── EmergencyEngine.java         → protocolo + paso + respuesta → siguiente paso
│   │   │   │   │   │   ├── ProtocolDefinition.java      → modelo de emergency-protocols.json
│   │   │   │   │   │   └── ProtocolStep.java
│   │   │   │   │   ├── eva/
│   │   │   │   │   │   └── EvaReadinessEvaluator.java   → APTO / CON PRECAUCIÓN / NO APTO    [D4]
│   │   │   │   │   ├── report/
│   │   │   │   │   │   └── SbarReportBuilder.java       → reporte SBAR para la Tierra        [D10]
│   │   │   │   │   └── gamification/                    → [0.9.4]
│   │   │   │   │       ├── PointsCalculator.java        → puntos por conductas (nunca por resultados)
│   │   │   │   │       └── AchievementEvaluator.java    → decide qué insignias se desbloquean
│   │   │   │   │
│   │   │   │   ├── simulation/                          ← NUEVO: hace el papel de los sensores
│   │   │   │   │   ├── SimulationRunner.java            → @Scheduled, envía lecturas por los Services
│   │   │   │   │   ├── scenarios/ → NominalScenario, FatigueScenario, HypoxiaScenario,
│   │   │   │   │   │                Co2BuildupScenario, SolarStormScenario, ChestPainScenario
│   │   │   │   │   └── replay/    → DatasetReplayScenario (lee CSV/JSON de OSDR desde datasets/)
│   │   │   │   │
│   │   │   │   └── ZeroGVitalsApplication.java
│   │   │   │
│   │   │   └── resources/
│   │   │       ├── application.yml               → configuración común
│   │   │       ├── application-dev.yml           → Postgres de Docker local
│   │   │       ├── application-prod.yml          → Neon/Render (opcional)
│   │   │       ├── db/migration/                 → Flyway: V1__init_schema.sql, V2__seed_profiles.sql, ...
│   │   │       └── data/                         ← reglas en JSON (también las usa el front offline)
│   │   │           ├── thresholds.json
│   │   │           ├── mission-profiles.json
│   │   │           ├── measurement-guides.json
│   │   │           ├── emergency-protocols.json
│   │   │           ├── body-map.json                → regiones del cuerpo                [0.9.3]
│   │   │           ├── achievements.json            → catálogo de insignias              [0.9.4]
│   │   │           ├── countermeasures.json         → tratamientos y mejoras por riesgo  [0.9.6]
│   │   │           ├── sources.json                 → catálogo de fuentes citadas        [D1]
│   │   │           ├── eva-criteria.json            → criterios de aptitud para EVA      [D4]
│   │   │           ├── projection-rates.json        → tasas para la proyección           [D7]
│   │   │           └── features.json                → feature flags                      [0.10.11]
│   │   │
│   │   └── test/java/com/zerogvitals/
│   │       ├── domain/triage/TriageEngineTest.java       → los ~30 casos de la sección 5.2 (pruebas parametrizadas)
│   │       ├── domain/emergency/EmergencyEngineTest.java → recorridos completos de P1, P2 y P3
│   │       └── controller/                               → pruebas de los endpoints principales (MockMvc)
│   │
│   ├── datasets/                          → archivos de OSDR para el modo replay. Ignorado en git
│   ├── uploads/                           → (Could) fotos adjuntas a las mediciones. Ignorado en git [0.9.8]
│   ├── target/                            → generado por Maven. Ignorado en git
│   ├── .dockerignore
│   ├── Dockerfile                         → build multi-etapa: compila con Maven y corre en un JRE 21
│   ├── mvnw / mvnw.cmd
│   ├── pom.xml
│   └── README.md                          → cómo correr y probar solo el backend
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── pages/         → BodyMap (pantalla principal), Dashboard, CrewDetail, SelfAssessment,
│   │   │                    Emergency, Alerts, Progress (gamificación), ImprovementPlan,
│   │   │                    MissionProfile, Simulation
│   │   ├── components/    → BodyFigure (SVG clicable y animado), BodyRegionPanel, VitalCard (semáforo
│   │   │                    con ícono), VitalChart (dinámica), MoodPicker, AlertBanner, EmergencyButton,
│   │   │                    EmergencyStep, CprMetronome, MeasurementGuide, ReminderList,
│   │   │                    PointsBadge, StreakCounter, AchievementCard, PhotoCapture (Could),
│   │   │                    WhyPanel (D1), HazardLensBar (D2), PainMap (D3), EvaChecklist (D4),
│   │   │                    VoiceGuide (D5), LanguageSwitcher (D6), ProjectionSlider y ProjectionChart (D7),
│   │   │                    TrendBadge (D8), FatigueModeProvider (D9), SbarReportView (D10)
│   │   ├── locales/       → es.json, en.json (D6)
│   │   ├── hooks/         → useCrewStatus (consulta periódica), useOnlineStatus, useEmergency
│   │   ├── services/      → apiClient + un archivo por recurso (crewApi, vitalsApi, emergencyApi, ...)
│   │   ├── engine/        → intérprete offline de los JSON: triaje básico y árboles de emergencia
│   │   ├── offline/       → localStorage: caché de la configuración y cola de envíos pendientes (IndexedDB solo si crece)
│   │   ├── types/         → tipos TS equivalentes a los DTOs de response y request
│   │   ├── styles/
│   │   └── main.tsx / App.tsx
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.ts
│
├── docs/
│   ├── ZeroG_Vitals_Plan_Equipo.md        → este documento
│   ├── proyecto_nasa_space_apps_2026_zerog_vitals.md
│   ├── arquitectura/                      → diagramas (capas, flujo, modelo de datos)
│   ├── protocolos/                        → fuentes y validación de las guías y los protocolos de emergencia
│   └── pitch/                             → guion de la demo y material del video
│
├── .env                                   → valores reales. ⚠️ NUNCA se sube a git
├── .env.example                           → plantilla sin secretos: DB_URL, DB_USER, DB_PASSWORD,
│                                            SPRING_PROFILES_ACTIVE, VITE_API_URL, SIMULATION_SPEED,
│                                            DEFAULT_MISSION_PROFILE
├── .gitattributes                         → finales de línea (mvnw con LF, mvnw.cmd con CRLF)
├── .gitignore                             → .env, .idea/, target/, node_modules/, dist/, backend/datasets/
├── CLAUDE.md                              → contexto del proyecto para Claude Code (apoya la declaración de uso de IA)
├── docker-compose.yml                     → servicios: postgres, backend, frontend
├── render.yaml                            → (opcional) despliegue de la demo pública en Render
└── README.md                              → descripción, cómo correrlo, arquitectura, fuentes NASA,
                                             declaración de uso de IA y créditos del equipo
```

**Diferencias con la plantilla original y por qué:**

| Elemento de la plantilla | Decisión en ZeroG Vitals | Motivo |
|---|---|---|
| `config, controller, dto, entity, exception, mapper, repository, service` | ✅ Se mantienen | Son las capas de la sección 4.3. |
| `security` | ⚠️ Se mantiene con lo mínimo | En 48 h la autenticación no aporta a la evaluación. Si sobra tiempo, se agregan dos roles simples: tripulante y CMO. |
| — | ➕ `domain` | El motor de triaje y el de emergencias son el corazón del proyecto. Separarlos permite probarlos sin levantar Spring. |
| — | ➕ `simulation` | Reemplaza a los sensores reales durante la demo. |
| — | ➕ `resources/data/*.json` | Reglas configurables. Los recursos NASA del 13 de noviembre solo cambian estos archivos. |
| `uploads/` | 🔄 Pasa a `datasets/` | Aquí no se suben archivos de usuarios; se importan datasets de OSDR para el modo replay. |
| `neon.ts` + `package.json` en la raíz | ❌ Se quitan | Spring se conecta a Neon solo con la URL JDBC en `application-prod.yml`. Un `package.json` en la raíz confunde con el del frontend. |
| `render.yaml` | ⚠️ Opcional | Solo si se quiere un enlace público para los jurados. |
| `.idea/`, `target/` | ❌ Fuera del repositorio | Son archivos locales de IntelliJ y de compilación. Van en `.gitignore`. |
| `.env` | ⚠️ Solo local | Debe estar en `.gitignore` desde el primer commit. Se comparte `.env.example`. |

**Quién trabaja en cada paquete:**

| Rol | Paquetes y carpetas |
|---|---|
| Rol 1 (Líder / DevOps) | `.github/`, `docker-compose.yml`, `Dockerfile`s, `config/`, `security/`, `exception/`, `README.md` |
| Rol 2 (API y BD) | `controller/`, `dto/`, `entity/`, `repository/`, `mapper/`, `db/migration/`, `service/` (CRUD) |
| Rol 3 (Triaje y simulación) | `domain/` (triage, emergency, gamification), `simulation/`, `service/impl/TriageServiceImpl` y `EmergencyServiceImpl`, `resources/data/thresholds.json`, `test/domain/` |
| Rol 4 (Dashboard) | `frontend/src/pages/Dashboard`, `Emergency`, `components/`, `hooks/` |
| Rol 5 (UX y autoevaluación) | `frontend/src/pages/SelfAssessment`, **`BodyMap` + `BodyFigure`** (pieza visual principal), `MeasurementGuide`, `Progress`, `engine/`, `offline/` |
| Rol 6 (Datos NASA y pitch) | `resources/data/measurement-guides.json`, `emergency-protocols.json`, `mission-profiles.json`, `body-map.json`, `countermeasures.json`, `achievements.json` (contenido), `docs/` |

### 4.5 Entities (modelo de datos)

| Entity | Campos principales | Relaciones |
|---|---|---|
| **CrewMember** (tripulante) | id, nombre, rol en la misión, edad, módulo actual, línea base de HRV, objetivo calórico, dosis acumulada en la carrera (mSv), fecha de creación | 1:N con todas las demás tablas de tripulante |
| **VitalReading** (lectura de vitales) | id, crewMemberId, timestamp, FC, HRV, presión sistólica, presión diastólica, SpO₂, temperatura, frecuencia respiratoria, glucosa (mg/dL), contexto de la glucosa (`FASTING` / `POST_MEAL` / `RANDOM`), origen (`SENSOR` / `GUIDED_MANUAL` / `SIMULATED`) | N:1 con CrewMember |
| **EnvironmentReading** (lectura ambiental) | id, módulo del hábitat, timestamp, ppCO₂ (mmHg), temperatura, humedad, dosis de radiación (mSv/día) | Por módulo, no por tripulante: afecta a todos los que están en él |
| **SelfAssessment** (autoevaluación) | id, crewMemberId, timestamp, horas de sueño, fatiga (1–10), estrés (1–10), hidratación (L), ingesta calórica (kcal), **ánimo (1–5)**, **minutos de ejercicio**, notas | N:1 con CrewMember |
| **TriageResult** (resultado de triaje) | id, crewMemberId, timestamp, estado global, nivel por indicador (JSON), puntaje de bienestar, recomendaciones (lista), ids de las lecturas evaluadas | N:1 con CrewMember. Se guarda el historial y el último resultado es el "estado actual". |
| **Alert** (alerta) | id, crewMemberId (o módulo, si es ambiental), indicador, nivel, mensaje, fecha de creación, fecha de reconocimiento, fecha de resolución, estado (`ACTIVE` / `ACKNOWLEDGED` / `RESOLVED`) | N:1 con CrewMember o con un módulo |
| **ThresholdOverride** (opcional, si sobra tiempo) | id, crewMemberId, indicador, nuevos límites | Permite umbrales personalizados por tripulante. **Este punto es bueno para el pitch.** |
| **MissionProfile** (0.2) | id, código (`STATION` / `LUNAR_TRANSIT` / `LUNAR_BASE` / `MARS_TRANSIT` / `MARS_BASE` / `ROVER`), gravedad, retraso de comunicación (s), tiempo de evacuación, tasa base de radiación, equipo médico disponible, activo (sí/no) | Uno activo a la vez |
| **Reminder** (0.5) | id, crewMemberId, indicador o tarea, fecha y hora programada, estado (`PENDING` / `DONE` / `SNOOZED` / `MISSED`), fecha de cumplimiento | N:1 con CrewMember |
| **EmergencySession** / **EmergencyStepLog** (0.4) | Sesión: id, crewMemberId (paciente), reportadoPor, protocolo, estado, inicio y fin. Paso: sessionId, stepId, respuesta, timestamp, vitales capturados | 1:N entre sesión y pasos |
| **Symptom** (D3) | id, crewMemberId, timestamp, región del cuerpo, intensidad (0–10), tipo, inicio, síntomas asociados, notas | N:1 con CrewMember |
| **EvaAssessment** (D4) | id, crewMemberId, timestamp, resultado (`FIT` / `FIT_WITH_CAUTION` / `NOT_FIT`), criterios que fallaron (JSON), aprobado por el CMO | N:1 con CrewMember |
| **CrewProgress** / **CrewAchievement** (0.9.4) | Progreso: crewMemberId, puntos, racha, nivel. Insignia: crewMemberId, código de la insignia, fecha | 1:1 / 1:N con CrewMember |
| **ImprovementGoal** (0.9.6) | id, crewMemberId, semana, contramedida, meta, progreso, estado | N:1 con CrewMember |
| **EarthMessage** (opcional) | id, tipo (SBAR, alerta, emergencia), payload, tamaño (KB), encolado en, entregado en | — |
| **MeasurementAttachment** (Could) | id, registro asociado, tipo (`DEVICE_PHOTO` / `WOUND` / `ULTRASOUND` / `OTHER`), ruta, notas | N:1 con una lectura, autoevaluación o síntoma |

### 4.6 Qué tiene cada módulo en cada capa

| Módulo | Controller (endpoints) | Service (casos de uso) | Repository (consultas) | Entity |
|---|---|---|---|---|
| **crew** | `GET /api/crew` · `GET /api/crew/{id}` · `PATCH /api/crew/{id}/baseline` | listar, obtener detalle, actualizar línea base | buscar todos, buscar por id, actualizar | CrewMember |
| **vitals** | `POST /api/crew/{id}/vitals` · `GET /api/crew/{id}/vitals?from=&to=` | registrar lectura → **dispara el triaje**, consultar historial | guardar, últimas N por tripulante, rango de fechas | VitalReading |
| **environment** | `POST /api/environment` · `GET /api/environment/latest` · `GET /api/environment?module=&from=&to=` | registrar lectura → **re-triaje de todos los tripulantes del módulo**, consultar historial | guardar, última por módulo, rango de fechas | EnvironmentReading |
| **self-assessment** | `POST /api/crew/{id}/self-assessments` · `GET /api/crew/{id}/self-assessments` | registrar autoevaluación → **dispara el triaje**, consultar historial | guardar, la más reciente, historial | SelfAssessment |
| **triage** | `GET /api/status` (toda la tripulación) · `GET /api/crew/{id}/status` · `GET /api/crew/{id}/triage-history` | evaluar tripulante (reúne el contexto, llama al Dominio y guarda), obtener estado actual | guardar resultado, último por tripulante, historial | TriageResult |
| **alerts** | `GET /api/alerts?status=ACTIVE` · `PATCH /api/alerts/{id}/acknowledge` | crear, escalar o cerrar alertas a partir del triaje; reconocer alerta | activas por tripulante o módulo, actualizar estado | Alert |
| **simulation** | `GET /api/simulation/scenarios` · `POST /api/simulation/scenarios/{name}/start` · `POST /api/simulation/stop` | generar lecturas periódicas según el escenario y enviarlas por los Services de vitals y environment | — (no tiene tablas propias) | — |
| **common** | `GET /api/health` | — | — | — |

**Escenarios de simulación para la demo:** `nominal` (todos sanos), `fatigue` (poco sueño y estrés alto), `hypoxia` (baja SpO₂), `co2-buildup` (falla del sistema de eliminación de CO₂) y `solar-storm` (pico de radiación).

### 4.7 Flujo de ejemplo: llega una lectura de vitales

```
1. Simulador / sensor ──POST /api/crew/3/vitals──► VitalsController
2. Controller valida el DTO (rangos físicamente posibles) ──► VitalsService.registrar()
3. VitalsService guarda la lectura ──► VitalReadingRepository
4. VitalsService llama a TriageService.evaluar(crew 3)
5. TriageService reúne el contexto con los Repositories:
     última lectura de vitales, última autoevaluación, última lectura ambiental
     del módulo, línea base del tripulante y el triaje anterior (para la persistencia)
6. TriageService llama al Dominio: TriageEngine.evaluar(contexto, umbrales)
     → devuelve: niveles por indicador, estado global, recomendaciones
7. TriageService guarda el TriageResult y llama a AlertService.sincronizar()
     → crea alertas nuevas, escala las existentes o resuelve las que ya se normalizaron
8. Controller responde 201 con la lectura guardada y el estado actualizado (DTO)
9. El frontend consulta /api/status cada pocos segundos y actualiza el dashboard
```

### 4.8 Implementación de cada capa en Spring Boot

| Capa | Paquete | Cómo se implementa |
|---|---|---|
| Controller | `controller` | Clase con `@RestController` y `@RequestMapping("/api/...")`. Los DTOs de entrada llevan `@Valid`. |
| DTO + Validación | `dto.request` / `dto.response` | `record` de Java con Bean Validation (`@NotNull`, `@Min`, `@Max`, `@DecimalMin`). |
| Service | `service` + `service.impl` | Una interfaz y su implementación con `@Service`. Usa `@Transactional` donde se escribe. |
| Dominio | `domain` | **Clases Java puras, sin anotaciones de Spring.** Se prueban con JUnit sin levantar la aplicación. |
| Repository | `repository` | Interfaz que extiende `JpaRepository`, con consultas derivadas o `@Query`. |
| Entity | `entity` + `entity.enums` | Clase con `@Entity`. Los enums se guardan como texto (`@Enumerated(EnumType.STRING)`). |
| Mapper | `mapper` | Mappers **manuales** (clases `XxxMapper` con métodos estáticos `toResponse` / `toEntity`). Sin MapStruct. |
| Errores | `exception` | `@RestControllerAdvice` con una respuesta de error uniforme. |
| Configuración | `config` | Clases `@Configuration`: CORS, OpenAPI, carga de los JSON y semilla de datos. |
| Seguridad | `security` | Configuración mínima (ver la sección 4.4). |

### 4.9 Capas del frontend (resumen)

| Capa | Contenido |
|---|---|
| **Pages / Views** | Dashboard de la tripulación, detalle de un tripulante, autoevaluación, alertas y control de simulación. |
| **Components** | Tarjeta de vital con semáforo, gráfica temporal, banner de alerta, formulario de autoevaluación. |
| **Hooks / Estado** | Consulta periódica del estado, estado global de la app y detección de conexión (online/offline). |
| **API Client (services)** | Única capa que llama al backend. Usa los mismos DTOs como tipos. |
| **Offline storage** | `localStorage` (IndexedDB solo si hace falta): guarda las últimas lecturas y autoevaluaciones pendientes, y las sincroniza cuando vuelve la conexión. |
| **Motor offline (`engine/`)** | Intérprete en TypeScript de los JSON descargados (protocolos de emergencia y umbrales). Si la API no responde, el modo emergencia y el triaje básico siguen funcionando. |

---

## 5. Lógica del programa: lo que falta y plan para el 13 de noviembre

> **Principio de diseño:** los recursos de la NASA llegan el **13 de noviembre**, un día antes del evento. La lógica debe quedar lista para que esos recursos solo cambien **configuración y datos** (umbrales, fuentes citadas, datasets de entrada) y **nunca la arquitectura**. Todo lo que no dependa de esos recursos se cierra antes.

### 5.1 Reglas de lógica que aún no están definidas

Ya están definidos los rangos (sección 3) y las capas (sección 4). Faltan las reglas para los **casos borde**, que es donde suele fallar un motor de triaje durante una demo. Para cada una dejo un **valor por defecto propuesto**, así el equipo solo tiene que aprobarlo o ajustarlo.

| # | Pregunta pendiente | Valor por defecto propuesto |
|---|---|---|
| L1 | **Datos faltantes u obsoletos:** ¿qué pasa si un sensor deja de enviar datos? | Si un vital no llega en **más de 10 min**, ese indicador pasa a ⚪ **SIN DATOS** (gris). Nunca se asume que está "Normal". Lecturas ambientales sin datos por más de 5 min generan una alerta técnica. Una autoevaluación de más de 24 h queda marcada como desactualizada y la app pide una nueva. |
| L2 | **Lecturas erróneas del sensor:** por ejemplo, la SpO₂ cae 15 puntos en una lectura y luego vuelve a la normalidad. | Un **Crítico** de un vital de sensor se confirma con **una nueva lectura inmediata** (en menos de 30 s, en tiempo simulado). Si no se confirma, se registra como "posible error de sensor". La radiación y el CO₂ críticos **no esperan confirmación**. |
| L3 | **Histéresis:** ¿cuándo baja de nivel un indicador? | Para **bajar** de nivel se necesitan **3 lecturas consecutivas** en el nivel inferior. Así el semáforo no parpadea entre colores. Subir de nivel sigue la regla de persistencia de la sección 3.5. |
| L4 | **Ciclo de vida de las alertas** | Hay **una alerta activa por par (tripulante, indicador)**. Si el nivel sube, se escala la misma alerta en lugar de crear otra. Reconocer una alerta no impide que escale. Se resuelve sola cuando el indicador vuelve a Normal, con histéresis. |
| L5 | **Varias recomendaciones a la vez:** ¿cuál se muestra primero? | Se ordenan primero por nivel y luego por prioridad clínica: **respiración/SpO₂ > cardiovascular > radiación > CO₂ > temperatura > conductual**. Se muestran **como máximo 3**. |
| L6 | **Pesos del puntaje de bienestar** | Se parte de 100. Se restan **25 por cada Crítico, 10 por cada Alerta y 4 por cada Precaución**, con un mínimo de 0. Es solo visual: la decisión siempre la toma la regla del peor nivel. |
| L7 | **Cálculo de la línea base de HRV** | Promedio de RMSSD de las **primeras 7 lecturas en reposo** del tripulante, o el valor fijo de su perfil si existe. Se puede editar desde `PATCH /baseline`. |
| L8 | **Dosis de radiación acumulada:** ¿quién la actualiza y cómo? | En cada lectura ambiental se suma al tripulante: dosis acumulada += tasa (mSv/día) × intervalo entre lecturas (en días), usando la tasa del **módulo donde está**. Se lleva por separado la dosis de la misión y la de la carrera. |
| L9 | **Tiempo simulado** | 1 lectura cada 2 s reales equivale a 1 min simulado (×30). Así, 24 h simuladas se ven en unos 48 min. Para la demo hay un control de velocidad ×30 / ×120. |
| L10 | **Unidades y conversiones** | Valores internos en el **SI clínico**: °C, mmHg, mSv, L y kcal. El CO₂ se guarda en mmHg; la conversión a ppm (aproximadamente ×1.300 a nivel del mar) se hace solo en pantalla. |
| L11 | **Riesgos ambientales que afectan a todos** | Una alerta de CO₂, temperatura, humedad o radiación del módulo se crea **una sola vez para el módulo** y se refleja en todos los tripulantes que están en él. |
| L12 | **Retraso de comunicación con la Tierra** (opcional, suma puntos en el pitch) | Hay una cola de "reportes para la Tierra" que se envía en ventanas simuladas, con un retraso configurable (por ejemplo, 20 min tipo Marte). Así se muestra que la app **no depende** de esa comunicación. |

### 5.2 Entregables de lógica que conviene tener listos antes del 13 de noviembre (sin código)

1. **Tabla de casos de prueba (tabla de decisión), de 25 a 30 casos.** Es lo más valioso que se puede hacer antes del evento. Cada fila indica las entradas y el resultado esperado. Durante el evento se programa directamente contra esta tabla. Ejemplos:

   | Caso | Entrada | Estado global esperado | Recomendación esperada |
   |---|---|---|---|
   | T01 | Todos los vitales normales, CO₂ 2.0 mmHg, sueño 7.5 h | 🟢 Normal | Ninguna |
   | T02 | SpO₂ 93 % (2 lecturas seguidas), resto normal | 🟡 Precaución | Respiración profunda y revisar el sensor |
   | T03 | SpO₂ 93 % + CO₂ 3.5 mmHg | 🟠 Alerta ambiental | Revisar el sistema de eliminación de CO₂ y cambiar de módulo |
   | T04 | FC 112, sueño 5.5 h, estrés 6 (tres Precaución) | 🟠 Alerta (por combinación) | Descanso + sueño + respiración guiada |
   | T05 | Dosis diaria 15 mSv | 🔴 Crítico (sin confirmación) | Ir al refugio de radiación |
   | T06 | SpO₂ 85 % en una sola lectura y luego 97 % | Sin cambio; registrar posible error de sensor | Revisar el sensor |
   | T07 | Sin lecturas de vitales durante 12 min | ⚪ Sin datos en los vitales | Revisar el sensor y la conexión |
   | T08 | Indicador en Alerta → 2 lecturas en Normal | Se mantiene 🟠 (histéresis) | — |
   | … | Completar hasta unos 30 casos cubriendo cada indicador y cada regla de las secciones 3.5 y 5.1 | | |

2. **Especificación de los escenarios de simulación.** Por cada escenario (`nominal`, `fatigue`, `hypoxia`, `co2-buildup`, `solar-storm`) se describe cómo evoluciona cada indicador en el tiempo. Ejemplo para `co2-buildup`: el CO₂ sube de 2.0 a 5.5 mmHg en 60 min simulados; desde los 3.5 mmHg la FC sube unos 10 lpm y empieza a reportarse dolor de cabeza.
3. **Matriz de trazabilidad** con una fila por indicador: umbral, fuente y estado (✅ verificado con fuente / ⚠️ supuesto del equipo / 🔄 a revisar con los recursos del 13 de noviembre). Muestra a los jurados que cada número tiene un respaldo.
4. **Registro de supuestos.** Por ejemplo:
   - S1: la presión de la cabina es similar a la del nivel del mar.
   - S2: hay un solo hábitat dividido en módulos.
   - S3: los sensores reportan cada minuto simulado.
   - S4: la tripulación es ficticia, de 4 a 6 personas.
   - S5: el servidor está a bordo, no en la Tierra.

   El 13 de noviembre se revisa cada supuesto contra los recursos recibidos.
5. **Catálogo de recomendaciones,** con el texto final de cada mensaje por indicador y nivel. Se redactan antes para no improvisar textos durante el evento.
6. **Guion de la demo (unos 2 min):** qué escenario se activa, en qué orden y qué debe verse en pantalla. Ejemplo: `nominal` → `co2-buildup` → la tripulante hace su autoevaluación → la alerta se resuelve.

### 5.3 Preparar el sistema para absorber los recursos NASA

Para que lo que llegue el 13 de noviembre se pueda incorporar en horas y no en días:

| Si los recursos traen… | Se resuelve con… | Impacto |
|---|---|---|
| Umbrales o rangos distintos | Editar `thresholds.json` y la matriz de trazabilidad | Bajo: es solo configuración |
| **Datasets reales** (CSV o JSON con series de tiempo) | **Modo "replay"** en el módulo de simulación: un adaptador lee el archivo, mapea sus columnas a los DTOs de lectura y los envía por los mismos Services | Medio: hay que escribir solo el mapeo de columnas |
| Indicadores nuevos que no estaban previstos | Los indicadores están definidos como un **catálogo** (nombre, unidad, umbrales, prioridad), así que agregar uno es una entrada nueva más su regla | Medio |
| Requisitos nuevos del reto | Se priorizan con MoSCoW (Must / Should / Could / Won't) en la reunión del 13 de noviembre | Variable |

**Fuentes NASA que conviene revisar desde ya**, porque es probable que aparezcan en los recursos oficiales:
- NASA Open Science Data Repository (OSDR).
- Life Sciences Data Archive (LSDA).
- Human Research Roadmap (riesgos y brechas).
- Los technical briefs de NASA-STD-3001 ya citados en la sección 7.

### 5.4 Protocolo para el 13 de noviembre (día de llegada de los recursos)

> Ese día puede coincidir con el **viaje a Medellín**. Planifica la lectura para hacerla en el trayecto. El equipo todavía no existe, así que el protocolo es individual.

| Paso | Duración | Qué se hace | Responsable |
|---|---|---|---|
| 1 | 15 min | Inventario de los recursos recibidos (documentos, datasets, enlaces) y priorización de cuáles leer primero | Verónica |
| 2 | 1.5–2 h | Lectura. Por cada recurso, una ficha corta: ¿qué datos trae?, ¿cambia algún umbral?, ¿confirma o rompe algún supuesto?, ¿se puede usar en modo replay?, ¿sugiere algún indicador nuevo? | Verónica (con Claude para resumir y contrastar) |
| 3 | 30–45 min | Actualizar la matriz de trazabilidad, el registro de supuestos, los umbrales (como documento) y las prioridades MoSCoW | Verónica |
| 4 | 15 min | **Congelar el alcance** y actualizar el kit de bienvenida con lo nuevo | Verónica |
| 5 | — | Descansar. El evento empieza el 14 a las 9:00 a.m. | 😴 |

### 5.5 Calendario de preparación (1 al 13 de noviembre)

| Fechas | Objetivo |
|---|---|
| **1–3 nov** | Confirmar integrantes y roles. Decidir el lenguaje del backend (✅ Java + Spring Boot). Instalar el entorno en todos los portátiles. |
| **4–7 nov** | Validar los umbrales de los signos vitales con fuentes (Rol 6). Aprobar o ajustar las reglas L1–L12. Armar la matriz de trazabilidad y el registro de supuestos. **Nuevo:** verificar los valores de los perfiles de misión (sección 0.2) y redactar las fichas de medición del MVP (sección 0.3). |
| **8–10 nov** | Escribir la tabla de casos de prueba (unos 30) y la especificación de los escenarios. Redactar el catálogo de recomendaciones. **Nuevo:** escribir los árboles de los protocolos P1–P3 (sección 0.4) con sus casos de prueba y validarlos con fuentes de primeros auxilios. |
| **11–12 nov** | Guion de la demo, bocetos de interfaz y repaso de tutoriales del stack. Reunión final de revisión. Logística de viaje. |
| **13 nov** | Recursos NASA: aplicar el protocolo de la sección 5.4. |

> *Actualización del 8 de noviembre: el equipo se forma en la sede (0.12). Las tareas de "equipo" e "integrantes" de este calendario se reemplazan por las prioridades de la sección 0.11, que hace Verónica sola.*

---

## 6. Pendientes antes del evento (sin código)

- [ ] ~~Confirmar integrantes antes del evento~~ → El equipo se forma en la sede. Preparar el pitch de reclutamiento y el kit de bienvenida (0.12.4).
- [ ] Confirmar que el equipo "ZeroG Vitals" está registrado en spaceappschallenge.org y cómo se invita a nuevos integrantes.
- [x] Decidir el lenguaje del backend: ✅ **Java 21 + Spring Boot 3** (3 de noviembre).
- [ ] Verificar que todos tengan instalados JDK 21, IntelliJ IDEA, Node LTS, Docker Desktop, Git y VS Code, y probar `docker run postgres` en cada portátil.
- [ ] Tener lista la cuenta de GitHub propia (el repo y la organización se crean en la hora 0, con los integrantes que se unan).
- [ ] El rol 6 revisa las fuentes NASA y confirma los umbrales de la sección 3.
- [ ] El rol 5 prepara bocetos en papel o Figma (los mockups finales se hacen en el evento).
- [ ] Confirmar las reglas oficiales sobre el formato del video y sobre lo que se puede preparar antes.
- [ ] Hacer una lista de reproducción de tutoriales cortos para quien no conozca el stack (React, Spring Boot con JPA, Flyway, Docker Compose, react-i18next, TanStack Query, Web Speech API).
- [ ] Confirmar la política de uso de IA de 2026 y revisar los límites del plan de Claude (0.13).
- [ ] Instalar Claude Code y probarlo con un proyecto de prueba ajeno al reto.
- [ ] Revisar y completar el borrador de `CLAUDE.md` (`CLAUDE_borrador.md`).
- [ ] Completar los elementos de la sección 0.11 (incompleto y no existe), en el orden de "Prioridades para esta semana".

---

## 7. Fuentes

- NASA OCHMO: *Carbon Dioxide Technical Brief* (NASA-STD-3001 V2 6004, 3 mmHg): https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-004-carbon-dioxide.pdf
- NASA OCHMO: *Habitable Atmosphere Technical Brief*: https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-003-habitable-atmosphere.pdf
- NASA OCHMO: *ECLSS Technical Brief* (temperatura y humedad): https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-002-eclss.pdf
- NASA OCHMO: *Radiation Protection Technical Brief* (600 mSv de carrera, 250 mSv por SPE): https://www.nasa.gov/wp-content/uploads/2023/03/radiation-protection-technical-brief-ochmo.pdf
- National Academies (2021): *Space Radiation and Astronaut Health*: https://nap.nationalacademies.org/read/26155/chapter/2
- PTB (Alemania): dosis de unos 0.5 mSv/día en la ISS: https://www.ptb.de/cms/en/presseaktuelles/journals-magazines/ptb-news/ptb-news-ausgaben/archivederptb-news/news08-1/direct-reading-personal-dosemeters.html
- Revisión en PMC sobre datos médicos de la ISS (0.2–0.5 mSv/día): https://pmc.ncbi.nlm.nih.gov/articles/PMC10919966
- Rangos de signos vitales: referencias clínicas estándar de adulto (categorías de presión de la AHA y umbrales de SpO₂ usados en triaje). **Por validar con fuentes citables (rol 6).**
- NASA Human Research Roadmap: https://humanresearchroadmap.nasa.gov
