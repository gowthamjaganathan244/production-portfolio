# Final production audit — 6 October 2026

Scope: local production build against the complete supplied `portfolio-tokyo-synthwave-rugged.html`. This is a parity/quality pass, not a redesign. Raw evidence lives in the ignored `artifacts/` directory; repeatable checks live in `tests/` and `scripts/audit-*.mjs`.

## Corrections

- Fixed name, counters, role and navigation overflow at tiny widths and enlarged text. Content wraps; nothing is concealed with page-level overflow clipping.
- Fixed the CTF submit button overflowing at 240px with 200% text. Tested every lab pane at enlarged text, not only the default terminal.
- Restored real Chakra Petch 500 and JetBrains Mono 500 weights; disabled synthetic font styling. JetBrains Mono uses one preloaded variable file for genuine weights. Source heading/navigation weights, four-column desktop Stack grid, section spacing, code-line timing, counter timing, cursor geometry, status blink, CTA pulse and hover-bracket inset are restored.
- Fixed the queued native-dialog close event racing with keyboard reopening. Added explicit Tab/Shift+Tab cycling, retained native modal isolation, and reset searches on close.
- Synchronized role-timer restarts with visibility/motion changes. Paused pseudo-element animation when hidden.
- Added canvas resolution-change observation: DPR changes no longer depend on a simultaneous viewport resize. The renderer equations remain unchanged.
- Added safe-area spacing, legacy viewport fallbacks, forced-colors control outlines, readable print colors, technical-input autocorrect settings and non-critical enhancement boundaries.
- Bounded terminal history to 200 commands, matching its existing output bound. Corrected a WebKit resize-observer feedback warning by scheduling measurements outside observer delivery.

## Evidence and coverage

Actually executed: Chromium, Firefox and WebKit engines, desktop and two touch/mobile profiles; keyboard Enter/Space/Escape/arrows/Tab; all 21 workflow nodes; all supported terminal commands; CTF empty/invalid/case/whitespace input; password edge cases; SHA-256 known vector; Unicode Base64, invalid UTF-8, ROT13, UTF-8 hex, 16,000-character input and rapidly changed conversions. No requests transmit lab input.

Layout matrix: 100 unique viewport combinations × 3 engines, plus 18 enlarged-text combinations × 3 engines = 354 scenarios. Sizes span 240×320 through 3840×2160, six short landscape-phone sizes, all requested older-phone dimensions, nine Android widths across four aspect ratios, rotated tablets, foldable widths, ultrawide, low-height laptops and all 14 requested intermediate stress widths. Checks inspect element bounds as well as document overflow. A separate test visits and refreshes all seven section deep links, opens dialogs on short screens, and rotates portrait → landscape → portrait.

Emulated, not physical-device claims: touch/pointer behavior; Pixel/iPhone-style profiles; 125/150/200% root-text scaling; 80/90/100/110/125/150/175/200% effective zoom layout sizes; DPR 1/1.25/1.5/2/3; reduced motion; forced colors; print media; 4×/6× CPU slowdown; cold/warm Fast-3G-style (150ms, 200kB/s) and Slow-4G-style (150ms, 500kB/s) network conditions. Effective zoom emulation is not native browser-toolbar zoom.

The three-minute interactive memory sample used forced GC between samples. Listeners stabilized at 460; one document remained live. Heap moved from 4.70MB to 4.97MB and largely levelled off; the final 60 seconds changed by about 18kB. This finite test found no listener leak, but cannot prove absence of every possible long-running leak. Its report also identified the DPR bug; `runtime-audit-quick.json` is the post-fix DPR retest.

Accessibility: axe WCAG 2 A/AA and 2.1 AA across the page, all four lab panels and both dialogs; keyboard focus/return and modal containment; readable no-JavaScript content/navigation; selection of paragraphs, code and terminal output; reduced-motion canvas/reveals/ticker; missing observer/canvas/Web Crypto API fallbacks. Print uses white surfaces and dark copy. Safe-area behavior is statically verified CSS, not a physical-notch test. Clipboard OS integration and screen-reader speech were not automated.

## Original-versus-rebuild disposition

