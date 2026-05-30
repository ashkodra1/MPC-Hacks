import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import type { Page } from './components/Header'
import DetectorPage from './DetectorPage'
import AboutPage from './pages/AboutPage'
import HomePage from './pages/HomePage'

function App() {
  const [page, setPage] = useState<Page>('home')

  if (page === 'detector') {
    return <DetectorPage currentPage={page} onNavigate={setPage} />
  }

  return (
    <main className="page-shell home-shell">
      <div className="orbital orbital-top" aria-hidden="true" />
      <div className="ambient-glow" aria-hidden="true" />

      <Header currentPage={page} onNavigate={setPage} />
      {page === 'home' ? (
        <HomePage onGetStarted={() => setPage('detector')} />
      ) : (
        <AboutPage />
      )}
    </main>
  )
}

export default App
