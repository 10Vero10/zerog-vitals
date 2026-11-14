import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/AppLayout'
import { EmergencyPage } from '@/pages/EmergencyPage'
import { HomePage } from '@/pages/HomePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="emergency" element={<EmergencyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
