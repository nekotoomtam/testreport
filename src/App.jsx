import { useEffect, useMemo, useRef, useState } from 'react';
import CodeEditor from './components/CodeEditor.jsx';
import ConsolePanel from './components/ConsolePanel.jsx';
import LessonRoadmap from './components/LessonRoadmap.jsx';
import PdfPreview from './components/PdfPreview.jsx';
import { lessons } from './lessons/basicLessons.js';
import { evaluateLessonChecklist } from './lessons/evaluateLessonChecklist.js';
import { createPdfUrl } from './pdf/createPdfUrl.js';
import { prepareLessonImageAssets } from './pdf/lessonImageAssets.js';
import { runLessonCode } from './pdf/runLessonCode.js';

const initialLesson = lessons[0];
const progressStorageKey = 'jspdf-visual-lessons-progress-v1';

function isRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function readStoredProgress() {
  const emptyProgress = {
    checklists: {},
    hintProgress: {},
    runCounts: {},
  };

  if (typeof window === 'undefined') {
    return emptyProgress;
  }

  try {
    const storedValue = window.localStorage.getItem(progressStorageKey);

    if (!storedValue) {
      return emptyProgress;
    }

    const parsedValue = JSON.parse(storedValue);

    return {
      checklists: isRecord(parsedValue?.checklists) ? parsedValue.checklists : {},
      hintProgress: isRecord(parsedValue?.hintProgress) ? parsedValue.hintProgress : {},
      runCounts: isRecord(parsedValue?.runCounts) ? parsedValue.runCounts : {},
    };
  } catch (error) {
    console.warn('Could not read stored lesson progress.', error);
    return emptyProgress;
  }
}

function mergeChecklistResults(previousResult, nextResult) {
  return Object.entries(nextResult).reduce(
    (mergedResult, [itemId, isComplete]) => ({
      ...mergedResult,
      [itemId]: Boolean(mergedResult[itemId] || isComplete),
    }),
    { ...previousResult },
  );
}

function isLessonChecklistComplete(lesson, checklistResult) {
  const items = lesson.completionChecklist ?? [];

  return items.length > 0 && items.every((item) => Boolean(checklistResult[item.id]));
}

function getNextRunCount(progress, lesson) {
  const currentRunCount = progress.runCounts[lesson.id] ?? 0;
  const checklistResult = progress.checklists[lesson.id] ?? {};

  return currentRunCount + (isLessonChecklistComplete(lesson, checklistResult) ? 0 : 1);
}

function getCheckpointPrerequisites(checkpointLesson) {
  if (checkpointLesson.type !== 'checkpoint') {
    return [];
  }

  return lessons.filter(
    (lesson) => lesson.type === 'lesson' && lesson.order < checkpointLesson.order,
  );
}

function hasCheckpointHintLadder(lesson) {
  return lesson.type === 'checkpoint';
}

function getHintLevel(hintProgress) {
  if (hintProgress >= 3) {
    return 3;
  }

  if (hintProgress >= 2) {
    return 2;
  }

  return 1;
}

function getChecklistHint(item, hintProgress) {
  const hintLevel = getHintLevel(hintProgress);

  return item.hints?.[hintLevel - 1] ?? null;
}

function getNextHintProgress(
  lesson,
  checklistItems,
  checklistResult,
  mergedChecklistResult,
  previousProgress,
  activeHintItemIds,
) {
  if (!hasCheckpointHintLadder(lesson)) {
    return previousProgress;
  }

  const activeHintItemIdSet = new Set(activeHintItemIds);

  return checklistItems.reduce((nextProgress, item) => {
    if (mergedChecklistResult[item.id]) {
      return {
        ...nextProgress,
        [item.id]: 0,
      };
    }

    if (!activeHintItemIdSet.has(item.id)) {
      return {
        ...nextProgress,
        [item.id]: previousProgress[item.id] ?? 0,
      };
    }

    return {
      ...nextProgress,
      [item.id]: (previousProgress[item.id] ?? 0) + (checklistResult[item.id] ? 0 : 1),
    };
  }, {});
}

function getActiveCheckpointHintIds(lesson, checklistItems, mergedChecklistResult) {
  if (!hasCheckpointHintLadder(lesson)) {
    return [];
  }

  return checklistItems
    .filter((item) => !mergedChecklistResult[item.id] && item.hints?.length === 3)
    .slice(0, 2)
    .map((item) => item.id);
}

