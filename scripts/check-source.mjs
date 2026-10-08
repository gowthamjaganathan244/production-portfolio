import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const sourcePath = process.argv[2];
if (!sourcePath) throw new Error('Pass the path to the original portfolio HTML.');
const html = await readFile(sourcePath, 'utf8');
const typedData = await readFile('src/data/portfolio.ts', 'utf8');
const compiled = ts.transpileModule(typedData, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const data = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`
);
const values = [
  data.profile.name,
  data.profile.description,
  // Private contacts were removed; supplied social profiles supersede generic source links.
  data.profile.contact,
  ...data.roles,
  ...data.ticker,
  ...data.education.flatMap((item) => [item.degree, item.detail]),
  ...data.skills.flatMap((item) => [item.category, item.title, ...item.items]),
  ...data.projects.flatMap((project) => [
    project.title,
    project.status,
    project.description,
    ...project.technologies,
    ...project.workflow.flatMap((node) => [node.title, node.detail]),
  ]),
  ...data.experience.flatMap((item) => [item.role, item.timeframe, item.description]),
  ...data.certifications.flatMap((item) => [item.title, item.level]),
];
const missing = values.filter((value) => !html.includes(value));
if (missing.length) throw new Error(`Content differs from reference:\n${missing.join('\n')}`);
console.log(
  `Source parity: ${values.length} facts/strings matched, ${data.projects.length} projects, ${data.projects.reduce((sum, project) => sum + project.workflow.length, 0)} workflow nodes, ${data.experience.length} experience records.`,
);
