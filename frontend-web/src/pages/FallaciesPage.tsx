import { useMemo, useState } from 'react'

type Fallacy = {
  name: string
  definition: string
  example: string
}

const fallacies: Fallacy[] = [
  {
    name: 'Ad hominem',
    definition: 'Attacking the person instead of responding to the argument.',
    example: 'You cannot trust her policy idea because she failed a class once.',
  },
  {
    name: 'Straw man',
    definition: 'Misrepresenting an argument to make it easier to attack.',
    example: 'They want cleaner buses, so they must want to ban every car.',
  },
  {
    name: 'Slippery slope',
    definition: 'Claiming one step will lead to extreme consequences without proof.',
    example: 'If we allow this rule, soon nobody will have any freedom.',
  },
  {
    name: 'False cause',
    definition: 'Assuming one event caused another just because they happened together.',
    example: 'Sales rose after the logo changed, so the logo caused the growth.',
  },
  {
    name: 'Bandwagon',
    definition: 'Treating popularity as evidence that a claim is true.',
    example: 'Millions of people shared it, so it must be accurate.',
  },
  {
    name: 'Appeal to authority',
    definition: 'Using a famous or powerful person as proof outside their expertise.',
    example: 'A celebrity says this supplement works, so it must be science.',
  },
  {
    name: 'False dilemma',
    definition: 'Pretending there are only two choices when more options exist.',
    example: 'Either you support this plan exactly, or you do not care about safety.',
  },
  {
    name: 'Circular reasoning',
    definition: 'Using the claim itself as the reason the claim is true.',
    example: 'This source is reliable because it always tells the truth.',
  },
  {
    name: 'Hasty generalization',
    definition: 'Drawing a broad conclusion from too little evidence.',
    example: 'Two students disliked the class, so the whole program is bad.',
  },
  {
    name: 'Red herring',
    definition: 'Changing the subject to distract from the original argument.',
    example: 'Instead of answering the budget question, they talk about school spirit.',
  },
  {
    name: 'Appeal to emotion',
    definition: 'Relying on fear, pity, or anger instead of evidence.',
    example: 'Think of how scary the future will be if you disagree with us.',
  },
  {
    name: 'Tu quoque',
    definition: 'Dismissing criticism by accusing the other person of hypocrisy.',
    example: 'You waste food too, so your point about food waste does not matter.',
  },
]

function FallaciesPage() {
  const [query, setQuery] = useState('')

  const filteredFallacies = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return fallacies
    }

    return fallacies.filter((fallacy) =>
      [fallacy.name, fallacy.definition, fallacy.example]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery),
    )
  }, [query])

  return (
    <section className="fallacies-page" aria-labelledby="fallacies-title">
      <div className="fallacies-hero">
        <div>
          <h1 id="fallacies-title">A quick guide to logical fallacies.</h1>
          <p>
            Use this page as a reference while watching videos. Search for a fallacy,
            read the pattern, then compare it with the claim you heard.
          </p>

          <label className="fallacy-search" htmlFor="fallacy-search">
            <input
              id="fallacy-search"
              type="search"
              placeholder="Search fallacies..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="fallacy-library" aria-live="polite">
        {filteredFallacies.map((fallacy) => (
          <article className="library-card" key={fallacy.name}>
            <h2>{fallacy.name}</h2>
            <p>{fallacy.definition}</p>
            <div>
              <strong>Example</strong>
              <span>{fallacy.example}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default FallaciesPage
