import { useState } from 'react'
import Header, { type Page } from './components/Header'
import AboutPage from './pages/AboutPage'
import HomePage from './pages/HomePage'
import './App.css'

function App() {
  const [page, setPage] = useState<Page>('home')

  return (
    <main className="page-shell">
      <div className="orbital orbital-top" aria-hidden="true" />
      <div className="ambient-glow" aria-hidden="true" />

      <Header currentPage={page} onNavigate={setPage} />
      {page === 'home' && <HomePage />}
      {page === 'about' && <AboutPage />}
    </main>
  )
}

export default App
