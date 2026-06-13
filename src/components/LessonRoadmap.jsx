import JsPdfCatalog from './JsPdfCatalog.jsx';

function LessonRoadmap({
  lessons,
  selectedLessonId,
  viewMode,
  railMode,
  lessonCompletionById = {},
  lessonUnlockById = {},
  lessonRunCounts = {},
  onSelectLesson,
  onSelectReference,
  onAdvanceRoadmap,
}) {
  const isWorkspaceMode = viewMode === 'lesson' || viewMode === 'reference';
  const isReferenceMode = viewMode === 'reference';
  const isCompactRail = isWorkspaceMode && railMode === 'compact';
  const advanceLabel = isCompactRail ? 'Open rail' : 'Full map';
  const advanceActionClass = isCompactRail ? 'isOpenRailAction' : 'isFullMapAction';
  const shouldShowIntroCopy = !isCompactRail;
  const shouldShowLessonCopy = !isCompactRail;
  const documentGroups = lessons.reduce((groups, lesson) => {
    const groupTitle = lesson.phase || 'Lessons';
    const existingGroup = groups.find((group) => group.title === groupTitle);

    if (existingGroup) {
      existingGroup.lessons.push(lesson);
      return groups;
    }

    return [...groups, { title: groupTitle, lessons: [lesson] }];
  }, []);

  function renderLessonCard(lesson) {
    const isSelected = lesson.id === selectedLessonId;
    const isCheckpoint = lesson.type === 'checkpoint';
    const isComplete = Boolean(lessonCompletionById[lesson.id]);
    const isLocked = lessonUnlockById[lesson.id] === false;
    const runCount = lessonRunCounts[lesson.id] ?? 0;
    const lessonNumber = String(lesson.order).padStart(2, '0');

    return (
      <button
        key={lesson.id}
        type="button"
        className={`roadmapLesson ${isSelected ? 'isSelected' : ''} ${
          isCheckpoint ? 'isCheckpoint' : ''
        } ${isComplete ? 'isComplete' : ''} ${isLocked ? 'isLocked' : ''}`}
        onClick={() => onSelectLesson(lesson.id)}
        disabled={isLocked}
        aria-disabled={isLocked}
        aria-current={isSelected && viewMode === 'lesson' ? 'step' : undefined}
      >
        <span
          className="lessonNumber"
          aria-label={isComplete ? `Lesson ${lessonNumber} complete` : undefined}
        >
          <span>{lessonNumber}</span>
          {isComplete ? <span className="lessonCompleteBadge">✓</span> : null}
        </span>
        {shouldShowLessonCopy ? (
          <span className="lessonCopy">
            {isCheckpoint ? <span className="checkpointLabel">Checkpoint</span> : null}
            <span className="lessonTitle">
              {isWorkspaceMode ? lesson.shortTitle : lesson.title}
            </span>
            {isLocked ? (
              <span className="lessonProgressMeta isLocked">Locked</span>
            ) : isComplete || runCount > 0 ? (
              <span className="lessonProgressMeta">
                {isComplete ? 'Completed' : 'In progress'}
                {runCount > 0 ? ` / Runs ${runCount}` : ''}
              </span>
            ) : null}
            {!isWorkspaceMode ? <span className="lessonSummary">{lesson.goal}</span> : null}
          </span>
        ) : null}
      </button>
    );
  }

  function renderDocumentPreview(group) {
    if (group.title !== 'Document 1: Project Brief' || isCompactRail) {
      return null;
    }

    return (
      <aside className="documentOutputPreview" aria-label={`${group.title} final output`}>
        <div className="documentOutputPreviewHeader">
          <p className="eyebrow">Final Output</p>
          <h3>Project Brief PDF</h3>
          <p>ทำบท 01-10 เพื่อประกอบเอกสารหน้านี้</p>
        </div>
        <img
          src="/images/document-1-project-brief-final.png"
          alt="Final Project Brief PDF output"
        />
      </aside>
    );
  }

  return (
    <section
      className={`roadmapPane ${isWorkspaceMode ? 'roadmapRail' : 'roadmapFull'} ${
        isCompactRail ? 'roadmapCompact' : ''
      }`}
      aria-label="Course roadmap"
    >
      <div className="roadmapIntro">
        {shouldShowIntroCopy ? (
          <>
            <p className="eyebrow">Course Map</p>
            <h1>jsPDF Visual Lessons</h1>
            {!isWorkspaceMode ? (
              <p className="roadmapIntroCopy">
                ใช้ REF เป็นคู่มือคำสั่ง แล้วไล่ทำเอกสารแต่ละชุดจากบทแรกไปบทสุดท้าย
              </p>
            ) : null}
          </>
        ) : null}
        {isWorkspaceMode ? (
          <button
            type="button"
            className={`expandMapButton ${advanceActionClass}`}
            onClick={onAdvanceRoadmap}
            aria-label={advanceLabel}
          >
            <span className="srOnly">{advanceLabel}</span>
          </button>
        ) : null}
      </div>

      <div className="roadmapContent">
        <div className="referenceRoadmapSlot" role="list">
          <JsPdfCatalog
            isSelected={isReferenceMode}
            isCompact={isCompactRail}
            onSelectReference={onSelectReference}
          />
        </div>

        <div className="documentRoadmapGroups">
          {documentGroups.map((group) => (
            <section key={group.title} className="documentRoadmapGroup" aria-label={group.title}>
              {shouldShowLessonCopy ? (
                <div className="documentRoadmapHeader">
                  <p className="eyebrow">Document Lessons</p>
                  <h2>{group.title}</h2>
                  <p>ทำเอกสารชุดนี้ทีละบท โดยแต่ละบทต่อจาก code ที่ผ่านของบทก่อนหน้า</p>
                </div>
              ) : null}

              <div className="documentRoadmapBody">
                <div className="lessonRoadmap" role="list">
                  {group.lessons.map((lesson) => renderLessonCard(lesson))}
                </div>
                {renderDocumentPreview(group)}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LessonRoadmap;
