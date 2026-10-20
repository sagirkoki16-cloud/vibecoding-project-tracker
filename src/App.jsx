
import { useState, useEffect } from 'react';

// M4: Board stages
export const STAGES = [
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
];

// Replace with actual names from PRD section 8
export const TEAM = [
  'Teammate A',
  'Teammate B',
  'Teammate C',
];

// M6: Official task colours from DESIGN.md
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

// M6: Reusable task-type badge
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

// Persistent browser storage
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
      console.error('Unable to save data');
    }
  }, [key, value]);

  return [value, setValue];
}

// M4: Initial sample tasks
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

// Blank task form
function emptyTask() {
  return {
    id: '',
    title: '',
    description: '',
    type: 'feature',
    status: 'todo',
    assignee: TEAM[0],
    dueDate: '',
    createdDate: new Date().toLocaleDateString('en-CA'),
  };
}

export default function App() {
  const [tasks, setTasks] = useLocalStorage(
    'vibetracker.tasks',
    initialTasks
  );

  // M5: Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(emptyTask);

  // Create task
  function addTask() {
    setForm(emptyTask());
    setEditing(false);
    setModalOpen(true);
  }

  // Edit existing task
  function editTask(task) {
    setForm({
      ...task,
      dueDate: task.dueDate || '',
    });
    setEditing(true);
    setModalOpen(true);
  }

  // Update form
  function updateField(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // Save task
  function saveTask(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      alert('Enter a task title.');
      return;
    }

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

    setModalOpen(false);
  }

  // Delete task
  function deleteTask() {
    if (!editing) return;

    if (
      window.confirm(
        'Delete this task? This cannot be undone.'
      )
    ) {
      setTasks((previous) =>
        previous.filter((task) => task.id !== form.id)
      );

      setModalOpen(false);
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

      {/* M11: Anchor Board goes here */}

      {/* M4 + M6: Kanban Board */}
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

                {stageTasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => editTask(task)}
                    className="block w-full rounded-xl border bg-white p-4 text-left shadow-sm transition hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                    style={{ borderColor: '#CBD5E1' }}
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

                    <p className="mt-4 text-sm text-slate-600">
                      Assigned to: {task.assignee}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* M5 + M6: Task Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-modal-title"
            className="my-auto w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
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
                className="text-2xl text-slate-500 hover:text-red-600"
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
                  placeholder="Describe the task"
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

              <label className="block text-sm font-medium">
                Assigned To
                <select
                  name="assignee"
                  value={form.assignee}
                  onChange={updateField}
                  className="mt-1 w-full rounded-lg border p-3"
                >
                  {TEAM.map((member) => (
                    <option key={member} value={member}>
                      {member}
                    </option>
                  ))}
                </select>
              </label>

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
                    onClick={() => setModalOpen(false)}
                    className="rounded-lg border px-4 py-2"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="rounded-lg px-4 py-2 text-white hover:opacity-90"
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
