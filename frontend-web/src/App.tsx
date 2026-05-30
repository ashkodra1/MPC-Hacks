import './App.css'

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Demo', href: '#demo' },
]
const fallacyTags = ['Straw man', 'False cause', 'Ad hominem']

function App() {
  return (
    <main className="page-shell">
      <div className="orbital orbital-top" aria-hidden="true" />
      <div className="ambient-glow" aria-hidden="true" />

      <header className="site-header">
        <a className="brand" href="/" aria-label="Pikmin home">
          <span className="brand-mark" />
          Pikmin
        </a>

        <nav className="site-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item.label} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <h1 id="hero-title">Real-time logical fallacy detection for online videos</h1>
          <p>
            Pikmin highlights weak reasoning as you watch, giving students, creators,
            and curious viewers a clearer read on persuasive claims.
          </p>

          <div className="hero-actions">
            <a className="primary-action" href="#get-started">
              Get Started
            </a>
          </div>
        </div>

        <aside className="analysis-panel" aria-label="Fallacy detection preview">
          <div className="panel-topbar">
            <span />
            <span />
            <span />
          </div>
          <div className="video-frame">
            <div className="play-button" />
            <div className="timeline">
              <span />
            </div>
          </div>
          <div className="insight-card">
            <div>
              <span className="status-dot" />
              Detected claim
            </div>
            <strong>Possible false cause</strong>
            <p>Correlation is being treated as proof without a supporting link.</p>
          </div>
          <div className="fallacy-tags">
            {fallacyTags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </aside>
      </section>
    </main>
  )
}

export default App
