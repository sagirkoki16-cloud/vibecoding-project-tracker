
import { useState, useEffect, useRef } from 'react';

import demoData from './demoData.json';


// ==========================================
// M4: KANBAN DATA MODEL
// ==========================================

export const STAGES = [
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
];

// Replace with names from your PRD
export const TEAM = [
  'Teammate A',
  'Teammate B',
  'Teammate C',
];

const TASK_STYLES = {
  feature: {
    label: 'Feature',
    icon: '+',
    color: '#1D4ED8',
    background: '#DBEAFE',
  },
  bug: {
    label: 'Bug',
    icon: '🐞',
    color: '#BE123C',
    background: '#FFE4E6',
  },
};

const DUE_STYLES = {
  calm: {
    color: '#334155',
    background: '#F1F5F9',
    border: '#334155',
  },
  warning: {
    color: '#92400E',
    background: '#FEF3C7',
    border: '#D97706',
  },
  overdue: {
    color: '#991B1B',
    background: '#FEE2E2',
    border: '#DC2626',
  },
  neutral: {
    color: '#475569',
    background: '#E2E8F0',
    border: '#CBD5E1',
  },
};

const AI_TOOLS = [
  'Claude',
  'ChatGPT',
  'Cursor',
  'Lovable',
  'Replit',
  'Other',
];

const CONTEXT_TEMPLATE = `## Background

## Constraints

## Tried so far

## Pick up
`;

const DELIVERABLES = [
  {
    id: 'presentation',
    label: 'Presentation',
    icon: '▣',
  },
  {
    id: 'demo',
    label: 'Demo',
    icon: '▶',
  },
  {
    id: 'report',
    label: 'Report',
    icon: '▤',
  },
  {
    id: 'documentation',
    label: 'Documentation',
    icon: '▥',
  },
];

const INITIAL_ANCHORS = {
  presentation: '',
  demo: '',
  report: '',
  documentation: '',
};

// ==========================================
// UTILITIES
// ==========================================

function localDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function isValidUrl(value) {
  try {
    const url = new URL(value);

    return (
      url.protocol === 'https:' ||
      url.protocol === 'http:'
    );
  } catch {
    return false;
  }
}

function getDueState(task, today) {
  if (task.status === 'done') {
    return {
      state: 'neutral',
      label: 'Completed',
    };
  }

  if (!task.dueDate) {
    return {
      state: 'neutral',
      label: 'No due date',
    };
  }

  if (task.dueDate < today) {
    return {
      state: 'overdue',
      label: `Overdue · ${task.dueDate}`,
    };
  }

  if (task.dueDate === today) {
    return {
      state: 'warning',
      label: 'Due today',
    };
  }

  const tomorrow = new Date(`${today}T12:00:00`);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (task.dueDate === localDate(tomorrow)) {
    return {
      state: 'warning',
      label: 'Due tomorrow',
    };
  }

  return {
    state: 'calm',
    label: `Due ${task.dueDate}`,
  };
}

function getInitials(name) {
  if (!name) return '?';

  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function timeAgo(timestamp, now) {
  if (!timestamp) return 'Not updated yet';

  const updated = new Date(timestamp).getTime();

  if (Number.isNaN(updated)) {
    return 'Not updated yet';
  }

  const minutes = Math.max(
    0,
    Math.floor((now - updated) / 60000)
  );

  if (minutes < 1) return 'Updated just now';

  if (minutes < 60) {
    return `Updated ${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `Updated ${hours} h ago`;
  }

  return `Updated ${Math.floor(hours / 24)} d ago`;
}

function createContextBriefing(task) {
  return [
    `# ${task.title || 'Untitled task'}`,
    '',
    '## Description',
    task.description || 'No description provided.',
    '',
    '## AI Context',
    task.context?.trim() || 'No AI context recorded.',
  ].join('\n');
}

// ==========================================
// LOCAL STORAGE
// ==========================================

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);

      return raw !== null
        ? JSON.parse(raw)
        : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(
        key,
        JSON.stringify(value)
      );
    } catch {
      console.error("Changes couldn't be saved.");
    }
  }, [key, value]);

  return [value, setValue];
}

// ==========================================
// SAMPLE TASKS
// ==========================================

