import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

/** Siempre visible y nunca pide identificación (principio 5). */
export function EmergencyButton() {
  const { t } = useTranslation()
  return (
    <Link
      to="/emergency"
      className="rounded-xl bg-emergency px-6 py-4 text-xl font-bold tracking-wide text-white shadow-lg hover:brightness-110"
    >
      {t('emergency.button')}
    </Link>
  )
}
