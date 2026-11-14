# ZeroG Vitals: frontend

React + TypeScript (`strict`) + Vite + Tailwind CSS 3 + TanStack Query + react-i18next + Recharts.

| Comando             | Qué hace                                                                    |
| ------------------- | --------------------------------------------------------------------------- |
| `npm run dev`       | Servidor de desarrollo en `http://localhost:5173`                           |
| `npm run lint`      | ESLint (`npm run lint -- --fix` para corregir)                              |
| `npm run typecheck` | Verificación de tipos                                                       |
| `npm run build`     | Build de producción                                                         |
| `npm run format`    | Prettier                                                                    |
| `npm run gen:types` | Genera `src/types/api.d.ts` desde OpenAPI (el backend debe estar corriendo) |

Estructura (SPEC 4.2): `pages/` · `components/` · `hooks/` y `services/` (datos) · `engine/` (intérprete offline) · `offline/` · `types/` · `locales/` · `styles/`.
