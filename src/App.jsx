import { useEffect, useMemo, useRef, useState } from 'react';
import CodeEditor from './components/CodeEditor.jsx';
import ConsolePanel from './components/ConsolePanel.jsx';
import LessonRoadmap from './components/LessonRoadmap.jsx';
import PdfPreview from './components/PdfPreview.jsx';
import { lessons } from './lessons/basicLessons.js';
import { createPdfUrl } from './pdf/createPdfUrl.js';
import { runLessonCode } from './pdf/runLessonCode.js';

const initialLesson = lessons[0];

function App() {
  const [viewMode, setViewMode] = useState('course-map');
  const [roadmapRailMode, setRoadmapRailMode] = useState('compact');
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [code, setCode] = useState('');
  const [pdfUrl, setPdfUrl] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [isEditorExpanded, setIsEditorExpanded] = useState(false);
  const [consoleEntry, setConsoleEntry] = useState({
    type: 'info',
    message: 'Choose a lesson, edit the code, then run it.',
  });
  const pdfUrlRef = useRef(null);

  const selectedLesson = useMemo(
    () => lessons.find((lesson) => lesson.id === selectedLessonId) ?? initialLesson,
    [selectedLessonId],
  );

  useEffect(() => {
    return () => {
      if (pdfUrlRef.current) {
        URL.revokeObjectURL(pdfUrlRef.current);
      }
    };
  }, []);

  function handleSelectLesson(lessonId) {
    const nextLesson = lessons.find((lesson) => lesson.id === lessonId);

    if (!nextLesson) {
      return;
    }

    setSelectedLessonId(nextLesson.id);
    setCode(nextLesson.starterCode);
    setConsoleEntry({
      type: 'info',
      message: 'Ready to generate this lesson. Press Run to update the PDF preview.',
    });
    setIsEditorExpanded(false);
    setRoadmapRailMode('compact');
    setViewMode('lesson');
  }

  function handleResetLesson() {
    setCode(selectedLesson.starterCode);
  }

  function handleExpandMap() {
    setIsEditorExpanded(false);
    setViewMode('course-map');
  }

  function handleAdvanceRoadmap() {
    if (roadmapRailMode === 'compact') {
      setRoadmapRailMode('rail');
      return;
    }

    handleExpandMap();
  }

  function handleRunLesson() {
    try {
      const doc = runLessonCode(code);
      const nextPdfUrl = createPdfUrl(doc);

      if (pdfUrlRef.current) {
        URL.revokeObjectURL(pdfUrlRef.current);
      }

      pdfUrlRef.current = nextPdfUrl;
      setPdfUrl(nextPdfUrl);
      setLastDoc(doc);
      setConsoleEntry({
        type: 'success',
        message: 'Generated PDF successfully',
      });
    } catch (error) {
      console.error(error);
      setConsoleEntry({
        type: 'error',
        message: error instanceof Error ? error.message : 'Could not generate PDF.',
      });
    }
  }

  function handleDownloadPdf() {
    if (!lastDoc) {
      setConsoleEntry({
        type: 'error',
        message: 'Run the lesson before downloading a PDF.',
      });
      return;
    }

    try {
      lastDoc.save('lesson-output.pdf');
      setConsoleEntry({
        type: 'success',
        message: 'Downloaded lesson-output.pdf',
      });
    } catch (error) {
      console.error(error);
      setConsoleEntry({
        type: 'error',
        message: error instanceof Error ? error.message : 'Could not download the PDF.',
      });
    }
  }

  const selectedLessonTypeLabel =
    selectedLesson.type === 'checkpoint' ? 'Checkpoint' : `Lesson ${selectedLesson.order}`;
  const editorHeight = isEditorExpanded ? 'min(68vh, 760px)' : '360px';

  const appShellClassName = [
    'appShell',
    viewMode === 'lesson' ? 'isLessonMode' : 'isCourseMapMode',
    viewMode === 'lesson' && roadmapRailMode === 'compact' ? 'isRoadmapCompact' : '',
    viewMode === 'lesson' && roadmapRailMode === 'rail' ? 'isRoadmapRailOpen' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <main className={appShellClassName}>
      <LessonRoadmap
        lessons={lessons}
        selectedLessonId={selectedLessonId}
        viewMode={viewMode}
        railMode={roadmapRailMode}
        onSelectLesson={handleSelectLesson}
        onAdvanceRoadmap={handleAdvanceRoadmap}
      />

      <div
        className="workspaceShell"
        aria-hidden={viewMode !== 'lesson'}
        inert={viewMode !== 'lesson' ? true : undefined}
      >
        <section
          className={`lessonPane ${isEditorExpanded ? 'isEditorExpanded' : ''}`}
          aria-labelledby="lesson-title"
        >
          <div className="lessonHeader">
            <p className="eyebrow">
              {selectedLesson.phase} / {selectedLessonTypeLabel}
            </p>
            <h2 id="lesson-title">{selectedLesson.title}</h2>
          </div>

          <div className="lessonDetails">
            <section className="lessonInfoBlock">
              <h3>Goal</h3>
              <p>{selectedLesson.goal}</p>
            </section>

            <section className="lessonInfoBlock">
              <h3>Explanation</h3>
              <p>{selectedLesson.explanation}</p>
            </section>

            <section className="lessonInfoBlock">
              <h3>Concepts</h3>
              <ul className="conceptList">
                {selectedLesson.concepts.map((concept) => (
                  <li key={concept}>{concept}</li>
                ))}
              </ul>
            </section>

            <section className="lessonInfoBlock">
              <h3>{selectedLesson.type === 'checkpoint' ? 'Challenge' : 'Mini Task'}</h3>
              {selectedLesson.challenge ? (
                <div className="challengeBlock">
                  <p>{selectedLesson.challenge.prompt}</p>
                  <ul className="taskList">
                    {selectedLesson.challenge.requirements.map((requirement) => (
                      <li key={requirement}>{requirement}</li>
                    ))}
                  </ul>
                  <p className="checklistTitle">Self-check</p>
                  <ul className="taskList checklist">
                    {selectedLesson.challenge.checklist.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>{selectedLesson.miniTask}</p>
              )}
            </section>

            <p className="visualPlaceholder">Visual helper: {selectedLesson.visualKind}</p>
          </div>

          <div className="editorHeader">
            <p className="editorLabel">Code</p>
            <button
              type="button"
              className="editorToggleButton"
              aria-controls="lesson-code-editor"
              aria-expanded={isEditorExpanded}
              onClick={() => setIsEditorExpanded((current) => !current)}
            >
              {isEditorExpanded ? 'Collapse' : 'Expand'}
            </button>
          </div>
          <CodeEditor
            id="lesson-code-editor"
            value={code}
            onChange={setCode}
            height={editorHeight}
          />

          <div className="actionBar" aria-label="Lesson actions">
            <button type="button" onClick={handleRunLesson}>
              Run
            </button>
            <button type="button" className="secondaryButton" onClick={handleResetLesson}>
              Reset
            </button>
            <button
              type="button"
              className="secondaryButton"
              onClick={handleDownloadPdf}
              disabled={!lastDoc}
            >
              Download
            </button>
          </div>

          <ConsolePanel entry={consoleEntry} />
        </section>

        <section className="previewPane" aria-labelledby="preview-title">
          <div className="previewHeader">
            <p className="eyebrow">Preview</p>
            <h2 id="preview-title">PDF output</h2>
          </div>
          <PdfPreview pdfUrl={pdfUrl} />
        </section>
      </div>
    </main>
  );
}

export default App;
