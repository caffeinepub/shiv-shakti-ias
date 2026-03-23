# Shiv Shakti IAS

## Current State
Full EdTech platform with 9 pages. Educators can create courses but have no interface to conduct live classes.

## Requested Changes (Diff)

### Add
- New /educator/classroom page: Educator Classroom for hosting live class sessions
  - Session panel: start/end session with timer, class title, notes board
  - Live Q&A feed: student doubts, educator can answer inline
  - Class schedule sidebar: upcoming classes
  - Schedule new class modal

### Modify
- EducatorPanel: add Conduct Live Class button
- App.tsx: add classroom route

### Remove
- Nothing

## Implementation Plan
1. Create EducatorClassroom.tsx
2. Add route in App.tsx
3. Add button in EducatorPanel.tsx
