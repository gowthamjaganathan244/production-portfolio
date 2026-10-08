export type WorkflowNode = { id: string; label: string; title: string; detail: string };
export type Project = {
  id: string;
  title: string;
  status: string;
  description: string;
  technologies: string[];
  workflow: WorkflowNode[];
  caption: string;
  branching?: boolean;
};
export type Experience = { role: string; timeframe: string; description: string };
