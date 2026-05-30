import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import Header from './components/Header'
import type { Page } from './components/Header'

type DetectorPageProps = {
  currentPage: Page
  onNavigate: (page: Page) => void
}

const detectedFallacies = [
  {
    time: '00:38',
    sentence: 'If we let this one rule pass, every freedom we have will disappear.',
    fallacy: 'Slippery slope',
  },
  {
    time: '02:14',
    sentence: 'They have never built a company, so their point about the economy is useless.',
    fallacy: 'Ad hominem',
  },
  {
    time: '04:51',
    sentence: 'Millions of people shared this clip, which proves the claim is true.',
    fallacy: 'Bandwagon',
  },
]

function getYouTubeId(url: string) {
  const trimmedUrl = url.trim()

  if (!trimmedUrl) {
    return ''
  }

  try {
    const parsedUrl = new URL(trimmedUrl)

    if (parsedUrl.hostname.includes('youtu.be')) {
      return parsedUrl.pathname.replace('/', '')
    }

    if (parsedUrl.searchParams.has('v')) {
      return parsedUrl.searchParams.get('v') ?? ''
    }

    const pathMatch = parsedUrl.pathname.match(/\/(?:embed|shorts)\/([^/?]+)/)
    return pathMatch?.[1] ?? ''
  } catch {
    return ''
  }
}

function DetectorPage({ currentPage, onNavigate }: DetectorPageProps) {
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [submittedUrl, setSubmittedUrl] = useState('')
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const videoId = useMemo(() => getYouTubeId(submittedUrl), [submittedUrl])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmittedUrl(youtubeUrl)
    setHasSubmitted(true)
  }

  return (
    <main className="page-shell detector-shell">
      <div className="ambient-glow" aria-hidden="true" />

      <Header currentPage={currentPage} onNavigate={onNavigate} variant="detector" />

      <section className="detector-intro">
        <div>
          <h1>Analyze a video for logical fallacies.</h1>
          <p>
            Paste a YouTube link and review each flagged sentence with its timestamp and fallacy type.
          </p>
        </div>

        <form className="youtube-form" onSubmit={handleSubmit}>
          <label htmlFor="youtube-link">YouTube link</label>
          <div>
            <input
              id="youtube-link"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(event) => setYoutubeUrl(event.target.value)}
            />
            <button type="submit">Analyze</button>
          </div>
        </form>
      </section>

      <section className="detector-grid">
        <div className="video-player-panel">
          {videoId ? (
            <iframe
              title="YouTube video player"
              src={`https://www.youtube.com/embed/${videoId}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="video-empty-state">
              <div className="play-button" />
              <p>Paste a YouTube link to load a playable video here.</p>
            </div>
          )}
        </div>

        <aside className="fallacy-results" aria-live="polite">
          <div className="results-heading">
            <div>
              <span className="eyebrow">
                <span>{hasSubmitted && videoId ? detectedFallacies.length : 0}</span>
                Findings
              </span>
              <h2>Fallacies found</h2>
            </div>
          </div>

          {hasSubmitted && !videoId ? (
            <p className="results-empty">That does not look like a YouTube link yet.</p>
          ) : hasSubmitted ? (
            <div className="fallacy-list">
              {detectedFallacies.map((item) => (
                <article className="fallacy-result" key={`${item.time}-${item.fallacy}`}>
                  <div>
                    <time>{item.time}</time>
                    <strong>{item.fallacy}</strong>
                  </div>
                  <p>"{item.sentence}"</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="results-empty">
              Your detected fallacies will appear here after you submit a video.
            </p>
          )}
        </aside>
      </section>
    </main>
  )
}

export default DetectorPage
