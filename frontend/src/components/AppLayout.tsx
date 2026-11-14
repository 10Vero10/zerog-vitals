import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'
import { EmergencyButton } from './EmergencyButton'
import { MedicalDisclaimer } from './MedicalDisclaimer'

export function AppLayout() {
  const { t } = useTranslation()
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="flex items-center justify-between gap-4 bg-slate-900 px-4 py-3 text-white">
        <div>
          <h1 className="text-2xl font-bold">{t('app.name')}</h1>
          <p className="text-sm text-slate-300">{t('app.tagline')}</p>
        </div>
        <EmergencyButton />
      </header>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
      <footer className="p-3">
        <MedicalDisclaimer />
      </footer>
    </div>
  )
}
