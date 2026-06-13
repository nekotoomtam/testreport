import { dataReferenceSections } from '../reference/dataReferenceCatalog.js';

function DataReferenceCatalog({
  isSelected,
  isCompact,
  isLocked,
  lockMessage = 'ผ่าน Checkpoint บท 10 ก่อน',
  onSelectDataReference,
}) {
  const catalogItemCount = dataReferenceSections.reduce(
    (itemCount, section) => itemCount + section.items.length,
    0,
  );

  return (
    <button
      type="button"
      className={`roadmapLesson catalogRoadmapLesson dataCatalogRoadmapLesson ${
        isSelected ? 'isSelected' : ''
      } ${isLocked ? 'isLocked' : ''}`}
      onClick={onSelectDataReference}
      disabled={isLocked}
      aria-disabled={isLocked}
      aria-current={isSelected ? 'step' : undefined}
    >
      <span className="lessonNumber catalogRoadmapNumber dataCatalogRoadmapNumber">DATA</span>
      {!isCompact ? (
        <span className="lessonCopy">
          <span className="checkpointLabel">Data Ref</span>
          <span className="lessonTitle">สารบัญจัดข้อมูล</span>
          <span className={`lessonProgressMeta ${isLocked ? 'isLocked' : ''}`}>
            {isLocked ? 'ยังไม่เปิด' : `${dataReferenceSections.length} หมวด / ${catalogItemCount} รายการ`}
          </span>
          <span className="lessonSummary">
            จัด raw data เป็น clean model ก่อนส่งเข้า function สร้าง PDF
          </span>
        </span>
      ) : null}
      {isLocked && !isCompact ? (
        <span className="lessonLockOverlay">
          <span>ยังไม่เปิด</span>
          <strong>{lockMessage}</strong>
        </span>
      ) : null}
    </button>
  );
}

export default DataReferenceCatalog;