| Area            | Classification            | Notes                                                                                                                                                        |
| --------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Global          | MATCH                     | Source palette, 1120px container, rugged surfaces and section rhythm.                                                                                        |
| Navigation      | IMPROVED WITHOUT REDESIGN | Fixed cockpit bar retained; mobile dialog, certification link and pause control added.                                                                       |
| Hero            | IMPROVED WITHOUT REDESIGN | Original name/copy/CTAs; content-bound name prevents overflow; code moves below on mobile.                                                                   |
| Reflection      | IMPROVED WITHOUT REDESIGN | Same font, magenta, mask, flip and ripple; decorative SVG avoids duplicate accessible text and overlap.                                                      |
| Role animation  | MATCH                     | Same three roles, 10-second cadence, 704ms decode and synchronized code role.                                                                                |
| project.ts      | IMPROVED WITHOUT REDESIGN | Same code and staged lines; SSR and wrapping avoid blank/clipped content.                                                                                    |
| Ticker          | IMPROVED WITHOUT REDESIGN | Source words and 40-second cadence; paired groups correct the loop gap.                                                                                      |
| Counters        | MATCH                     | Source values, labels, weight and 1700ms cubic easing.                                                                                                       |
| About           | MATCH                     | Original prose and education preserved.                                                                                                                      |
| Stack           | MATCH                     | Original categories/chips and desktop auto-fit grid restored.                                                                                                |
| Projects        | IMPROVED WITHOUT REDESIGN | All descriptions/status/tags retained; touch-size workflow controls make cards taller.                                                                       |
| Workflows       | IMPROVED WITHOUT REDESIGN | Same 21 node explanations and branching; semantic buttons, selected state and vertical mobile layout. Expanded abbreviations improve readability.            |
| Security Lab    | IMPROVED WITHOUT REDESIGN | All four tools retained; bounded input, Unicode handling, safe target validation and educational caveats. Simulated output is immediate rather than delayed. |
| Flight log      | MATCH                     | All six roles, dates, descriptions and timeline retained.                                                                                                    |
| Certifications  | MATCH                     | All three source titles/levels; no fabricated credential links.                                                                                              |
| Contact         | IMPROVED WITHOUT REDESIGN | Exact copy/contact details; accessible cyan-button foreground and stacked mobile actions.                                                                    |
| Command palette | IMPROVED WITHOUT REDESIGN | Same destinations/search/keyboard concept; native modal, focus management and usable empty results.                                                          |
| Footer          | IMPROVED WITHOUT REDESIGN | Identity/location retained, keyboard hint includes Command and wraps on mobile.                                                                              |
| Background      | MATCH                     | 2,880 deterministic frames match original drawing commands exactly. Lifecycle/DPR protections are intentional.                                               |
| Interactions    | IMPROVED WITHOUT REDESIGN | Source spotlight/brackets/tilt/magnetic motion retained; precision-pointer-only effects, motion pause and native cursor preserve usability.                  |

Intentional engineering differences: pre-flight is a non-blocking 1.35-second corner checklist, not a full-screen loading gate; entrance effects do not postpone meaningful content; small magenta text is lightened for contrast; cyan buttons have dark text; card blur is confined to desktop hover rather than all scrolling surfaces. These are accessibility/performance corrections, not unexplained parity mismatches.

Nine original/rebuild full-page and hero capture pairs cover 320/375/390/430/768/1024/1366/1440/1920px. The original's broken narrow layout is not treated as a target. Pixel identity is not asserted for randomized backgrounds or intentionally improved layout.

## Architecture, content and release configuration

Static sections remain Server Components; only interactions are client islands. No animation, graph, UI-kit or syntax-highlighting runtime was added. Motion mutates DOM/canvas instead of React state every frame. Timers/observers/listeners are cleaned up. The source-data check matches 170 original facts/strings; original prose and source code were also reviewed directly.

Internal anchors, mailto and tel destinations are valid; external links use safe new-tab relationships. The original supplied only LinkedIn/GitHub service homepages. Real personal URLs and a production `SITE_URL` still need owner configuration; no replacements were invented. Canonical/domain-specific metadata and sitemap URLs appear only when configured. Title, description, OpenGraph, Twitter summary, robots, Person JSON-LD and local favicon exist; no broken social-image URL was invented.

Production dependency audit: zero advisories. The previously documented development-only braces/ESLint advisory remains a separate tooling issue; no incompatible forced downgrade was applied.

Unavailable: physical phones/tablets, Windows font rendering, branded Edge and automated installed Safari/iOS runs, NVDA/VoiceOver interaction, physical notch/browser-chrome behavior, native toolbar zoom and real-user INP. Current engine tests and deliberate missing-API tests are not claims of testing historical browser versions. Recheck these on the deployed HTTPS origin.

See [QA.md](QA.md) for final Lighthouse/build results and reproduction instructions.
