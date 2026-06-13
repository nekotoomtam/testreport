import { useEffect, useMemo, useRef, useState } from 'react';
import CopyableCodeBlock from './CopyableCodeBlock.jsx';
import DataReferenceCatalog from './DataReferenceCatalog.jsx';
import JsPdfCatalog from './JsPdfCatalog.jsx';
import { quotationBlueprintCode } from '../blueprints/quotationBlueprint.js';

const quotationPreviewId = 'document-2-quotation';
const quotationThemePreviewSlides = [
  {
    id: 'blue',
    label: 'Blue',
    src: '/images/document-2-quotation-blue.png',
    accent: '#2457d6',
  },
  {
    id: 'green',
    label: 'Green',
    src: '/images/document-2-quotation-green.png',
    accent: '#2f7d4f',
  },
  {
    id: 'pink',
    label: 'Pink',
    src: '/images/document-2-quotation-pink.png',
    accent: '#cb3e83',
  },
];
const quotationPreviewSteps = [
  {
    number: '01',
    title: 'Raw rows to model',
    status: 'Planned',
    summary: 'รับข้อมูลแถวจาก DB แล้วจัดเป็น quotation object ที่อ่านง่าย',
  },
  {
    number: '02',
    title: 'Quotation Header',
    status: 'Planned',
    summary: 'วางโลโก้ เลขที่เอกสาร วันที่ และข้อมูลลูกค้าให้ตรง blueprint',
  },
  {
    number: '03',
    title: 'Items Table',
    status: 'Planned',
    summary: 'loop รายการสินค้า วางรูป จำนวน หน่วย ราคา และรวมรายบรรทัด',
  },
  {
    number: '04',
    title: 'Totals and Signatures',
    status: 'Planned',
    summary: 'คำนวณยอดรวม ส่วนลด VAT และจัดช่องลงชื่อด้านท้ายเอกสาร',
  },
];

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
  const [documentPreviewModeById, setDocumentPreviewModeById] = useState({});
  const [activeQuotationThemeIndex, setActiveQuotationThemeIndex] = useState(0);
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
  const leadingDocumentGroups = visibleDocumentGroups.filter(
    (group) => group.title === 'Document 1: Project Brief',
  );
  const trailingDocumentGroups = visibleDocumentGroups.filter(
    (group) => group.title !== 'Document 1: Project Brief',
  );
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

  useEffect(() => {
    if (isWorkspaceMode) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveQuotationThemeIndex(
        (currentIndex) => (currentIndex + 1) % quotationThemePreviewSlides.length,
      );
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [isWorkspaceMode]);

  function getLessonLockMessage(lesson) {
    const previousLesson = lessons.find(
      (candidate) =>
        candidate.phase === lesson.phase && candidate.order === lesson.order - 1,
    );

    if (!previousLesson) {
      const lessonIndex = lessons.findIndex((candidate) => candidate.id === lesson.id);
      const previousGlobalLesson = lessonIndex > 0 ? lessons[lessonIndex - 1] : null;

      if (previousGlobalLesson && previousGlobalLesson.phase !== lesson.phase) {
        return `ผ่าน ${previousGlobalLesson.phase} ก่อน`;
      }

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
    if (isCompactRail) {
      return null;
    }

    if (group.title === 'Document 2: Quotation') {
      return renderQuotationDocumentPreview(group);
    }

    if (group.title !== 'Document 1: Project Brief') {
      return null;
    }

    const checkpointLesson = group.lessons.find((lesson) => lesson.type === 'checkpoint');
    const isDocumentComplete = Boolean(
      checkpointLesson && lessonCompletionById[checkpointLesson.id],
    );
    const finalCode = checkpointLesson?.solutionCode ?? '';
    const documentPreviewMode =
      isDocumentComplete && finalCode ? documentPreviewModeById[group.id] ?? 'image' : 'image';
    const isCodePreviewMode = documentPreviewMode === 'code';

    return (
      <aside
        className={`documentOutputPreview ${isDocumentComplete ? 'isComplete' : ''} ${
          isCodePreviewMode ? 'isCodeMode' : ''
        }`}
        aria-label={`${group.title} final output`}
      >
        <div className="documentOutputPreviewHeader">
          <div>
            <p className="eyebrow">Final Output</p>
            <h3>Project Brief PDF</h3>
            <p>ทำบท 01-10 เพื่อประกอบเอกสารหน้านี้</p>
          </div>
          {isDocumentComplete && finalCode ? (
            <div className="documentModeSwitch" role="group" aria-label="Final output mode">
              <button
                type="button"
                className={`documentModeButton ${documentPreviewMode === 'image' ? 'isSelected' : ''}`}
                onClick={() =>
                  setDocumentPreviewModeById((current) => ({
                    ...current,
                    [group.id]: 'image',
                  }))
                }
                aria-pressed={documentPreviewMode === 'image'}
                title="ดูภาพเอกสาร"
              >
                <span className="documentModeIcon isImage" aria-hidden="true" />
                <span className="srOnly">ดูภาพเอกสาร</span>
              </button>
              <button
                type="button"
                className={`documentModeButton ${isCodePreviewMode ? 'isSelected' : ''}`}
                onClick={() =>
                  setDocumentPreviewModeById((current) => ({
                    ...current,
                    [group.id]: 'code',
                  }))
                }
                aria-pressed={isCodePreviewMode}
                title="ดู code blueprint"
              >
                <span className="documentModeIcon isCode" aria-hidden="true" />
                <span className="srOnly">ดู code blueprint</span>
              </button>
            </div>
          ) : null}
        </div>
        {isCodePreviewMode ? (
          <div className="documentOutputCodeFrame">
            <div className="documentOutputCodeIntro">
              <p className="eyebrow">Code Blueprint</p>
              <h4>โค้ดตัวอย่างปลายทาง</h4>
              <p>ตัวอย่างหนึ่งของ code ที่สร้างเอกสารนี้ได้ ใช้ทาบโครง ไม่ใช่รูปแบบเดียวที่ถูก</p>
            </div>
            <CopyableCodeBlock code={finalCode} copyLabel="Copy final code" />
          </div>
        ) : (
          <div className="documentOutputImageFrame">
            <img
              src="/images/document-1-project-brief-final.png"
              alt="Final Project Brief PDF output"
            />
            {isDocumentComplete ? (
              <span className="documentCompleteWatermark" aria-hidden="true" />
            ) : null}
          </div>
        )}
        {!isDocumentComplete ? (
          <div className="documentCodePreview isLocked">
            <div className="documentCodePreviewHeader">
              <div>
                <p className="eyebrow">Code Blueprint</p>
                <h4>โค้ดตัวอย่างปลายทาง</h4>
              </div>
            </div>
            <p>ผ่าน checkpoint บท 10 ก่อน แล้วค่อยเปิดดู code ตัวอย่างฉบับเต็ม</p>
          </div>
        ) : null}
      </aside>
    );
  }

  function renderQuotationDocumentPreview(group) {
    const checkpointLesson = group.lessons.find((lesson) => lesson.type === 'checkpoint');
    const isDocumentComplete = Boolean(
      checkpointLesson && lessonCompletionById[checkpointLesson.id],
    );
    const finalCode = checkpointLesson?.solutionCode ?? quotationBlueprintCode;
    const quotationPreviewMode =
      isDocumentComplete && finalCode ? documentPreviewModeById[group.id] ?? 'image' : 'image';
    const isCodePreviewMode = quotationPreviewMode === 'code';
    const activeQuotationTheme = quotationThemePreviewSlides[activeQuotationThemeIndex];

    return (
      <aside
        className={`documentOutputPreview upcomingDocumentPreview ${
          isDocumentComplete ? 'isComplete' : ''
        } ${isCodePreviewMode ? 'isCodeMode' : ''}`}
        aria-label={`${group.title} final output`}
      >
        <div className="documentOutputPreviewHeader">
          <div>
            <p className="eyebrow">Final Output</p>
            <h3>Quotation PDF</h3>
            <p>ทำบท 01-16 เพื่อประกอบใบเสนอราคาจาก raw data</p>
          </div>
          {isDocumentComplete && finalCode ? (
            <div className="documentModeSwitch" role="group" aria-label="Quotation output mode">
              <button
                type="button"
                className={`documentModeButton ${quotationPreviewMode === 'image' ? 'isSelected' : ''}`}
                onClick={() =>
                  setDocumentPreviewModeById((current) => ({
                    ...current,
                    [group.id]: 'image',
                  }))
                }
                aria-pressed={quotationPreviewMode === 'image'}
                title="ดูภาพเอกสาร"
              >
                <span className="documentModeIcon isImage" aria-hidden="true" />
                <span className="srOnly">ดูภาพเอกสาร</span>
              </button>
              <button
                type="button"
                className={`documentModeButton ${isCodePreviewMode ? 'isSelected' : ''}`}
                onClick={() =>
                  setDocumentPreviewModeById((current) => ({
                    ...current,
                    [group.id]: 'code',
                  }))
                }
                aria-pressed={isCodePreviewMode}
                title="ดู code blueprint"
              >
                <span className="documentModeIcon isCode" aria-hidden="true" />
                <span className="srOnly">ดู code blueprint</span>
              </button>
            </div>
          ) : null}
        </div>

        {isCodePreviewMode ? (
          <div className="documentOutputCodeFrame">
            <div className="documentOutputCodeIntro">
              <p className="eyebrow">Code Blueprint</p>
              <h4>โค้ดตัวอย่างปลายทาง</h4>
              <p>{'ตัวอย่างหนึ่งของ flow rawRows -> normalize -> renderQuotation'}</p>
            </div>
            <CopyableCodeBlock code={finalCode} copyLabel="Copy quotation code" />
          </div>
        ) : (
          <div className="documentOutputImageFrame quotationThemePreviewFrame">
            <div
              className="quotationThemeStack"
              style={{ '--active-theme-color': activeQuotationTheme.accent }}
              aria-label={`Quotation PDF target output, ${activeQuotationTheme.label} theme`}
            >
              {quotationThemePreviewSlides.map((slide, index) => {
                const slideOffset =
                  (index - activeQuotationThemeIndex + quotationThemePreviewSlides.length) %
                  quotationThemePreviewSlides.length;
                const stackState =
                  slideOffset === 0 ? 'isActive' : slideOffset === 1 ? 'isNext' : 'isPrevious';

                return (
                  <img
                    key={slide.id}
                    className={`quotationThemeSheet ${stackState}`}
                    src={slide.src}
                    alt=""
                    aria-hidden={slideOffset !== 0}
                  />
                );
              })}
              {isDocumentComplete ? (
                <span className="documentCompleteWatermark" aria-hidden="true" />
              ) : null}
            </div>
            <div className="quotationThemeDots" aria-hidden="true">
              {quotationThemePreviewSlides.map((slide, index) => (
                <span
                  key={slide.id}
                  className={index === activeQuotationThemeIndex ? 'isActive' : ''}
                  style={{ '--dot-color': slide.accent }}
                />
              ))}
            </div>
          </div>
        )}

        {!isDocumentComplete ? (
          <div className="documentCodePreview isLocked">
            <div className="documentCodePreviewHeader">
              <div>
                <p className="eyebrow">Code Blueprint</p>
                <h4>โค้ดตัวอย่างปลายทาง</h4>
              </div>
            </div>
            <p>ผ่าน checkpoint บท 16 ก่อน แล้วค่อยเปิดดู code ตัวอย่างฉบับเต็ม</p>
          </div>
        ) : null}
      </aside>
    );
  }

  function renderQuotationPreviewSection() {
    const hasQuotationLessonGroup = documentGroups.some(
      (group) => group.title === 'Document 2: Quotation',
    );

    if (isWorkspaceMode || hasQuotationLessonGroup) {
      return null;
    }

    const quotationPreviewMode = documentPreviewModeById[quotationPreviewId] ?? 'image';
    const isCodePreviewMode = quotationPreviewMode === 'code';
    const activeQuotationTheme = quotationThemePreviewSlides[activeQuotationThemeIndex];

    return (
      <section
        className={`upcomingDocumentSection ${
          activeRoadmapSectionId === quotationPreviewId ? 'isActive' : ''
        }`}
        data-roadmap-section={quotationPreviewId}
        aria-label="Document 2 Quotation preview"
      >
        <div className="documentRoadmapHeader upcomingDocumentHeader">
          <p className="eyebrow">Next Document</p>
          <h2>Document 2: Quotation</h2>
          <p>
            ใช้ raw rows จากข้อมูลขาย จัดเป็น quotation model แล้วค่อยวาดใบเสนอราคาเป็น PDF
          </p>
        </div>

        <div className="upcomingDocumentBody">
          <div className="lessonRoadmap upcomingLessonRoadmap" role="list">
            {quotationPreviewSteps.map((step) => (
              <article
                key={step.number}
                className="roadmapLesson upcomingRoadmapLesson"
                role="listitem"
              >
                <span className="lessonNumber upcomingDocumentNumber">
                  <span>{step.number}</span>
                </span>
                <span className="lessonCopy">
                  <span className="checkpointLabel">{step.status}</span>
                  <span className="lessonTitle">{step.title}</span>
                  <span className="lessonProgressMeta isLocked">Preparing</span>
                  <span className="lessonSummary">{step.summary}</span>
                </span>
              </article>
            ))}
          </div>

          <aside
            className={`documentOutputPreview upcomingDocumentPreview ${
              isCodePreviewMode ? 'isCodeMode' : ''
            }`}
            aria-label="Quotation target output"
          >
            <div className="documentOutputPreviewHeader">
              <div>
                <p className="eyebrow">Target Output</p>
                <h3>Quotation PDF</h3>
                <p>ภาพและ code ปลายทางสำหรับใช้เป็น blueprint ก่อนแตกบทเรียน</p>
              </div>
              <div className="documentModeSwitch" role="group" aria-label="Quotation preview mode">
                <button
                  type="button"
                  className={`documentModeButton ${quotationPreviewMode === 'image' ? 'isSelected' : ''}`}
                  onClick={() =>
                    setDocumentPreviewModeById((current) => ({
                      ...current,
                      [quotationPreviewId]: 'image',
                    }))
                  }
                  aria-pressed={quotationPreviewMode === 'image'}
                  title="ดูภาพเอกสาร"
                >
                  <span className="documentModeIcon isImage" aria-hidden="true" />
                  <span className="srOnly">ดูภาพเอกสาร</span>
                </button>
                <button
                  type="button"
                  className={`documentModeButton ${isCodePreviewMode ? 'isSelected' : ''}`}
                  onClick={() =>
                    setDocumentPreviewModeById((current) => ({
                      ...current,
                      [quotationPreviewId]: 'code',
                    }))
                  }
                  aria-pressed={isCodePreviewMode}
                  title="ดู code blueprint"
                >
                  <span className="documentModeIcon isCode" aria-hidden="true" />
                  <span className="srOnly">ดู code blueprint</span>
                </button>
              </div>
            </div>

            {isCodePreviewMode ? (
              <div className="documentOutputCodeFrame">
                <div className="documentOutputCodeIntro">
                  <p className="eyebrow">Golden Code</p>
                  <h4>code ที่สร้าง output นี้ได้</h4>
                  <p>ยังเป็น code ปลายทางก่อนแตกเป็นบท 01..n ของเอกสาร Quotation</p>
                </div>
                <CopyableCodeBlock code={quotationBlueprintCode} copyLabel="Copy quotation code" />
              </div>
            ) : (
              <div className="documentOutputImageFrame quotationThemePreviewFrame">
                <div
                  className="quotationThemeStack"
                  style={{ '--active-theme-color': activeQuotationTheme.accent }}
                  aria-label={`Quotation PDF target output, ${activeQuotationTheme.label} theme`}
                >
                  {quotationThemePreviewSlides.map((slide, index) => {
                    const slideOffset =
                      (index - activeQuotationThemeIndex + quotationThemePreviewSlides.length) %
                      quotationThemePreviewSlides.length;
                    const stackState =
                      slideOffset === 0 ? 'isActive' : slideOffset === 1 ? 'isNext' : 'isPrevious';

                    return (
                      <img
                        key={slide.id}
                        className={`quotationThemeSheet ${stackState}`}
                        src={slide.src}
                        alt=""
                        aria-hidden={slideOffset !== 0}
                      />
                    );
                  })}
                </div>
                <div className="quotationThemeDots" aria-hidden="true">
                  {quotationThemePreviewSlides.map((slide, index) => (
                    <span
                      key={slide.id}
                      className={index === activeQuotationThemeIndex ? 'isActive' : ''}
                      style={{ '--dot-color': slide.accent }}
                    />
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    );
  }

  function renderDocumentGroup(group) {
    return (
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
          {leadingDocumentGroups.map((group) => renderDocumentGroup(group))}
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

        <div className="documentRoadmapGroups">
          {trailingDocumentGroups.map((group) => renderDocumentGroup(group))}
        </div>

        {renderQuotationPreviewSection()}
      </div>
    </section>
  );
}

export default LessonRoadmap;
