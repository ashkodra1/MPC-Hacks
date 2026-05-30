import AnalysisPanel from '../components/AnalysisPanel'

function HomePage() {
  return (
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

      <AnalysisPanel />
    </section>
  )
}

export default HomePage
