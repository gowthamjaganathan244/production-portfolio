import {
  certifications,
  education,
  experience,
  metrics,
  profile,
  projects,
  skills,
  ticker,
} from '@/data/portfolio';
import { CockpitCard, SectionHeading, TechChips } from '@/components/ui/CockpitCard';
import { ProjectWorkflow } from '@/components/projects/ProjectWorkflow';
export function Ticker() {
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {[0, 1].map((copy) => (
          <div className="ticker-group" key={copy}>
            {ticker.map((word) => (
              <span key={word}>{word}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
export function About() {
  return (
    <section id="about">
      <div className="wrap">
        <div className="counters">
          {metrics.map((metric) => (
            <CockpitCard key={metric.label}>
              <b>
                <span className="sr-only">
                  {metric.value}
                  {metric.suffix}
                </span>
                <span aria-hidden="true" data-count={metric.value} data-suffix={metric.suffix}>
                  {metric.value}
                  {metric.suffix}
                </span>
              </b>
              <span>{metric.label}</span>
            </CockpitCard>
          ))}
        </div>
        <SectionHeading
          number="01"
          title="Clean systems, clearly built."
          subtitle="Master's graduate, AWS certified, comfortable from the browser to the cloud account."
        />
        <div className="about-grid">
          <CockpitCard className="about-copy" tilt>
            <p>
              I&apos;m a cloud-focused software engineer with more than two years of hands-on
              development experience. I build and automate on AWS with{' '}
              <strong>Lambda, API Gateway, S3, DynamoDB, Cognito and IAM</strong>, and ship through{' '}
              <strong>GitHub Actions</strong> pipelines.
            </p>
            <p>
              My earlier work covers Python and Flask services, Swift apps and responsive front
              ends, so I can follow a feature from the interface through to the infrastructure. I
              want to grow in cloud platform and DevOps engineering inside a collaborative, Agile
              team.
            </p>
          </CockpitCard>
          <CockpitCard className="education" tilt>
            <ul>
              {education.map((item) => (
                <li key={item.degree}>
                  <h3>{item.degree}</h3>
                  <p>{item.detail}</p>
                </li>
              ))}
            </ul>
          </CockpitCard>
        </div>
      </div>
    </section>
  );
}
export function Skills() {
  return (
    <section id="skills">
      <div className="wrap">
        <SectionHeading number="02" title="Stack" subtitle="What I reach for day to day." />
        <div className="skills-grid">
          {skills.map((skill) => (
            <CockpitCard key={skill.category} className="skill-card" tilt>
              <h3>
                <small>{skill.category}</small>
                {skill.title}
              </h3>
              <TechChips items={skill.items} />
            </CockpitCard>
          ))}
        </div>
      </div>
    </section>
  );
}
export function Projects() {
  return (
    <section id="projects">
      <div className="wrap">
        <SectionHeading
          number="03"
          title="Selected work"
          subtitle="Projects where something real had to work."
        />
        <div className="projects-grid">
          {projects.map((project) => (
            <article
              className="card project-card reveal"
              key={project.id}
              aria-labelledby={`${project.id}-title`}
              data-tilt
            >
              <span className="project-status">{project.status}</span>
              <h3 id={`${project.id}-title`}>{project.title}</h3>
              <p>{project.description}</p>
              <ProjectWorkflow project={project} />
              <TechChips items={project.technologies} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
export function Experience() {
  return (
    <section id="experience">
      <div className="wrap">
        <SectionHeading
          number="05"
          title="Flight log"
          subtitle="From iOS interning to cloud delivery."
        />
        <div className="timeline">
          <div className="timeline-fill" aria-hidden="true" />
          {experience.map((job) => (
            <article className="job reveal" key={job.role}>
              <h3>{job.role}</h3>
              <p className="when">{job.timeframe}</p>
              <p>{job.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
export function Certifications() {
  return (
    <section id="certs">
      <div className="wrap">
        <SectionHeading number="06" title="Certifications" subtitle="Verified on AWS." />
        <div className="certs-grid">
          {certifications.map((cert) => (
            <CockpitCard className="cert-card" key={cert.title} tilt>
              <h3>{cert.title}</h3>
              <p>{cert.level}</p>
            </CockpitCard>
          ))}
        </div>
      </div>
    </section>
  );
}
export function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="wrap">
        <CockpitCard>
          <h2>Ready when you are.</h2>
          <p>{profile.contact}</p>
          <div className="cta">
            <a
              className="btn solid magnetic"
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn (opens in a new tab)"
            >
              LinkedIn
            </a>
            <a
              className="btn ghost magnetic"
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub (opens in a new tab)"
            >
              GitHub
            </a>
          </div>
        </CockpitCard>
      </div>
    </section>
  );
}
