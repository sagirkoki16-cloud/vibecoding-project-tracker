
import { useState, useEffect } from 'react';

// M4: Four Kanban stages
export const STAGES = [
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
];

// Replace with actual team names from PRD section 8
export const TEAM = ['Teammate A', 'Teammate B', 'Teammate C'];

// Persist data in the browser
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore localStorage errors
    }
  }, [key, value]);

  return [value, setValue];
}

// M4: Sample tasks
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

export default function App() {
  // M4: Store tasks persistently
  const [tasks, setTasks] = useLocalStorage(
    'vibetracker.tasks',
    initialTasks
  );

  // M5: CRUD modal will go here
  // const [editing, setEditing] = useState(null);

  // M11: Anchor Board will go here
  // const [anchors, setAnchors] = useLocalStorage(...);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Vibecoding Project Tracker
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Team starter
        </p>
      </header>

      {/* M11: Anchor Board will go here */}

      {/* M4: Kanban board */}
      <main className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {STAGES.map((stage) => {
          const stageTasks = tasks.filter(
            (task) => task.status === stage.id
          );

          return (
            <section
              key={stage.id}
              className="min-h-80 rounded-xl bg-slate-200/60 p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-slate-800">
                  {stage.label}
                </h2>
                <span className="rounded-full bg-white px-2 py-1 text-xs">
                  {stageTasks.length}
                </span>
              </div>

              <div className="space-y-3">
                {stageTasks.map((task) => (
                  <article
                    key={task.id}
                    className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <h3 className="font-semibold text-slate-900">
                      {task.title}
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      {task.description}
                    </p>

                    <div className="mt-4 text-xs text-slate-600">
                      Assigned to: {task.assignee}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
