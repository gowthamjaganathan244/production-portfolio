import { profile } from '@/data/portfolio';
import { CockpitCard } from '@/components/ui/CockpitCard';
import { RoleScrambler } from './RoleScrambler';
export function Hero() {
  return (
    <header className="hero" id="top">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="status">
            <i aria-hidden="true" />
            All systems nominal · open to work Australia-wide
          </p>
          <h1 aria-label="Gowtham Jaganathan">
            <span>Gowtham</span>
            <span>Jaganathan</span>
          </h1>
          <div className="reflection" aria-hidden="true">
            <svg width="100%" height="100%" focusable="false">
              <text x="0" y=".79em" fill="currentColor">
                Jaganathan
              </text>
            </svg>
          </div>
          <p className="roleline">
            <span className="role-prefix">&gt; role =</span>{' '}
            <span data-role aria-hidden="true">
              Software Developer
            </span>
            <span className="sr-only">Software Developer, Cloud Developer, Platform Engineer</span>
          </p>
          <div className="role-timer" aria-hidden="true">
            <i />
          </div>
          <p className="lead">{profile.description}</p>
          <div className="cta">
            <a className="btn solid magnetic" href="#projects">
              See my work
            </a>
            <a className="btn ghost magnetic" href="#contact">
              Get in touch
            </a>
          </div>
        </div>
        <CockpitCard className="project-code" tilt>
          <div className="code-top">
            <span className="window-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>project.ts</span>
          </div>
          <pre aria-label="Project profile as code">
            <code>
              <span className="code-line">
                <span className="syntax-keyword">const</span>
                {' gowtham = {'}
              </span>
              <span className="code-line">
                {'  role: '}
                <span className="syntax-string">
                  &quot;<span data-role>Software Developer</span>&quot;
                </span>
                ,
              </span>
              <span className="code-line">
                {'  base: '}
                <span className="syntax-string">&quot;Canberra, AU&quot;</span>,
              </span>
              <span className="code-line">
                {'  stack: ['}
                <span className="syntax-string">&quot;AWS&quot;</span>,{' '}
                <span className="syntax-string">&quot;React&quot;</span>,{' '}
                <span className="syntax-string">&quot;Python&quot;</span>],
              </span>
              <span className="code-line">{'  certs: '}3,</span>
              <span className="code-line">
                {'  openToWork: '}
                <span className="syntax-keyword">true</span>
              </span>
              <span className="code-line">{' };'}</span>
            </code>
          </pre>
        </CockpitCard>
        <RoleScrambler />
      </div>
    </header>
  );
}
