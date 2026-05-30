const teamMembers = [
  { name: 'Allison Shkodra', program: 'Software Engineering' },
  { name: 'Zineb Bamouh', program: 'Computer Engineering' },
  { name: 'Srabanti Mazumdar', program: 'Software Engineering' },
  { name: 'Salma Benlemlih', program: 'Computer Science' },
]

function AboutPage() {
  return (
    <section className="about-page" aria-labelledby="about-title">
      <div className="about-copy">
        <h1 id="about-title">Helping people watch persuasive media with sharper eyes.</h1>
        <p>
          We are four Concordia University students and members of the Women in
          Engineering society. Pikmin is our way of making critical thinking more
          accessible while people watch, learn, and debate online.
        </p>
      </div>

      <div className="about-card">
        <div className="about-panel">
          <div className="about-stat">
            <strong>Concordia University</strong>
            <span>Built by students across software, computer, and computer science programs.</span>
          </div>
          <div className="about-stat">
            <strong>Women in Engineering</strong>
            <span>Created by members of a community that supports women in technical fields.</span>
          </div>
          <div className="about-stat">
            <strong>Media literacy</strong>
            <span>Focused on helping viewers recognize weak reasoning in real time.</span>
          </div>
        </div>

        <div className="team-grid" aria-label="Team members">
          {teamMembers.map((member) => (
            <article className="team-card" key={member.name}>
              <span>{member.name.charAt(0)}</span>
              <div>
                <h2>
                  {member.name} <small>({member.program})</small>
                </h2>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AboutPage
