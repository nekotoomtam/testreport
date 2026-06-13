import { useEffect, useMemo, useRef, useState } from 'react';
import CopyableCodeBlock from './CopyableCodeBlock.jsx';
import DataReferenceCatalog from './DataReferenceCatalog.jsx';
import JsPdfCatalog from './JsPdfCatalog.jsx';

function getRoadmapSectionId(title) {
  return `document-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
}

function LessonRoadmap({
  lessons,
  selectedLessonId,
  viewMode,
  railMode,
  lessonCompletionById = {},
  lessonUnlockById = {},
  lessonRunCounts = {},
  isDataReferenceUnlocked = false,
  onSelectLesson,
  onSelectReference,
  onSelectDataReference,
  onAdvanceRoadmap,
}) {
  const roadmapRef = useRef(null);
  const [activeRoadmapSectionId, setActiveRoadmapSectionId] = useState('reference');
  const [openDocumentCodeById, setOpenDocumentCodeById] = useState({});
  const isDataReferenceMode = viewMode === 'data-reference';
  const isWorkspaceMode = viewMode === 'lesson' || viewMode === 'reference' || isDataReferenceMode;
  const isReferenceMode = viewMode === 'reference';
  const isCompactRail = isWorkspaceMode && railMode === 'compact';
  const advanceLabel = isCompactRail ? 'Open rail' : 'Full map';
  const advanceActionClass = isCompactRail ? 'isOpenRailAction' : 'isFullMapAction';
  const shouldShowIntroCopy = !isCompactRail;
  const shouldShowLessonCopy = !isCompactRail;
  const documentGroups = useMemo(
    () =>
      lessons.reduce((groups, lesson) => {
        const groupTitle = lesson.phase || 'Lessons';
        const existingGroup = groups.find((group) => group.title === groupTitle);

        if (existingGroup) {
          existingGroup.lessons.push(lesson);
          return groups;
        }

        return [
          ...groups,
          { id: getRoadmapSectionId(groupTitle), title: groupTitle, lessons: [lesson] },
        ];
      }, []),
    [lessons],
  );
  const selectedDocumentGroup = documentGroups.find((group) =>
    group.lessons.some((lesson) => lesson.id === selectedLessonId),
  );
  const visibleDocumentGroups =
    isWorkspaceMode
      ? viewMode === 'lesson' && selectedDocumentGroup
        ? [selectedDocumentGroup]
        : []
      : documentGroups;
  const shouldShowReferenceSection = !isWorkspaceMode || isReferenceMode;
  const shouldShowDataReferenceSection = !isWorkspaceMode || isDataReferenceMode;

  useEffect(() => {
    const roadmapElement = roadmapRef.current;

    if (!roadmapElement || isWorkspaceMode) {
      setActiveRoadmapSectionId(isDataReferenceMode ? 'data-reference' : 'reference');
      return undefined;
    }

    const sectionElements = Array.from(
      roadmapElement.querySelectorAll('[data-roadmap-section]'),
    );

    if (!sectionElements.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (firstEntry, secondEntry) =>
              secondEntry.intersectionRatio - firstEntry.intersectionRatio,
          );

        if (!visibleEntries.length) {
          return;
        }

        const nextSectionId = visibleEntries[0].target.getAttribute('data-roadmap-section');

        if (nextSectionId) {
          setActiveRoadmapSectionId(nextSectionId);
        }
      },
      {
        root: roadmapElement,
        rootMargin: '-18% 0px -42% 0px',
        threshold: [0.2, 0.35, 0.5, 0.65, 0.8],
      },
    );

    sectionElements.forEach((sectionElement) => observer.observe(sectionElement));

    return () => observer.disconnect();
  }, [isWorkspaceMode, isDataReferenceMode, documentGroups]);

  function getLessonLockMessage(lesson) {
    const previousLesson = lessons.find(
      (candidate) =>
        candidate.phase === lesson.phase && candidate.order === lesson.order - 1,
    );

    if (!previousLesson) {
      return 'ผ่านบทก่อนหน้าก่อน';
    }

    return `ผ่านบท ${String(previousLesson.order).padStart(2, '0')} ก่อน`;
  }

  function renderLessonCard(lesson) {
    const isSelected = lesson.id === selectedLessonId;
    const isCheckpoint = lesson.type === 'checkpoint';
    const isComplete = Boolean(lessonCompletionById[lesson.id]);
    const isLocked = lessonUnlockById[lesson.id] === false && !isComplete;
    const runCount = lessonRunCounts[lesson.id] ?? 0;
    const lessonNumber = String(lesson.order).padStart(2, '0');
    const lockMessage = isLocked ? getLessonLockMessage(lesson) : '';

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
                {isComplete ? 'ผ่านแล้ว' : 'In progress'}
                {runCount > 0 ? ` / Runs ${runCount}` : ''}
              </span>
            ) : null}
            {!isWorkspaceMode ? <span className="lessonSummary">{lesson.goal}</span> : null}
          </span>
        ) : null}
        {isLocked && shouldShowLessonCopy ? (
          <span className="lessonLockOverlay">
            <span>ยังไม่เปิด</span>
            <strong>{lockMessage}</strong>
          </span>
        ) : null}
      </button>
    );
  }

  function renderDocumentPreview(group) {
    if (group.title !== 'Document 1: Project Brief' || isCompactRail) {
      return null;
    }

    const checkpointLesson = group.lessons.find((lesson) => lesson.type === 'checkpoint');
    const isDocumentComplete = Boolean(
      checkpointLesson && lessonCompletionById[checkpointLesson.id],
    );
    const finalCode = checkpointLesson?.solutionCode ?? '';
    const isFinalCodeOpen = Boolean(openDocumentCodeById[group.id]);

    return (
      <aside
        className={`documentOutputPreview ${isDocumentComplete ? 'isComplete' : ''}`}
        aria-label={`${group.title} final output`}
      >
        <div className="documentOutputPreviewHeader">
          <p className="eyebrow">Final Output</p>
          <h3>Project Brief PDF</h3>
          <p>ทำบท 01-10 เพื่อประกอบเอกสารหน้านี้</p>
        </div>
        <div className="documentOutputImageFrame">
          <img
            src="/images/document-1-project-brief-final.png"
            alt="Final Project Brief PDF output"
          />
          {isDocumentComplete ? (
            <span className="documentCompleteWatermark" aria-hidden="true" />
          ) : null}
        </div>
        <div className={`documentCodePreview ${isDocumentComplete ? '' : 'isLocked'}`}>
          <div className="documentCodePreviewHeader">
            <div>
              <p className="eyebrow">Code Blueprint</p>
              <h4>โค้ดตัวอย่างปลายทาง</h4>
            </div>
            {isDocumentComplete && finalCode ? (
              <button
                type="button"
                onClick={() =>
                  setOpenDocumentCodeById((current) => ({
                    ...current,
                    [group.id]: !current[group.id],
                  }))
                }
                aria-expanded={isFinalCodeOpen}
              >
                {isFinalCodeOpen ? 'Hide' : 'View'}
              </button>
            ) : null}
          </div>
          <p>
            {isDocumentComplete
              ? 'ตัวอย่างหนึ่งของ code ที่สร้างเอกสารนี้ได้ ใช้ทาบโครง ไม่ใช่รูปแบบเดียวที่ถูก'
              : 'ผ่าน checkpoint บท 10 ก่อน แล้วค่อยเปิดดู code ตัวอย่างฉบับเต็ม'}
          </p>
          {isDocumentComplete && isFinalCodeOpen && finalCode ? (
            <CopyableCodeBlock code={finalCode} copyLabel="Copy final code" />
          ) : null}
        </div>
      </aside>
    );
  }

  return (
    <section
      className={`roadmapPane ${isWorkspaceMode ? 'roadmapRail' : 'roadmapFull'} ${
        isCompactRail ? 'roadmapCompact' : ''
      }`}
      aria-label="Course roadmap"
      ref={roadmapRef}
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
        {shouldShowReferenceSection ? (
          <section
            className={`referenceJourneySection ${
              activeRoadmapSectionId === 'reference' ? 'isActive' : ''
            }`}
            data-roadmap-section="reference"
            aria-label="Reference guide start"
          >
            {!isWorkspaceMode ? (
              <div className="referenceJourneyHeader">
                <p className="eyebrow">Start Here</p>
                <h2>สารบัญคำสั่งก่อนลงมือทำเอกสาร</h2>
                <p>
                  เปิดภาพจำของคำสั่ง jsPDF ก่อน แล้วค่อยไล่ทำเอกสารแต่ละชุดแบบต่อขั้น
                </p>
              </div>
            ) : null}

            <div className="referenceJourneyBody">
              <div className="referenceRoadmapSlot" role="list">
                <JsPdfCatalog
                  isSelected={isReferenceMode}
                  isCompact={isCompactRail}
                  onSelectReference={onSelectReference}
                />
              </div>

              {!isWorkspaceMode ? (
                <div className="referenceFlowVisual" aria-hidden="true">
                  <div className="referenceFlowPaper">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="referenceFlowSteps">
                    <span>new jsPDF()</span>
                    <span>doc.text()</span>
                    <span>doc.rect()</span>
                    <span>doc.output()</span>
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        <div className="documentRoadmapGroups">
          {visibleDocumentGroups.map((group) => (
            <section
              key={group.title}
              className={`documentRoadmapGroup ${
                activeRoadmapSectionId === group.id ? 'isActive' : ''
              }`}
              data-roadmap-section={group.id}
              aria-label={group.title}
            >
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

        {shouldShowDataReferenceSection ? (
          <section
            className={`referenceJourneySection dataReferenceJourneySection ${
              activeRoadmapSectionId === 'data-reference' ? 'isActive' : ''
            } ${isDataReferenceUnlocked ? '' : 'isLocked'}`}
            data-roadmap-section="data-reference"
            aria-label="Data reference guide"
          >
            {!isWorkspaceMode ? (
              <div className="referenceJourneyHeader">
                <p className="eyebrow">After Document 1</p>
                <h2>สารบัญจัดข้อมูลก่อนทำเอกสารธุรกิจ</h2>
                <p>
                  ก่อนเข้า Quotation ให้ฝึกแปลง raw data เป็น clean model
                  แล้วค่อยส่งเข้า renderer ที่สร้าง PDF
                </p>
              </div>
            ) : null}

            <div className="referenceJourneyBody">
              <div className="referenceRoadmapSlot" role="list">
                <DataReferenceCatalog
                  isSelected={isDataReferenceMode}
                  isCompact={isCompactRail}
                  isLocked={!isDataReferenceUnlocked}
                  lockMessage="ผ่าน Checkpoint บท 10 ก่อน"
                  onSelectDataReference={onSelectDataReference}
                />
              </div>

              {!isWorkspaceMode ? (
                <div className="referenceFlowVisual dataFlowVisual" aria-hidden="true">
                  <div className="dataFlowStack">
                    <span>raw API data</span>
                    <span>normalize()</span>
                    <span>clean model</span>
                  </div>
                  <div className="referenceFlowSteps dataFlowSteps">
                    <span>textOrDash()</span>
                    <span>toNumber()</span>
                    <span>map() / reduce()</span>
                    <span>generatePdf(model)</span>
                  </div>
                </div>
              ) : null}
              {!isDataReferenceUnlocked && !isWorkspaceMode ? (
                <div className="sectionLockOverlay">
                  <span>ยังไม่เปิด</span>
                  <strong>ผ่าน Checkpoint: Project Brief PDF ก่อน</strong>
                  <small>แล้วสารบัญจัดข้อมูลจะเปิดให้ใช้ต่อ</small>
                </div>
              ) : null}
            </div>
          </section>
        ) : null}
      </div>
    </section>
  );
}

export default LessonRoadmap;
