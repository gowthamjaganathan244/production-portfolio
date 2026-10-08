import { Navbar } from '@/components/navigation/Navbar';
import { Hero } from '@/components/hero/Hero';
import {
  About,
  Certifications,
  Contact,
  Experience,
  Projects,
  Skills,
  Ticker,
} from '@/components/sections/Content';
import { SectionHeading } from '@/components/ui/CockpitCard';
import { SecurityLabLoader } from '@/components/lab/SecurityLabLoader';
import { Enhancements } from '@/components/effects/Enhancements';
import { DeferredEffects } from '@/components/effects/DeferredEffects';
import { BootSequence } from '@/components/effects/BootSequence';
import { profile, navigation } from '@/data/portfolio';
import { siteOrigin } from '@/lib/site';
export default function Home() {
  const origin = siteOrigin();
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: 'Software Developer',
    description: profile.description,
    ...(origin ? { url: origin } : {}),
    address: { '@type': 'PostalAddress', addressLocality: 'Canberra', addressCountry: 'AU' },
    knowsAbout: ['AWS', 'React', 'Python', 'CI/CD'],
  };
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <DeferredEffects />
      <div className="ambience" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />
      <BootSequence />
      <Enhancements />
      <Navbar />
      <noscript>
        <nav className="nojs-nav" aria-label="Section navigation">
          {navigation.map((item) => (
            <a href={`#${item.id}`} key={item.id}>
              {item.label}
            </a>
          ))}
        </nav>
      </noscript>
      <main id="main">
        <Hero />
        <Ticker />
        <About />
        <Skills />
        <Projects />
        <section id="lab">
          <div className="wrap">
            <SectionHeading
              number="04"
              title="Security lab"
              subtitle="Think like an attacker, build like a defender. Everything here runs locally in your browser and only simulates a sandbox."
            />
            <SecurityLabLoader />
          </div>
        </section>
        <Experience />
        <Certifications />
        <Contact />
      </main>
      <footer>
        © {new Date().getFullYear()} Gowtham Jaganathan · Canberra
        <span>press Ctrl / ⌘ K for the console</span>
      </footer>
      {/* JSON-LD is generated from trusted, typed data; escape HTML delimiters defensively. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, '\\u003c') }}
      />
    </>
  );
}
