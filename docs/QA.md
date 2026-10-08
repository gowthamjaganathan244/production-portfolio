# Production QA

Completed 6 October 2026 against the supplied HTML and the local production build. Results describe this machine and test setup, not a guarantee about a future deployment.

The strict final parity pass, fixes, 20-area comparison and explicit testing limitations are recorded in [FINAL-AUDIT.md](FINAL-AUDIT.md).

## Build and content

- `npm run lint`, `npm run build` and `npm run typecheck`: passed.
- Next.js 16.3.8 / React 19.3.0, resolved from stable npm tags and pinned with a lockfile.
- Home, 404, icon, robots and sitemap are statically generated.
- `scripts/check-source.mjs` matched 170 original facts/strings, including all four projects, all 21 workflow node names/explanations and all six experience records.
- Original metrics, skills, education, certification titles and contact copy are preserved. Private email and telephone details were subsequently removed before public repository publication.
- Compared original and rebuilt desktop screenshots. Retained palette, fonts, hero scale, magenta surname, code panel placement, cards, brackets, ticker, project hierarchy, timeline and contact composition. Mobile intentionally stacks the hero and vertically arranges workflows.
- Reflection is a decorative SVG using the same font, mask and ripple. Small magenta labels are lightened for contrast. Cyan-filled controls use dark text.
- Pre-flight is a 1.35-second, once-per-session corner console, skipped for reduced motion and dismissed by interaction. It retains the checklist/progress but never covers the whole page.

## Browser and interaction checks

55 Playwright tests passed across desktop Chromium, Firefox and WebKit, plus Pixel-style Chromium and iPhone-style WebKit emulation. The standalone audit additionally passed 354 viewport/text-scale scenarios across all three desktop engines, with no overflow or browser errors.

Covered:

- Layout bounds and clipping at 320, 360, 375, 390, 393, 412, 430, 768, 820, 834, 1024, 1280, 1366, 1440, 1512, 1920 and 2560px widths (appropriate subsets per test profile).
- No document horizontal overflow or clipped hero, code panel, navigation or workflow buttons.
- Final extended matrix covers 100 unique viewport combinations from 240×320 to 3840×2160, four Android aspect ratios, landscape phones/tablets and all requested intermediate resize widths; enlarged text is checked at 125/150/200%.
- Command palette: Ctrl+K and Cmd+K, search/no results, arrows, Enter, Escape, focus containment and restoration. Explicitly fixed WebKit's click-focus difference.
- Mobile menu: Escape, focus restoration, expanded state and section links.
- Workflow selection with Space and live explanations; motion pause control.
- Terminal commands, history and safe handling of arbitrary text; non-portfolio scan targets are rejected.
- Flag capture, weak/common password feedback, SHA-256 known vector, UTF-8 Base64 round trip, invalid Base64 handling.
- Every workflow node and supported terminal command; CTF empty/invalid/case/whitespace cases; Unicode and 16,000-character conversions; every lab panel at 200% text including 240px width; long future labels and paragraph/code/terminal selection.
- Short-screen dialogs, portrait/landscape changes, all section deep links and refreshes, forced colors, readable print colors, unavailable canvas/observer/Web Crypto APIs, and real font loading.
- No non-GET requests during password/hash interaction; source inspection confirms no fetch, storage, analytics or input logging in those tools.
- Reduced-motion rendering and no-JavaScript static content/navigation.
- Canvas backing-store/CSS dimensions and DPR cap; motion pause/resume; simulated visibility-change suspension; reduced-motion static rendering and resize, across all five browser profiles.
- Live DPR 1/1.25/1.5/2/3 changes passed after adding resolution monitoring plus a cheap frame-level fallback for environments that omit media-change events. Effective zoom reflow at 80–200% passed; this is not native browser-toolbar zoom testing.
- No page errors or console errors in the responsive test.

The final accessibility suite uses axe's WCAG 2 A/AA and 2.1 AA rules on the entire page, all four lab panels, the command palette and mobile navigation. It found no violations. Automated scans do not replace manual assistive-technology testing.

## Exact starfield parity update

The follow-up request explicitly prioritizes the original background behavior over the first implementation's reduced-density/mobile adaptations. `src/lib/hyperdrive.ts` now retains the original star model, 10% magenta probability, adaptive star count, DPR cap, origin, pointer offsets, velocity smoothing, idle/scroll speed, projection, depth alpha and line widths. Particles are mutated in place when recycled. The canvas uses one animation-frame loop, with no React state updates per frame. The scanline opacity is restored to the source's 0.015.

`tests/fixtures/original-starfield.txt` is the verbatim renderer extracted from the supplied HTML. `scripts/check-starfield.mjs` verifies the fixture against that HTML when its path is supplied, then compares **2,880 deterministic frames** from the original and rebuilt renderers. All drawing commands match exactly, including coordinates, colors, opacity and thickness. Cases cover six viewport/DPR combinations, DPR 3 capped to 2, idle, slow/fast/reverse scroll, pointer offsets, decay, resizing, recycling and zero-speed reduced motion.