const initialTasks = [
  {
    id: 'task-1',
    title: 'Design dashboard',
    description: 'Create the project dashboard layout.',
    type: 'feature',
    status: 'todo',
    assignee: TEAM[0],
    dueDate: null,
    createdDate: '2026-10-20',
  },
  {
    id: 'task-2',
    title: 'Build login page',
    description: 'Develop the login page interface.',
    type: 'feature',
    status: 'in-progress',
    assignee: TEAM[1],
    dueDate: null,
    createdDate: '2026-10-20',
  },
  {
    id: 'task-3',
    title: 'Test navigation',
    description: 'Check navigation links and identify bugs.',
    type: 'bug',
    status: 'review',
    assignee: TEAM[2],
    dueDate: null,
    createdDate: '2026-10-20',
  },
  {
    id: 'task-4',
    title: 'Write documentation',
    description: 'Prepare the initial project documentation.',
    type: 'feature',
    status: 'todo',
    assignee: TEAM[0],
    dueDate: null,
    createdDate: '2026-10-20',
  },
];

function emptyTask() {
  return {
    id: '',
    title: '',
    description: '',
    type: 'feature',
    status: 'todo',
    assignee: TEAM[0],
    dueDate: '',
    createdDate: localDate(),
    context: CONTEXT_TEMPLATE,
    contextTool: '',
    contextUpdatedAt: null,
  };
}

// ==========================================
// REUSABLE COMPONENTS
// ==========================================

function TaskTypeBadge({ type }) {
  const style =
    TASK_STYLES[type] || TASK_STYLES.feature;

  return (
    <span
      className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold"
      style={{
        color: style.color,
        backgroundColor: style.background,
      }}
    >
      <span aria-hidden="true">{style.icon}</span>
      {style.label}
    </span>
  );
}

function DueBadge({ task, today }) {
  const due = getDueState(task, today);
  const style = DUE_STYLES[due.state];

  return (
    <span
      className="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
      style={{
        color: style.color,
        backgroundColor: style.background,
      }}
    >
      {due.label}
    </span>
  );
}

function OwnerBadge({ name }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold"
        style={{
          backgroundColor: '#CCFBF1',
          color: '#115E59',
        }}
        aria-hidden="true"
      >
        {getInitials(name)}
      </span>

      <span className="text-sm font-medium text-slate-700">
        {name || 'Unassigned'}
      </span>
    </span>
  );
}

// ==========================================
// M11: DELIVERABLE ANCHOR CARDS
// ==========================================

