# Gowtham Jaganathan — production portfolio

A Next.js rebuild of the supplied Tokyo Synthwave portfolio: midnight violet, cyan and magenta, sharp cockpit panels, interactive architecture workflows and a browser-only Security Lab. Original project descriptions, career history, education, certifications and contact details are centralized in typed data.

## Run locally

Node.js 22+ and npm are required.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. `npm install` also works; `npm ci` reproduces the committed lockfile.

```sh
npm run lint
npm run build
npm run typecheck
npm start
```

## Architecture

Next.js 16.3.8 App Router, React 19.3.0, strict TypeScript and plain CSS. Versions were resolved from npm's stable tags during implementation and pinned. No animation, graph, syntax-highlighting or UI framework is needed.

```text
src/
  app/             Server-rendered page, layout, CSS, metadata, robots, sitemap
  components/
    effects/       Canvas, pointer, boot, reveals, counters, progress, tilt
    hero/          Server-rendered hero and synchronized role animation
    navigation/    Responsive navigation and native-dialog command palette
    projects/      Accessible responsive workflow diagrams
    lab/           Lazy-loaded terminal, CTF, password and hash tools
    sections/      Static portfolio sections
    ui/            Cockpit cards, headings and technology chips
  data/            Authoritative portfolio content
  lib/             Local lab calculations, motion preferences, site origin
  types/           Project, workflow and experience types
tests/             Playwright responsive, keyboard, lab and axe checks
scripts/           Screenshot capture for visual review
docs/              Source inventory, migration notes and QA results
.github/workflows/ Reproducible verification on pushes and pull requests
```

Static content stays in Server Components. Client boundaries are limited to navigation, project selection, lab controls and decorative enhancements. The page, robots and sitemap are prerendered at build time. No database, API, login or runtime content service is required.

## Content and deployment configuration

Edit `src/data/portfolio.ts` to update projects, workflow explanations, skills, experience, education, certifications, metrics, role rotation and contact information. Static About prose is in `src/components/sections/Content.tsx`.

LinkedIn and GitHub use the supplied public profiles. Private email and phone details are excluded from the website, terminal, command palette and repository source. The source's “Nov 2023 – Present” employment record and certification claims are preserved as supplied.

Set `SITE_URL` to the actual public origin **before building** to generate the canonical URL, Open Graph URL, sitemap and robots sitemap reference. Without it, preview builds deliberately omit the canonical and return an empty sitemap. `.env.example` documents the variable. No production domain, credential links or social image was supplied; none has been fabricated. A small GJ vector favicon uses the source palette and corner brackets.

Deploy on any host supporting Next.js and Node.js 22+: install with `npm ci`, build with `npm run build`, and serve with `npm start`. A platform such as Vercel can detect this configuration automatically. For a container or VM, expose the chosen `PORT`, terminate HTTPS at the reverse proxy and use a process supervisor. Keep build-time dependencies installed until the build finishes. Do not copy `.env` secrets or development artifacts into a public repository.

The repository includes `.gitignore` and GitHub Actions CI. Local environment files, dependencies, builds, screenshots and browser reports are excluded from Git. Publishing the repository does not deploy a live website.

## Interaction and accessibility

- Native modal dialogs provide focus containment, Escape dismissal and focus restoration. The command palette supports Ctrl/Cmd+K, search, arrows and Enter.
- Lab tabs use roving focus with Arrow Left/Right, Home and End. Workflow nodes are real buttons with pressed state and a live detail region.
- All static portfolio content remains readable without JavaScript; workflow role descriptions are included in a no-script fallback.
- Reduced motion disables scrambling, boot, ticker movement, tilt, magnetic controls and pointer effects. The navigation pause control also pauses decorative motion.
- The once-per-session pre-flight checklist appears as a brief corner console so it never hides the portfolio or delays access to content.
- The system cursor remains available for text selection and reliable native interaction. The cyan ring supplements it only on precision pointers.
- Cyan buttons use dark text for contrast; small magenta text is lightened while the original magenta remains the hero and ambient accent.

