import AnalysisPanel from '../components/AnalysisPanel'

type HomePageProps = {
  onGetStarted: () => void
}

function HomePage({ onGetStarted }: HomePageProps) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <h1 id="hero-title">Think beyond the claim</h1>
        <p>
          Therefore highlights weak reasoning as you watch, giving students, creators,
          and curious viewers a clearer read on persuasive claims.
        </p>

        <div className="hero-actions">
          <button className="primary-action" type="button" onClick={onGetStarted}>
            Get Started
          </button>
        </div>
      </div>

      <AnalysisPanel />
    </section>
  )
}

export default HomePage