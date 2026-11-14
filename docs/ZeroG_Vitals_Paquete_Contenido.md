# 📦 ZeroG Vitals: paquete de contenido (borrador para validar)

> **Qué es:** el contenido "cerebro" de la app, escrito como texto (no código) **antes del evento**. Durante la hackatón, Claude lo convierte en `resources/data/*.json` (pedido P2 de la sección 0.13.4 del plan).
> **Idioma:** español. La versión en inglés la genera Claude en la hora 2 y una persona la revisa.
> **Reglas:**
> 1. **Política de fuentes (decisión del 13 de noviembre): todo el contenido va ligado a los recursos de la NASA** (sección 0).
> 2. ⚠️ ya **no** significa "buscar una guía externa". Significa **"valor de demostración configurable por el CMO, sin fuente NASA"** (sección 0.2).
> 3. **Ningún texto indica medicamentos ni dosis.** Solo remite a *"el protocolo de la misión o la indicación del CMO"*.
> 4. ZeroG Vitals **no diagnostica**. Orienta, registra y escala.
> 5. Las fuentes `S01`, `S02`… están en la sección 9. Los riesgos `HRP-xx` están en la sección 1.2.

---

## 0. Política de fuentes: ligados a la NASA

### 0.1 Jerarquía de fuentes permitidas

| Orden | Fuente | Ejemplos |
|---|---|---|
| 1 | **Recursos del reto** (Programa de Investigación Humana de la NASA) | Los 5 peligros, los 17 riesgos, *The Human Body in Space*, el paquete de radiación (R1–R14) |
| 2 | **Otros documentos oficiales de la NASA** y de **otras agencias espaciales** (el enunciado lo permite) | NASA-STD-3001 y los *technical briefs* de OCHMO (S01–S03), ESA, CSA, JAXA, AEB |
| 3 | **Propuesta del equipo**, declarada como tal y **configurable por el CMO** | Criterios de aptitud para EVA, pesos de la gamificación, regla en U de la carga de trabajo |
| ❌ | Guías clínicas externas (ADA, AHA, ERC…) | **No se usan.** Se quitaron S10, S11 y S16 |

### 0.2 Cómo funcionan los umbrales sin rangos clínicos externos

Los recursos de la NASA **no publican rangos clínicos** (FC, presión, glucosa, temperatura, FR) ni la técnica de RCP. Por eso los umbrales siguen tres reglas:

1. **Línea base personal primero (Precaución y Alerta).** El nivel se calcula según **cuánto se aleja cada valor de la línea base del propio tripulante**. Es el mismo enfoque de la NASA: los efectos *"varían sustancialmente entre astronautas"* (S09, condición física) y se buscan *"evaluaciones de riesgo personalizadas"* (S09, cáncer). Propuesta del equipo:
   - 🟡 desviación del **15 %** o más;
   - 🟠 desviación del **30 %** o más, sostenida.
2. **Límites oficiales donde la NASA los da:** CO₂, temperatura y humedad de la cabina, límite de radiación de carrera y por evento solar, ejercicio diario, pérdida ósea (S01–S03, S08, S09).
3. **Límites críticos absolutos = valores de demostración ⚠️**, cargados en `thresholds.json` con la marca `"source": "CMO_CONFIGURABLE"`. La interfaz los muestra como *"límite configurado por el oficial médico de la misión"*. **En una misión real los define el equipo médico de vuelo**, y así se dice en el pitch.

### 0.3 Emergencias (P1–P4)

La NASA indica que los astronautas reciben **entrenamiento médico antes y durante la misión**, que para Marte habrá **entrenamiento reforzado en emergencias cardiovasculares** (S08, S09) y que la meta son **sistemas fáciles de usar para operar sin la Tierra** (HRP-15). Por eso:
- Los protocolos son **guías de coordinación y registro**: avisar, asegurar el entorno, medir, seguir pasos y registrar todo.
- Los pasos clínicos remiten al **"entrenamiento médico de la tripulación"** y al **"protocolo de la misión"**.
- **El ritmo del metrónomo de RCP es configurable** (`CMO_CONFIGURABLE`). La app no enseña RCP: **acompaña** a una tripulación que ya fue entrenada.
- Lo que sí tiene fuente NASA se mantiene: terminar la EVA ante síntomas de descompresión (S09), el refugio y el agua como blindaje en eventos solares (S07), y los líquidos y prendas de compresión antes del aterrizaje (S09).

### 0.4 Fuentes NASA adicionales encontradas (13 de noviembre)

En la colección oficial de *technical briefs* de OCHMO y en **NASA-STD-3001 Vol. 1 Rev. C** aparecieron datos que **reemplazan varios valores de demostración**:

| Tema | Lo que dice la NASA | Fuente | Qué cambia |
|---|---|---|---|
| **Signos vitales** | La norma exige *"evaluar, registrar, monitorear y ver tendencias de los signos vitales"*, y que los parámetros de la tripulación estén *"dentro de valores clínicamente aceptados"*, definidos por la medicina de vuelo | S30 (V1 §3, V1 4005, 4011, 4015) | ✅ **Respalda la política:** tendencias frente a la línea base + límites que define el equipo médico (`CMO_CONFIGURABLE`) |
| **Línea base personal** | Fuerza muscular **≥ 80 % de la línea base**; densidad ósea de cadera y columna **≥ 95 %** y de cuello femoral **≥ 90 %** de los valores previos a la misión; tras el vuelo, la capacidad aeróbica baja **10–30 %** | S30 (V1 4024, 4027, 4004) | ✅ **La NASA misma usa límites relativos a la línea base.** Respalda las reglas de desviación (0.2) |
| **Temperatura** | Normal ~37 °C; **hipotermia por debajo de 35 °C** | S30 (glosario) | ✅ Crítico bajo: < 35 °C con fuente NASA |
| **Sueño** | Un adulto necesita **7–9 h**. En el espacio se duermen **6–6.5 h** en promedio (déficit de ~0.3 h/día). Tras 7 días de 6 h hay deterioro. Se recomienda un **periodo de sueño de 8.5 h** y **no programar tareas críticas entre la 1 y las 7 a. m.** (nadir circadiano) | S20 (TB-041), S30 (V1 6001) | ✅ Umbrales de sueño con fuente NASA. ➕ Regla del nadir circadiano en D4 y D9 |
| **Higiene del sueño** | Sin cafeína **6–12 h** antes de dormir; evitar ejercicio intenso y comidas grandes **2 h** antes; evitar luz brillante o azul **1–2 h** antes; buscar luz brillante **1–2 h** después de despertar | S21 (MTB-009) | ✅ Contramedidas de sueño con fuente NASA |
| **Hidratación** | Asignación de **2.5 L/día** de agua para consumo directo, **+0.24 L por hora de EVA**. Antes de la reentrada: **mínimo 1.000 mL** por tripulante (protocolo actual: 24–48 oz de agua con sal según el peso) | S22 (TB-027, V2 6109), S23 (TB-019) | ✅ **Meta de hidratación: 2.5 L/día** (antes ~2 L ⚠️) |
| **Calorías** | Se debe dar el **100 % del requerimiento calculado** con la ecuación EER según edad, sexo, peso, estatura y factor de actividad. Hombres: EER = 662 − 9.53 × edad + AF × (15.9 × peso + 539.6 × estatura). Mujeres: EER = 354 − 6.91 × edad + AF × (9.36 × peso + 726 × estatura). Más vitamina D por la poca luz solar | S24 (TB-013), S30 (V1 4020) | ✅ **El objetivo calórico personal se calcula con la ecuación de la NASA** |
| **Carga de trabajo** | La NASA evalúa la carga con la **escala Bedford (1–10)**: **≤ 3** en tareas normales y **≤ 6** en tareas fuera de lo normal. Una carga percibida **baja también es un riesgo** (aburrimiento, poca atención, más errores) | S25 (TB-032, V2 5007), S30 (V1 §4.3) | 🔄 **Se reemplaza la escala 1–5 por la escala Bedford** + pregunta de aburrimiento (sección 2.1) |
| **Mareo espacial** | Afecta al **70–90 %** de la tripulación, sobre todo los **primeros 2–3 días** (hasta 3–7). **Escala oficial de 4 grados:** Ninguno (0), Leve (1), Moderado (2), Severo (3). Medidas sin medicamentos: inactividad, **ejercicios de movimiento de cabeza**, sujeción de la cabeza, orientación "1 g" e hidratación | S26 (MTB-004) | 🔄 **Se reemplaza la escala 0–10 por la escala oficial de la NASA** |
| **Descompresión** | **Tipo I:** picazón, dolor musculoesquelético, erupción leve. **Tipo II:** síntomas neurológicos, entumecimiento, debilidad, problemas cognitivos, de oído interno o cardiopulmonares, piel moteada | S27 (TB-037) | ✅ P4 distingue Tipo I (🟠) y Tipo II (🔴) |
| **Coágulos** | Se observaron alteraciones del flujo en la **vena yugular interna izquierda**. Síntomas de estancamiento venoso: **hinchazón** y cambios en la piel | S28 (MTB-007) | ✅ Síntoma "hinchazón del cuello o de una extremidad" con fuente NASA |
| **SANS** | **70 %** presenta uno o más signos y **18 %** recibe el diagnóstico. Hay **cambios hacia la hipermetropía** (peor visión de cerca); la norma exige llevar lentes de corrección | S29 (MTB-001), S30 | ✅ Pregunta de visión: "¿ves peor de cerca?" |
| **Hipoxia** | Pueden aparecer fallas sutiles desde una PaO₂ de ~80 mmHg (equivalente a ~1.550 m de altitud). El desempeño físico baja por encima de ~1.000 m y el tiempo de reacción se afecta cerca de ~2.700 m | S31 (TB-003) | ✅ El perfil con cabina de presión reducida muestra su **altitud equivalente** y la explicación de hipoxia leve. Sin umbral nuevo de SpO₂ |

**Siguen sin fuente NASA** (se quedan como `CMO_CONFIGURABLE` o propuesta del equipo): los límites críticos de FC, presión, SpO₂, FR y glucosa · la caída de 20/10 mmHg de la prueba ortostática · el criterio de lapso de 500 ms · los criterios de EVA no listados arriba · el ritmo de RCP.

### 0.5 Más fuentes NASA (búsqueda nocturna del 13 de noviembre)

