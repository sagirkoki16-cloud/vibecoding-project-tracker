
import { useState, useEffect } from 'react';

// M4: Kanban stages
export const STAGES = [
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
];

// Replace with actual team names from PRD section 8
export const TEAM = [
  'Teammate A',
  'Teammate B',
  'Teammate C',
];

// M6: Task colours
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

// M8: Deadline colours
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

// M9: AI tools
const AI_TOOLS = [
  'Claude',
  'ChatGPT',
  'Cursor',
  'Lovable',
  'Replit',
  'Other',
];

// M9: Starting context for new tasks
const CONTEXT_TEMPLATE = `## Background

## Constraints

## Tried so far

## Pick up
`;

function localDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

// M8: Calculate deadline status
function getDueState(task, today) {
  if (task.status === 'done') {
    return { state: 'neutral', label: 'Completed' };
  }

  if (!task.dueDate) {
    return { state: 'neutral', label: 'No due date' };
  }

  if (task.dueDate < today) {
    return {
      state: 'overdue',
      label: `Overdue · ${task.dueDate}`,
    };
  }

  if (task.dueDate === today) {
    return { state: 'warning', label: 'Due today' };
  }

  const tomorrow = new Date(`${today}T12:00:00`);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (task.dueDate === localDate(tomorrow)) {
    return { state: 'warning', label: 'Due tomorrow' };
  }

  return {
    state: 'calm',
    label: `Due ${task.dueDate}`,
  };
}

// M6: Feature / Bug badge
function TaskTypeBadge({ type }) {
  const style = TASK_STYLES[type] || TASK_STYLES.feature;

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

// M8: Due date badge
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

// M7: Task owner avatar
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

// M9: Human-readable last-updated message
function timeAgo(timestamp, now) {
  if (!timestamp) return 'Not updated yet';

  const updated = new Date(timestamp).getTime();
  if (Number.isNaN(updated)) return 'Not updated yet';

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

  const days = Math.floor(hours / 24);
  return `Updated ${days} d ago`;
}

// Browser storage
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initialValue;
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

// M4: Seed tasks
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

    // M9: New task context fields
    context: CONTEXT_TEMPLATE,
    contextTool: '',
    contextUpdatedAt: null,
  };
}

