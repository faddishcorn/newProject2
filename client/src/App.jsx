// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import { Analytics } from "@vercel/analytics/react"
import LoginPage from './pages/LoginPage'
import AppRoutes from './routes'

export default function App() {
  return (
    <>
    <AppRoutes/>
    <Analytics/>
    </>
  )
}