| Tema | Lo que dice la NASA | Fuente | Qué cambia |
|---|---|---|---|
| **Prueba de vigilancia (D11)** | La NASA usa en la ISS el **Reaction Self Test**, una prueba de vigilancia (PVT) de **3 minutos**. Mide el **tiempo de reacción**, los **lapsos** (respuestas omitidas) y los **errores de impulsividad**, y da una calificación de **0–100 % frente a las normas de astronautas**. Está pensada como **"ayuda personalizada para manejar la fatiga"**. Se hace **2 veces al día** (al despertar y antes de dormir) y **antes y después de las EVA** | S32 (NTRS 20090029851, Dinges, U. de Pensilvania / NASA) | ✅ **D11 queda respaldada por la NASA.** Se replica el formato (3 min, 2 veces al día, antes y después de la EVA) y la salida se muestra en **% frente a la línea base personal**. El umbral del lapso (ms) sigue siendo configurable |
| **Factores de fatiga** | La NASA espera que el desempeño baje con: **vigilia de más de 16 h**, **sueño de menos de 6 h durante 3 días o más**, cambios de horario de sueño, **jornadas de más de 12 h**, **más de 6 días seguidos sin descanso** y **EVA** | S32 | ➕ **Reglas de riesgo de fatiga con fuente NASA**: cada una suma una alerta 🟡, activa el modo cansancio (D9) y sugiere la prueba de vigilancia |
| **Día marciano** | Duración del día en Marte: **24.6597 h** (= **24 h 39 min 35 s**). Gravedad en la superficie: **0.380 g** | S33 (NASA NSSDC, *Mars Fact Sheet*) | ✅ **Sol marciano con fuente NASA.** Se reemplaza el "37 minutos" por **24 h 39 min 35 s**. 0.38 g confirmado |
| **Dolor en el pecho (P1)** | Procedimiento *"CHEST PAIN"* del **Medical Checklist de la NASA**: 1) sin pulso ni respiración → **RCP con restricciones para paciente y rescatador**; 2) inconsciente → vía aérea + oxígeno; 3) consciente → **oxígeno suplementario**; 4) **signos vitales** (presión, pulso, frecuencia respiratoria, temperatura); 5) examen de tórax (ritmo cardíaco, ruidos respiratorios, movimiento del pecho, **color de piel azulado, grisáceo o pálido**); 6) **ECG**; 7) medicamento del kit; 8) **contactar al cirujano de vuelo** | S34 (NASA JSC-48031 *Medical Checklist*, Rev. H, 2001) | ✅ **P1 sigue la estructura del procedimiento oficial de la NASA.** El paso del medicamento se reemplaza por "según el protocolo de la misión o el CMO" (sin dosis). "Contactar al cirujano" = aviso al CMO + reporte en cola hacia la Tierra |
| **RCP en microgravedad** | El paciente y el rescatador se **fijan con cinturones de restricción** (el rescatador se fija al casillero médico). *(El ritmo de compresiones de esa versión de 2001 corresponde a guías antiguas: no se usa.)* | S34 | ✅ El paso de fijación de P1 tiene fuente NASA. El ritmo de RCP sigue `CMO_CONFIGURABLE` |
| **Descompresión: escala "Cuff Class" (P4)** | **1:** dolor leve en uno o varios sitios y/o hormigueo en una extremidad, sin afectar el desempeño. **2:** síntomas de clase 1 moderados que afectan el desempeño o que se resuelven al represurizar. **3:** síntomas severos, hormigueo que migra o en el tronco o en varios sitios, dolor de cabeza inusual. **4 (graves):** neurológicos (visión con manchas, habla arrastrada, falta de coordinación, pérdida de sensibilidad, convulsiones, inconsciencia) o cardiopulmonares (dolor en el pecho, tos, falta de aire). **Causas:** prerrespiración insuficiente, EVA extenuante, **deshidratación severa en la EVA**, pérdida de presión. **Principio del tratamiento:** represurización + oxígeno al 100 % | S34 | ✅ **P4 usa la escala oficial:** clase 1 → 🟡, clase 2 → 🟠, clase 3 → 🟠 + aviso inmediato, clase 4 → 🔴. ➕ **Chequeo neurológico de la NASA:** *"¿Qué día de vuelo es? ¿Cómo se llaman y qué cargo tienen tus compañeros?"* |

**Nota sobre S34:** es un documento oficial de la NASA (Centro Espacial Johnson) de la época del transbordador (2001), consultado en una copia pública. Se usa para la **estructura** de los procedimientos y las **clasificaciones**, no para valores que hayan cambiado con guías más nuevas (como el ritmo de RCP).

---

## 1. Catálogo base

### 1.1 Niveles y escalamiento (resumen de las secciones 3.1 y 0.9.5 del plan)

| Nivel | Código | Color + ícono | ¿A quién se avisa? | Qué ve el astronauta |
|---|---|---|---|---|
| Normal | `NORMAL` | 🟢 ✓ | Nadie | "Todo en orden" + consejo de prevención |
| Precaución | `CAUTION` | 🟡 ! | El mismo astronauta (`SELF`) | Acción de autocuidado y la medición se repite más tarde |
| Alerta | `ALERT` | 🟠 !! | CMO (`CREW_CMO`) | Aviso al CMO y autoevaluación completa |
| Crítico | `CRITICAL` | 🔴 ✕ | CMO + tripulación + cirujanos de vuelo en Tierra (`FLIGHT_SURGEON`) | Protocolo de emergencia y reporte a la Tierra |
| Sin datos | `NO_DATA` | ⚪ ? | El mismo astronauta | "No hay lectura reciente: mide de nuevo" |

### 1.2 Riesgos oficiales del HRP (para el campo `hrpRisk`)

| Código | Riesgo (nombre corto) | Descripción formal (NASA, se copia tal cual) |
|---|---|---|
| HRP-01 | Sistema inmune | *Risk of in mission impacts, adverse health events, or long-term health impacts due to altered immune system response* |
| HRP-02 | Sensoriomotor y vestibular | *Risk of altered sensorimotor/vestibular function impacting critical mission tasks, human health, and long-term health* |
| HRP-03 | Cardiovascular | *Risk of cardiovascular adaptations contributing to adverse mission performance and health outcomes* |
| HRP-04 | Descompresión | *Risk of mission impacts and long-term health issues due to decompression sickness* |
| HRP-05 | Microorganismos | *Risk of adverse in-mission and long-term health effects and performance effects due to host-microorganism interactions* |
| HRP-06 | Hipoxia | *Risk of reduced crew health and performance due to hypoxia* |
| HRP-07 | Nutrición | *Risk of performance decrement and crew illness due to inadequate food and nutrition* |
| HRP-08 | EVA | *Risk of mission impacting injury and compromised performance and long-term health effects due to EVA operations* |
| HRP-09 | Condición física | *Risk of mission performance decrements and adverse health outcomes resulting from reduced cardiorespiratory and musculoskeletal fitness* |
| HRP-10 | SANS | *Risk of Spaceflight Associated Neuro-ocular Syndrome (SANS)* |
| HRP-11 | Huesos | *Risk of bone fracture due to spaceflight-induced changes to bone* |
| HRP-12 | Conducta | *Risk of adverse cognitive or behavioral changes and psychiatric disorders leading to in-mission health and performance and long-term health effects* |
| HRP-13 | Trabajo en equipo | *Risk of in-mission performance and behavioral health decrements due to inadequate cooperation, coordination, communication, and psychosocial adaptation within a team* |
| HRP-14 | Sueño | *Risk of performance decrements and adverse health outcomes resulting from sleep loss, circadian desynchronization, and work overload* |
| HRP-15 | Operación de sistemas | *Risk of adverse mission outcomes due to Earth independent human-systems operation* |
| HRP-16 | Cargas dinámicas | *Risk of in-mission injury and performance decrements and long-term health effects from dynamic loads* |
| HRP-17 | Cáncer por radiación | *Risk of radiation carcinogenesis* |

### 1.3 Peligros (lentes D2)

| Código | Peligro | Color propio (no el de la NASA) | Ícono propio |
|---|---|---|---|
| `RADIATION` | Radiación espacial | Morado | átomo ☢️ |
| `ISOLATION` | Aislamiento y confinamiento | Azul | persona dentro de un círculo |
| `DISTANCE` | Distancia de la Tierra | Amarillo | Tierra lejana con línea punteada |
| `GRAVITY` | Campos de gravedad | Rojo | flecha hacia abajo con ondas |
| `ENVIRONMENT` | Ambiente cerrado hostil | Verde | casa cerrada con hojas |

---

## 2. Catálogo de indicadores

