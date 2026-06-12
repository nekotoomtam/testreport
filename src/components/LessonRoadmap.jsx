import JsPdfCatalog from './JsPdfCatalog.jsx';

function LessonRoadmap({
  lessons,
  selectedLessonId,
  viewMode,
  railMode,
  lessonCompletionById = {},
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
                Follow the reference card first, then move through the visual lessons
                that connect code changes to a PDF preview.
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

      <div className="lessonRoadmap" role="list">
        <JsPdfCatalog
          isSelected={isReferenceMode}
          isCompact={isCompactRail}
          onSelectReference={onSelectReference}
        />
        {lessons.map((lesson, index) => {
          const isSelected = lesson.id === selectedLessonId;
          const isCheckpoint = lesson.type === 'checkpoint';
          const isComplete = Boolean(lessonCompletionById[lesson.id]);
          const runCount = lessonRunCounts[lesson.id] ?? 0;
          const lessonNumber = String(index + 1).padStart(2, '0');

          return (
            <button
              key={lesson.id}
              type="button"
              className={`roadmapLesson ${isSelected ? 'isSelected' : ''} ${
                isCheckpoint ? 'isCheckpoint' : ''
              } ${isComplete ? 'isComplete' : ''}`}
              onClick={() => onSelectLesson(lesson.id)}
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
                  {isComplete || runCount > 0 ? (
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
        })}
      </div>
    </section>
  );
}

export default LessonRoadmap;
