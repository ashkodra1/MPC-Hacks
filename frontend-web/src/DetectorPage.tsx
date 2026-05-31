import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import Header from './components/Header'
import type { Page } from './components/Header'

type DetectorPageProps = {
  currentPage: Page
  onNavigate: (page: Page) => void
}

type FallacyFinding = {
  name?: string
  type?: string
  quote?: string | null
  excerpt?: string | null
  explanation?: string
  contextDescription?: string
}

type AnalyzeVideoResponse = {
  videoId: string
  analysis: {
    possible_fallacies?: FallacyFinding[]
  }
}

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

const FALLACY_DEFINITIONS: Record<string, string> = {
  'Ad hominem': 'Attacking the person instead of responding to the argument.',
  'Straw man': 'Misrepresenting an argument to make it easier to attack.',
  'Slippery slope': 'Claiming one step will lead to extreme consequences without proof.',
  'False cause': 'Assuming one event caused another just because they happened together.',
  Bandwagon: 'Treating popularity as evidence that a claim is true.',
  'Appeal to authority': 'Using a famous or powerful person as proof outside their expertise.',
  'False dilemma': 'Pretending there are only two choices when more options exist.',
  'Circular reasoning': 'Using the claim itself as the reason the claim is true.',
  'Hasty generalization': 'Drawing a broad conclusion from too little evidence.',
  'Red herring': 'Changing the subject to distract from the original argument.',
  'Appeal to emotion': 'Relying on fear, pity, or anger instead of evidence.',
  'Tu quoque': 'Dismissing criticism by accusing the other person of hypocrisy.',
}

const FALLACY_TEMPLATES: Record<string, { what: string; why: string }> = {
  'ad hominem': {
    what: 'The speaker attacks the person or character of their opponent instead of addressing the argument.',
    why: "Personal attacks do not engage with the argument's merits; they distract from evidence and reasoning.",
  },
  'straw man': {
    what: "The speaker misrepresents the opponent's position, then argues against that weaker version.",
    why: 'Refuting a distorted version of an argument does not address the original claim.',
  },
  'slippery slope': {
    what: 'The speaker claims that a small step will inevitably lead to extreme consequences without supporting evidence.',
    why: 'Such causal chains require evidence; asserting inevitability is speculative and unsupported.',
  },
  'false cause': {
    what: 'The speaker treats a correlation or coincident event as if it proves causation.',
    why: "Correlation alone doesn't establish that one event caused the other; other explanations may exist.",
  },
  bandwagon: {
    what: 'The speaker appeals to popularity or the number of supporters as proof the claim is true.',
    why: 'Popularity is not evidence of truth; claims require independent reasons or data.',
  },
  'appeal to authority': {
    what: "The speaker leans on a famous or powerful person's endorsement as proof outside their expertise.",
    why: 'Authority is helpful only when the person is an expert in the relevant domain and evidence supports the claim.',
  },
  'false dilemma': {
    what: 'The speaker presents only two options, ignoring other viable possibilities.',
    why: 'Framing the choice as binary can hide alternatives and oversimplify complex issues.',
  },
  'circular reasoning': {
    what: "The speaker uses the conclusion as part of the premise, effectively assuming what they're trying to prove.",
    why: 'This provides no independent support for the claim; it assumes its own truth.',
  },
  'hasty generalization': {
    what: 'The speaker draws a broad conclusion from a small or unrepresentative sample.',
    why: "Insufficient evidence can lead to unreliable generalizations that don't hold in the wider case.",
  },
  'red herring': {
    what: 'The speaker diverts the discussion to a different issue, avoiding the original point.',
    why: 'Changing the subject prevents engagement with the argument at hand and obscures the real issue.',
  },
  'appeal to emotion': {
    what: 'The speaker appeals to feelings instead of providing evidence.',
    why: 'Emotional appeals can persuade, but they do not substitute for logical reasons or supporting facts.',
  },
  'tu quoque': {
    what: 'The speaker deflects criticism by accusing the critic of similar faults instead of answering the critique.',
    why: "Pointing out hypocrisy doesn't address whether the original argument is valid.",
  },
}

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

function getFallacyTitle(item: FallacyFinding) {
  return item.type || item.name || 'Unknown fallacy'
}

function getDirectQuote(item: FallacyFinding) {
  return String(item.quote || item.excerpt || '')
    .replace(/^\s*\[\d{1,2}:\d{2}(?::\d{2})?\]\s*/, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function getFallacyBreakdown(item: FallacyFinding) {
  const title = getFallacyTitle(item)
  const canonicalDefinition = FALLACY_DEFINITIONS[title]
  const definition = canonicalDefinition || item.explanation || 'No definition returned for this finding.'
  const template = FALLACY_TEMPLATES[title.toLowerCase()]
  const quote = getDirectQuote(item)

  let whatHappened = item.contextDescription || template?.what || ''

  if (!whatHappened && quote) {
    const normalizedQuote = quote.toLowerCase()

    if (/study|research|survey|data|found/.test(normalizedQuote)) {
      whatHappened = 'The speaker appealed to a study or data, treating it as direct proof of a causal claim.'
    } else if (/should\b|must\b|we should|we must/.test(normalizedQuote)) {
      whatHappened = 'The speaker urged a policy or action, presenting it as the only reasonable choice without adequate support.'
    } else if (/because\b|therefore\b|so (it|they)/.test(normalizedQuote)) {
      whatHappened = 'The speaker presented a causal or consequential claim without offering sufficient evidence.'
    }
  }

  if (!whatHappened) {
    whatHappened = `This segment contains behavior that fits the ${title} fallacy.`
  }

  const whyItsWrong =
    item.explanation && item.explanation !== canonicalDefinition
      ? item.explanation
      : template?.why || `This is a logical error: ${definition}`

  return {
    title,
    definition,
    quote,
    whatHappened,
    whyItsWrong,
  }
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
                <article className="fallacy-result" key={`${getFallacyTitle(item)}-${index}`}>
                  <div className="fallacy-result-header">
                    <span>Quote</span>
                    <strong>{getFallacyTitle(item)}</strong>
                  </div>
                  {(() => {
                    const breakdown = getFallacyBreakdown(item)

                    return (
                      <div className="fallacy-breakdown">
                        <blockquote>
                          {breakdown.quote || 'No direct quote returned for this finding.'}
                        </blockquote>
                        <section>
                          <h3>Definition</h3>
                          <p>{breakdown.definition}</p>
                        </section>
                        <section>
                          <h3>What happened</h3>
                          <p>{breakdown.whatHappened}</p>
                        </section>
                        <section>
                          <h3>Why it is wrong</h3>
                          <p>{breakdown.whyItsWrong}</p>
                        </section>
                      </div>
                    )
                  })()}
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