function DeliverableCard({ item, value, onChange }) {
  const text = value || '';
  const filled = isValidUrl(text.trim());
  const invalid = text.trim() !== '' && !filled;

  return (
    <div className="rounded-xl border border-slate-300 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 font-semibold text-slate-900">
          <span className="text-xl text-teal-700">
            {item.icon}
          </span>
          {item.label}
        </h3>

        <span
          className="h-3 w-3 rounded-full"
          style={{
            backgroundColor: filled
              ? '#16A34A'
              : '#CBD5E1',
          }}
          title={filled ? 'Link added' : 'No valid link'}
          aria-label={
            filled ? 'Link added' : 'No valid link'
          }
        />
      </div>

      <label
        htmlFor={`anchor-${item.id}`}
        className="mb-1 block text-xs font-medium text-slate-600"
      >
        Deliverable URL
      </label>

      <input
        id={`anchor-${item.id}`}
        type="url"
        value={text}
        onChange={(event) =>
          onChange(item.id, event.target.value)
        }
        placeholder="https://example.com/..."
        aria-invalid={invalid}
        className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2 text-sm focus:outline-2 focus:outline-teal-700"
      />

      <div className="mt-3 flex items-center justify-between gap-2">
        <span
          className={`text-xs font-medium ${
            filled ? 'text-green-700' : 'text-slate-500'
          }`}
        >
          {filled ? '● Link saved' : '○ No valid link'}
        </span>

        {filled && (
          <a
            href={text.trim()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-teal-700 underline"
          >
            Open link ↗
          </a>
        )}
      </div>

      {invalid && (
        <p className="mt-2 text-xs text-red-700">
          Enter a full link starting with https:// or http://.
        </p>
      )}
    </div>
  );
}

// ==========================================
// M12: SMART PROJECT INSIGHTS
// ==========================================

function ProjectInsights({ tasks, today }) {
  const [expanded, setExpanded] = useState(true);

  const total = tasks.length;

  const completed = tasks.filter(
    (task) => task.status === 'done'
  ).length;

  const active = total - completed;

  const overdueTasks = tasks.filter(
    (task) =>
      getDueState(task, today).state === 'overdue'
  );

  const upcomingTasks = tasks.filter((task) => {
    const due = getDueState(task, today);

    return due.state === 'warning';
  });

  const completionRate = total
    ? Math.round((completed / total) * 100)
    : 0;

  const workload = TEAM.map((member) => ({
    name: member,
    count: tasks.filter(
      (task) =>
        task.assignee === member &&
        task.status !== 'done'
    ).length,
  }));

  const maxWorkload = Math.max(
    1,
    ...workload.map((member) => member.count)
  );

  const sortedWorkload = [...workload].sort(
    (a, b) => a.count - b.count
  );

  const leastBusy = sortedWorkload[0];
  const busiest =
    sortedWorkload[sortedWorkload.length - 1];

  const showSuggestion =
    leastBusy &&
    busiest &&
    busiest.count - leastBusy.count >= 2;

  return (
    <section className="mb-8 overflow-hidden rounded-2xl border border-teal-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-teal-50 p-5">
        <div>
          <h2 className="text-xl font-bold text-teal-900">
            ✦ Smart Project Insights
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Live project progress, deadlines and team workload
          </p>
        </div>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          className="rounded-lg border border-teal-300 bg-white px-4 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-100"
        >
          {expanded ? 'Hide insights ▲' : 'Show insights ▼'}
        </button>
      </div>

      {expanded && (
        <div className="space-y-6 p-5">
          {/* Project Statistics */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            {[
              {
                label: 'Total Tasks',
                value: total,
                color: '#0F172A',
              },
              {
                label: 'Active Tasks',
                value: active,
                color: '#1D4ED8',
              },
              {
                label: 'Completed',
                value: completed,
                color: '#0F766E',
              },
              {
                label: 'Overdue',
                value: overdueTasks.length,
                color: '#BE123C',
              },
              {
                label: 'Completion',
                value: `${completionRate}%`,
                color: '#0F766E',
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-sm text-slate-500">
                  {stat.label}
                </p>

                <p
                  className="mt-2 text-3xl font-bold"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div>
            <div className="mb-2 flex justify-between gap-3">
              <h3 className="font-semibold text-slate-900">
                Overall Project Progress
              </h3>

              <span className="font-semibold text-teal-800">
                {completionRate}%
              </span>
            </div>

            <div
              className="h-4 overflow-hidden rounded-full bg-slate-200"
              role="progressbar"
              aria-valuenow={completionRate}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Project completion"
            >
              <div
                className="h-full rounded-full bg-teal-700 transition-all"
                style={{
                  width: `${completionRate}%`,
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Team Workload */}
            <div className="rounded-xl border border-slate-200 p-4">
              <h3 className="mb-4 font-bold text-slate-900">
                👥 Team Workload
              </h3>

              <div className="space-y-4">
                {workload.map((member) => (
                  <div key={member.name}>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <OwnerBadge name={member.name} />

                      <span className="text-sm font-semibold text-slate-600">
                        {member.count} active
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-teal-600"
                        style={{
                          width: `${
                            (member.count / maxWorkload) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deadline Intelligence */}
            <div className="rounded-xl border border-slate-200 p-4">
              <h3 className="mb-4 font-bold text-slate-900">
                ⚡ Deadline Intelligence
              </h3>

              <div className="space-y-3">
                <div className="rounded-lg bg-red-50 p-3">
                  <p className="font-semibold text-red-800">
                    {overdueTasks.length} overdue task(s)
                  </p>

                  <p className="mt-1 text-sm text-red-700">
                    {overdueTasks.length
                      ? overdueTasks.map(
                          (task) => task.title
                        ).join(', ')
                      : 'No overdue tasks. Great progress!'}
                  </p>
                </div>

                <div className="rounded-lg bg-amber-50 p-3">
                  <p className="font-semibold text-amber-900">
                    {upcomingTasks.length} urgent deadline(s)
                  </p>

                  <p className="mt-1 text-sm text-amber-800">
                    {upcomingTasks.length
                      ? upcomingTasks.map(
                          (task) => task.title
                        ).join(', ')
                      : 'Nothing due today or tomorrow.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Smart Recommendations */}
          <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">
            <h3 className="mb-3 font-bold text-teal-900">
              💡 Smart Recommendations
            </h3>

            <div className="space-y-2 text-sm text-teal-900">
              {overdueTasks.length > 0 && (
                <p>
                  • Prioritise {overdueTasks.length} overdue
                  task(s) before starting new work.
                </p>
              )}

              {upcomingTasks.length > 0 && (
                <p>
                  • Review tasks due today or tomorrow to
                  avoid missing deadlines.
                </p>
              )}

              {showSuggestion && (
                <p>
                  • Consider handing off an active task
                  from {busiest.name} to {leastBusy.name}
                  to balance the workload.
                </p>
              )}

              {!overdueTasks.length &&
                !upcomingTasks.length &&
                !showSuggestion && (
                  <p>
                    ✓ Your project currently has no urgent
                    deadline or workload warnings.
                  </p>
                )}
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Insights are calculated automatically from
            your saved tasks. Recommendations are based
            on simple rules, not an external AI service.
          </p>
        </div>
      )}
    </section>
  );
}

// ==========================================
// MAIN APPLICATION
// ==========================================

const PROJECT_STAGES = [
  'Intent',
  'Plan',
  'Build',
  'Validate',
  'Ship',
];

const INITIAL_PROJECT = {
  name: '',
  description: '',
  problem: '',
  objectives: '',
  constraints: '',
  techStack: '',
  stage: 'Intent',
  lead: TEAM[0],
  releaseDate: '',
};

function ProjectOverview({ project, onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(project);

  function startEditing() {
    setDraft({ ...INITIAL_PROJECT, ...project });
    setEditing(true);
  }

  function updateField(event) {
    const { name, value } = event.target;

    setDraft((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function saveProject(event) {
    event.preventDefault();

    if (!draft.name.trim()) {
      return;
    }

    onSave({
      ...draft,
      name: draft.name.trim(),
    });

    setEditing(false);
  }

  const details = {
    ...INITIAL_PROJECT,
    ...project,
  };

  return (
    <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-teal-700">
            Project Overview
          </p>

          <h2 className="text-2xl font-bold text-slate-900">
            {details.name || 'Start your project'}
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            {details.description ||
              'Define your project intent, goals and development plan.'}
          </p>
        </div>

        <button
          type="button"
          onClick={startEditing}
          className="rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white hover:bg-teal-800"
        >
          Edit Project
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Lifecycle Stage</p>
          <p className="mt-1 font-semibold text-teal-800">
            {details.stage}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Project Lead</p>
          <p className="mt-1 font-semibold">
            {details.lead}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Technology Stack</p>
          <p className="mt-1 font-semibold">
            {details.techStack || 'Not specified'}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Target Release</p>
          <p className="mt-1 font-semibold">
            {details.releaseDate || 'Not set'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {[
          ['Problem Statement', details.problem],
          ['Project Objectives', details.objectives],
          ['Constraints', details.constraints],
        ].map(([heading, value]) => (
          <div
            key={heading}
            className="rounded-xl border border-slate-200 p-4"
          >
            <h3 className="mb-2 font-semibold text-slate-900">
              {heading}
            </h3>

            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
              {value || 'Not specified yet.'}
            </p>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-dialog-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
          >
            <h2
              id="project-dialog-title"
              className="mb-5 text-xl font-bold"
            >
              Edit Project Overview
            </h2>

            <form onSubmit={saveProject} className="space-y-4">
              {[
                ['name', 'Project Name', 'text'],
                ['description', 'Short Description', 'text'],
                ['techStack', 'Technology Stack', 'text'],
                ['releaseDate', 'Target Release Date', 'date'],
              ].map(([name, label, type]) => (
                <label key={name} className="block text-sm font-medium">
                  {label}
                  <input
                    type={type}
                    name={name}
                    required={name === 'name'}
                    value={draft[name]}
                    onChange={updateField}
                    className="mt-1 w-full rounded-lg border border-slate-300 p-3"
                  />
                </label>
              ))}

              <label className="block text-sm font-medium">
                Lifecycle Stage
                <select
                  name="stage"
                  value={draft.stage}
                  onChange={updateField}
                  className="mt-1 w-full rounded-lg border border-slate-300 p-3"
                >
                  {PROJECT_STAGES.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium">
                Project Lead
                <select
                  name="lead"
                  value={draft.lead}
                  onChange={updateField}
                  className="mt-1 w-full rounded-lg border border-slate-300 p-3"
                >
                  {TEAM.map((member) => (
                    <option key={member} value={member}>
                      {member}
                    </option>
                  ))}
                </select>
              </label>

              {[
                ['problem', 'Problem Statement'],
                ['objectives', 'Project Objectives'],
                ['constraints', 'Project Constraints'],
              ].map(([name, label]) => (
                <label key={name} className="block text-sm font-medium">
                  {label}
                  <textarea
                    name={name}
                    value={draft[name]}
                    onChange={updateField}
                    rows={3}
                    className="mt-1 w-full rounded-lg border border-slate-300 p-3"
                  />
                </label>
              ))}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white hover:bg-teal-800"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default function App() {

  
  // Project details persist separately from tasks
 
  // Tasks: use demonstration data for new visitors
  const [tasks, setTasks] = useLocalStorage(
    'vibetracker.tasks',
    demoData.tasks ?? initialTasks
  );

  // Project Overview
  const [project, setProject] = useLocalStorage(
    'vibetracker.project',
    demoData.project ?? INITIAL_PROJECT
  );

  // Project Deliverables
  const [anchors, setAnchors] = useLocalStorage(
    'vibetracker.anchors',
    demoData.anchors ?? INITIAL_ANCHORS
  );


  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(emptyTask);

  // Notifications
  const [handoffNotice, setHandoffNotice] = useState('');
  const [copyNotice, setCopyNotice] = useState('');
  const [moveNotice, setMoveNotice] = useState('');

  // M12: Drag and drop state
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);

  // Date and time
  const [now, setNow] = useState(() => Date.now());
  const today = localDate(new Date(now));

  const modalCloseRef = useRef(null);
  const previousFocusRef = useRef(null);
  const dragTaskRef = useRef(null);

  // ========================================
  // TIME UPDATES
  // ========================================

  useEffect(() => {
    const refresh = () => setNow(Date.now());

    const timer = window.setInterval(
      refresh,
      60000
    );

    window.addEventListener('focus', refresh);
    document.addEventListener(
      'visibilitychange',
      refresh
    );

    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', refresh);
      document.removeEventListener(
        'visibilitychange',
        refresh
      );
    };
  }, []);

  // ========================================
  // MODAL ACCESSIBILITY
  // ========================================

  useEffect(() => {
    if (!modalOpen) return;

    modalCloseRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setModalOpen(false);
      }

      if (event.key !== 'Tab') return;

      const dialog = document.querySelector(
        '[role="dialog"]'
      );

      if (!dialog) return;

      const focusable = Array.from(
        dialog.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (
        event.shiftKey &&
        document.activeElement === first
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown
      );

      previousFocusRef.current?.focus();
    };
  }, [modalOpen]);

  
  // Export the current project as demonstration data
  function exportDemoData() {
    const demoData = {
      project,
      tasks,
      anchors,
    };

    const json = JSON.stringify(demoData, null, 2);

    const blob = new Blob([json], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'demoData.json';

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  }


  
  // ========================================
  // M11: DELIVERABLE LINKS
  // ========================================

  function updateAnchor(id, value) {
    setAnchors((previous) => ({
      ...previous,
      [id]: value,
    }));
  }

  // ========================================
  // M5: CREATE AND EDIT TASKS
  // ========================================

  function addTask() {
    previousFocusRef.current = document.activeElement;

    setForm(emptyTask());
    setEditing(false);
    setModalOpen(true);

    setHandoffNotice('');
    setCopyNotice('');
  }

  function editTask(task) {
    previousFocusRef.current = document.activeElement;

    setForm({
      ...task,
      dueDate: task.dueDate || '',
      context: task.context ?? '',
      contextTool: task.contextTool ?? '',
      contextUpdatedAt:
        task.contextUpdatedAt ?? null,
    });

    setEditing(true);
    setModalOpen(true);

    setHandoffNotice('');
    setCopyNotice('');
  }

  function updateField(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // ========================================
  // M7: TASK HANDOFF
  // ========================================

  function handOffTask(event) {
    const newOwner = event.target.value;

    setForm((previous) => ({
      ...previous,
      assignee: newOwner,
    }));
  }

  // ========================================
  // M9: AI CONTEXT
  // ========================================

  function updateContext(event) {
    const value = event.target.value;
    const timestamp = new Date().toISOString();

    setForm((previous) => ({
      ...previous,
      context: value,
      contextUpdatedAt: timestamp,
    }));

    setNow(Date.now());
  }

  // ========================================
  // M10: COPY CONTEXT
  // ========================================

  async function handleCopyContext(task) {
    const briefing = createContextBriefing(task);

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard unavailable');
      }

      await navigator.clipboard.writeText(briefing);

      setCopyNotice(
        'Context copied. Ready to paste.'
      );
    } catch {
      setCopyNotice(
        "Couldn't copy. Select and copy the text manually."
      );
    }
  }

  // ========================================
  // SAVE TASK
  // ========================================

  function saveTask(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      alert('Enter a task title.');
      return;
    }

    const oldTask = editing
      ? tasks.find((task) => task.id === form.id)
      : null;

    const savedTask = {
      ...form,
      id: editing
        ? form.id
        : crypto.randomUUID(),
      title: form.title.trim(),
      dueDate: form.dueDate || null,
    };

    if (editing) {
      setTasks((previous) =>
        previous.map((task) =>
          task.id === savedTask.id
            ? savedTask
            : task
        )
      );
    } else {
      setTasks((previous) => [
        ...previous,
        savedTask,
      ]);
    }

    if (
      oldTask &&
      oldTask.assignee !== savedTask.assignee
    ) {
      setHandoffNotice(
        `Task handed off to ${savedTask.assignee}.`
      );
    } else {
      setHandoffNotice('');
    }

    setModalOpen(false);
  }

  // ========================================
  // DELETE TASK
  // ========================================

  function deleteTask() {
    if (!editing) return;

    if (
      window.confirm(
        'Delete this task? This cannot be undone.'
      )
    ) {
      setTasks((previous) =>
        previous.filter(
          (task) => task.id !== form.id
        )
      );

      setModalOpen(false);
      setHandoffNotice('');
    }
  }

  // ========================================
  // M12: DRAG AND DROP KANBAN
  // ========================================

  function handleDragStart(event, task) {
    dragTaskRef.current = task.id;
    setDraggedTaskId(task.id);
    setDragOverStage(null);

    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData(
      'text/plain',
      task.id
    );
  }

  function handleDragOver(event, stageId) {
    event.preventDefault();

    event.dataTransfer.dropEffect = 'move';

    if (dragOverStage !== stageId) {
      setDragOverStage(stageId);
    }
  }

  function handleDrop(event, stageId) {
    event.preventDefault();

    const taskId =
      event.dataTransfer.getData('text/plain') ||
      dragTaskRef.current;

    const task = tasks.find(
      (item) => item.id === taskId
    );

    if (task && task.status !== stageId) {
      setTasks((previous) =>
        previous.map((item) =>
          item.id === taskId
            ? { ...item, status: stageId }
            : item
        )
      );

      const destination = STAGES.find(
        (stage) => stage.id === stageId
      );

      setMoveNotice(
        `"${task.title}" moved to ${destination.label}.`
      );
    }

    dragTaskRef.current = null;
    setDraggedTaskId(null);
    setDragOverStage(null);
  }

  function handleDragEnd() {
    dragTaskRef.current = null;
    setDraggedTaskId(null);
    setDragOverStage(null);
  }

  // ========================================
  // APPLICATION INTERFACE
  // ========================================

  return (
    <div
      className="min-h-screen p-6"
      style={{
        backgroundColor: '#F8FAFC',
        color: '#0F172A',
      }}
    >
      {/* HEADER */}
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Vibecoding Project Tracker
          </h1>

          <p className="mt-1 text-sm text-slate-600">
            Team starter
          </p>
        </div>


        <button
          type="button"
          onClick={exportDemoData}
          className="rounded-lg border border-teal-700 bg-white px-5 py-3 font-semibold text-teal-800 hover:bg-teal-50"
        >
          ↓ Export Data
        </button>

        <button
          type="button"
          onClick={addTask}
          className="rounded-lg px-5 py-3 font-semibold text-white hover:opacity-90"
          style={{
            backgroundColor: '#0F766E',
          }}
        >
          + Add task
        </button>
      </header>

      {/* NOTIFICATIONS */}
      {handoffNotice && (
        <div
          role="status"
          className="mb-4 rounded-lg border border-teal-300 bg-teal-50 p-4 text-teal-900"
        >
          ✓ {handoffNotice}
        </div>
      )}

      {copyNotice && (
        <div
          role="status"
          className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-teal-300 bg-teal-50 p-4 text-teal-900"
        >
          <span>{copyNotice}</span>

          <button
            type="button"
            onClick={() => setCopyNotice('')}
            aria-label="Dismiss copy message"
          >
            ×
          </button>
        </div>
      )}

      {moveNotice && (
        <div
          role="status"
          className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-900"
        >
          <span>✓ {moveNotice}</span>

          <button
            type="button"
            onClick={() => setMoveNotice('')}
            aria-label="Dismiss movement message"
          >
            ×
          </button>
        </div>
      )}
      
      {/* Project Overview: Intent to Ship */}
      <ProjectOverview
        project={project}
        onSave={setProject}
      />


      {/* ====================================
          M11: PROJECT DELIVERABLES
      ==================================== */}

      <section
        aria-labelledby="deliverables-title"
        className="mb-8"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2
              id="deliverables-title"
              className="text-xl font-bold text-slate-900"
            >
              Project Deliverables
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Keep the four final project links in one place.
            </p>
          </div>

          <span className="rounded-full bg-teal-100 px-3 py-1 text-sm font-medium text-teal-800">
            {
              DELIVERABLES.filter((item) =>
                isValidUrl(
                  (anchors?.[item.id] || '').trim()
                )
              ).length
            } / 4 linked
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {DELIVERABLES.map((item) => (
            <DeliverableCard
              key={item.id}
              item={item}
              value={anchors?.[item.id] || ''}
              onChange={updateAnchor}
            />
          ))}
        </div>
      </section>

      {/* ====================================
          M12: SMART PROJECT INSIGHTS
      ==================================== */}

      <ProjectInsights
        tasks={tasks}
        today={today}
      />

      {/* ====================================
          M4-M12: KANBAN BOARD
      ==================================== */}

      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-900">
          Kanban Task Board
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Drag and drop task cards between columns,
          or click a card to edit its status.
        </p>
      </div>

      <main className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {STAGES.map((stage) => {
          const stageTasks = tasks.filter(
            (task) => task.status === stage.id
          );

          const isDropTarget =
            dragOverStage === stage.id;

          return (
            <section
              key={stage.id}
              onDragOver={(event) =>
                handleDragOver(event, stage.id)
              }
              onDragLeave={(event) => {
                if (
                  !event.currentTarget.contains(
                    event.relatedTarget
                  )
                ) {
                  setDragOverStage(null);
                }
              }}
              onDrop={(event) =>
                handleDrop(event, stage.id)
              }
              className={`min-h-80 rounded-xl border-2 p-4 transition-all ${
                isDropTarget
                  ? 'border-teal-600 bg-teal-100'
                  : 'border-transparent bg-slate-100'
              }`}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  {stage.label}
                </h2>

                <span className="rounded-full bg-white px-3 py-1 text-xs">
                  {stageTasks.length}
                </span>
              </div>

              {isDropTarget && (
                <p className="mb-3 rounded-lg border border-dashed border-teal-600 bg-white p-3 text-center text-sm font-semibold text-teal-800">
                  Drop task here
                </p>
              )}

              <div className="space-y-3">
                {stageTasks.length === 0 && (
                  <p className="text-sm text-slate-500">
                    No tasks here yet.
                  </p>
                )}

                {stageTasks.map((task) => {
                  const due = getDueState(
                    task,
                    today
                  );

                  const dueStyle =
                    DUE_STYLES[due.state];

                  const isDragging =
                    draggedTaskId === task.id;

                  return (
                    <article
                      key={task.id}
                      draggable
                      onDragStart={(event) =>
                        handleDragStart(event, task)
                      }
                      onDragEnd={handleDragEnd}
                      className={`overflow-hidden rounded-xl border bg-white shadow-sm transition-all ${
                        isDragging
                          ? 'opacity-40'
                          : 'hover:shadow-md'
                      }`}
                      style={{
                        borderColor: dueStyle.border,
                        borderLeftWidth: '5px',
                        cursor: 'grab',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => editTask(task)}
                        className="block w-full p-4 text-left transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-teal-700"
                      >
                        <div className="mb-3 flex items-start justify-between gap-2">
                          <h3 className="text-base font-semibold">
                            {task.title}
                          </h3>

                          <TaskTypeBadge
                            type={task.type}
                          />
                        </div>

                        <p className="text-sm text-slate-600">
                          {task.description}
                        </p>

                        <div className="mt-3">
                          <DueBadge
                            task={task}
                            today={today}
                          />
                        </div>

                        {task.context && (
                          <p className="mt-3 text-xs font-medium text-teal-700">
                            ✦ AI context saved
                            {task.contextTool
                              ? ` · ${task.contextTool}`
                              : ''}
                          </p>
                        )}

                        <div className="mt-4 border-t border-slate-100 pt-3">
                          <OwnerBadge
                            name={task.assignee}
                          />
                        </div>
                      </button>

                      <div className="border-t border-slate-100 px-4 pb-4 pt-3">
                        <button
                          type="button"
                          onClick={() =>
                            handleCopyContext(task)
                          }
                          className="w-full rounded-lg border border-teal-600 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-100"
                        >
                          ⧉ Copy Context
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>

      {/* ====================================
          M5-M10: CREATE / EDIT MODAL
      ==================================== */}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-modal-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <h2
                  id="task-modal-title"
                  className="text-xl font-bold"
                >
                  {editing
                    ? 'Edit task'
                    : 'Create a task'}
                </h2>

                <TaskTypeBadge
                  type={form.type}
                />
              </div>

              <button
                ref={modalCloseRef}
                type="button"
                onClick={() =>
                  setModalOpen(false)
                }
                aria-label="Close task form"
                className="text-2xl text-slate-500"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={saveTask}
              className="space-y-4"
            >
              {/* TASK TITLE */}
              <label className="block text-sm font-medium">
                Task Title *
                <input
                  name="title"
                  value={form.title}
                  onChange={updateField}
                  required
                  className="mt-1 w-full rounded-lg border p-3"
                  placeholder="Enter a task title"
                />
              </label>

              {/* DESCRIPTION */}
              <label className="block text-sm font-medium">
                Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={updateField}
                  rows={3}
                  className="mt-1 w-full rounded-lg border p-3"
                />
              </label>

              {/* TASK TYPE */}
              <label className="block text-sm font-medium">
                Task Type
                <select
                  name="type"
                  value={form.type}
                  onChange={updateField}
                  className="mt-1 w-full rounded-lg border p-3"
                >
                  <option value="feature">
                    Feature
                  </option>

                  <option value="bug">
                    Bug
                  </option>
                </select>
              </label>

              {/* STATUS */}
              <label className="block text-sm font-medium">
                Status
                <select
                  name="status"
                  value={form.status}
                  onChange={updateField}
                  className="mt-1 w-full rounded-lg border p-3"
                >
                  {STAGES.map((stage) => (
                    <option
                      key={stage.id}
                      value={stage.id}
                    >
                      {stage.label}
                    </option>
                  ))}
                </select>
              </label>

              {/* TASK OWNER */}
              <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">
                <p className="mb-3 text-sm font-semibold text-teal-900">
                  Task Owner
                </p>

                <OwnerBadge
                  name={form.assignee}
                />

                <label className="mt-4 block text-sm font-medium">
                  Hand off to...

                  <select
                    name="assignee"
                    value={form.assignee}
                    onChange={handOffTask}
                    className="mt-2 w-full rounded-lg border bg-white p-3"
                  >
                    {TEAM.map((member) => (
                      <option
                        key={member}
                        value={member}
                      >
                        {member}
                      </option>
                    ))}
                  </select>
                </label>

                <p className="mt-2 text-xs text-slate-600">
                  Save the task to confirm the handoff.
                </p>
              </div>

              {/* DUE DATE */}
              <label className="block text-sm font-medium">
                Due Date
                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={updateField}
                  className="mt-1 w-full rounded-lg border p-3"
                />
              </label>

              {/* CREATED DATE */}
              <label className="block text-sm font-medium">
                Created Date
                <input
                  type="date"
                  name="createdDate"
                  value={form.createdDate}
                  onChange={updateField}
                  className="mt-1 w-full rounded-lg border p-3"
                />
              </label>

              {/* DEADLINE PREVIEW */}
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="mb-2 text-sm font-medium">
                  Deadline status
                </p>

                <DueBadge
                  task={form}
                  today={today}
                />
              </div>

              {/* AI CONTEXT */}
              <section className="rounded-xl border-2 border-teal-200 bg-teal-50/50 p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-bold text-teal-900">
                    ✦ AI context
                  </h3>

                  <span className="text-xs text-slate-500">
                    {timeAgo(
                      form.contextUpdatedAt,
                      now
                    )}
                  </span>
                </div>

                <p className="mb-3 text-sm text-slate-600">
                  Record your prompt, outcome and next step.
                </p>

                <label className="block text-sm font-medium">
                  Context briefing (Markdown)

                  <textarea
                    name="context"
                    value={form.context}
                    onChange={updateContext}
                    rows={10}
                    placeholder={CONTEXT_TEMPLATE}
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 font-mono text-sm leading-relaxed"
                  />
                </label>

                <label className="mt-4 block text-sm font-medium">
                  AI tool used (optional)

                  <select
                    name="contextTool"
                    value={form.contextTool}
                    onChange={updateField}
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3"
                  >
                    <option value="">
                      Select an AI tool
                    </option>

                    {AI_TOOLS.map((tool) => (
                      <option
                        key={tool}
                        value={tool}
                      >
                        {tool}
                      </option>
                    ))}
                  </select>
                </label>

                {form.contextUpdatedAt && (
                  <p className="mt-3 text-xs text-slate-500">
                    Last edited:{' '}
                    {new Date(
                      form.contextUpdatedAt
                    ).toLocaleString()}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() =>
                    handleCopyContext(form)
                  }
                  className="mt-4 w-full rounded-lg border border-teal-600 bg-white px-4 py-3 font-semibold text-teal-800 hover:bg-teal-100"
                >
                  ⧉ Copy Context
                </button>
              </section>

              {/* COPY FEEDBACK */}
              {copyNotice && (
                <p
                  role="status"
                  className="rounded-lg bg-teal-50 p-3 text-sm font-medium text-teal-800"
                >
                  {copyNotice}
                </p>
              )}

              {/* MODAL ACTIONS */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
                {editing ? (
                  <button
                    type="button"
                    onClick={deleteTask}
                    className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                  >
                    Delete task
                  </button>
                ) : (
                  <span />
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setModalOpen(false)
                    }
                    className="rounded-lg border px-4 py-2"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="rounded-lg px-4 py-2 text-white hover:opacity-90"
                    style={{
                      backgroundColor: '#0F766E',
                    }}
                  >
                    Save task
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