| Código | Indicador | Unidad | Entrada | Región del cuerpo | Riesgo HRP | Umbrales |
|---|---|---|---|---|---|---|
| `HEART_RATE` | Frecuencia cardíaca en reposo | lpm | Guiada o sensor | Corazón | HRP-03 | Plan 3.2 |
| `HRV` | Variabilidad de la FC (RMSSD) | % de la línea base | Sensor o simulada | Corazón, mente | HRP-03, HRP-12 | Plan 3.2 |
| `BLOOD_PRESSURE` | Presión arterial (sistólica y diastólica) | mmHg | Guiada | Corazón | HRP-03 | Plan 3.2 ⚠️ |
| `SPO2` | Saturación de oxígeno | % | Guiada o sensor | Pulmones | HRP-06 | Plan 3.2 ⚠️ |
| `BODY_TEMPERATURE` | Temperatura corporal | °C | Guiada | Cuerpo completo | HRP-01 | Plan 3.2 ⚠️ |
| `RESPIRATORY_RATE` | Frecuencia respiratoria | rpm | Guiada | Pulmones | HRP-06 | Plan 3.2 ⚠️ |
| `GLUCOSE` | Glucosa capilar (con contexto: ayunas, después de comer, aleatoria) | mg/dL | Guiada | Sangre y metabolismo | HRP-07 | Plan 0.9.2 ⚠️ |
| `SLEEP` | Horas de sueño (últimas 24 h) | h | Autoevaluación | Mente | HRP-14 | Plan 3.4 ✅ (S20: 7–9 h; promedio en vuelo 6–6.5 h) |
| `MOOD` | Estado de ánimo | 1–5 (emojis) | Autoevaluación | Mente | HRP-12 | Plan 0.9.2 |
| `MORALE` (opcional) | Moral o motivación | 1–5 | Autoevaluación | Mente | HRP-12 | Igual que el ánimo |
| `FATIGUE` | Fatiga | 1–10 | Autoevaluación | Mente | HRP-14 | Plan 3.4 |
| `STRESS` | Estrés | 1–10 | Autoevaluación | Mente | HRP-12 | Plan 3.4 |
| `WORKLOAD` | Carga de trabajo (**escala Bedford de la NASA**) + aburrimiento | Bedford 1–10 + Sí/No | Autoevaluación | Mente | HRP-14, HRP-12 | Sección 2.1 ✅ (S25) |
| `EXERCISE` | Ejercicio | min/día | Autoevaluación | Huesos, músculos | HRP-09, HRP-11 | Plan 0.9.2 ✅ (S08, S09) |
| `HYDRATION` | Hidratación | L/día | Autoevaluación | Riñones | HRP-07, HRP-11 | Sección 2.1 ✅ (S22: 2.5 L/día) |
| `CALORIES` | Ingesta calórica | % del objetivo | Autoevaluación | Sangre y metabolismo | HRP-07 | Plan 3.4 |
| `APPETITE` | Apetito | 1–5 | Autoevaluación | Sangre y metabolismo | HRP-07, HRP-17 | Sección 2.1 |
| `DIZZINESS` | Mareo espacial (**escala de la NASA**) | 0–3 (Ninguno, Leve, Moderado, Severo) | Autoevaluación | Oído interno | HRP-02 | Sección 2.1 ✅ (S26) |
| `VISION_CHANGE` (opcional) | Cambios en la visión | Sí/No + descripción | Autoevaluación | Ojos | HRP-10 | Sí → 🟠 aviso al CMO |
| `VIGILANCE` (D11) | Prueba de vigilancia de 3 min (como el *Reaction Self Test* de la NASA) | Tiempo de reacción, lapsos, errores; % frente a la línea base | Prueba en pantalla, 2 veces al día + antes y después de la EVA | Mente | HRP-14, HRP-12 | Sección 2.1 ✅ (S32) |
| `RADIATION_DAILY` | Dosis diaria estimada | mSv/día | Monitor de área del módulo | Cuerpo completo | HRP-17 | Plan 0.2 (factor por perfil) |
| `RADIATION_CAREER` | Dosis acumulada de carrera | mSv y % de 600 | Calculada | Cuerpo completo | HRP-17 | Plan 3.3 ✅ (S03) |
| `CO2` | CO₂ de la cabina | mmHg (promedio de 1 h) | Monitor del módulo | Pulmones | HRP-06 | Plan 3.3 ✅ (S01) |
| `CABIN_TEMPERATURE` / `CABIN_HUMIDITY` | Temperatura y humedad del hábitat | °C / % | Monitor del módulo | Cuerpo completo | — | Plan 3.3 ✅ (S02) |

### 2.1 Umbrales nuevos (complementan las secciones 3.2–3.4 y 0.9.2 del plan)

| Indicador | 🟢 Normal | 🟡 Precaución | 🟠 Alerta | 🔴 Crítico | Nota |
|---|---|---|---|---|---|
| `WORKLOAD` (Bedford 1–10 + aburrimiento) | Bedford 1–3 | Bedford 4–6, **o** aburrimiento = Sí | Bedford ≥ 7, **o** aburrimiento 3 días seguidos | — | ✅ ≤ 3 normal y ≤ 6 fuera de lo normal (S25, V2 5007). Carga baja = riesgo (S30, V1 §4.3) |
| `HYDRATION` | ≥ 2.5 L | 2.0–2.4 L | < 2.0 L durante 2 días | — | ✅ Meta de 2.5 L/día; +0.24 L por hora de EVA (S22). Los cortes intermedios son propuesta del equipo |
| `SLEEP` | ≥ 7 h | 6–6.9 h | < 6 h | < 4 h o < 5 h durante 3 días (`CMO_CONFIGURABLE`) | ✅ 7–9 h necesarias; deterioro con 6 h sostenidas (S20) |
| `BODY_TEMPERATURE` (bajo) | — | — | — | **< 35 °C (hipotermia)** | ✅ S30 |
| `DIZZINESS` (escala NASA 0–3) | 0 Ninguno | 1 Leve | 2 Moderado · 3 Severo | — (con signos neurológicos se activa P4 o P1) | ✅ Escala oficial (S26). **Moderado o severo → NO APTO para EVA o rover** (propuesta del equipo, alineada con V1 4006). Severo → el CMO evalúa la hidratación |
| `APPETITE` (1–5) | 4–5 | 3 | 1–2 durante 2 días seguidos | — | Después de un evento solar: apetito ≤ 2 + náuseas → regla P3 (S07, R12) |
| `VIGILANCE` (D11) ✅ formato NASA (S32) | Mediana < línea base +15 % y lapsos ≤ línea base +1 | Mediana +15–30 % o lapsos +2–4 | Mediana > +30 % o lapsos ≥ +5 | — | **Lapso = respuesta > 500 ms** ⚠️. Línea base: mediana de las 3 primeras pruebas. Propuesta del equipo |
| **Riesgo de fatiga** (S32) | Ninguno de los factores | 1 factor: vigilia > 16 h · sueño < 6 h durante 3 días o más · jornada > 12 h · más de 6 días sin descanso · EVA hoy | 2 o más factores | — | ✅ Factores de la NASA. Activa el modo cansancio (D9) y sugiere D11 |
| Prueba ortostática (D4) | Caída de la sistólica < 20 y de la diastólica < 10 mmHg | — | Caída ≥ 20/10 mmHg **o** mareo al ponerse de pie | Desmayo | Criterio clínico estándar ⚠️ validar (`CMO_CONFIGURABLE`). Contexto: S08, S09 |

---

## 3. Fichas de medición

> **Formato de cada ficha:** qué es · equipo · cómo medir · errores comunes · por qué importa en el espacio · cómo la afectan los peligros · qué hacer según el nivel · cuándo escalar · prevención · frecuencia · riesgo HRP · fuentes.
> Las acciones por nivel usan el texto exacto que mostrará la app.

### F01 · Frecuencia cardíaca en reposo (`HEART_RATE`)
- **Qué es:** cuántas veces late tu corazón por minuto estando en reposo.
- **Equipo:** oxímetro de pulso, sensor de pecho o reloj. Sin equipo: contar el pulso en la muñeca durante 30 s y multiplicar por 2.
- **Cómo medir:**
  1. Descansa 5 minutos sin hablar.
  2. En microgravedad, fija los pies en los anclajes.
  3. Coloca el sensor o busca el pulso en la muñeca.
  4. Espera a que el número se estabilice (unos 30 s).
  5. Registra el valor.
- **Errores comunes:** medir justo después de moverse, hablar o tomar cafeína; sensor flojo.
- **Por qué importa en el espacio:** la baja gravedad cambia el corazón y los vasos; hay riesgo de arritmias y de desmayo al volver a la gravedad (S09).
- **Peligros:** gravedad (desplazamiento de líquidos, el corazón se vuelve más esférico) · radiación (riesgo cardiovascular a largo plazo, S07) · aislamiento (estrés).
- **Qué hacer:**
  - 🟡 *"Descansa 10 minutos, hidrátate y vuelve a medir. Evita la cafeína por ahora."*
  - 🟠 *"Detén la actividad. Avisa al CMO. Se repetirá la medición en 5 minutos."*
  - 🔴 *"Activa EMERGENCIA."* (protocolo P1)
- **Cuándo escalar:** 🟠 al CMO; 🔴 al CMO y a los cirujanos de vuelo.
- **Prevención:** ejercicio aeróbico diario (S08), hidratación, sueño suficiente.
- **Frecuencia:** diaria al despertar, y siempre que haya síntomas.
- **Riesgo HRP:** HRP-03. **Fuentes:** S08, S09.

### F02 · Saturación de oxígeno (`SPO2`)
- **Qué es:** el porcentaje de oxígeno que transporta tu sangre.
- **Equipo:** oxímetro de pulso (pinza de dedo).
- **Cómo medir:**
  1. Quédate quieto 1 minuto.
  2. Fija el cuerpo si estás en microgravedad.
  3. Pon la pinza en el dedo índice, sin esmalte y con la mano tibia.
  4. Espera a que el número deje de cambiar (unos 30 s).
  5. Registra el valor.
- **Errores comunes:** mano fría, movimiento, pinza mal puesta.
- **Por qué importa en el espacio:** una falla del soporte vital, el CO₂ alto o un problema pulmonar bajan el oxígeno. La hipoxia afecta el juicio sin que lo notes. Las naves futuras tendrán **cabina con presión reducida**, lo que aumenta el riesgo de **hipoxia leve** (S09).
- **Peligros:** ambiente cerrado (CO₂, presión de cabina) · EVA (protocolos de prerrespiración).
- **Qué hacer:**
  - 🟡 *"Respira profundo 2 minutos, revisa que la pinza esté bien y vuelve a medir. ¿Tienes dolor de cabeza, confusión o problemas de visión?"*
  - 🟠 *"Avisa al CMO. Revisa la alarma de CO₂ del módulo. Usa oxígeno del kit según el protocolo de la misión."* (protocolo P2)
  - 🔴 *"Activa EMERGENCIA."* (P2)
- **Cuándo escalar:** 🟠 al CMO; 🔴 al CMO y a los cirujanos de vuelo.
- **Prevención:** revisar el estado del CO₂ de la cabina; no hacer esfuerzo intenso con síntomas.
- **Frecuencia:** diaria; antes y después de cada EVA; siempre con síntomas.
- **Riesgo HRP:** HRP-06. **Fuentes:** S09 (hipoxia), S01.
- ⚠️ **Con cabina de presión reducida**, la ficha explica que la SpO₂ puede ser algo menor y la app la cruza con los síntomas. No se usan umbrales distintos sin una fuente.

### F03 · Presión arterial (`BLOOD_PRESSURE`)
- **Qué es:** la fuerza con la que la sangre empuja las arterias. Se mide en dos números: sistólica (la máxima) y diastólica (la mínima).
- **Equipo:** tensiómetro de brazalete automático.
- **Cómo medir:**
  1. Descansa 5 minutos con los pies fijos en los anclajes.
  2. Coloca el brazalete en el brazo izquierdo, a la altura del corazón.
  3. No hables durante la medición.
  4. Toma 2 lecturas con 1 minuto de diferencia y registra el promedio.