function App() {
  const [viewMode, setViewMode] = useState('course-map');
  const [roadmapRailMode, setRoadmapRailMode] = useState('compact');
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [code, setCode] = useState('');
  const [pdfUrl, setPdfUrl] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [isEditorExpanded, setIsEditorExpanded] = useState(false);
  const [lessonProgress, setLessonProgress] = useState(() => readStoredProgress());
  const [activeHintItemIds, setActiveHintItemIds] = useState([]);
  const [consoleEntry, setConsoleEntry] = useState({
    type: 'info',
    message: 'Choose a lesson, edit the code, then run it.',
  });
  const pdfUrlRef = useRef(null);
  const lessonChecklistState = lessonProgress.checklists;
  const lessonRunCounts = lessonProgress.runCounts;

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

  useEffect(() => {
    try {
      window.localStorage.setItem(progressStorageKey, JSON.stringify(lessonProgress));
    } catch (error) {
      console.warn('Could not save lesson progress.', error);
    }
  }, [lessonProgress]);

  function clearGeneratedPreview() {
    if (pdfUrlRef.current) {
      URL.revokeObjectURL(pdfUrlRef.current);
      pdfUrlRef.current = null;
    }

    setPdfUrl(null);
    setLastDoc(null);
  }

  function handleSelectLesson(lessonId) {
    const nextLesson = lessons.find((lesson) => lesson.id === lessonId);

    if (!nextLesson) {
      return;
    }

    clearGeneratedPreview();
    setSelectedLessonId(nextLesson.id);
    setCode(nextLesson.starterCode);
    setConsoleEntry({
      type: 'info',
      message: 'Ready to generate this lesson. Press Run to update the PDF preview.',
    });
    setActiveHintItemIds([]);
    setIsEditorExpanded(false);
    setRoadmapRailMode('compact');
    setViewMode('lesson');
  }

  function handleResetLesson() {
    setCode(selectedLesson.starterCode);
    setActiveHintItemIds([]);
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

  async function handleRunLesson() {
    if (isCheckpointLocked) {
      setConsoleEntry({
        type: 'info',
        message: 'Complete lessons 1-9 before running this checkpoint.',
      });
      return;
    }

    try {
      const getLessonImage = await prepareLessonImageAssets(selectedLesson.imagePaths ?? []);
      const doc = runLessonCode(code, { getLessonImage });
      const nextPdfUrl = createPdfUrl(doc);

      if (pdfUrlRef.current) {
        URL.revokeObjectURL(pdfUrlRef.current);
      }

      pdfUrlRef.current = nextPdfUrl;
      setPdfUrl(nextPdfUrl);
      setLastDoc(doc);
      const checklistResult = evaluateLessonChecklist(selectedLesson, code, doc);
      const checklistItems = selectedLesson.completionChecklist ?? [];
      const previousChecklistResult = lessonChecklistState[selectedLesson.id] ?? {};
      const mergedChecklistResult = mergeChecklistResults(previousChecklistResult, checklistResult);
      const checkedItemCount = checklistItems.filter((item) => mergedChecklistResult[item.id]).length;
      const nextRunCount = getNextRunCount(lessonProgress, selectedLesson);
      const nextActiveHintItemIds = getActiveCheckpointHintIds(
        selectedLesson,
        checklistItems,
        mergedChecklistResult,
      );

      setLessonProgress((current) => {
        const currentChecklistResult = current.checklists[selectedLesson.id] ?? {};
        const currentMergedChecklistResult = mergeChecklistResults(
          currentChecklistResult,
          checklistResult,
        );
        const currentActiveHintItemIds = getActiveCheckpointHintIds(
          selectedLesson,
          checklistItems,
          currentMergedChecklistResult,
        );
        const currentHintProgress = getNextHintProgress(
          selectedLesson,
          checklistItems,
          checklistResult,
          currentMergedChecklistResult,
          current.hintProgress[selectedLesson.id] ?? {},
          currentActiveHintItemIds,
        );

        return {
          checklists:
            checklistItems.length > 0
              ? {
                  ...current.checklists,
                  [selectedLesson.id]: currentMergedChecklistResult,
                }
              : current.checklists,
          hintProgress: hasCheckpointHintLadder(selectedLesson)
            ? {
                ...current.hintProgress,
                [selectedLesson.id]: currentHintProgress,
              }
            : current.hintProgress,
          runCounts: {
            ...current.runCounts,
            [selectedLesson.id]: getNextRunCount(current, selectedLesson),
          },
        };
      });
      setActiveHintItemIds(nextActiveHintItemIds);

      setConsoleEntry({
        type: 'success',
        message:
          checklistItems.length > 0
            ? `Generated PDF successfully. Checklist ${checkedItemCount}/${checklistItems.length}. Run ${nextRunCount}.`
            : `Generated PDF successfully. Run ${nextRunCount}.`,
      });
    } catch (error) {
      console.error(error);
      const nextRunCount = getNextRunCount(lessonProgress, selectedLesson);
      setActiveHintItemIds([]);

      setLessonProgress((current) => ({
        ...current,
        runCounts: {
          ...current.runCounts,
          [selectedLesson.id]: getNextRunCount(current, selectedLesson),
        },
      }));

      setConsoleEntry({
        type: 'error',
        message: `${
          error instanceof Error ? error.message : 'Could not generate PDF.'
        } Run ${nextRunCount}.`,
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
  const checklistItems = selectedLesson.completionChecklist ?? [];
  const checkedItems = lessonChecklistState[selectedLesson.id] ?? {};
  const checkedItemCount = checklistItems.filter((item) => checkedItems[item.id]).length;
  const selectedLessonRunCount = lessonRunCounts[selectedLesson.id] ?? 0;
  const selectedHintProgress = lessonProgress.hintProgress[selectedLesson.id] ?? {};
  const lessonCompletionById = useMemo(
    () =>
      lessons.reduce((completionMap, lesson) => {
        const items = lesson.completionChecklist ?? [];
        const checklistResult = lessonChecklistState[lesson.id] ?? {};

        return {
          ...completionMap,
          [lesson.id]: items.length > 0 && items.every((item) => checklistResult[item.id]),
        };
      }, {}),
    [lessonChecklistState],
  );
  const checkpointPrerequisites = useMemo(
    () => getCheckpointPrerequisites(selectedLesson),
    [selectedLesson],
  );
  const isCheckpointLocked =
    selectedLesson.type === 'checkpoint' &&
    checkpointPrerequisites.some((lesson) => !lessonCompletionById[lesson.id]);
  const completedPrerequisiteCount = checkpointPrerequisites.filter(
    (lesson) => lessonCompletionById[lesson.id],
  ).length;
  const taskHeading = selectedLesson.challenge
    ? 'Challenge'
    : selectedLesson.practice
      ? 'Practice'
      : 'Mini Task';

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
        lessonCompletionById={lessonCompletionById}
        lessonRunCounts={lessonRunCounts}
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
              {selectedLesson.teachingPoints ? (
                <ul className="teachingPointList">
                  {selectedLesson.teachingPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              ) : null}
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
              <h3>{taskHeading}</h3>
              {selectedLesson.challenge ? (
                isCheckpointLocked ? (
                  <div className="lockedChallenge">
                    <div className="lockedChallengePreview" aria-hidden="true">
                      <div className="lockedBlueprintMock">
                        <span />
                        <span />
                        <span />
                        <span />
                      </div>
                      <div className="lockedTextLines">
                        <span />
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>
                    <div className="lockedChallengeNotice">
                      <p className="checklistTitle">Locked checkpoint</p>
                      <p>
                        Complete lessons 1-9 to reveal the challenge brief, expected
                        document blueprint, and grading checklist.
                      </p>
                      <p>
                        {completedPrerequisiteCount}/{checkpointPrerequisites.length} lessons
                        complete
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="challengeBlock">
                    <p>{selectedLesson.challenge.prompt}</p>
                    <ul className="taskList">
                      {selectedLesson.challenge.requirements.map((requirement) => (
                        <li key={requirement}>{requirement}</li>
                      ))}
                    </ul>
                    {selectedLesson.challenge.blueprint ? (
                      <>
                        <p className="checklistTitle">Expected blueprint</p>
                        {selectedLesson.challenge.layoutSketch ? (
                          <pre className="layoutSketch">
                            {selectedLesson.challenge.layoutSketch}
                          </pre>
                        ) : null}
                        <div className="blueprintPanel">
                          {selectedLesson.challenge.blueprint.map((item) => (
                            <div key={item.label} className="blueprintRow">
                              <span>{item.label}</span>
                              <p>{item.detail}</p>
                            </div>
                          ))}
                        </div>
                        {selectedLesson.challenge.designContract ? (
                          <>
                            <p className="checklistTitle">Design contract</p>
                            <div className="blueprintPanel designContractPanel">
                              {selectedLesson.challenge.designContract.map((item) => (
                                <div key={item.label} className="blueprintRow">
                                  <span>{item.label}</span>
                                  <p>{item.detail}</p>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : null}
                      </>
                    ) : null}
                    {selectedLesson.challenge.dataFields ? (
                      <>
                        <p className="checklistTitle">Required data fields</p>
                        <ul className="taskList">
                          {selectedLesson.challenge.dataFields.map((field) => (
                            <li key={field}>{field}</li>
                          ))}
                        </ul>
                      </>
                    ) : null}
                    <p className="checklistTitle">
                      {selectedLesson.challenge.blueprint ? 'Blueprint checklist' : 'Self-check'}
                    </p>
                    <ul className="taskList checklist">
                      {selectedLesson.challenge.checklist.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )
              ) : selectedLesson.practice ? (
                <div className="challengeBlock">
                  <p>{selectedLesson.practice.prompt}</p>
                  <ul className="taskList">
                    {selectedLesson.practice.requirements.map((requirement) => (
                      <li key={requirement}>{requirement}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>{selectedLesson.miniTask}</p>
              )}
            </section>

            {checklistItems.length > 0 && !isCheckpointLocked ? (
              <section className="lessonInfoBlock">
                <div className="checklistHeader">
                  <h3>Lesson Checklist</h3>
                  <div className="checklistStats">
                    <span>
                      {checkedItemCount}/{checklistItems.length}
                    </span>
                    <span>Runs {selectedLessonRunCount}</span>
                  </div>
                </div>
                <p className="checklistHint">ตรวจอัตโนมัติจาก code และ PDF หลังจากกด Run</p>
                <ul className="autoChecklist">
                  {checklistItems.map((item) => {
                    const isComplete = Boolean(checkedItems[item.id]);
                    const hintProgress = selectedHintProgress[item.id] ?? 0;
                    const hintText = getChecklistHint(item, hintProgress);
                    const shouldShowHint =
                      !isComplete && activeHintItemIds.includes(item.id) && Boolean(hintText);
                    const hintLevel = getHintLevel(hintProgress);
                    const hintId = `${selectedLesson.id}-${item.id}-hint`;

                    return (
                      <li
                        key={item.id}
                        className={`${isComplete ? 'isComplete' : ''} ${
                          shouldShowHint ? 'hasHint' : ''
                        }`}
                      >
                        <span
                          className="checkStatus"
                          aria-label={isComplete ? 'Passed' : 'Pending'}
                        />
                        <span>{item.label}</span>
                        {shouldShowHint ? (
                          <span className="checkpointHint">
                            <button
                              type="button"
                              className="checkpointHintButton"
                              aria-label={`คำใบ้ระดับ ${hintLevel} สำหรับ ${item.label}`}
                              aria-describedby={hintId}
                            >
                              !
                            </button>
                            <span id={hintId} role="tooltip" className="checkpointHintBubble">
                              <p className="checkpointHintLevel">คำใบ้ระดับ {hintLevel}</p>
                              <p>{hintText}</p>
                            </span>
                          </span>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </section>
            ) : null}

            <p className="visualPlaceholder">Visual helper: {selectedLesson.visualKind}</p>
          </div>

          <div className="editorHeader">
            <p className="editorLabel">Code</p>
            {!isCheckpointLocked ? (
              <button
                type="button"
                className="editorToggleButton"
                aria-controls="lesson-code-editor"
                aria-expanded={isEditorExpanded}
                onClick={() => setIsEditorExpanded((current) => !current)}
              >
                {isEditorExpanded ? 'Collapse' : 'Expand'}
              </button>
            ) : null}
          </div>
          {isCheckpointLocked ? (
            <div className="lockedCodeNotice">
              <p className="checklistTitle">Code hidden</p>
              <p>Starter code and Run are available after lessons 1-9 are complete.</p>
            </div>
          ) : (
            <>
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
            </>
          )}
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
