# Configuración del repositorio `zerog-vitals` (paso a paso)

> Esto lo haces **tú, a mano en GitHub** (unos 15 minutos). Los archivos del repositorio (`.gitignore`, CI, Docker…) los genera Claude en el pedido **P0**, siguiendo la sección 13 del SPEC.

## 1. Crear el repositorio (github.com → **New repository**)

| Campo | Valor |
|---|---|
| Owner | Tu cuenta (o una organización `zerog-vitals` si prefieres) |
| Repository name | `zerog-vitals` |
| Description | `Visual health self-assessment tool for astronauts, offline-first, linked to NASA HRP risks. NASA Space Apps Challenge 2026` |
| Visibility | **Public** (es un entregable oficial) |
| Add a README | ❌ **No** |
| Add .gitignore | ❌ **No** |
| Choose a license | ❌ **No** |

**¿Por qué vacío?** Claude crea el README, el `.gitignore` y la licencia MIT en P0. Si GitHub los crea primero, el primer `push` tiene conflictos.

## 2. Ajustes generales (**Settings → General**)

- **About** (el engranaje en la página principal del repo) → *Topics*: `nasa-space-apps-2026`, `space-health`, `astronauts`, `spring-boot`, `react`, `offline-first`.
- **Features:** ✅ Issues · ✅ Projects · ❌ Wikis · ❌ Discussions.
- **Pull Requests:**
  - ❌ Allow merge commits
  - ✅ **Allow squash merging** (*Default to pull request title*)
  - ❌ Allow rebase merging
  - ✅ **Automatically delete head branches**

## 3. Colaboradores (**Settings → Collaborators → Add people**)

Invita a cada integrante con su **usuario de GitHub**, con rol **Write**. Tú quedas como **Admin**.

| Integrante | Usuario de GitHub | Rol en GitHub |
|---|---|---|
| Verónica Padilla | (tu cuenta) | Admin |
| Elimar Álvarez | `@…` | Write |
| Rafael Valencia | `@…` | Write |

> Cada persona debe **aceptar la invitación** desde su correo o en github.com/notifications.

## 4. Subir los documentos (primer commit, en tu portátil)

Clona el repo vacío (cambia `TU-USUARIO`):

```bash
git clone https://github.com/TU-USUARIO/zerog-vitals.git
```

```bash
cd zerog-vitals
```

```bash
mkdir docs
```

Copia los archivos así:
- `CLAUDE_borrador.md` → `CLAUDE.md` (en la raíz)
- `ZeroG_Vitals_SPEC.md`, `ZeroG_Vitals_Modelo_Datos.md`, `ZeroG_Vitals_API_REST.md`, `ZeroG_Vitals_Paquete_Contenido.md`, `ZeroG_Vitals_Plan_Equipo.md` y `proyecto_nasa_space_apps_2026_zerog_vitals.md` → `docs/`

Luego:

```bash
git add .
```

```bash
git commit -m "docs: add project spec, data model, API contract and content pack"
```

```bash
git push -u origin main
```

> Si `git push` dice que la rama se llama `master`, cámbiala primero con `git branch -M main`.

## 5. Primer pedido a Claude (P0)

Abre Claude Code en la carpeta `zerog-vitals` y pega el mensaje de `PROMPT_ARRANQUE.md`. Claude genera la estructura, el CI y la configuración; tú revisas, haces commit y push.

## 6. Proteger `main` (**después** de que el CI haya corrido una vez)

**Settings → Branches → Add branch ruleset** (o *Add classic branch protection rule*), para `main`:
- ✅ **Require a pull request before merging** → *Required approvals*: **1**
- ✅ **Require status checks to pass** → elige los checks `backend` y `frontend` (solo aparecen después de que el CI corrió por primera vez)
- ✅ **Block force pushes**
- ❌ No marques "Do not allow bypassing": así tú, como líder, puedes desbloquear una emergencia de última hora

## 7. Tablero y etiquetas

- **Projects → New project → Board**, con el nombre `ZeroG Vitals – 48h`. Columnas: `Backlog` · `En progreso` · `En revisión` · `Hecho`.
- **Issues → Labels:** crea `ola-1`, `ola-2`, `ola-3`, `backend`, `frontend`, `contenido`, `demo`, `bloqueante` (`bug` ya viene creada).
- Opcional: pídele a Claude que cree las issues del MVP con `gh issue create`. Tú apruebas cada comando.

## 8. Actions (**Settings → Actions → General**)

- *Actions permissions:* **Allow all actions and reusable workflows**.
- *Workflow permissions:* **Read repository contents** (basta para el CI).

## 9. Lo que NO se configura

- ❌ Secretos en el repositorio: no hacen falta.
- ❌ Dependabot: apagado durante la hackatón.
- ❌ GitHub Pages: la demo corre local (o en Render, opcional).

## Checklist rápido

- [ ] Repo `zerog-vitals` creado, **público y vacío**
- [ ] Topics, squash merge y borrado automático de ramas
- [ ] Integrantes invitados (y que aceptaron)
- [ ] Docs + `CLAUDE.md` subidos a `main`
- [ ] P0 ejecutado con Claude y CI en verde
- [ ] Protección de `main` activada
- [ ] Tablero y etiquetas creados
