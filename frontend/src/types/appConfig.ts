// ⚠️ Temporal: se reemplaza por el tipo generado desde OpenAPI (npm run gen:types)
// cuando exista GET /api/config (API REST 3.7).
export type FeatureKey =
  'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6' | 'D7' | 'D8' | 'D9' | 'D10' | 'D11'

export interface AppConfig {
  rulesVersion: string
  features: Partial<Record<FeatureKey, boolean>>
}
