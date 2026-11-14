import type { FeatureKey } from '@/types/appConfig'
import { useAppConfig } from './useAppConfig'

/** Una funcionalidad sin flag o sin configuración cargada se considera apagada. */
export function useFeatures() {
  const { data } = useAppConfig()
  return {
    isEnabled: (key: FeatureKey): boolean => data?.features[key] === true,
  }
}
