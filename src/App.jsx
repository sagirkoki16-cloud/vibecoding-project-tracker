
import { useState, useEffect } from 'react';

// M4: Board stages
export const STAGES = [
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
];

// Replace with your actual PRD team names
export const TEAM = [
  'Teammate A',
  'Teammate B',
  'Teammate C',
];

// M6: Task type styles
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

// M8: Deadline colours from DESIGN.md
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

// Local date formatted as YYYY-MM-DD
function localDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

// M8: Calculate deadline status
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

// M8: Deadline badge
function DueBadge({ task, today }) {
  const due = getDueState(task, today);
  const style = DUE_STYLES[due.state];

  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
      style={{
        color: style.color,
        backgroundColor: style.background,
      }}
    >
      {due.label}
    </span>
  );
}

// M7: Owner initials
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
      >
        {getInitials(name)}
      </span>

      <span className="text-sm font-medium text-slate-700">
        {name || 'Unassigned'}
      </span>
    </span>
  );
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
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.error("Changes couldn't be saved.");
    }
  }, [key, value]);

  return [value, setValue];
}

// M4: Initial tasks
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

  // M8: Update deadline colours automatically
  const [today, setToday] = useState(() => localDate());

  useEffect(() => {
    const updateToday = () => setToday(localDate());

    const timer = window.setInterval(updateToday, 60000);

    window.addEventListener('focus', updateToday);
    document.addEventListener('visibilitychange', updateToday);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', updateToday);
      document.removeEventListener('visibilitychange', updateToday);
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
      setTasks((previous) => [...previous, savedTask]);
    }

    if (oldTask && oldTask.assignee !== savedTask.assignee) {
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

    if (window.confirm('Delete this task? This cannot be undone.')) {
      setTasks((previous) =>
        previous.filter((task) => task.id !== form.id)
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
          onClick={addTask}
          className="rounded-lg px-5 py-3 font-semibold text-white hover:opacity-90"
          style={{ backgroundColor: '#0F766E' }}
        >
          + Add task
        </button>
      </header>

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

      {/* M4-M8: Kanban board */}
      <main className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {STAGES.map((stage) => {
          const stageTasks = tasks.filter(
            (task) => task.status === stage.id
          );

          return (
            <section
              key={stage.id}
              className="min-h-80 rounded-xl p-4"
              style={{ backgroundColor: '#F1F5F9' }}
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
                  const dueStyle = DUE_STYLES[due.state];

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

                      {/* M8: Deadline badge */}
                      <div className="mt-3">
                        <DueBadge task={task} today={today} />
                      </div>

                      {/* M7: Task owner */}
                      <div className="mt-4 border-t border-slate-100 pt-3">
                        <OwnerBadge name={task.assignee} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-modal-title"
            className="my-auto max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <h2
                  id="task-modal-title"
                  className="text-xl font-bold"
                >
                  {editing ? 'Edit task' : 'Create a task'}
                </h2>

                <TaskTypeBadge type={form.type} />
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

            <form onSubmit={saveTask} className="space-y-4">
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
                  <option value="feature">Feature</option>
                  <option value="bug">Bug</option>
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
                    <option key={stage.id} value={stage.id}>
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

                <OwnerBadge name={form.assignee} />

                <label className="mt-4 block text-sm font-medium">
                  Hand off to...
                  <select
                    name="assignee"
                    value={form.assignee}
                    onChange={handOffTask}
                    className="mt-2 w-full rounded-lg border bg-white p-3"
                  >
                    {TEAM.map((member) => (
                      <option key={member} value={member}>
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

              {/* M8: Live deadline preview */}
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="mb-2 text-sm font-medium">
                  Deadline status
                </p>
                <DueBadge task={form} today={today} />
              </div>

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
                    style={{ backgroundColor: '#0F766E' }}
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