- **Errores comunes:** brazalete flojo o sobre la ropa, hablar, medir después de hacer ejercicio.
- **Por qué importa en el espacio:** los líquidos se desplazan hacia la cabeza y el corazón se adapta. Al volver a la gravedad puede haber **presión baja y desmayo** (intolerancia ortostática, S08).
- **Peligros:** gravedad · aislamiento y estrés.
- **Qué hacer:**
  - 🟡 *"Descansa, hidrátate y vuelve a medir en 1 hora."*
  - 🟠 *"Avisa al CMO. Vuelve a medir en 15 minutos."*
  - 🔴 *"Activa EMERGENCIA."*
  - **Presión baja con mareo:** *"Acuéstate o fíjate con las piernas elevadas, hidrátate y avisa al CMO."*
- **Cuándo escalar:** 🟠 al CMO; 🔴 al CMO y a los cirujanos de vuelo.
- **Prevención:** ejercicio, hidratación, y **prendas de compresión y líquidos antes del aterrizaje** (S09).
- **Frecuencia:** diaria; antes de EVA; en la transición de gravedad, acostado y de pie (D4).
- **Riesgo HRP:** HRP-03. **Fuentes:** S08, S09, `CMO_CONFIGURABLE`.

### F04 · Temperatura corporal (`BODY_TEMPERATURE`)
- **Qué es:** la temperatura interna de tu cuerpo.
- **Equipo:** termómetro digital (oral o de frente).
- **Cómo medir:**
  1. No comas ni bebas nada caliente o frío en los 15 minutos anteriores.
  2. Coloca el termómetro bajo la lengua con la boca cerrada, o úsalo en la frente.
  3. Espera la señal y registra.
- **Errores comunes:** medir después de hacer ejercicio o de comer; termómetro mal colocado.
- **Por qué importa en el espacio:** el sistema inmune cambia y pueden despertar virus latentes o aparecer infecciones (S09). La fiebre es una señal temprana.
- **Peligros:** ambiente cerrado (microbios que pasan entre personas) · radiación · estrés.
- **Qué hacer:**
  - 🟡 *"Hidrátate, descansa y vuelve a medir en 2 horas. ¿Tienes erupción, ampollas o síntomas de resfriado?"*
  - 🟠 *"Avisa al CMO. Limita el contacto cercano con la tripulación."*
  - 🔴 *"Activa EMERGENCIA."*
- **Cuándo escalar:** 🟠 al CMO; 🔴 al CMO y a los cirujanos de vuelo.
- **Prevención:** higiene de manos y superficies, cambio de filtros (S08), sueño suficiente.
- **Frecuencia:** diaria; siempre que haya síntomas.
- **Riesgo HRP:** HRP-01, HRP-05. **Fuentes:** S08, S09, `CMO_CONFIGURABLE`.

### F05 · Frecuencia respiratoria (`RESPIRATORY_RATE`)
- **Qué es:** cuántas veces respiras por minuto.
- **Equipo:** reloj con segundero. Mejor si un compañero cuenta.
- **Cómo medir:**
  1. Quédate en reposo 2 minutos.
  2. Cuenta cuántas veces sube el pecho durante 30 s y multiplica por 2.
  3. Respira normal: no lo controles.
- **Errores comunes:** contar justo después de moverse o hablar.
- **Por qué importa en el espacio:** respirar más rápido puede indicar falta de oxígeno, CO₂ alto, ansiedad o infección.
- **Peligros:** ambiente cerrado (CO₂).
- **Qué hacer:**
  - 🟡 *"Descansa y vuelve a contar en 10 minutos. Revisa la SpO₂."*
  - 🟠 *"Avisa al CMO. Mide la SpO₂ y revisa el CO₂ del módulo."* (P2)
  - 🔴 *"Activa EMERGENCIA."* (P2)
- **Cuándo escalar:** 🟠 al CMO; 🔴 al CMO y a los cirujanos de vuelo.
- **Frecuencia:** con síntomas, en emergencias y en la autoevaluación semanal.
- **Riesgo HRP:** HRP-06. **Fuentes:** `CMO_CONFIGURABLE`.

### F06 · Glucosa capilar (`GLUCOSE`)
- **Qué es:** la cantidad de azúcar en tu sangre en este momento.
- **Equipo:** glucómetro, lanceta y tira reactiva.
- **Cómo medir:**
  1. Lávate y sécate las manos.
  2. Elige el contexto: **en ayunas**, **después de comer** (2 h) o **aleatoria**.
  3. Pincha el costado de la yema del dedo con la lanceta.
  4. Pon la gota en la tira y espera el resultado.
  5. Registra el valor y el contexto.
  6. Desecha la lanceta en el contenedor de residuos.
- **Errores comunes:** dedos húmedos o con restos de comida, no registrar el contexto, tiras vencidas.
- **Por qué importa en el espacio:** la nutrición es un riesgo oficial (HRP-07). En el vuelo espacial se ha observado **resistencia a la insulina** ⚠️. La glucosa muy baja afecta la conciencia y el desempeño.
- **Peligros:** distancia (comida limitada, fatiga de menú) · gravedad (menos actividad muscular).
- **Qué hacer:**
  - **Baja** (🟡 60–69 / 🟠 54–59): *"Come o bebe carbohidratos de absorción rápida del kit de alimentos y vuelve a medir en 15 minutos."* Si sigue baja o hay confusión → CMO.
  - **Alta** (🟡 141–180 / 🟠 181–250): *"Hidrátate y vuelve a medir en 2 horas. Si sigue alta, avisa al CMO."*
  - 🔴 *"Avisa al CMO de inmediato. Si hay confusión o pérdida de conciencia, activa EMERGENCIA."*
- **Cuándo escalar:** 🟠 al CMO; 🔴 al CMO y a los cirujanos de vuelo. **Medicamentos solo según el protocolo de la misión.**
- **Prevención:** comidas regulares, cumplir el objetivo calórico, ejercicio.
- **Frecuencia:** semanal en ayunas; con síntomas (temblor, sudor, confusión).
- **Riesgo HRP:** HRP-07. **Fuentes:** S09 (nutrición). Límites: `CMO_CONFIGURABLE`.

### F07 · Sueño (`SLEEP`)
- **Qué es:** cuántas horas dormiste en las últimas 24 h.
- **Equipo:** autorreporte; actigrafía si hay sensor (S08).
- **Cómo medir:** al despertar, registra a qué hora te dormiste y a qué hora despertaste. Opcional: calidad del 1 al 5.
- **Errores comunes:** contar el tiempo en la cama como tiempo dormido.
- **Por qué importa en el espacio:** en la ISS hay **16 amaneceres al día**. Los ciclos irregulares de luz, el ruido, el estrés y la sobrecarga alteran el ritmo circadiano. En Marte el día dura unos 40 minutos más (S08, S09).
- **Peligros:** aislamiento · ambiente cerrado (luz, ruido) · distancia (horarios de misión).
- **Qué hacer:**
  - 🟡 *"Prioriza el sueño en el próximo ciclo: horario fijo, luz de cabina tenue y sin pantallas 30 minutos antes."*
  - 🟠 *"Avisa al CMO. Evita tareas críticas si es posible. Haz la prueba de vigilancia (D11)."*
  - 🔴 *"Avisa al CMO. No conduzcas el rover ni salgas a EVA."*
- **Prevención (S21, S30):** periodo de sueño de **8.5 h**; sin cafeína 6–12 h antes de dormir; sin ejercicio intenso ni comidas grandes 2 h antes; evitar luz brillante o azul 1–2 h antes y buscar luz brillante 1–2 h después de despertar; **no programar tareas críticas entre la 1 y las 7 a. m.** (nadir circadiano).
- **Frecuencia:** diaria al despertar.
- **Dato NASA:** en el espacio se duerme 6–6.5 h en promedio, aunque un adulto necesita 7–9 h (S20).
- **Riesgo HRP:** HRP-14. **Fuentes:** S08, S09, S20, S21, S30.

### F08 · Estado de ánimo (`MOOD`) y moral (`MORALE`, opcional)
- **Qué es:** cómo te sientes hoy, del 1 (muy mal) al 5 (muy bien).
- **Equipo:** ninguno: un toque en la escala de emojis 😣 🙁 😐 🙂 😀.
- **Cómo medir:** responde con honestidad. Nadie te juzga y **tu respuesta no afecta tus puntos**.
- **Por qué importa en el espacio:** el aislamiento prolongado aumenta el riesgo de **ansiedad y depresión**, que afectan el sueño, la moral y las decisiones (S09). Los problemas de ánimo son "inevitables" en grupos encerrados mucho tiempo (R13).
- **Peligros:** aislamiento · distancia (extrañar a la familia) · radiación (efectos en el sistema nervioso, S07).
- **Qué hacer:**
  - 🟡 *"Haz algo que disfrutes, escribe en tu bitácora o habla con un compañero."*
  - 🟠 *"Te sugerimos hablar con el CMO o programar una llamada de apoyo en la próxima ventana de comunicación."*
  - 🔴 *"Busca al CMO ahora. No estás solo."*
- **Prevención:** bitácora (S08, S09), actividades con sentido, cuidar plantas, "ventana a la Tierra", privacidad.
- **Frecuencia:** diaria.
- **Riesgo HRP:** HRP-12. **Fuentes:** S08, S09.

### F09 · Fatiga y estrés (`FATIGUE`, `STRESS`)
- **Qué es:** qué tan cansado y qué tan estresado te sientes, del 1 al 10.
- **Cómo medir:** una escala para cada uno, al final de tu jornada.
- **Por qué importa en el espacio:** la sobrecarga de trabajo y la falta de sueño bajan el desempeño (S09). Las hormonas del estrés alteran el sistema inmune (S08).
- **Qué hacer:**
  - 🟡 *"Respiración guiada de 2 minutos (4-7-8) y un descanso corto."*
  - 🟠 *"Avisa al CMO. Revisa tu carga de trabajo. Haz la prueba de vigilancia."*
  - 🔴 *"Avisa al CMO. Detén las tareas críticas."*
- **Frecuencia:** diaria.
- **Riesgo HRP:** HRP-14, HRP-12, HRP-01. **Fuentes:** S08, S09.

