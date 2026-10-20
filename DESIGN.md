# Vibecoding Project Tracker — Design System

## 1. Mood

A calm, organised workspace that makes tasks, deadlines and AI
context easy to understand at a glance.

## 2. Colours

### Brand and surfaces

| Token | Hex | Purpose |
|---|---|---|
| brand | #0F766E | Primary buttons, selected controls and links |
| brandHover | #115E59 | Primary button hover state |
| background | #F8FAFC | Main page background |
| surface | #FFFFFF | Task cards and modal backgrounds |
| surfaceMuted | #F1F5F9 | Kanban column backgrounds |
| border | #CBD5E1 | Card borders and form outlines |
| textPrimary | #0F172A | Headings and main text |
| textSecondary | #475569 | Supporting text and field hints |

Primary buttons use white text on the brand colour.

### Task types

| Token | Hex | Purpose |
|---|---|---|
| feature | #1D4ED8 | Feature label and icon |
| featureSurface | #DBEAFE | Feature badge background |
| bug | #BE123C | Bug label and icon |
| bugSurface | #FFE4E6 | Bug badge background |

Feature tasks display a plus icon and the word “Feature”.
Bug tasks display a bug icon and the word “Bug”.
Task type must remain recognisable without colour.

### Four due-date states

| State | Text/accent token | Hex | Background token | Hex |
|---|---|---|---|---|
| Calm | dueCalm | #334155 | dueCalmSurface | #F1F5F9 |
| Warning | dueWarning | #92400E | dueWarningSurface | #FEF3C7 |
| Overdue | dueOverdue | #991B1B | dueOverdueSurface | #FEE2E2 |
| Done / neutral | dueNeutral | #475569 | dueNeutralSurface | #E2E8F0 |

- Future deadlines use calm styling and display the due date.
- Tasks due today use warning styling and “Due today”.
- Unfinished tasks with past deadlines use overdue styling.
- Completed tasks use neutral styling and “Completed”.
- Tasks without a deadline use neutral styling and “No due date”.

Use deadline colours on a badge and card accent border.
Keep task-type colours within the type badge to avoid confusion.

## 3. Typography

| Role | Font stack | Size and weight |
|---|---|---|
| Page heading | system-ui, Segoe UI, sans-serif | 28px, bold |
| Column heading | system-ui, Segoe UI, sans-serif | 18px, semibold |
| Card title | system-ui, Segoe UI, sans-serif | 16px, semibold |
| Body and forms | system-ui, Segoe UI, sans-serif | 16px, regular |
| Metadata | system-ui, Segoe UI, sans-serif | 14px, regular |
| AI context | ui-monospace, Consolas, monospace | 14px, regular |

Use a line height of approximately 1.5.
Use system fonts so the interface needs no external font download.

## 4. Component Principles

Use four equally sized Kanban columns, with deliverable links above
the board and consistent spacing based on multiples of 4px.

Cards use white backgrounds, 12px rounded corners, subtle borders
and 16px padding, with the title first and secondary details below.

Task forms use clearly labelled fields, visible Save and Cancel
buttons, and inline validation that preserves the user's input.

All interactive controls support keyboard use and visible focus;
modals keep focus inside while open and return it to the trigger
when closed.

## 5. Microcopy

| Situation | Text |
|---|---|
| Add button | Add task |
| New task heading | Create a task |
| Edit heading | Edit task |
| Save button | Save task |
| Cancel button | Cancel |
| Missing title | Enter a task title. |
| Empty column | No tasks here yet. |
| Context label | AI context |
| Context hint | Record your prompt, outcome and next step. |
| AI tool label | AI tool used |
| Copy button | Copy Context |
| Copy success | Context copied. Ready to paste. |
| Copy failure | Couldn't copy. Select and copy the text manually. |
| Delete confirmation | Delete this task? This cannot be undone. |
| Delete action | Delete task |
| Missing deliverable | Add a link |
| Invalid link | Enter a full link starting with https:// or http://. |
| Storage failure | Changes couldn't be saved. Keep this page open and try again. |