import { useTranslation } from 'react-i18next'
import { useAppConfig } from '@/hooks/useAppConfig'

// Pantalla inicial provisional: aquí irá el selector de tripulante (P5).
export function HomePage() {
  const { t } = useTranslation()
  const { isLoading, isError } = useAppConfig()
  if (isLoading) return <p>{t('common.loading')}</p>
  return isError ? <p className="text-level-alert">{t('common.offline')}</p> : null
}