### F10 · Carga de trabajo (`WORKLOAD`): escala Bedford de la NASA
- **Qué es:** cuánta "capacidad mental libre" te quedó durante tu trabajo de hoy, según la **escala Bedford (1–10)** que usa la NASA (S25).
- **Cómo medir:** la app guía con 3 preguntas en árbol:
  1. ¿Pudiste completar las tareas?
  2. ¿La carga fue tolerable?
  3. ¿Fue satisfactoria sin necesidad de reducirla?

  Luego eliges un número del 1 (carga insignificante) al 10 (tarea abandonada). Al final se pregunta: **"¿Te sentiste aburrido o con muy poco que hacer?"** (Sí/No).
- **Por qué importa:** la NASA fija **≤ 3** para tareas normales y **≤ 6** para tareas fuera de lo normal (S25, V2 5007). Una carga **baja también es riesgo**: aburrimiento, poca atención y más errores (S30, V1 §4.3). El viaje a Marte alternará sobrecarga y aburrimiento (R13).
- **Qué hacer:**
  - 🟡 Bedford 4–6: *"Habla con el comandante o el CMO para redistribuir tareas o simplificarlas."*
  - 🟡 Aburrimiento: *"Haz una actividad con sentido: aprende algo nuevo o cuida las plantas (S08)."*
  - 🟠 Bedford ≥ 7 o aburrimiento 3 días seguidos: aviso al CMO.
- **Frecuencia:** diaria, al final de la jornada.
- **Riesgo HRP:** HRP-14, HRP-12. **Fuentes:** S25, S30, S08, R13.

### F11 · Ejercicio (`EXERCISE`)
- **Qué es:** los minutos de ejercicio aeróbico y de resistencia que hiciste hoy.
- **Equipo:** registro manual (cinta, bicicleta, máquina de resistencia).
- **Por qué importa en el espacio:** sin gravedad, los huesos pierden **1–1.5 % por mes** y los músculos se debilitan. En la ISS se hacen **1.5 h diarias, 6–7 días por semana**. La pérdida media de fuerza y capacidad aeróbica es de **10–12 %** (S08, S09).
- **Qué hacer:**
  - 🟡 *"Hoy te faltan X minutos: completa tu sesión."*
  - 🟠 *"Llevas 2 días con menos de 60 minutos. Ajusta tu horario con el CMO."*
- **Prevención:** sesiones fijas en la agenda; recordatorios; la gamificación premia cumplir (S08: "compañeros de entrenamiento por software").
- **Frecuencia:** diaria.
- **Riesgo HRP:** HRP-09, HRP-11. **Fuentes:** S08, S09.

### F12 · Hidratación (`HYDRATION`)
- **Qué es:** los litros de líquido que bebiste hoy.
- **Por qué importa en el espacio:** la deshidratación y el calcio que pierden los huesos aumentan el riesgo de **cálculos renales** (S08, S14). Beber bastante líquido **antes del aterrizaje** ayuda a evitar desmayos (S09). La NASA asigna **2.5 L/día** para beber, **+0.24 L por hora de EVA** y **mínimo 1.000 mL** para cargar líquido antes de la reentrada (S22, S23).
- **Qué hacer:**
  - 🟡 *"Bebe agua ahora y repártela durante el día."*
  - 🟠 *"Avisa al CMO si además tienes dolor lumbar o en el costado."*
- **Frecuencia:** diaria.
- **Riesgo HRP:** HRP-07, HRP-11. **Fuentes:** S08, S14, S22, S23.

### F13 · Ingesta calórica y apetito (`CALORIES`, `APPETITE`)
- **Qué es:** cuánto comiste respecto a tu objetivo y cómo está tu apetito (1–5).
- **Objetivo calórico personal:** se calcula con la **ecuación EER que usa la NASA** (edad, sexo, peso, estatura y factor de actividad), con más calorías los días de EVA. La norma pide dar el **100 % del requerimiento calculado** (S24, S30 V1 4020).
- **Por qué importa en el espacio:** la comida debe ser variada para evitar la **fatiga de menú**. No habrá reabastecimiento (S09). La **pérdida de apetito** también es un síntoma después de radiación (S07, R12).
- **Qué hacer:**
  - 🟡 *"Prueba otra opción del menú o una comida favorita."*
  - 🟠 *"Avisa al CMO. ¿Hubo un evento solar reciente o tienes náuseas?"*
- **Frecuencia:** diaria.
- **Riesgo HRP:** HRP-07. **Fuentes:** S09, S07.

### F14 · Mareo espacial (`DIZZINESS`): escala de la NASA
- **Qué es:** el mareo y la desorientación del espacio, calificados con la **escala oficial de 4 grados** (S26):
  - **0 · Ninguno:** solo dolor de cabeza leve y pasajero o un poco menos de apetito.
  - **1 · Leve:** uno o varios síntomas leves, a veces solo al mover la cabeza. Sin impacto en el trabajo. Puede haber una arcada o un vómito. Se resuelve en 36–48 h.
  - **2 · Moderado:** varios síntomas más persistentes, pérdida de apetito, malestar, cansancio, molestia en el estómago. No más de 2 vómitos. Impacto mínimo. Se resuelve en 72 h.
  - **3 · Severo:** lo anterior más pronunciado, fuertes ganas de no mover la cabeza, más de 2 vómitos, deterioro claro del desempeño. Puede durar más de 72 h.
- **Por qué importa en el espacio:** afecta al **70–90 %** de la tripulación, sobre todo los **primeros 2–3 días** (S26). Marearse en la Tierra no lo predice (S09). Afecta las tareas, el manejo de vehículos y las EVA (S09, S30 V1 4006).
- **Qué hacer (sin medicamentos, S26):**
  - 🟡 Leve: *"Quédate quieto un rato, usa la sujeción de cabeza, oriéntate con un 'arriba' y un 'abajo' visuales, hidrátate y haz los ejercicios de movimiento de cabeza indicados en tu entrenamiento."*
  - 🟠 Moderado: lo anterior + *"Avisa al CMO. NO APTO para EVA ni para conducir el rover."*
  - 🟠 Severo: *"Avisa al CMO ahora (riesgo de deshidratación). Tratamiento según el protocolo de la misión."*
  - **Con debilidad de un lado, dificultad para hablar o confusión:** 🔴 → EMERGENCIA (P1 o P4).
- **Frecuencia:** diaria los primeros días de misión y en cada transición de gravedad.
- **Riesgo HRP:** HRP-02. **Fuentes:** S26, S09, S30.

### F15 · Dosis de radiación (`RADIATION_DAILY`, `RADIATION_CAREER`)
- **Qué es:** cuánta radiación has recibido hoy y en toda tu carrera.
- **Cómo se obtiene:** **no la mides tú**. La app la **estima** con el monitor de área del módulo donde estás y el tiempo que pasas en él. Los dosímetros personales se analizan en la Tierra (S13).
- **Por qué importa en el espacio:** la radiación **no se ve ni se siente**. En la ISS se recibe más de 10 veces la radiación natural de la Tierra (S12). En el espacio profundo, de 2 a 3 veces la de la ISS (S07). Los riesgos son **cáncer, sistema nervioso, corazón y cataratas** y, en eventos solares, **síndrome agudo** (S07, S13).
- **Unidades:** **Gy** = dosis absorbida; **Sv** = efecto biológico. La app muestra **mSv**.
- **Qué hacer:**
  - Barra *"Has usado X % de tu límite de carrera (600 mSv)"* (S03).
  - Dosis diaria mayor que el múltiplo crítico del perfil o aviso de evento solar → **P3**.
- **Riesgo HRP:** HRP-17. **Fuentes:** S03, S04, S07, S12, S13.

### F16 · Visión (`VISION_CHANGE`, opcional)
- **Qué es:** si notas cambios en tu vista: borrosa, de cerca o con manchas.
- **Por qué importa en el espacio:** **cerca del 70 %** de los astronautas de la ISS tiene algo de inflamación detrás del ojo (SANS), y el **18 %** recibe el diagnóstico (S29). Los líquidos suben a la cabeza en microgravedad (S09).
- **Pregunta clave:** *"¿Ves peor de cerca que antes?"* La NASA observa **cambios hacia la hipermetropía** y lleva lentes de corrección a bordo (S29, S30).
- **Qué hacer:** *"Avisa al CMO y anota qué cambió. Esto no es un diagnóstico."*
- **Frecuencia:** semanal.
- **Riesgo HRP:** HRP-10. **Fuentes:** S09.

---

## 4. Mapa corporal (`body-map.json`): 11 regiones

> Por región: función · indicadores que la colorean · efecto de cada peligro (lente D2) · contramedidas · riesgo HRP.

