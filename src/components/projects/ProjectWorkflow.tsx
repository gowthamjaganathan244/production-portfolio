'use client';
import { useState } from 'react';
import type { Project, WorkflowNode } from '@/types/portfolio';
export function ProjectWorkflow({ project }: { project: Project }) {
  const [selected, setSelected] = useState<WorkflowNode | null>(null);
  const main = project.branching ? project.workflow.slice(0, 4) : project.workflow;
  const node = (item: WorkflowNode) => (
    <button
      type="button"
      className="workflow-node"
      aria-pressed={selected?.id === item.id}
      aria-controls={`${project.id}-detail`}
      aria-label={`Inspect ${item.label}${item.label === item.title ? '' : ` (${item.title})`}`}
      onClick={() => setSelected(item)}
    >
      {item.label}
    </button>
  );
  return (
    <div className="workflow">
      <ol
        className={`workflow-track ${project.branching ? 'has-branch' : ''}`}
        aria-label={`${project.title} architecture workflow`}
      >
        {main.map((item) => (
          <li key={item.id}>{node(item)}</li>
        ))}
        {project.branching && (
          <li className="workflow-branch">
            <ul>
              {project.workflow.slice(4).map((item) => (
                <li key={item.id}>{node(item)}</li>
              ))}
            </ul>
          </li>
        )}
      </ol>
      <p className="workflow-caption">{project.caption}</p>
      <div className="flow-detail" id={`${project.id}-detail`} role="status" aria-live="polite">
        {selected ? (
          <>
            <b>{selected.title}</b>
            <p>
              <span>Role </span>
              {selected.detail}
            </p>
          </>
        ) : (
          <p>Click a workflow component to inspect what it does.</p>
        )}
      </div>
      <noscript>
        <dl>
          {project.workflow.map((item) => (
            <div key={item.id}>
              <dt>{item.title}</dt>
              <dd>{item.detail}</dd>
            </div>
          ))}
        </dl>
      </noscript>
    </div>
  );
}
