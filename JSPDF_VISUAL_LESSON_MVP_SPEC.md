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
- The lesson set includes object/array data mapping and basic text wrapping examples.
- Thai Font uses the bundled `pdf_font.js` TH Sarabun New data instead of a placeholder.
- Checkpoint 1 shows an applied challenge with self-check checklist.
- Course map, roadmap rail, lesson content, and code editor can scroll when content exceeds the viewport.
- No backend, TypeScript, AutoTable, locking, progress persistence, or auto grading.

## Acceptance for Patch 6A

- Lesson 1 introduces jsPDF page setup with `unit`, `format`, and `orientation`.
- Lesson 1 explains A4 and A3 landscape sizes in millimeters.
- Lesson 1 includes a practice prompt for changing the starter code to A3 landscape.
- Lesson 1 includes an automatic completion checklist that updates after pressing Run.
- Lesson 1 checklist checks concrete output/code conditions: mm unit, A3 format, landscape orientation, and successful preview generation.
- Text positioning and centered text checks belong to Lesson 2.
- Checklist progress is persisted in `localStorage`.
- Run count is tracked per lesson and persisted in `localStorage`.
- Run count stops increasing after that lesson's checklist is complete.
- A roadmap lesson changes from its number to a check mark when all checklist items are complete.
- Selecting another lesson clears the generated preview and last downloadable document for the workspace.
- No checkpoint locking yet.

## Acceptance for Patch 6B

- Lesson 2 teaches x/y coordinates from the top-left page origin.
- Lesson 2 explains that A4 portrait width is about 210 mm, so x = 105 is the center line.
- Lesson 2 practice asks learners to place `Left`, `Center`, and `Right` text.
- Lesson 2 checklist auto-checks left text position, center text position, center alignment, right text position, right alignment, and successful preview generation.
- Lesson 2 progress uses the same `localStorage` checklist and run count system.
- No visual X/Y overlay or deep PDF parsing yet.

## Acceptance for Patch 6C

- Lesson 3 is `Line / Rect`.
- Lesson 4 is `Text Style`.
- Lesson 3/4 are only reordered in this patch; detailed lesson goals and auto-check rules are designed later.

## Acceptance for Patch 6D

- Lesson 3 teaches that `rect(x, y, width, height)` uses a start point plus size.
- Lesson 3 teaches that `line(x1, y1, x2, y2)` uses a start point and an end point.
- Lesson 3 practice asks learners to draw one centered rectangle and two diagonal lines that form an X inside it.
- Lesson 3 checklist auto-checks the rect call, centered rect size, both diagonal line directions, at least two line calls, and successful preview generation.
- Lesson 3 progress uses the same `localStorage` checklist and run count system.
- Lessons 1-3 starter code avoids style APIs such as `setFontSize()`, `setDrawColor()`, and `setLineWidth()` before Lesson 4 introduces styling.
- No visual geometry overlay or deep PDF parsing yet.

## Acceptance for Patch 6E

- Lesson 4 is renamed from `Text Style` to `Style`.
- Lesson 4 teaches text size, text color, draw color, fill color, line color, border color, and filled rectangle style mode.
- Lesson 4 explains that style calls affect the drawing/text commands that follow them.
- Lesson 4 explains that `rect(..., 'FD')` means fill plus draw, and that an incorrect style mode can make fill or border output look wrong.
- Lesson 4 encourages storing layout values in variables such as `cardX`, `cardY`, `cardWidth`, and `cardHeight` so related `rect`, `line`, and `text` calls stay readable.
- Lesson 4 practice asks learners to build a simple status card with a filled box, border, divider line, text colors, and two font sizes.
- Lesson 4 checklist auto-checks card variables, at least two `setFontSize()` calls, `setTextColor()`, `setFillColor()`, `setDrawColor()`, `rect(..., 'FD')` or `rect(..., 'DF')`, a divider `doc.line()`, and successful preview generation.
- No strict ordering analysis for style calls yet.

## Acceptance for Patch 6F

- Lesson 5 teaches adding an image from a prepared path instead of building a canvas in starter code.
- The app includes a sample image asset at `/images/lesson-image-sample.svg`.
- Lesson code can call injected `getLessonImage(path)` to get image data that `doc.addImage()` can use.
- The runner preloads lesson image paths before executing lesson code.
- Lesson 5 starter code uses `imagePath`, `getLessonImage(imagePath)`, and `doc.addImage(imageData, 'PNG', x, y, width, height)`.
- Lesson 5 checklist auto-checks the image path variable, `getLessonImage(imagePath)`, `doc.addImage()`, explicit image width/height, and successful preview generation.
- User lesson code still does not need imports or async code.

## Acceptance for Patch 6G

- Lesson 6 teaches that PDF fonts are not available just by naming a font family.
- Lesson 6 explains that a TTF font file or prepared font data is needed before jsPDF can embed the font.
- Lesson 6 explains that `registerThaiFont(doc)` wraps the font registration work such as `addFileToVFS()` and `addFont()`.
- Lesson 6 explains that `PDF_FONTS.thai` stores the registered font family, file name, and style.
- Lesson 6 teaches that this project currently has one Thai font style, `normal`; other styles such as bold or italic would need their own font data.
- Lesson 6 warns that a font must contain glyphs for the language being rendered.
- Lesson 6 checklist auto-checks `registerThaiFont(doc)`, `PDF_FONTS.thai`, `doc.setFont()`, Thai text in `doc.text()`, `normal` style usage, and successful preview generation.
- User lesson code still does not need imports or raw font conversion steps.