## Performance and responsive strategy

Fonts are Latin WOFF2 subsets bundled through `next/font/local`, including fallback metric adjustment. They are self-hosted and require no Google connection at build or runtime. The Security Lab loads within 500px of the viewport. CSS handles the ticker, reflection and packet indicators; browser APIs handle counters, scroll progress and canvas.

The canvas retains the original `ceil(min(260, innerWidth / 4))` star count, 90% cyan / 10% magenta classification, depth projection, per-frame speed and scroll-velocity response. Its backing-store DPR is capped at 2 on desktops, 1.5 with a coarse pointer, and 1 when hardware or data-saving hints indicate a constrained device. This reduces pixel work without reducing stars or changing their motion. Existing star objects are recycled without per-frame particle allocation. The loop stops in hidden tabs or reduced motion; touch devices use the centered origin. `npm run test:starfield` compares 2,880 deterministic frames with the verbatim source renderer at matching rendering resolutions. Resize events are coalesced, and unchanged dimensions no longer reset the field. Off-screen decorative animations and role rotation pause until needed. Scroll indicators remain event-driven and frame-batched, outside React state, with layout reads completed before style writes. Observers, listeners and frames are cleaned up on unmount.

The hero stacks below 1000px. Narrow project diagrams become vertical with full-size targets and a visible storage branch. Skills, counters, lab tabs and contact actions have explicit small-screen layouts. `svh`/`dvh` avoid fixed mobile viewport-height assumptions.

## Security Lab and privacy

The terminal is a fixed command interpreter; it never invokes an operating-system command or makes a network scan. Only `nmap portfolio` produces simulated output. Input is rendered as React text, not injected HTML. The CTF is intentionally discoverable client-side demo material.

Password and hash inputs stay in component memory. No analytics, storage, logging or backend submission is added. Password strength is a deliberately labeled educational character-pool estimate, not a security guarantee. SHA-256 uses Web Crypto and requires HTTPS or localhost; unsupported contexts display an explanation. Base64 supports UTF-8 and rejects malformed input.

The only `dangerouslySetInnerHTML` is the JSON-LD Person record generated from trusted portfolio data, with `<` escaped to prevent closing a script tag. Generic social homepages are intentionally excluded from `sameAs` structured data.

## Verification

```sh
npx playwright install chromium firefox webkit
npm run build
npm test
```

CI additionally installs Linux browser dependencies. Tests run against a production server and cover Chromium, Firefox, WebKit, Android-style Chromium emulation and iPhone-style WebKit emulation. Emulation is not a substitute for physical iOS/Android devices or branded Safari/Edge verification. See `docs/QA.md` for measured results and remaining limits.

For screenshot review, start the production server and run `node scripts/capture.mjs`. Optionally set `PORTFOLIO_REFERENCE` to the original HTML's absolute path. Output is placed in git-ignored `artifacts/`.

The strict final audit is documented in [docs/FINAL-AUDIT.md](docs/FINAL-AUDIT.md). With a production server on port 3102, reproduce the expanded checks with:

```sh
node scripts/audit-layout.mjs
node scripts/audit-runtime.mjs
PORTFOLIO_REFERENCE='/absolute/path/to/original.html' node scripts/audit-visual.mjs
```

`PORTFOLIO_URL` overrides that server URL. The runtime check includes a three-minute memory sample; `MEMORY_STEPS=0` runs only the short CPU/network/DPR/zoom checks. The 354-case layout audit fails on overflow or browser errors. Safe areas, print, forced colors, large text and missing browser APIs are covered by styles and targeted tests; unavailable physical-device checks remain explicitly documented.

The development linting dependency chain currently includes an upstream `braces` advisory without a patched release. Do not apply `npm audit fix --force`: its proposed downgrade would replace the current Next.js lint configuration with an incompatible older major. Review and update the chain when an upstream fix is released. This package is not in the production runtime dependency set.