| ID | Región | Función (1 frase) | Indicadores | ☢️ Radiación | 🧍 Aislamiento | 🌍 Distancia | 🪐 Gravedad | 🏭 Ambiente | Contramedidas | HRP |
|---|---|---|---|---|---|---|---|---|---|---|
| `MIND` | Cerebro y mente | Piensa, decide, regula el ánimo y el sueño | Sueño, ánimo, moral, fatiga, estrés, carga, vigilancia | Puede alterar la cognición, la función motora y la conducta (S07, R12) | Ansiedad, depresión, baja moral (S09) | Sin apoyo inmediato de la familia ni de la Tierra | — | Ruido y luz alteran el sueño (S08) | Bitácora, horario de luz, autocuidado, actividades con sentido | HRP-12, 14 |
| `EYES` | Ojos | Ver | Visión (opcional) | **Cataratas** a largo plazo (S07) | — | — | Líquidos hacia la cabeza: SANS en ~70 % (S09) | — | Reportar cambios de visión al CMO | HRP-10, 17 |
| `INNER_EAR` | Oído interno y equilibrio | Mantiene el equilibrio y la orientación | Mareo | — | — | — | Mareo y desorientación en los cambios de gravedad (S09) | — | Movimientos lentos de cabeza, fijar la vista, no conducir con mareo | HRP-02 |
| `HEART` | Corazón y vasos | Bombea la sangre al cuerpo | FC, HRV, presión | Riesgo cardiovascular a largo plazo (S07) | El estrés eleva la FC | Para Marte, entrenamiento reforzado en emergencias cardiovasculares (S09) | Se vuelve más esférico; presión baja y desmayo al aterrizar; coágulos (S09) | — | Ejercicio aeróbico, hidratación, prendas de compresión y líquidos antes del aterrizaje | HRP-03 |
| `LUNGS` | Pulmones | Toman oxígeno y eliminan CO₂ | SpO₂, FR, CO₂ de la cabina | — | — | — | — | CO₂, presión de cabina reducida → hipoxia leve (S01, S09) | Revisar el CO₂, oxígeno del kit según el protocolo | HRP-06 |
| `BLOOD` | Sangre, metabolismo e inmunidad | Transporta energía y defiende al cuerpo | Glucosa, calorías, apetito, temperatura | Daño a células sanguíneas e inmunes (S07) | El estrés altera el sistema inmune (S08) | Comida limitada, fatiga de menú (S09) | — | Microbios que cambian y pasan entre personas (S08) | Comidas variadas, higiene, sueño | HRP-01, 05, 07 |
| `BONES` | Huesos | Sostienen el cuerpo y protegen órganos | Ejercicio (indirecto) | — | — | — | Pérdida de **1–1.5 %/mes** en columna y caderas (S09) | — | Ejercicio de resistencia diario; calcio y vitamina D en la dieta ⚠️ | HRP-11 |
| `MUSCLES` | Músculos | Permiten moverse y hacer fuerza | Ejercicio | — | — | — | Pérdida de fuerza de 10–12 %; riesgo de caídas en transiciones (S09) | — | 1.5 h/día de ejercicio, 6–7 días/semana (S09) | HRP-09 |
| `SPINE` | Espalda y columna | Sostiene el tronco | Dolor de espalda (D3) | — | — | — | La columna se estira hasta 3 %: dolor de espalda (S08, S09) | — | Estiramientos, ejercicio de core ⚠️ | HRP-11, 16 |
| `KIDNEYS` | Riñones | Filtran la sangre y eliminan desechos | Hidratación | — | — | — | Calcio de los huesos + deshidratación → cálculos renales (S08, S14) | — | Beber suficiente agua | HRP-07, 11 |
| `WHOLE_BODY` | Piel y cuerpo completo | Barrera de protección y estado general | Dosis diaria y de carrera, temperatura, síntomas de piel | Cáncer (riesgo principal del límite de exposición) y síndrome agudo: piel, náuseas (S07) | — | — | — | Alergias, erupciones, virus latentes (S09) | Refugio en eventos solares, higiene, barra de % del límite | HRP-17, 01 |

---

## 5. Protocolos de emergencia (`emergency-protocols.json`)

> **Formato:** cada paso tiene un `id`, un texto, un tipo (`INFO`, `QUESTION` Sí/No, `ACTION`, `MEASURE`, `TIMER`) y a qué paso va después.
> **Reglas comunes:**
> - El protocolo se activa **sin login**.
> - Al empezar, se avisa a toda la tripulación del módulo y al CMO, y se abre la **bitácora** con la hora de cada paso.
> - Al terminar, se genera el reporte SBAR y se pone en cola hacia la Tierra con el retraso del perfil.
> - **Política (sección 0.3):** guías de coordinación para una tripulación **entrenada**. Los pasos clínicos remiten al entrenamiento médico y al protocolo de la misión. El ritmo del metrónomo es `CMO_CONFIGURABLE`.

### P1 · Dolor en el pecho o colapso

> ✅ Estructura basada en el procedimiento *CHEST PAIN* y *CPR* del Medical Checklist de la NASA (S34), adaptada a una app (sin medicamentos ni dosis).

| ID | Tipo | Texto | Sí → | No → |
|---|---|---|---|---|
| P1-01 | INFO | "Emergencia activada. Se avisó a la tripulación y al CMO." | P1-02 | — |
| P1-02 | QUESTION | "¿Hay alarma de humo, CO₂ o despresurización en el módulo?" | P1-03 | P1-04 |
| P1-03 | ACTION | "Primero, protégete: ponte la máscara y lleva al compañero a un módulo seguro si puedes hacerlo sin riesgo." | P1-04 | — |
| P1-04 | QUESTION | "¿La persona responde si le hablas fuerte y le tocas los hombros?" | P1-20 | P1-05 |
| P1-05 | QUESTION | "¿Respira con normalidad? (mira el pecho durante 10 segundos)" | P1-15 | P1-06 |
| P1-06 | ACTION | "Pide a alguien que traiga el desfibrilador (DEA) si el kit lo tiene." | P1-07 | — |
| P1-07 | ACTION | **Según la gravedad del perfil.** Microgravedad: *"Fija a la persona con los **cinturones de restricción del paciente** y fíjate tú con el **cinturón del rescatador**"* (S34). Luna o Marte: *"Acuesta a la persona boca arriba sobre una superficie firme."* | P1-08 | — |
| P1-08 | TIMER | "Inicia la RCP **según tu entrenamiento médico de misión**. Sigue el metrónomo (ritmo configurado por el CMO)." En microgravedad, usa la técnica de RCP adaptada que te enseñaron | P1-09 | — |
| P1-09 | QUESTION | "¿Llegó el DEA?" | P1-10 | P1-08 (continuar) |
| P1-10 | ACTION | "Enciende el DEA y sigue sus instrucciones de voz. Nadie toca a la persona durante la descarga." | P1-11 | — |
| P1-11 | QUESTION | "¿La persona empezó a respirar o a moverse?" | P1-15 | P1-08 |
| P1-15 | ACTION | "Coloca a la persona en posición segura (o fíjala de lado en microgravedad). Pon el oxímetro." | P1-16 | — |
| P1-16 | MEASURE | "Registra la FC y la SpO₂ cada 2 minutos." | P1-17 | — |
| P1-17 | QUESTION | "¿Deja de responder o de respirar?" | P1-05 | P1-30 |
| P1-20 | MEASURE | "Pregunta y registra: ¿cuándo empezó el dolor? ¿Cómo es (opresivo, punzante)? ¿Se extiende al brazo, la mandíbula o la espalda? ¿Falta el aire? ¿Hay sudor o náuseas?" | P1-21 | — |
| P1-21 | MEASURE | "Mide la **presión, el pulso, la frecuencia respiratoria, la temperatura y la SpO₂**. Observa el **color de la piel** (azulado, grisáceo, pálido) y si el pecho se mueve igual de ambos lados. Haz un **ECG** si hay equipo." (S34) | P1-22 | — |
| P1-22 | ACTION | "Reposo total. Oxígeno del kit según el protocolo de la misión si la SpO₂ está bajo el límite configurado. **Medicamentos del kit solo según el protocolo de la misión o la indicación del CMO.**" | P1-23 | — |
| P1-23 | TIMER | "Reevalúa cada 5 minutos." | P1-24 | — |
| P1-24 | QUESTION | "¿Pierde la conciencia?" | P1-04 | P1-30 |
| P1-30 | ACTION | "**Contacta al cirujano de vuelo**: se genera el reporte y queda en cola hacia la Tierra. Mantén la vigilancia hasta que el CMO cierre la emergencia." (S34) | FIN | — |

### P2 · Dificultad para respirar o hipoxia

| ID | Tipo | Texto | Sí → | No → |
|---|---|---|---|---|
| P2-01 | QUESTION | "¿Hay alarma de CO₂, humo o presión en el módulo?" | P2-02 | P2-04 |
| P2-02 | ACTION | "Máscaras puestas. Pasa a un módulo seguro. Avisa del problema ambiental a toda la tripulación." | P2-03 | — |
| P2-03 | MEASURE | "Mide la SpO₂ de todos los que estaban en el módulo." | P2-05 | — |
| P2-04 | ACTION | "Siéntate o fíjate en posición cómoda. Afloja la ropa. Respira despacio." | P2-05 | — |
| P2-05 | MEASURE | "Registra la SpO₂ y la FR cada minuto." | P2-06 | — |
| P2-06 | QUESTION | "¿La SpO₂ está por debajo de 92 % o la FR es de 25 o más?" | P2-07 | P2-09 |
| P2-07 | ACTION | "Oxígeno del kit según el protocolo de la misión. Avisa al CMO." | P2-08 | — |
| P2-08 | QUESTION | "¿Hay confusión, labios morados o deja de responder?" | → P1-04 | P2-09 |
| P2-09 | ACTION | "Vigila durante 15 minutos. Reporte al CMO." | FIN | — |

### P3 · Evento solar o radiación

| ID | Tipo | Texto | Sí → | No → |
|---|---|---|---|---|
| P3-01 | INFO | "Aviso de evento solar o dosis alta en el módulo." | P3-02 | — |
| P3-02 | ACTION | "Ve **ahora** al área más blindada (refugio). Lleva tu dosímetro." | P3-03 | — |
| P3-03 | ACTION | "Si el hábitat lo permite, reacomoda las **bolsas de agua** alrededor del refugio: el agua es un buen blindaje (S07)." | P3-04 | — |
| P3-04 | QUESTION | "¿Hay alguien haciendo una EVA o fuera del hábitat?" | P3-05 | P3-06 |
| P3-05 | ACTION | "Ordena el regreso inmediato al hábitat. No se programan nuevas EVA durante el evento." | P3-06 | — |
| P3-06 | TIMER | "Registra la hora de entrada al refugio. Permanece hasta que se levante el aviso." | P3-07 | — |
| P3-07 | QUESTION | "Después del evento: ¿hay náuseas, vómito, enrojecimiento de la piel, mucha fatiga o pérdida de apetito?" | P3-08 | P3-09 |
| P3-08 | ACTION | "🔴 Avisa al CMO y a los cirujanos de vuelo. Registra los síntomas en el mapa corporal. **Sin medicamentos fuera del protocolo de la misión.**" | P3-09 | — |
| P3-09 | ACTION | "Actualiza la dosis acumulada y la barra del límite de carrera." | FIN | — |

### P4 · Síntomas durante o después de una EVA (descompresión)

