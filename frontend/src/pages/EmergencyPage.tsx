import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

// Provisional: la pantalla P1 se construye en el pedido P7.
export function EmergencyPage() {
  const { t } = useTranslation()
  return (
    <section className="space-y-4">
      <p className="text-lg">{t('emergency.comingSoon')}</p>
      <Link to="/" className="underline">
        {t('common.back')}
      </Link>
    </section>
  )
}
