import type { ReactNode } from 'react'
import { useFeatures } from '@/hooks/useFeatures'
import type { FeatureKey } from '@/types/appConfig'

interface FeatureGateProps {
  feature: FeatureKey
  children: ReactNode
}

/** Si la funcionalidad está apagada en features.json, no se muestra nada. */
export function FeatureGate({ feature, children }: FeatureGateProps) {
  const { isEnabled } = useFeatures()
  return isEnabled(feature) ? <>{children}</> : null
}