| ID | Tipo | Texto | Sí → | No → |
|---|---|---|---|---|
| P4-00 | MEASURE | "Califica los síntomas con la **escala Cuff Class de la NASA** (1 a 4, S34). Clase 1 → 🟡 · 2 → 🟠 · 3 → 🟠 + aviso inmediato al CMO · 4 → 🔴" | P4-01 | — |
| P4-01 | QUESTION | "¿Hay **picazón**, **dolor muscular o en articulaciones**, **erupción leve**, hormigueo o mareo durante o después de la EVA?" (Tipo I, S27) | P4-02 | FIN |
| P4-02 | ACTION | "Si sigues en EVA: **termínala de forma segura pero rápida** y vuelve al hábitat presurizado (S09)." | P4-03 | — |
| P4-03 | ACTION | "Avisa al CMO. Registra los síntomas en el mapa corporal (zona y hora de inicio)." | P4-04 | — |
| P4-04 | QUESTION | "¿Hay **entumecimiento, debilidad, confusión o problemas para pensar, vértigo o problemas de oído, falta de aire o piel moteada**?" (Tipo II, S27) | P4-05 | P4-06 |
| P4-05 | ACTION | "🔴 Emergencia: oxígeno del kit según el protocolo de la misión, aviso a los cirujanos de vuelo. Si deja de responder → P1-04." | P4-06 | — |
| P4-05b | MEASURE | "**Chequeo neurológico (NASA):** ¿qué día de vuelo es? ¿Cómo se llaman y qué cargo tienen tus compañeros?" (S34). Respuesta incorrecta → 🔴 | P4-06 | — |
| P4-06 | TIMER | "Reevalúa cada 10 minutos. Tratamiento según el protocolo de la misión y el CMO (el principio NASA es represurizar y dar oxígeno, S34)." | FIN | — |

---

## 6. Contramedidas (`countermeasures.json`)

| Código | Contramedida | Riesgos (HRP) | Se sugiere cuando… | Fuente |
|---|---|---|---|---|
| CM-EX-01 | Ejercicio de resistencia + aeróbico, 1.5 h/día | 09, 11, 03 | Ejercicio en 🟡/🟠, tendencia de FC al alza | S08, S09 |
| CM-HY-01 | Hidratación repartida durante el día | 07, 11, 03 | Hidratación baja, presión baja | S08, S09 |
| CM-HY-02 | Líquidos y prendas de compresión **antes del aterrizaje** | 03, 16 | Checklist de transición de gravedad | S09 |
| CM-SL-01 | Horario de sueño fijo + luz de cabina tenue | 14 | Sueño en 🟡/🟠 | S08, S09 |
| CM-SL-02 | Cafeína solo en la primera mitad del día | 14 | Sueño bajo + cafeína tarde | S09 |
| CM-BH-01 | Bitácora personal (2–3 líneas) | 12 | Ánimo o estrés en 🟡 | S08, S09 |
| CM-BH-02 | Respiración guiada 4-7-8 (2 min) | 12, 14 | Estrés o fatiga en 🟡 | ⚠️ |
| CM-BH-03 | "Ventana a la Tierra" (imagen + respiración, 3 min) | 12 | Ánimo bajo, monotonía | S09 |
| CM-BH-04 | Actividad con sentido (idioma, habilidad médica, plantas) | 12, 14 | Carga de trabajo = 1 (aburrimiento) | S08 |
| CM-BH-05 | Hablar con el CMO o llamada de apoyo | 12, 13 | Ánimo en 🟠, convivencia baja | S09 |
| CM-BH-06 | Bloque diario de autocuidado | 14, 12 | Sobrecarga (carga de trabajo = 5) | S09 |
| CM-NU-01 | Variar el menú o elegir una comida favorita | 07 | Apetito bajo, fatiga de menú | S09 |
| CM-IM-01 | Higiene de manos y superficies, cambio de filtros | 01, 05 | Temperatura en 🟡, síntomas de infección | S08 |
| CM-RA-01 | Refugio en eventos solares + agua como blindaje | 17 | P3 | S07 |
| CM-RA-02 | Minimizar el tiempo en módulos poco blindados | 17 | Barra de dosis > 50 % | S07, S08 |
| CM-VE-01 | Movimientos lentos de cabeza, fijar la vista | 02 | Mareo en 🟡 | S09 |

---

## 7. Criterios de aptitud (D4)

### 7.1 Antes de la EVA (o de una salida en rover)

| Criterio | APTO | CON PRECAUCIÓN (requiere visto bueno del CMO) | NO APTO |
|---|---|---|---|
| Sueño en las últimas 24 h | ≥ 6 h | 5–5.9 h | < 5 h |
| Horario | Fuera del nadir circadiano | — | **Entre la 1 y las 7 a. m.** del horario de sueño del tripulante → reprogramar (S30, V1 6001) |
| SpO₂ | ≥ 95 % | 93–94 % | < 93 % |
| Presión | < 140/90 | 140–159 / 90–99 | ≥ 160/100 |
| FC en reposo | 50–100 | 101–110 | > 110 o < 45 |
| Temperatura | < 37.6 °C | 37.6–38.0 °C | > 38.0 °C |
| Glucosa | 70–180 | 60–69 o 181–250 | < 60 o > 250 |
| Ánimo / fatiga | Ánimo ≥ 3 y fatiga ≤ 5 | Fatiga 6–7 | Fatiga ≥ 8 |
| Mareo (escala NASA) | 0 Ninguno | 1 Leve | 2 Moderado o 3 Severo (S26) |
| Prueba de vigilancia (si se hizo) | 🟢 | 🟡 | 🟠 |
| Síntomas en el mapa | Ninguno ≥ 4 | Uno de 4–6 | Alguno ≥ 7 |
| Alertas activas | Ninguna | Solo 🟡 | 🟠 o 🔴 |
| Radiación | Sin aviso solar | — | Aviso de evento solar activo |
| Ejercicio en los últimos 7 días | ≥ 5 días cumplidos | 3–4 días | — (es informativo) |

> ⚠️ **Todos los criterios son propuesta del equipo.** Los criterios reales de la NASA no son públicos en detalle.

### 7.2 Después de la EVA
- Las 4 preguntas de P4-01 (dolor articular, hormigueo, picazón, mareo).
- Más el mapa de dolor.
- Si alguna es "sí" → P4.

### 7.3 Transición de gravedad (al aterrizar en la Luna o Marte, o al volver a la Tierra)

| Paso | Qué se hace | Resultado |
|---|---|---|
| 1 | Mareo (escala NASA 0–3) | Moderado o Severo → NO APTO para salir solo ni conducir (S26) |
| 1b | Carga de líquido antes de la reentrada | Recordatorio: mínimo 1.000 mL (S22, S23) |
| 2 | Presión y FC **acostado** (5 min de reposo) | Valor base |
| 3 | Presión y FC **de pie** a 1 y 3 min | Caída ≥ 20/10 mmHg o mareo → 🟠 **CON AYUDA** ⚠️ (`CMO_CONFIGURABLE`) · desmayo → 🔴 |
| 4 | Equilibrio: mantenerse de pie 30 s con los pies juntos | No lo logra → CON AYUDA ⚠️ |
| 5 | Dolor en el mapa (espalda, articulaciones) | Alguno ≥ 7 → CON AYUDA |
| 6 | Recordatorio | "Riesgo de caídas los primeros días: muévete despacio" (S09) |
| **Resultado** | **APTO / CON AYUDA / NO APTO para salir de la nave por tus propios medios** | (S09, HRP-16) |

---

## 8. Gamificación

| Elemento | Detalle |
|---|---|
| **Puntos** | +10 por recordatorio cumplido a tiempo · +5 por autoevaluación completa · +15 por ejercicio diario cumplido · +20 por leer una ficha nueva · +10 por prueba de vigilancia · +15 por **reportar un síntoma** |
| **Niveles** | Cadete (0) → Especialista (300) → Ingeniero de vuelo (800) → Comandante de salud (1.500) |
| **Insignias** | 🥇 *Primera medición* · 🔥 *Racha de 7 días* · 🧭 *Explorador del cuerpo* (abrió las 11 regiones) · 😴 *Sueño reparador* (5 noches ≥ 7 h) · 💧 *Hidratado* (7 días cumpliendo la meta) · 🏋️ *Constante* (6 de 7 días de ejercicio) · 📣 *Reportero honesto* (reportó un síntoma) · ☢️ *Guardián de la radiación* (completó P3 en un simulacro) |
| **Misión de la tripulación** | "La tripulación completa el 95 % de las mediciones esta semana". Premio colectivo |
| **Regla de oro** | **Nunca se premian ni se castigan los valores de salud.** Solo las conductas |

---

## 9. Fuentes (`sources.json`)