Intentional lifecycle protections remain: suspend while hidden, draw one static frame for reduced motion, ignore coarse-pointer origin movement, and clean up listeners/frames. The source's per-frame speed is preserved without a new elapsed-time multiplier or mobile frame-rate cap. This also preserves its dependence on display refresh rate.

Actual branded Chrome also ran the Lighthouse audits. WebKit tests are engine tests, **not claims of testing the installed Safari browser or a physical iPhone**. Branded Edge, physical Android Chrome, physical iOS Safari, VoiceOver and NVDA were not available in this automated QA run and remain release checks.

## Performance and bundle review

Lighthouse 13.5.0, Chrome 154 headless, `next start`, localhost. Standard simulated mobile throttling and the desktop preset; motion enabled and fresh storage. Tests were not running concurrently with these measurements.

| Metric                   | Mobile | Desktop |
| ------------------------ | -----: | ------: |
| Performance              |     97 |     100 |
| Accessibility            |    100 |     100 |
| Best practices           |    100 |     100 |
| SEO                      |    100 |     100 |
| First contentful paint   |  0.9 s |   0.3 s |
| Largest contentful paint | 2.67 s |  0.56 s |
| Total blocking time      |  40 ms |    0 ms |
| Cumulative layout shift  |      0 | 0.00001 |
| Speed index              |  0.9 s |   0.3 s |

The mobile LCP result remains above the requested 2.5-second target, despite consolidating the monospace font and prioritizing hero fonts. Real source font weights increase the payload versus the earlier weight-substituted build. Repeat on the actual HTTPS deployment and representative devices; this audit does not claim the mobile LCP target was met. Real-user INP is not established by Lighthouse; TBT is a lab proxy, not an INP measurement.

Measured initial page transfer: approximately **272 KiB**: 150 KiB JavaScript (mostly Next/React), 100 KiB fonts, 8 KiB CSS and 13 KiB HTML. Five font requests replace six through variable JetBrains Mono. No image payloads beyond the small vector favicon, or third-party runtime requests. Security Lab is split into a deferred chunk and not requested in the initial viewport. Canvas is separately loaded when the main thread is idle. No graph, animation or syntax-highlighting libraries are bundled.

Review confirmed:

- Static sections are Server Components; no client directive at the page or layout root.
- Canvas parity update: original `ceil(min(260, viewport width / 4))` particle count, DPR capped at 2, original per-animation-frame stepping with no alternate mobile cadence. Original speed, opacity, line width, vanishing point and pointer offsets are restored. Hidden-tab suspension and no React state per frame are retained. This is not a guarantee of measured 60fps on every device.
- One scheduled scroll update per frame; resize observation handles changing content height. No continuous layout-polling loop for progress or active navigation.
- Pointer effects update transforms directly, are precision-pointer-only and stop under reduced motion.
- Reveals and counters observe entry once. Listeners, observers, timers and animation frames are cleaned up.
- Fonts are self-hosted WOFF2 via `next/font/local`; no build-time font network dependency.
- Real Chakra Petch 300/500/600 weights and variable JetBrains Mono replace weight substitution. Hero font weights receive preload priority; the 500 display weight loads on demand. Synthetic font styling is disabled.

The first mobile audit scored 88 before the full-screen boot overlay was replaced with the non-blocking console and decorative startup was deferred. Final mobile results above reflect that correction. Raw reports and screenshots are in the git-ignored `artifacts/` directory.

## Dependency and deployment notes

- `npm audit --omit=dev`: **0 vulnerabilities**.
- Full audit: five high-severity entries in the same development-only chain: `eslint-config-next` → `@next/eslint-plugin-next` → `fast-glob` → `micromatch` → `braces`. At verification, latest `braces` was 3.0.3 and there was no patched version. The audit's suggested older-major Next lint configuration is not a compatible remediation. Track upstream GHSA-vfj7-8cjw-p6xm.
- ESLint 9 is retained because the current React lint plugin's peer range excludes ESLint 10. No forced peer overrides.
- Supply actual LinkedIn/GitHub profile URLs in `src/data/portfolio.ts`; the original only contains service homepages.
- Set `SITE_URL` before the production build. Preview intentionally omits canonical/domain-specific URLs and has an empty sitemap.
- No remote GitHub repository, deployment or fabricated credential verification links were created. Git ignore, lockfile and GitHub CI are included.

## Reproduce

```sh
npm ci
npx playwright install chromium firefox webkit
npm run lint
npm run build
npm run typecheck
npm test
```

Playwright owns a dedicated server on port 3100 so an existing development preview cannot contaminate production tests. For Lighthouse, start a separate production server and run:

```sh
npm start -- --port 3102
npx lighthouse http://localhost:3102 --chrome-flags='--headless=new' --output=json --output-path=artifacts/lighthouse-mobile.json
npx lighthouse http://localhost:3102 --preset=desktop --chrome-flags='--headless=new' --output=json --output-path=artifacts/lighthouse-desktop.json
```

Create `artifacts/` first if absent, or use an existing output directory. For visual review use `PORTFOLIO_URL=http://localhost:3102 node scripts/capture.mjs`. Browser binaries for this workspace's run were stored in `/private/tmp/production-portfolio-browsers`; set `PLAYWRIGHT_BROWSERS_PATH` accordingly to reuse them locally, or install to Playwright's default location.
