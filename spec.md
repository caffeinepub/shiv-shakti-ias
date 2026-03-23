# Shiv Shakti IAS

## Current State
- Educator Classroom at `/educator/classroom` supports live session timer, whiteboard notes, Q&A, and scheduling.
- No screen sharing or recording functionality exists.
- Students have no way to access past class recordings.

## Requested Changes (Diff)

### Add
- Screen share button in Educator Classroom: uses browser `getDisplayMedia()` API to share screen (PPT/slides) during live session. Preview shown in classroom UI.
- Record button: uses `MediaRecorder` API to record the screen share stream. Starts/stops with session or manually.
- On session end: recorded video blob is uploaded to blob-storage and saved. Recording metadata (title, date, duration) is stored in backend.
- New `/recordings` page for students: lists all past recordings with title, date, duration, and a play button.
- Recordings playback in-page via HTML5 video player.
- Add "Recordings" link in navbar and student dashboard.

### Modify
- `EducatorClassroom.tsx`: add screen share preview panel, record indicator, and upload-on-end flow.
- `App.tsx`: add `/recordings` route.
- `Navbar.tsx` or student nav: add Recordings link.
- Backend: add recording metadata storage (title, date, duration, blobId).

### Remove
- Nothing removed.

## Implementation Plan
1. Select `blob-storage` component.
2. Generate Motoko backend with recording metadata CRUD (store title, date, duration, blobId; list recordings).
3. Update `EducatorClassroom.tsx`: screen share via `getDisplayMedia`, record via `MediaRecorder`, upload blob on session end.
4. Create `Recordings.tsx` page: fetch recording list, display cards with video player.
5. Add `/recordings` route in `App.tsx`.
6. Add Recordings link in Navbar.