export default function App() {
  const [tasks, setTasks] = useLocalStorage(
    'vibetracker.tasks',
    initialTasks
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(emptyTask);
  const [handoffNotice, setHandoffNotice] = useState('');

  // M8/M9: Keep date and relative times current
  const [now, setNow] = useState(() => Date.now());
  const today = localDate(new Date(now));

  useEffect(() => {
    const refreshTime = () => setNow(Date.now());

    const timer = window.setInterval(
      refreshTime,
      60000
    );

    window.addEventListener('focus', refreshTime);
    document.addEventListener(
      'visibilitychange',
      refreshTime
    );

    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', refreshTime);
      document.removeEventListener(
        'visibilitychange',
        refreshTime
      );
    };
  }, []);

  function addTask() {
    setForm(emptyTask());
    setEditing(false);
    setModalOpen(true);
    setHandoffNotice('');
  }

  function editTask(task) {
    setForm({
      ...task,
      dueDate: task.dueDate || '',
      context: task.context ?? '',
      contextTool: task.contextTool ?? '',
      contextUpdatedAt: task.contextUpdatedAt ?? null,
    });

    setEditing(true);
    setModalOpen(true);
    setHandoffNotice('');
  }

  function updateField(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handOffTask(event) {
    setForm((previous) => ({
      ...previous,
      assignee: event.target.value,
    }));
  }

  // M9: Update timestamp whenever context changes
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
      id: editing ? form.id : crypto.randomUUID(),
      title: form.title.trim(),
      dueDate: form.dueDate || null,
    };

    if (editing) {
      setTasks((previous) =>
        previous.map((task) =>
          task.id === savedTask.id ? savedTask : task
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

  return (
    <div
      className="min-h-screen p-6"
      style={{
        backgroundColor: '#F8FAFC',
        color: '#0F172A',
      }}
    >
      {/* Header */}
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            sagir's Vibecoding Project Tracker
          </h1>

          <p className="mt-1 text-sm text-slate-600">
            Team starter
          </p>
        </div>

        <button
          onClick={addTask}
          className="rounded-lg px-5 py-3 font-semibold text-white hover:opacity-90"
          style={{
            backgroundColor: '#0F766E',
          }}
        >
          + Add task
        </button>
      </header>

      {/* M7: Handoff notice */}
      {handoffNotice && (
        <div
          role="status"
          className="mb-5 flex items-center justify-between rounded-lg border border-teal-300 bg-teal-50 p-4 text-teal-900"
        >
          <span>✓ {handoffNotice}</span>

          <button
            onClick={() => setHandoffNotice('')}
            aria-label="Dismiss confirmation"
          >
            ×
          </button>
        </div>
      )}

      {/* M11: Anchor Board goes here */}

      {/* M4-M9: Kanban board */}
      <main className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {STAGES.map((stage) => {
          const stageTasks = tasks.filter(
            (task) => task.status === stage.id
          );

          return (
            <section
              key={stage.id}
              className="min-h-80 rounded-xl p-4"
              style={{
                backgroundColor: '#F1F5F9',
              }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  {stage.label}
                </h2>

                <span className="rounded-full bg-white px-3 py-1 text-xs">
                  {stageTasks.length}
                </span>
              </div>

              <div className="space-y-3">
                {stageTasks.length === 0 && (
                  <p className="text-sm text-slate-500">
                    No tasks here yet.
                  </p>
                )}

                {stageTasks.map((task) => {
                  const due = getDueState(task, today);
                  const dueStyle =
                    DUE_STYLES[due.state];

                  return (
                    <button
                      key={task.id}
                      onClick={() => editTask(task)}
                      className="block w-full rounded-xl border bg-white p-4 text-left shadow-sm transition hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                      style={{
                        borderColor: dueStyle.border,
                        borderLeftWidth: '5px',
                      }}
                    >
                      <div className="mb-3 flex items-start justify-between gap-2">
                        <h3 className="text-base font-semibold">
                          {task.title}
                        </h3>

                        <TaskTypeBadge type={task.type} />
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

                      {/* M9: AI context indicator */}
                      {task.context && (
                        <p className="mt-3 text-xs font-medium text-teal-700">
                          ✦ AI context saved
                          {task.contextTool
                            ? ` · ${task.contextTool}`
                            : ''}
                        </p>
                      )}

                      {/* M7: Task owner */}
                      <div className="mt-4 border-t border-slate-100 pt-3">
                        <OwnerBadge
                          name={task.assignee}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>

      {/* Create/Edit Task Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-modal-title"
            className="my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
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
                type="button"
                onClick={() => setModalOpen(false)}
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

              {/* M7: Handoff */}
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

              {/* M8: Deadline preview */}
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="mb-2 text-sm font-medium">
                  Deadline status
                </p>

                <DueBadge
                  task={form}
                  today={today}
                />
              </div>

              {/* M9: AI Context */}
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
                  Use Markdown headings to organise your notes.
                </p>

                <label className="block text-sm font-medium">
                  Context briefing (Markdown)
                  <textarea
                    name="context"
                    value={form.context}
                    onChange={updateContext}
                    rows={10}
                    placeholder={CONTEXT_TEMPLATE}
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 font-mono text-sm leading-relaxed focus:outline-teal-700"
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

                <p className="mt-2 text-xs text-slate-500">
                  Changes are stored when you click Save task.
                </p>
              </section>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
                {editing ? (
                  <button
                    type="button"
                    onClick={deleteTask}
                    className="rounded-lg bg-red-600 px-4 py-2 text-white"
                  >
                    Delete task
                  </button>
                ) : (
                  <span />
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-lg border px-4 py-2"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="rounded-lg px-4 py-2 text-white"
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
