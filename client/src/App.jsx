// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import { Analytics } from "@vercel/analytics/react"

export default function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* 추후 여기에 다른 페이지도 추가 */}
      </Routes>
    </BrowserRouter>
    <Analytics/>
    </>
  )
}
