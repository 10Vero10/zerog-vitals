import { readCachedConfig, writeCachedConfig } from '@/offline/configCache'
import type { AppConfig } from '@/types/appConfig'
import { apiGet } from './apiClient'

/** Descarga la configuración y la guarda; sin conexión, usa la última copia en caché. */
export async function loadAppConfig(): Promise<AppConfig> {
  try {
    const config = await apiGet<AppConfig>('/config')
    writeCachedConfig(config)
    return config
  } catch (error) {
    const cached = readCachedConfig()
    if (cached) return cached
    throw error
  }
}
