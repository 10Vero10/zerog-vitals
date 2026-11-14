# Prompt de arranque para el chat nuevo (hora 0 del evento)

> Copia los archivos a la carpeta `docs/` del repositorio (el borrador de `CLAUDE.md` va en la raíz con ese nombre) y pega este mensaje como primer pedido en Claude Code:

---

Hola. Vamos a construir **ZeroG Vitals** para el NASA Space Apps Challenge 2026, en 48 horas.

1. Lee `CLAUDE.md`, `docs/ZeroG_Vitals_SPEC.md`, `docs/ZeroG_Vitals_Modelo_Datos.md`, `docs/ZeroG_Vitals_API_REST.md` y `docs/ZeroG_Vitals_Paquete_Contenido.md`. El SPEC es la fuente de verdad. `docs/ZeroG_Vitals_Plan_Equipo.md` es histórico: no lo uses para decidir.
2. Antes de escribir código, resúmeme en 10 líneas qué entendiste (producto, alcance del MVP, stack, reglas innegociables) y dime si encuentras alguna contradicción o algo que falte.
3. Cuando lo confirme, ejecuta el pedido **P0** de la sección 10 del SPEC, siguiendo **la configuración del repositorio de la sección 13**: archivos de la raíz, `.gitignore`, `.gitattributes`, `.editorconfig`, `.env.example`, Docker Compose, CI, plantilla de PR, licencia MIT y README base, más la estructura de la sección 4.2 con i18n y flags. Sin lógica de negocio todavía. Al final, dime qué debo configurar a mano en GitHub (protección de `main`, colaboradores, tablero).
4. Trabaja en tareas pequeñas y haz commits frecuentes con `Co-Authored-By: Claude`. No agregues Spring Security ni MapStruct. No inventes contenido médico.

**Equipo (3 personas, sección 14 del SPEC):** Verónica (líder + base de datos + triaje + emergencia de punta a punta), Elimar (backend: API, servicios y contenido JSON) y Rafael (frontend: base, autoevaluación, mapa corporal y gráficas). Alcance: **MVP recortado** de la sección 14.1. Yo soy [nombre] y hoy trabajo en [mi módulo].