## Acceptance for Patch 6H

- Lesson 7 is renamed to `Data Mapping`.
- Lesson 7 combines single-record object mapping and array row mapping in one lesson.
- Lesson 7 starter code uses a `project` object and a `milestones` array.
- Lesson 7 teaches mapping object properties into fixed labels and values.
- Lesson 7 teaches looping over an array and using `index` to calculate each row's y position.
- Lesson 7 checklist auto-checks the `project` object, `milestones` array, project property usage, array iteration, index-based y position, and successful preview generation.
- Lesson 8 is changed from JSON object mapping to `Text Wrap`.
- Lesson 8 teaches basic wrapping with `doc.splitTextToSize(project.summary, maxWidth)`.
- Lesson 8 starter code stores the wrapped lines in `wrappedSummary` and passes that array to `doc.text()`.
- Lesson 8 checklist auto-checks long summary data, `maxWidth`, `splitTextToSize()`, `wrappedSummary`, wrapped text rendering, and successful preview generation.
- No automatic page-break, overflow-height, or multi-page layout handling yet.

## Acceptance for Patch 6I

- Lesson 9 stays `Basic One-page Layout`.
- Lesson 9 acts as the pre-checkpoint composition lesson rather than introducing many new jsPDF APIs.
- Lesson 9 teaches dividing one page into header, project info, summary, milestones/status, and footer sections.
- Lesson 9 starter code uses layout variables such as `pageMargin`, `contentWidth`, `headerY`, `sectionGap`, and `footerY`.
- Lesson 9 starter code uses a `project` object, multiple `doc.rect()` section boxes, `doc.line()` dividers, wrapped summary text, and a footer near the bottom of the page.
- Lesson 9 practice asks learners to build a one-page Project Brief PDF.
- Lesson 9 checklist auto-checks `pageMargin`, `contentWidth`, at least two section boxes, a divider line, `doc.splitTextToSize()` for `project.summary`, project data usage, footer placement near the page bottom, and successful preview generation.
- No automatic layout solver, page-break handling, or visual overflow detection yet.

## Acceptance for Patch 6J

- Checkpoint 1 can be opened before it is unlocked, but its challenge brief, blueprint, checklist, starter code, and Run controls are hidden.
- Checkpoint 1 unlocks only after lessons 1-9 have complete automatic checklists in persisted progress.
- Locked Checkpoint 1 shows a blurred/skeleton challenge preview and a progress message such as `8/9 lessons complete`.
- Once unlocked, Checkpoint 1 reveals a broad project-summary challenge plus an expected document blueprint.
- The checkpoint blueprint describes header, info card, image cue, wrapped summary, status/milestones, and footer sections.
- The checkpoint blueprint gives expected placement zones for the header, info card, image, summary card, status card, and footer.
- The current checkpoint level uses a markdown-style ASCII layout sketch as the visual target.
- A real reference PDF target is deferred to a later level.
- Checkpoint 1 includes a design contract that constrains typography and colors: title 22pt, section headings 18pt, body text 16pt, primary text `#111827`, muted body text `#475569`, accent line `#2457d6`, card border `#cbd5e1`, and card fill `#f8fafc`.
- Checkpoint starter code provides a `project` data object with `project.imagePath` plus prepared `imageData`, but does not complete the whole challenge for the learner.
- Checkpoint checklist auto-checks blueprint evidence in learner-facing priority order: project object, explicit font setup with `doc.setFont()`, header/divider zone, title/heading/body font sizes, required contract colors, info/summary/status section stack, divider line, image placement in the info-card zone with `getLessonImage(project.imagePath)` and `doc.addImage()`, wrapped summary, required project fields including `project.imagePath`, footer placement, and successful preview generation.
- Checkpoint grading remains pattern-based and does not require pixel-perfect output matching.

## Acceptance for Patch 6K

- Scope is Checkpoint 1 only; normal lesson checklist items in lessons 1-9 do not get this hint ladder yet.
- Checkpoint checklist items should have learner hints, but hints must be tied to the checklist id rather than shown as generic help text.
- Every Checkpoint 1 `completionChecklist` item must have all 3 hint levels before the hint UI is considered complete.
- Hint level 1 is a light clue: point the learner back to the relevant part of the Expected blueprint or design contract.
- Hint level 2 explains the expected approach: describe the zone, data field, API, or document structure that should be used.
- Hint level 3 explains what the checker is looking for in learner-friendly language without exposing evaluator source code or giving the whole solution.
- Hints should advance based on repeated times the same checklist item is actively shown as a hint after Run, not only total runs for the lesson.
- Hidden incomplete checklist items must not accumulate hint levels while another earlier checklist item is being hinted.
- A checklist item that has never been shown as a hint must start at hint level 1, then advance to level 2 and level 3 on later active hint appearances.
- Hint progress counts are stored per checkpoint checklist item in persisted progress.
- Passed checklist items should not show hints.
- The UI should show a small helper icon beside incomplete checklist items, not a large warning state.
- Desktop can reveal the hint with hover/focus.
- Mobile or keyboard users must be able to open the same hint inline or with an accessible interaction.
- The app should highlight only the first 1-2 incomplete checklist items after each Run to avoid overwhelming the learner.
- Syntax/runtime errors should take priority over checklist hints until the code can run.
- The hint system should remain advisory and should not change checklist pass/fail logic.
- No AI hint generation in this patch; hints are authored content.
- No full answer reveal in this patch.
