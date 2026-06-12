import { jspdfCatalogSections } from '../reference/jspdfCatalog.js';

function JsPdfCatalog({ isSelected, isCompact, onSelectReference }) {
  const catalogItemCount = jspdfCatalogSections.reduce(
    (itemCount, section) => itemCount + section.items.length,
    0,
  );

  return (
    <button
      type="button"
      className={`roadmapLesson catalogRoadmapLesson ${isSelected ? 'isSelected' : ''}`}
      onClick={onSelectReference}
      aria-current={isSelected ? 'step' : undefined}
    >
      <span className="lessonNumber catalogRoadmapNumber">REF</span>
      {!isCompact ? (
        <span className="lessonCopy">
          <span className="checkpointLabel">Reference</span>
          <span className="lessonTitle">สารบัญ jsPDF</span>
          <span className="lessonProgressMeta">
            {jspdfCatalogSections.length} หมวด / {catalogItemCount} รายการ
          </span>
          <span className="lessonSummary">
            เปิดภาพจำของคำสั่งและ parameter ก่อนลงมือในบทเรียน
          </span>
        </span>
      ) : null}
    </button>
  );
}

export default JsPdfCatalog;
