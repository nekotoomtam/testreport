function LessonRoadmap({
  lessons,
  selectedLessonId,
  viewMode,
  railMode,
  lessonCompletionById = {},
  lessonRunCounts = {},
  onSelectLesson,
  onAdvanceRoadmap,
}) {
  const isLessonMode = viewMode === 'lesson';
  const isCompactRail = isLessonMode && railMode === 'compact';
  const advanceLabel = isCompactRail ? 'Open rail' : 'Full map';
  const advanceActionClass = isCompactRail ? 'isOpenRailAction' : 'isFullMapAction';
  const shouldShowIntroCopy = !isCompactRail;
  const shouldShowLessonCopy = !isCompactRail;

  return (
    <section
      className={`roadmapPane ${isLessonMode ? 'roadmapRail' : 'roadmapFull'} ${
        isCompactRail ? 'roadmapCompact' : ''
      }`}
      aria-label="Course roadmap"
    >
      <div className="roadmapIntro">
        {shouldShowIntroCopy ? (
          <>
            <p className="eyebrow">Course Map</p>
            <h1>jsPDF Visual Lessons</h1>
            {!isLessonMode ? (
              <p>
                Follow a small sequence of visual lessons that connect code changes to a
                PDF preview.
              </p>
            ) : null}
          </>
        ) : null}
        {isLessonMode ? (
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
              aria-current={isSelected && isLessonMode ? 'step' : undefined}
            >
              <span
                className="lessonNumber"
                aria-label={isComplete ? `Lesson ${lessonNumber} complete` : undefined}
              >
                {isComplete ? '✓' : lessonNumber}
              </span>
              {shouldShowLessonCopy ? (
                <span className="lessonCopy">
                  {isCheckpoint ? <span className="checkpointLabel">Checkpoint</span> : null}
                  <span className="lessonTitle">{isLessonMode ? lesson.shortTitle : lesson.title}</span>
                  {isComplete || runCount > 0 ? (
                    <span className="lessonProgressMeta">
                      {isComplete ? 'Completed' : 'In progress'}
                      {runCount > 0 ? ` / Runs ${runCount}` : ''}
                    </span>
                  ) : null}
                  {!isLessonMode ? <span className="lessonSummary">{lesson.goal}</span> : null}
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
