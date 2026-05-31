import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import Header from './components/Header'
import type { Page } from './components/Header'

type DetectorPageProps = {
  currentPage: Page
  onNavigate: (page: Page) => void
}

type FallacyFinding = {
  name: string
  quote?: string | null
  explanation?: string
  timestamp?: string | number | null
}

type AnalyzeVideoResponse = {
  videoId: string
  analysis: {
    possible_fallacies?: FallacyFinding[]
  }
}

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

function parseJsonResponse(text: string) {
  if (!text) {
    return null
  }

  try {
    return JSON.parse(text) as AnalyzeVideoResponse | { error?: string; details?: string }
  } catch {
    return { error: text }
  }
}

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

function formatTimestamp(timestamp: FallacyFinding['timestamp']) {
  if (timestamp === null || timestamp === undefined || timestamp === '') {
    return '--:--'
  }

  if (typeof timestamp === 'number') {
    if (!Number.isFinite(timestamp)) {
      return '--:--'
    }

    const hours = Math.floor(timestamp / 3600)
    const minutes = Math.floor((timestamp % 3600) / 60)
    const seconds = Math.floor(timestamp % 60)
    const pad = (value: number) => String(value).padStart(2, '0')

    return hours > 0
      ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
      : `${pad(minutes)}:${pad(seconds)}`
  }

  const cleanedTimestamp = timestamp.replace(/[[\]]/g, '').trim()
  const isValidTimestamp = /^\d{1,2}:\d{2}(?::\d{2})?$/.test(cleanedTimestamp)

  return isValidTimestamp ? cleanedTimestamp : '--:--'
}

function DetectorPage({ currentPage, onNavigate }: DetectorPageProps) {
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [submittedUrl, setSubmittedUrl] = useState('')
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [findings, setFindings] = useState<FallacyFinding[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const videoId = useMemo(() => getYouTubeId(submittedUrl), [submittedUrl])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextVideoId = getYouTubeId(youtubeUrl)

    setSubmittedUrl(youtubeUrl)
    setHasSubmitted(true)
    setFindings([])
    setErrorMessage('')

    if (!nextVideoId) {
      return
    }

    setIsAnalyzing(true)

    try {
      const response = await fetch(`${API_BASE_URL}/analyze-video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: youtubeUrl }),
      })

      const responseText = await response.text()
      const data = parseJsonResponse(responseText)

      if (!response.ok) {
        if (response.status === 502) {
          throw new Error(
            'The frontend could not connect to the backend. Start the backend with "cd backend" then "npm run dev", then restart the frontend.',
          )
        }

        throw new Error(
          data && 'error' in data && data.error
            ? data.details || data.error
            : `Backend returned ${response.status} ${response.statusText || 'with no response body'}`,
        )
      }

      setFindings((data && 'analysis' in data && data.analysis.possible_fallacies) || [])
    } catch (error) {
      if (error instanceof TypeError) {
        setErrorMessage(
          `Could not reach the backend at ${API_BASE_URL}. Start the backend with "cd backend" then "npm run dev".`,
        )
        return
      }

      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong while analyzing the video.',
      )
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <main className="page-shell detector-shell">
      <div className="ambient-glow" aria-hidden="true" />

      <Header currentPage={currentPage} onNavigate={onNavigate} />

      <section className="detector-intro">
        <div>
          <h1>Analyze a video for logical fallacies.</h1>
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
              <button type="submit" disabled={isAnalyzing}>
                {isAnalyzing ? 'Analyzing' : 'Analyze'}
              </button>
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
              <p>Paste a YouTube link to load a playable video here.</p>
            </div>
          )}
        </div>

        <aside className="fallacy-results" aria-live="polite">
          <div className="results-heading">
            <div>
              <span className="eyebrow">
                  <span>{hasSubmitted && videoId ? findings.length : 0}</span>
                  Findings
                </span>
                <h2>Fallacies found</h2>
            </div>
          </div>

          {hasSubmitted && !videoId ? (
            <p className="results-empty">That does not look like a YouTube link yet.</p>
          ) : errorMessage ? (
            <p className="results-empty">{errorMessage}</p>
          ) : isAnalyzing ? (
            <p className="results-empty">Analyzing the video transcript...</p>
          ) : hasSubmitted && findings.length > 0 ? (
            <div className="fallacy-list">
              {findings.map((item, index) => (
                <article className="fallacy-result" key={`${item.timestamp}-${item.name}-${index}`}>
                  <div>
                    <time>{formatTimestamp(item.timestamp)}</time>
                    <strong>{item.name}</strong>
                  </div>
                  <p>"{item.quote || item.explanation || 'No quote returned for this finding.'}"</p>
                </article>
              ))}
            </div>
          ) : hasSubmitted ? (
            <p className="results-empty">No clear logical fallacies were detected.</p>
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
