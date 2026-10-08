import type { ReactNode } from 'react';
export function CockpitCard({
  children,
  className = '',
  tilt = false,
}: {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
}) {
  return (
    <div className={`card reveal ${className}`} data-tilt={tilt || undefined}>
      {children}
    </div>
  );
}
export function TechChips({ items }: { items: string[] }) {
  return (
    <ul className="chips" aria-label="Technologies">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
export function SectionHeading({
  number,
  title,
  subtitle,
}: {
  number: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="section-heading reveal">
      <h2>
        <span className="section-number">{number}</span>
        {title}
      </h2>
      <p className="sub">{subtitle}</p>
    </div>
  );
}
