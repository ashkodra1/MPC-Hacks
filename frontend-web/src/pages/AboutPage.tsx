import teamPhoto from '../assets/DSC07786.jpeg'

type TeamMember = {
  name: string
  program: string
}

const teamMembers: TeamMember[] = [
  { name: 'Allison Shkodra', program: 'Software Engineering' },
  { name: 'Zineb Bamouh', program: 'Computer Engineering' },
  { name: 'Srabanti Mazumdar', program: 'Software Engineering' },
  { name: 'Salma Benlemlih', program: 'Computer Science' },
]

function AboutPage() {
  return (
    <section className="about-page" aria-labelledby="about-title">
      <div className="about-copy">
        <h1 id="about-title">The Team</h1>
        <p>
          We are four Concordia University students and members of the Women in
          Engineering society. Therefore is our way of making critical thinking more
          accessible while people watch, learn, and debate online.
        </p>
      </div>

      <div className="about-card">
        <figure className="team-photo-card">
          <img src={teamPhoto} alt="The Therefore team smiling together outside." />
        </figure>

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
