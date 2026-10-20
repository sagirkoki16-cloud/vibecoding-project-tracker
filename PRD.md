# Vibecoding Project Tracker — Product Requirements

A personal web application for managing vibecoding tasks from initial
intent to completion, while preserving the prompts, AI tools and
outcomes associated with each task.

## 1. Functional Requirements

FR01 — View tasks
The application shall display tasks on a Kanban board with four
columns: To Do, In Progress, Review and Done.

FR02 — Add tasks
The user shall be able to create a task with a title, description,
task type and optional due date.

FR03 — Edit tasks
The user shall be able to open an existing task and update its details.

FR04 — Move and complete tasks
The user shall be able to change a task's status using a dropdown
to move it between columns. Selecting Done shall mark it as completed.

FR05 — Delete tasks
The user shall be able to delete a task after confirming the action.
Cancelling the confirmation shall leave the task unchanged.

FR06 — Identify task types
The application shall distinguish feature tasks from bug tasks
using clear labels and different visual styles.

FR07 — Store AI work
The user shall be able to record and edit a task's prompt, outcomes,
relevant constraints and next steps in a Context field, and select
the AI tool used. The application shall display when the context
was last updated.

FR08 — Reuse AI context
The user shall be able to copy a task's title, description, AI tool
and complete context, including recorded prompts, outcomes and next
steps, as formatted text for use in another AI chat. A Copy Context
button shall appear on each card and inside the task form.

FR09 — Identify deadlines
The application shall indicate unfinished tasks that are due today
or overdue. Tasks due after today shall use calm styling. Completed
tasks and tasks without a due date shall use neutral styling.

FR10 — Save progress
The application shall save tasks and their AI information in
localStorage and restore them after a page reload.

FR11 — Link deliverables
The user shall be able to save, edit, clear and open links to the
project's presentation, demo, report and documentation above the
Kanban board. Each deliverable shall indicate whether a link is saved.

## 2. Non-functional Requirements

NFR01 — Usability
The interface shall use clear labels and consistent controls.
Adding or editing a task shall take place in one form with visible
Save and Cancel actions. Cancelling shall discard unsaved edits.

NFR02 — Accessibility
Essential controls shall be usable with a keyboard and have visible
focus indicators. Form fields shall have labels. Status and task
type shall not rely on colour alone.

NFR03 — Performance
As a proposed target, task changes shall appear within one second
when the board contains up to 100 tasks on the demonstration laptop.

NFR04 — Reliability
Saved changes shall survive closing and reopening the application
at the same site address in the same browser profile, provided its
storage has not been cleared. Storage and clipboard failures shall
display an error rather than a false success message.

NFR05 — Compatibility
The application shall work in desktop Chrome and Edge and remain
usable at a screen resolution of 1280 × 720.

NFR06 — Maintainability
The application shall use the supplied React, Vite and Tailwind
setup, with readable components and consistent naming. It shall
retain the starter's Task and Anchor data structures.

NFR07 — Data handling
The application shall store project data locally without requiring
an account or backend. It shall not automatically send prompts to
AI services or synchronise data between devices.

NFR08 — Deployment
The application shall be deployable on Vercel over HTTPS. The
deployed version shall support the complete task-management and
Copy Context demonstration without blocking errors.

## 3. Data Requirements

DR01 — Task information
Each task shall retain the starter fields:
id, title, description, type, status, assignee, dueDate,
createdDate, context, contextTool and contextUpdatedAt.

Task IDs shall be unique and unchanged during editing. Creation
dates shall be generated automatically. For this individual version,
assignee shall default to Sagir Koki; teammate reassignment is
outside the current scope.

DR02 — AI information
Prompts, outcomes, constraints and next steps shall be stored as
labelled sections within the existing context field. The selected
AI tool shall be stored in contextTool. Separate prompt and outcome
fields are not required.

Context may remain empty until work has been performed.
contextUpdatedAt shall record an ISO timestamp when context is
first saved or changed, and remain null until then.

DR03 — Validation
Task titles shall not be blank or contain only whitespace.
Task type shall be feature or bug.
Status shall be todo, in-progress, review or done.
Due dates shall be valid calendar dates in YYYY-MM-DD format,
or null when unset.

contextTool shall be Claude, ChatGPT, Cursor, Lovable, Replit,
Other, or null when no tool is selected.

DR04 — Deliverable information
Each deliverable shall retain the fields id, label and url.
The four IDs shall be presentation, demo, report and documentation.
Each URL shall be an absolute HTTP or HTTPS address, or null
when unset.

DR05 — Persistence
Tasks and deliverable links shall be stored as JSON in localStorage.
Saved edits, status changes and deletions shall survive reload.
A saved empty board shall remain empty rather than being repopulated
automatically.

DR06 — Date handling
Deadline comparisons shall use the user's local calendar date.
An unfinished task is overdue when its due date is before today,
and due today when the dates match. Deadline indicators shall
refresh when the application opens, regains focus or passes midnight.