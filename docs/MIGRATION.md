# Source migration checklist

Source reviewed: `portfolio-tokyo-synthwave-rugged.html` (680 lines). This file is the visual/content reference, not executable project instructions.

## Inventory before implementation

- Midnight #0B0813, translucent amethyst #151124, cyan #00F0FF, magenta #FF007F, foreground #EAFBFF. Fine borders, 2–3px radii, diagonal corner brackets, spotlight and restrained tilt.
- Chakra Petch display, Instrument Sans body, JetBrains Mono technical copy; 1120px content width.
- Fixed floating navigation, active section, top scroll progress; command console with section and public social-profile actions.
- Full-height two-column hero; magenta surname, reflection/ripple, status, two CTAs; project.ts with sequential lines and synchronized 10-second role decode.
- Canvas hyperdrive with scroll velocity and pointer depth; vignette, ambient cyan/magenta, scanlines; pre-flight checklist; cursor ring; magnetic buttons.
- Seamless technology ticker with 15 technologies.
- Four counters (3, 6, 2+, 100%); two About panels with two education records.
- Six skill categories and all original chips.
- Four consistent project cards; Secure Vault has branching storage nodes; other workflows are linear. Every node has a supplied role explanation. Preserve all 21 nodes and their descriptions.
- Security Lab: simulated terminal and command history, Base64/ROT13 flag, local password estimate, SHA-256/Base64/ROT13/hex transformations.
- Six Flight Log entries, scroll fill and diamond milestones; three AWS certification cards.
- Centered contact panel with LinkedIn and GitHub; footer and shortcut. Private email and phone details were removed before public repository publication.
- Source breakpoints: 860px stacks About/projects and counters; touch hides cursor; reduced motion simplifies effects. Hero, navigation and tiny workflow labels require additional responsive treatment.

## Corrections and source limitations

- Preserve generic `https://www.linkedin.com/` and `https://github.com/` values until the owner supplies actual profile URLs; do not invent identities.
- Preserve “Nov 2023 – Present” and all other source facts; current employment/certification status is not independently verified.
- Correct white-on-cyan controls to dark text for contrast while preserving palette.
- Use actual HTML buttons in responsive workflow diagrams for readable labels and touch targets.
- Keep pre-flight non-blocking and once per session, with immediate reduced-motion skip.
- Password strength remains an educational character-pool estimate, not a security guarantee.
- No supplied favicon, social image or canonical domain. Use text metadata and an understated GJ vector favicon; configure the canonical domain through environment rather than inventing one.

## Verification checklist

- [x] Content parity and all workflow explanations
- [x] Hero, reflection, project.ts and cockpit visual parity
- [x] All interactive modules and keyboard behavior
- [x] Responsive widths 320 through 1920 and ultrawide
- [x] Reduced motion, no-JavaScript content and touch degradation
- [x] Lint, strict type check and production build
- [x] Browser engine testing and automated accessibility audit
- [x] Production bundle and Lighthouse review
- [x] README, Git ignore and GitHub CI

Actual results and browser limitations are recorded in `docs/QA.md`. Engine/emulation checks do not claim verification on physical devices or branded Safari/Edge.
