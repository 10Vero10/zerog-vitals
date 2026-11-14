import type { AppConfig } from '@/types/appConfig'

// Caché offline del paquete GET /api/config (SPEC 8). localStorage puede fallar
// (modo privado, cuota), así que toda lectura y escritura va protegida.
const CONFIG_KEY = 'zerogvitals.config'

export function readCachedConfig(): AppConfig | null {
  try {
    const raw = localStorage.getItem(CONFIG_KEY)
    return raw ? (JSON.parse(raw) as AppConfig) : null
  } catch {
    return null
  }
}

export function writeCachedConfig(config: AppConfig): void {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
  } catch {
    // Sin caché: la app sigue funcionando mientras haya conexión.
  }
}
