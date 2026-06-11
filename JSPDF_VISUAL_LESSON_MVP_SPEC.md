# jsPDF Visual Lesson Playground MVP Spec

## Goal

Create a visual-first learning playground for jsPDF. This is not a PDF builder. Learners read a short lesson, edit sample code, press Run, and see a PDF preview generated from jsPDF.

## Initial Scope

- React + Vite + JavaScript only.
- Course map first screen, then a two-pane lesson workspace.
- Left pane: lesson title, explanation placeholder, code editor placeholder, and Run / Reset / Download buttons.
- Right pane: PDF preview placeholder.
- Use an iframe preview from a Blob URL in a later patch.
- Roadmap rail remains visible after selecting a lesson.

## Out of Scope for Patch 1

- No real PDF generation yet.
- No CodeMirror integration yet.
- No backend.
- No TypeScript.
- No PDF.js.
- No AutoTable.
- No complex lesson runner.

## Planned Folder Structure

- `src/components`: reusable UI panels and controls.
- `src/lessons`: lesson definitions and starter code.
- `src/pdf`: future jsPDF runner and Blob URL helpers.
- `src/visuals`: preview and visual teaching helpers.

## Acceptance for Patch 1

- `npm install` completes.
- `npm run dev` starts a Vite dev server.
- Opening the app shows a left lesson/code pane and a right preview pane.
- The app has no backend and no TypeScript files.

## Acceptance for Patch 2

- Opening the app shows a full-page course map.
- Selecting a lesson changes `viewMode` to `lesson` without route navigation.
- The roadmap becomes a compact side rail while the lesson workspace and preview appear.
- The compact side rail shows lesson numbers only, with an icon-only expand control.
- The compact rail can expand to a wider rail, then expand again to the full course map.
- Selecting another lesson from the rail updates the lesson text and starter code.
- The side rail can expand back into the full course map without navigation.

## Acceptance for Patch 3

- Lesson code defines `function generate()` and uses injected `jsPDF`.
- Lesson code can use injected `registerThaiFont(doc)` and `PDF_FONTS` for the bundled Thai font.
- Pressing Run executes the current lesson code and renders a PDF Blob URL in an iframe.
- Syntax or return-value errors appear in the console panel without crashing the page.
- The last successful PDF remains visible after a failed run.
- Download saves the last generated document as `lesson-output.pdf`.
- No backend, TypeScript, PDF.js, AutoTable, async runner, or import-statement support.

## Acceptance for Patch 4

- Lesson code is edited in a CodeMirror JavaScript editor.
- CodeMirror has its own vertical and horizontal scrolling area.
- The code editor can be expanded and collapsed from the lesson pane.
- Editing code updates the same state used by Run and Reset.
- Switching lessons replaces the editor content with the selected lesson starter code.
- Run errors still appear in the console panel without crashing the page.

## Acceptance for Patch 5

- The roadmap shows 9 basic lessons plus Checkpoint 1.
- Lesson data includes phase, type, goal, concepts, visualKind, and task/challenge fields.
- Selecting each item updates lesson title, explanation, concepts, and starter code.
- The lesson set includes both array mapping and single JSON-style object mapping examples.
- Thai Font uses the bundled `pdf_font.js` TH Sarabun New data instead of a placeholder.
- Checkpoint 1 shows an applied challenge with self-check checklist.
- Course map, roadmap rail, lesson content, and code editor can scroll when content exceeds the viewport.
- No backend, TypeScript, AutoTable, locking, progress persistence, or auto grading.