| ID | Fuente | Tipo | Uso |
|---|---|---|---|
| S01 | NASA OCHMO, *Carbon Dioxide Technical Brief* (NASA-STD-3001 V2 6004) | Oficial | CO₂ ≤ 3 mmHg |
| S02 | NASA OCHMO, *ECLSS / Habitable Atmosphere Technical Briefs* | Oficial | Temperatura y humedad |
| S03 | NASA OCHMO, *Radiation Protection Technical Brief* | Oficial | Límite de carrera de 600 mSv; 250 mSv por SPE |
| S04 | PTB, dosímetros en la ISS | Científica | ~0.5 mSv/día en la ISS |
| S05 | Revisión en PMC sobre datos médicos de la ISS | Científica | 0.2–0.5 mSv/día |
| S06 | NASA, *5 Hazards of Human Spaceflight* (R1) | Oficial | Los 5 peligros |
| S07 | NASA, *Houston We Have a Podcast* ep. 57 + paquete de radiación (R2–R6, R12) | Oficial | Factores de dosis, 4 riesgos de radiación, P3 |
| S08 | NASA HRP, *The Human Body in Space* (R10) | Oficial | Contramedidas, sueño, ejercicio, ortostatismo, apoyo a la decisión clínica |
| S09 | NASA HRP, páginas de los 17 riesgos (R8, R14) | Oficial | `hrpRisk` y datos por riesgo |
| S12 | NASA, *Space Radiation Won't Stop NASA's Human Exploration* (R2) | Oficial | 10× la radiación natural en la ISS |
| S13 | NASA JSC, *Space Radiation* (R4) | Oficial | Monitoreo y dosímetros |
| S14 | NASA, *Hazard: Gravity Fields* (R7) | Oficial | Pérdida ósea, cálculos renales, 3 campos de gravedad |
| S15 | NASA, *Risks of Human Spaceflight* (R8) | Oficial | Lista de los 17 riesgos |
| S20 | NASA OCHMO, *Sleep Accommodations* (OCHMO-TB-041) | Oficial | Sueño: 7–9 h, 6–6.5 h en vuelo |
| S21 | NASA OCHMO, *Circadian Desynchrony* (OCHMO-MTB-009) | Oficial | Higiene del sueño y luz |
| S22 | NASA OCHMO, *Water* (OCHMO-TB-027) · NASA-STD-3001 V2 6109 | Oficial | 2.5 L/día, +0.24 L/h de EVA, 1.000 mL antes de la reentrada |
| S23 | NASA OCHMO, *Orthostatic Intolerance* (OCHMO-TB-019) | Oficial | Carga de líquido y sal, prendas de compresión |
| S24 | NASA OCHMO, *Food and Nutrition* (OCHMO-TB-013) | Oficial | Ecuación EER, 100 % del requerimiento |
| S25 | NASA OCHMO, *Cognitive Workload* (OCHMO-TB-032) · NASA-STD-3001 V2 5007 | Oficial | Escala Bedford ≤ 3 / ≤ 6 |
| S26 | NASA OCHMO, *Space Adaptation Sickness* (OCHMO-MTB-004) | Oficial | Escala de mareo espacial 0–3, 70–90 %, medidas sin medicamentos |
| S27 | NASA OCHMO, *Decompression Sickness* (OCHMO-TB-037) | Oficial | Tipos I y II |
| S28 | NASA OCHMO, *Venous Thrombosis in Spaceflight* (OCHMO-MTB-007) | Oficial | Coágulos, vena yugular, hinchazón |
| S29 | NASA OCHMO, *SANS* (OCHMO-MTB-001) | Oficial | 70 % con signos, 18 % diagnosticados, hipermetropía |
| S30 | **NASA-STD-3001 Vol. 1 Rev. C** (2023) | Norma oficial | Signos vitales, valores clínicos aceptados, ≥ 80 % de fuerza, ≥ 95 %/90 % de densidad ósea, 8.5 h de sueño, nadir circadiano, hipotermia < 35 °C, EER al 100 % |
| S31 | NASA OCHMO, *Habitable Atmosphere* (OCHMO-TB-003) | Oficial | Hipoxia y altitud equivalente de la cabina |
| S32 | NASA NTRS 20090029851, *Psychomotor Vigilance Self Test on ISS (Reaction Self Test)* | Oficial (NASA) | Prueba de 3 min, lapsos, 2 veces al día, factores de fatiga |
| S33 | NASA NSSDC, *Mars Fact Sheet* (nssdc.gsfc.nasa.gov) | Oficial | Día de 24.6597 h; 0.380 g |
| S34 | NASA JSC-48031, *Medical Checklist*, Rev. H (2001) | Oficial (histórico) | Estructura de P1 (dolor en el pecho, RCP con restricciones) y de P4 (escala Cuff Class, chequeo neurológico) |
| `CMO_CONFIGURABLE` | Valor de demostración configurable por el CMO (sin fuente NASA) | Propuesta del equipo | Límites críticos absolutos, ritmo de RCP, criterios de aptitud |
| ~~S10, S11, S16~~ | ~~Guías clínicas externas (ADA, AHA, ERC)~~ | ❌ Eliminadas | Política de fuentes (sección 0) |

---

## 10. Casos de prueba (para los motores)

| ID | Entrada | Resultado esperado |
|---|---|---|
| T01 | Todos los valores normales | 🟢 global, escalamiento `NONE` |
| T02 | SpO₂ 93 % en 2 lecturas seguidas | 🟡, `SELF`; la explicación cita la persistencia |
| T03 | SpO₂ 93 % en 1 lectura y 97 % en la siguiente | 🟢 (no se cumple la persistencia) |
| T04 | SpO₂ 85 % una vez y luego 97 % | Sin 🔴; "posible error de sensor" (L2) |
| T05 | SpO₂ 85 % en 2 lecturas en menos de 30 s | 🔴, `FLIGHT_SURGEON`, se ofrece P2 |
| T06 | SpO₂ 93 % + CO₂ 3.5 mmHg | 🟠 alerta ambiental en el módulo |
| T07 | FC 112, sueño 5.5 h, estrés 6 (3 precauciones) | 🟠 por combinación |
| T08 | FC 135 | 🔴 (crítico de sensor, con confirmación) |
| T09 | Presión 185/100 | 🔴 |
| T10 | Presión 132/86 | 🟡 |
| T11 | Temperatura 38.5 °C | 🟠, `CREW_CMO` |
| T12 | Glucosa 65, en ayunas | 🟡 + "carbohidratos rápidos y medir en 15 min" |
| T13 | Glucosa 50 | 🔴 |
| T14 | Glucosa 200, después de comer | 🟠 |
| T15 | Ánimo 3 durante 3 días | 🟠 |
| T16 | Ánimo 1 | 🔴 + "Busca al CMO ahora" |
| T17 | Bedford 5 en un día | 🟡 (S25: > 3 en tarea normal) |
| T18 | Aburrimiento = Sí durante 3 días | 🟠 (carga baja, S30 V1 §4.3) |
| T19 | Bedford 2, sin aburrimiento | 🟢 |
| T20 | Mareo espacial grado 2 (moderado) | 🟠 + NO APTO para EVA o rover (S26) |
| T21 | Ejercicio 45 min durante 2 días | 🟠 (el máximo de este indicador) |
| T21b | Hidratación 1.8 L durante 2 días | 🟠 (meta de 2.5 L/día, S22) |
| T21c | Temperatura 34.8 °C | 🔴 hipotermia (S30) |
| T21d | D4: EVA programada a las 3 a. m. del horario del tripulante | NO APTO → reprogramar (nadir circadiano, S30) |
| T22 | Sin lecturas de vitales durante 12 min | ⚪ sin datos (no 🟢) |
| T23 | Indicador en 🟠 y luego 2 lecturas normales | Sigue 🟠 (histéresis, L3) |
| T24 | Indicador en 🟠 y luego 3 lecturas normales | Baja a 🟢 |
| T25 | Perfil Tránsito a Marte, dosis 2.5× la de la ISS | 🟢 (es lo esperado en el perfil) |
| T26 | Perfil Estación, dosis 2.5× la de la ISS | 🟡 o 🟠 según el múltiplo |
| T27 | Aviso de evento solar | 🔴 + P3, sin esperar confirmación |
| T28 | Después del evento solar: náuseas + apetito 2 | 🔴, P3-08 |
| T29 | Dosis de carrera 470 mSv | 🟠, barra al 78 % |
| T30 | Mapa de dolor: pecho 8 | 🔴 + se ofrece P1 |
| T31 | Mapa de dolor: pecho 5 + falta de aire | 🔴 + P1 |
| T32 | Mapa de dolor: pierna con hinchazón y dolor | 🟠 (posible coágulo), aviso al CMO |
| T33 | Después de la EVA: dolor articular | P4; 🟠 |
| T34 | Después de la EVA: hormigueo + debilidad de un lado | P4-05, 🔴 |
| T35 | D4 antes de la EVA: sueño 4.5 h | NO APTO; la razón es el sueño |
| T36 | D4 antes de la EVA: todo normal y fatiga 6 | CON PRECAUCIÓN (visto bueno del CMO) |
| T37 | D4 transición: caída de la sistólica de 25 mmHg al ponerse de pie | CON AYUDA |
| T38 | D4 transición: desmayo | 🔴 |
| T39 | Vigilancia: mediana +35 % sobre la línea base | 🟠 + afecta la aptitud para EVA |
| T40 | P1: no responde y no respira | P1-06 → P1-07 → metrónomo |
| T41 | P1: responde con dolor en el pecho, SpO₂ 92 % | P1-20 → P1-22 (oxígeno según el protocolo) |
| T42 | P1 abierto con la API caída | El intérprete offline sigue los pasos desde `localStorage` |
| T43 | Botón EMERGENCIA sin haber elegido tripulante | El protocolo se abre igual (sin login) |
| T44 | Gamificación: el tripulante reporta ánimo 1 | +5 por autoevaluación y +15 por reportar; **ningún punto se resta** |
| T45 | Gamificación: valores de salud "malos" | Los puntos no cambian por el valor, solo por la conducta |
| T46 | Perfil Rover + 🟠 | La recomendación incluye "regresar a la base" |
| T47 | Perfil con presión de cabina reducida + SpO₂ 93 % + dolor de cabeza | 🟡; la explicación menciona hipoxia leve y cabina reducida |
| T48 | Contenido: un umbral sin `sourceId` | La aplicación **no arranca** (fail fast, 0.14.4) |

---

## 11. Estado de las fuentes (política: ligados a la NASA), actualizado el 13 de noviembre

| # | Contenido | Estado |
|---|---|---|
| 1 | Riesgos, peligros, contramedidas, huesos, ejercicio, SANS, radiación, ambiente de la cabina | ✅ Fuente NASA |
| 2 | **Sueño** (7–9 h, 8.5 h, nadir 1–7 a. m., higiene del sueño) | ✅ **Nuevo:** S20, S21, S30 |
| 3 | **Hidratación** (2.5 L/día, +0.24 L/h de EVA, 1.000 mL antes de la reentrada) | ✅ **Nuevo:** S22, S23 |
| 4 | **Objetivo calórico** (ecuación EER) | ✅ **Nuevo:** S24, S30 |
| 5 | **Carga de trabajo** (escala Bedford) y **mareo espacial** (escala 0–3) | ✅ **Nuevo:** S25, S26 (reemplazan las escalas propias) |
| 6 | **Descompresión** Tipo I y II, **coágulos**, **visión** (hipermetropía) | ✅ **Nuevo:** S27, S28, S29 |
| 7 | **Línea base personal** como regla principal | ✅ La norma usa límites relativos (≥ 80 % de fuerza, ≥ 95 % de densidad ósea, S30) |
| 8 | Hipotermia < 35 °C | ✅ S30 |
| 9 | Límites críticos de FC, presión, SpO₂, FR y glucosa | ⚠️ `CMO_CONFIGURABLE`. La norma dice que deben estar *"dentro de valores clínicamente aceptados"* definidos por la medicina de vuelo (S30), y así se presenta |
| 10 | Prueba ortostática (20/10 mmHg), lapso de 500 ms, ritmo de RCP, criterios de EVA sin fuente | ⚠️ Propuesta del equipo o `CMO_CONFIGURABLE` |
| 11 | Día marciano | ✅ **24 h 39 min 35 s** (S33, NASA NSSDC) |
| 12 | Prueba de vigilancia (D11) y factores de fatiga | ✅ **Nuevo:** formato del *Reaction Self Test* de la NASA (S32). Solo el umbral del lapso (ms) sigue configurable |
| 13 | Estructura de P1 y escala de P4 | ✅ **Nuevo:** Medical Checklist de la NASA (S34). El ritmo de RCP sigue `CMO_CONFIGURABLE` |
