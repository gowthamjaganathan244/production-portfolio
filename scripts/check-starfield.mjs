import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

// Compare against the supplied renderer, not a second rewrite of its equations.
const referenceSource = (await readFile('tests/fixtures/original-starfield.txt', 'utf8')).trim();
if (process.argv[2]) {
  const html = await readFile(process.argv[2], 'utf8');
  const original = html
    .slice(html.indexOf("var cv=document.getElementById('warp')"), html.indexOf('/* main loop */'))
    .trim();
  assert.equal(
    referenceSource,
    original,
    'The reference fixture must match the supplied HTML verbatim.',
  );
}
const code = ts.transpileModule(await readFile('src/lib/hyperdrive.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { HyperdriveField } = await import(
  `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`
);
const seededRandom = (initial) => {
  let seed = initial;
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 2 ** 32;
  };
};
function recorder() {
  let strokes = [],
    start = [],
    end = [];
  return {
    strokeStyle: '',
    lineWidth: 0,
    clearRect(...args) {
      strokes = [['clear', ...args]];
    },
    beginPath() {},
    moveTo(...args) {
      start = args;
    },
    lineTo(...args) {
      end = args;
    },
    stroke() {
      strokes.push([this.strokeStyle, this.lineWidth, ...start, ...end]);
    },
    get strokes() {
      return strokes;
    },
  };
}

let comparedFrames = 0;
for (const [width, height, dpr] of [
  [320, 568, 1],
  [375, 667, 3],
  [390, 844, 2],
  [768, 1024, 2],
  [1440, 900, 1],
  [1920, 1080, 2],
]) {
  for (const reduced of [false, true]) {
    const expected = recorder(),
      actual = recorder();
    const seed = width * 31 + height;
    const field = new HyperdriveField(seededRandom(seed));
    field.resize(width, height, dpr);
    const reference = vm.createContext({
      document: {
        getElementById: () => ({ width: 0, height: 0, style: {}, getContext: () => expected }),
      },
      Math: { min: Math.min, max: Math.max, abs: Math.abs, random: seededRandom(seed) },
      innerWidth: width,
      innerHeight: height,
      devicePixelRatio: dpr,
      scrollY: 0,
      mx: 0,
      my: 0,
      RM: reduced,
      addEventListener() {},
    });
    vm.runInContext(referenceSource, reference);
    assert.equal(reference.stars.length, Math.ceil(Math.min(260, width / 4)));
    for (let frame = 0; frame < 240; frame++) {
      // Idle, slow scroll, fast scroll, reverse scroll, then deceleration.
      const scroll =
        frame < 30
          ? 0
          : frame < 60
            ? (frame - 30) * 2
            : frame < 100
              ? 60 + (frame - 60) * 100
              : frame < 140
                ? 4060 - (frame - 100) * 70
                : 1260;
      reference.scrollY = scroll;
      reference.mx = frame >= 100 ? 0.25 : 0;
      reference.my = frame >= 100 ? -0.2 : 0;
      if (frame === 180) {
        // Resize both implementations, preserving the original accumulated velocity.
        reference.innerWidth = width + 100;
        reference.innerHeight = height + 80;
        reference.size();
        field.resize(width + 100, height + 80, dpr);
      }
      reference.warp();
      field.draw(actual, scroll, reference.mx, reference.my, reduced);
      assert.deepEqual(
        actual.strokes,
        expected.strokes,
        `${width}px DPR ${dpr}, reduced=${reduced}, frame ${frame}`,
      );
      comparedFrames++;
    }
  }
}
console.log(
  `Hyperdrive parity: ${comparedFrames} frames matched the original exactly (positions, colors, opacity, widths, scroll/pointer response, resize and recycling).`,
);
