import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import type { Page } from './components/Header'
import DetectorPage from './DetectorPage'
import AboutPage from './pages/AboutPage'
import FallaciesPage from './pages/FallaciesPage'
import HomePage from './pages/HomePage'

function App() {
  const [page, setPage] = useState<Page>('home')

  if (page === 'detector') {
    return <DetectorPage currentPage={page} onNavigate={setPage} />
  }

  return (
    <main className={`page-shell ${page === 'home' ? 'home-shell' : 'content-shell'}`}>
      <div className="orbital orbital-top" aria-hidden="true" />
      <div className="ambient-glow" aria-hidden="true" />

      <Header currentPage={page} onNavigate={setPage} />
      {page === 'home' && <HomePage onGetStarted={() => setPage('detector')} />}
      {page === 'fallacies' && <FallaciesPage />}
      {page === 'about' && <AboutPage />}
    </main>
  )
}

export default App
