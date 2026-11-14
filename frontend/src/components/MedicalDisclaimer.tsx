import { useTranslation } from 'react-i18next'

export function MedicalDisclaimer() {
  const { t } = useTranslation()
  return (
    <p role="note" className="text-center text-sm font-medium text-gray-600">
      {t('disclaimer')}
    </p>
  )
}
