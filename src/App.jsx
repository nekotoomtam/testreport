import { useEffect, useMemo, useRef, useState } from 'react';
import CodeEditor from './components/CodeEditor.jsx';
import ConsolePanel from './components/ConsolePanel.jsx';
import CopyableCodeBlock from './components/CopyableCodeBlock.jsx';
import DataReferenceWorkspace from './components/DataReferenceWorkspace.jsx';
import LessonRoadmap from './components/LessonRoadmap.jsx';
import PdfPreview from './components/PdfPreview.jsx';
import QuickReference from './components/QuickReference.jsx';
import ReferenceWorkspace from './components/ReferenceWorkspace.jsx';
import { lessons } from './lessons/basicLessons.js';
import { getChecklistGuide } from './lessons/checklistGuides.js';
import { evaluateLessonChecklist } from './lessons/evaluateLessonChecklist.js';
import { createPdfUrl } from './pdf/createPdfUrl.js';
import { prepareLessonImageAssets } from './pdf/lessonImageAssets.js';
import { runLessonCode } from './pdf/runLessonCode.js';
import {
  readLessonWorkEntries,
  saveLessonWorkEntry,
} from './storage/lessonWorkStore.js';

const initialLesson = lessons[0];
const progressStorageKey = 'jspdf-visual-lessons-progress-v2';

function isRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function readStoredProgress() {
  const emptyProgress = {
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
      hintProgress: isRecord(parsedValue?.hintProgress) ? parsedValue.hintProgress : {},
      runCounts: isRecord(parsedValue?.runCounts) ? parsedValue.runCounts : {},
    };
  } catch (error) {
    console.warn('Could not read stored lesson progress.', error);
    return emptyProgress;
  }
}

function isLessonChecklistComplete(lesson, checklistResult) {
  const items = lesson.completionChecklist ?? [];

  return items.length > 0 && items.every((item) => Boolean(checklistResult[item.id]));
}

function getNextRunCount(progress, lesson, checklistResult) {
  const currentRunCount = progress.runCounts[lesson.id] ?? 0;

  return currentRunCount + (isLessonChecklistComplete(lesson, checklistResult) ? 0 : 1);
}

function getChecklistItemScope(item) {
  if (item.scope) {
    return item.scope;
  }

  if (item.id === 'previous-stage') {
    return 'base';
  }

  if (item.id === 'run-preview') {
    return 'run';
  }

  return 'task';
}

function getChecklistScopeTitle(scope, lesson) {
  if (scope === 'base') {
    return 'ฐานจากบทก่อน';
  }

  if (scope === 'run') {
    return 'สถานะการรัน';
  }

  return lesson.type === 'checkpoint' ? 'รายการตรวจ checkpoint' : 'งานใหม่ของบทนี้';
}

function getChecklistScopeDescription(scope) {
  if (scope === 'base') {
    return 'ควรผ่านอยู่แล้วถ้า code จากบทก่อนยังไม่หาย';
  }

  if (scope === 'run') {
    return 'ใช้ยืนยันว่า generate() ทำงานและ preview ถูกสร้างได้';
  }

  return 'ส่วนนี้คือสิ่งที่บทนี้อยากให้เพิ่มหรือปรับจริง ๆ';
}

function getChecklistGroups(checklistItems, lesson) {
  const scopeOrder = ['task', 'base', 'run'];

  return scopeOrder
    .map((scope) => {
      const items = checklistItems.filter((item) => getChecklistItemScope(item) === scope);

      return {
        scope,
        title: getChecklistScopeTitle(scope, lesson),
        description: getChecklistScopeDescription(scope),
        items,
      };
    })
    .filter((group) => group.items.length > 0);
}

function countCheckedItems(items, checklistResult) {
  return items.filter((item) => checklistResult[item.id]).length;
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

function getFriendlyRunErrorMessage(error) {
  const message = error instanceof Error && error.message ? error.message : String(error);

  if (message.includes('Could not parse lesson code')) {
    return `โค้ดอ่านไม่ได้ น่าจะมีวงเล็บ ปีกกา quote หรือ comma ขาดอยู่: ${message}`;
  }

  if (/is not defined/i.test(message)) {
    return `น่าจะสะกดชื่อตัวแปรหรือฟังก์ชันผิด หรือเรียกชื่อที่ยังไม่ได้ประกาศ: ${message}`;
  }

  if (message.includes('generate() must return')) {
    return 'function generate() ต้อง return doc ที่สร้างจาก new jsPDF(...)';
  }

  if (message.includes('Missing function generate')) {
    return 'ต้องมี function generate() ครอบ code ของบทเรียนก่อน';
  }

  if (message.includes('Image assets are not available')) {
    return 'บทนี้ยังไม่มี image asset ให้ใช้ หรือเรียก getLessonImage() ในบทที่ไม่ได้เตรียมรูปไว้';
  }

  return message;
}

function getNextHintProgress(
  lesson,
  checklistItems,
  checklistResult,
  currentChecklistResult,
  previousProgress,
  activeHintItemIds,
) {
  if (!hasCheckpointHintLadder(lesson)) {
    return previousProgress;
  }

  const activeHintItemIdSet = new Set(activeHintItemIds);

  return checklistItems.reduce((nextProgress, item) => {
    if (currentChecklistResult[item.id]) {
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

function getActiveCheckpointHintIds(lesson, checklistItems, checklistResult) {
  if (!hasCheckpointHintLadder(lesson)) {
    return [];
  }

  return checklistItems
    .filter((item) => !checklistResult[item.id] && item.hints?.length === 3)
    .slice(0, 2)
    .map((item) => item.id);
}

function getPreviousLesson(lesson) {
  const lessonIndex = lessons.findIndex((currentLesson) => currentLesson.id === lesson.id);

  return lessonIndex > 0 ? lessons[lessonIndex - 1] : null;
}

function getCompletedLessonCode(lesson, lessonWorkById) {
  const lessonWork = lessonWorkById[lesson.id];
  const baseCode = getLessonBaseCode(lesson, lessonWorkById);
  const previousLesson = getPreviousLesson(lesson);

  if (
    !isLessonWorkCurrent(lesson, lessonWork) ||
    typeof lessonWork.code !== 'string' ||
    (previousLesson && lessonWork.baseCode !== baseCode) ||
    lessonWork.checklistEvaluatedCode !== lessonWork.code
  ) {
    return null;
  }

  const checklistResult = isRecord(lessonWork.checklistResult) ? lessonWork.checklistResult : {};

  return isLessonChecklistComplete(lesson, checklistResult) ? lessonWork.code : null;
}

function getLessonBaseCode(lesson, lessonWorkById) {
  const previousLesson = getPreviousLesson(lesson);
  const previousLessonCode = previousLesson
    ? getCompletedLessonCode(previousLesson, lessonWorkById)
    : null;

  return previousLessonCode ?? lesson.starterCode;
}

function getLessonDraftCode(lesson, lessonWorkById) {
  const lessonWork = lessonWorkById[lesson.id];
  const draftCode = lessonWork?.code;
  const baseCode = getLessonBaseCode(lesson, lessonWorkById);
  const previousLesson = getPreviousLesson(lesson);

  if (!isLessonWorkCurrent(lesson, lessonWork)) {
    return baseCode;
  }

  if (previousLesson && lessonWork.baseCode !== baseCode) {
    return baseCode;
  }

  return typeof draftCode === 'string' ? draftCode : baseCode;
}

function isLessonUnlocked(lesson, lessonCompletionById) {
  const lessonIndex = lessons.findIndex((currentLesson) => currentLesson.id === lesson.id);

  if (lessonIndex <= 0) {
    return true;
  }

  return lessons
    .slice(0, lessonIndex)
    .every((previousLesson) => Boolean(lessonCompletionById[previousLesson.id]));
}

function getEffectiveChecklistResult(lesson, lessonWorkById, currentCode) {
  const lessonWork = lessonWorkById[lesson.id];
  const draftCode = currentCode ?? getLessonDraftCode(lesson, lessonWorkById);

  if (
    !isLessonWorkCurrent(lesson, lessonWork) ||
    lessonWork.checklistEvaluatedCode !== draftCode
  ) {
    return {};
  }

  return isRecord(lessonWork.checklistResult) ? lessonWork.checklistResult : {};
}

function isLessonWorkCurrent(lesson, lessonWork) {
  if (!lessonWork) {
    return false;
  }

  if (typeof lesson.starterCodeVersion !== 'number') {
    return true;
  }

  return lessonWork.starterCodeVersion === lesson.starterCodeVersion;
}

function createLessonWorkMap(entries) {
  return entries.reduce((lessonWorkMap, entry) => {
    if (!isRecord(entry) || typeof entry.lessonId !== 'string') {
      return lessonWorkMap;
    }

    return {
      ...lessonWorkMap,
      [entry.lessonId]: {
        lessonId: entry.lessonId,
        code: typeof entry.code === 'string' ? entry.code : '',
        baseCode: typeof entry.baseCode === 'string' ? entry.baseCode : null,
        checklistResult: isRecord(entry.checklistResult) ? entry.checklistResult : {},
        checklistEvaluatedCode:
          typeof entry.checklistEvaluatedCode === 'string'
            ? entry.checklistEvaluatedCode
            : null,
        starterCodeVersion:
          typeof entry.starterCodeVersion === 'number' ? entry.starterCodeVersion : null,
        updatedAt: typeof entry.updatedAt === 'string' ? entry.updatedAt : null,
      },
    };
  }, {});
}

function App() {
  const [viewMode, setViewMode] = useState('course-map');
  const [roadmapRailMode, setRoadmapRailMode] = useState('compact');
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [code, setCode] = useState('');
  const [pdfUrl, setPdfUrl] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [isEditorExpanded, setIsEditorExpanded] = useState(false);
  const [collapsedLessonCards, setCollapsedLessonCards] = useState({});
  const [lessonProgress, setLessonProgress] = useState(() => readStoredProgress());
  const [lessonWorkById, setLessonWorkById] = useState({});
  const [isLessonWorkLoaded, setIsLessonWorkLoaded] = useState(false);
  const [activeHintItemIds, setActiveHintItemIds] = useState([]);
  const [openChecklistGuideById, setOpenChecklistGuideById] = useState({});
  const [openCodeTargetById, setOpenCodeTargetById] = useState({});
  const [consoleEntry, setConsoleEntry] = useState({
    type: 'info',
    message: 'Choose a lesson, edit the code, then run it.',
  });
  const pdfUrlRef = useRef(null);
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
    let isMounted = true;

    async function readStoredLessonWork() {
      const entries = await readLessonWorkEntries();

      if (!isMounted) {
        return;
      }

      setLessonWorkById(createLessonWorkMap(entries));
      setIsLessonWorkLoaded(true);
    }

    readStoredLessonWork();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isLessonWorkLoaded || !selectedLessonId) {
      return;
    }

    const storedCode = getLessonDraftCode(selectedLesson, lessonWorkById);

    setCode((currentCode) =>
      currentCode === '' || currentCode === selectedLesson.starterCode
        ? storedCode
        : currentCode,
    );
  }, [isLessonWorkLoaded, lessonWorkById, selectedLesson, selectedLessonId]);

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

  function persistLessonWork(nextLessonWork) {
    setLessonWorkById((current) => ({
      ...current,
      [nextLessonWork.lessonId]: {
        ...current[nextLessonWork.lessonId],
        ...nextLessonWork,
      },
    }));
    saveLessonWorkEntry(nextLessonWork);
  }

  function handleSelectLesson(lessonId) {
    const nextLesson = lessons.find((lesson) => lesson.id === lessonId);

    if (!nextLesson) {
      return;
    }

    if (!lessonUnlockById[nextLesson.id] && !lessonCompletionById[nextLesson.id]) {
      const previousLesson = getPreviousLesson(nextLesson);

      setConsoleEntry({
        type: 'info',
        message: previousLesson
          ? `Complete lesson ${previousLesson.order} before opening lesson ${nextLesson.order}.`
          : 'This lesson is still locked.',
      });
      return;
    }

    clearGeneratedPreview();
    setSelectedLessonId(nextLesson.id);
    setCode(getLessonDraftCode(nextLesson, lessonWorkById));
    setConsoleEntry({
      type: 'info',
      message: 'Ready to generate this lesson. Press Run to update the PDF preview.',
    });
    setActiveHintItemIds([]);
    setOpenChecklistGuideById({});
    setIsEditorExpanded(false);
    setRoadmapRailMode('compact');
    setViewMode('lesson');
  }

  function handleSelectReference() {
    clearGeneratedPreview();
    setSelectedLessonId(null);
    setActiveHintItemIds([]);
    setOpenChecklistGuideById({});
    setIsEditorExpanded(false);
    setRoadmapRailMode('compact');
    setViewMode('reference');
  }

  function handleSelectDataReference() {
    if (!isDataReferenceUnlocked) {
      setConsoleEntry({
        type: 'info',
        message: 'Complete Document 1 before opening the Data REF.',
      });
      return;
    }

    clearGeneratedPreview();
    setSelectedLessonId(null);
    setActiveHintItemIds([]);
    setOpenChecklistGuideById({});
    setIsEditorExpanded(false);
    setRoadmapRailMode('compact');
    setViewMode('data-reference');
  }

  function handleResetLesson() {
    const baseCode = getLessonBaseCode(selectedLesson, lessonWorkById);
    const resetLessonWork = {
      lessonId: selectedLesson.id,
      code: baseCode,
      baseCode,
      checklistResult: {},
      checklistEvaluatedCode: null,
      starterCodeVersion: selectedLesson.starterCodeVersion ?? null,
    };

    setCode(baseCode);
    persistLessonWork(resetLessonWork);
    setActiveHintItemIds([]);
    setOpenChecklistGuideById({});
  }

  function handleCodeChange(nextCode) {
    const previousLessonWork = lessonWorkById[selectedLesson.id] ?? {};
    const baseCode = getLessonBaseCode(selectedLesson, lessonWorkById);
    const previousLesson = getPreviousLesson(selectedLesson);
    const shouldPreserveChecklist =
      isLessonWorkCurrent(selectedLesson, previousLessonWork) &&
      (!previousLesson || previousLessonWork.baseCode === baseCode);
    const nextLessonWork = {
      lessonId: selectedLesson.id,
      code: nextCode,
      baseCode,
      checklistResult: shouldPreserveChecklist && isRecord(previousLessonWork.checklistResult)
        ? previousLessonWork.checklistResult
        : {},
      checklistEvaluatedCode:
        shouldPreserveChecklist && typeof previousLessonWork.checklistEvaluatedCode === 'string'
          ? previousLessonWork.checklistEvaluatedCode
          : null,
      starterCodeVersion: selectedLesson.starterCodeVersion ?? null,
    };

    setCode(nextCode);
    persistLessonWork(nextLessonWork);
    setActiveHintItemIds([]);
  }

  function handleToggleChecklistGuide(itemId, guideType) {
    const guideKey = `${selectedLesson.id}:${itemId}`;

    setOpenChecklistGuideById((current) => ({
      ...current,
      [guideKey]: current[guideKey] === guideType ? null : guideType,
    }));
  }

  function handleToggleCodeTarget() {
    setOpenCodeTargetById((current) => ({
      ...current,
      [selectedLesson.id]: !current[selectedLesson.id],
    }));
  }

  function handleToggleLessonCard(cardId) {
    const shouldCollapseExpandedEditor = cardId === 'code' && !collapsedLessonCards.code;

    setCollapsedLessonCards((current) => ({
      ...current,
      [cardId]: !current[cardId],
    }));

    if (shouldCollapseExpandedEditor) {
      setIsEditorExpanded(false);
    }
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
    if (isSelectedLessonLocked || isCheckpointLocked) {
      setConsoleEntry({
        type: 'info',
        message: isCheckpointLocked
          ? 'Complete lessons 1-9 before running this checkpoint.'
          : 'Complete the previous lesson before running this lesson.',
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
      const previousChecklistResult = getEffectiveChecklistResult(
        selectedLesson,
        lessonWorkById,
        code,
      );
      const checkedItemCount = checklistItems.filter((item) => checklistResult[item.id]).length;
      const nextRunCount = getNextRunCount(lessonProgress, selectedLesson, previousChecklistResult);
      const nextActiveHintItemIds = getActiveCheckpointHintIds(
        selectedLesson,
        checklistItems,
        checklistResult,
      );
      const nextLessonWork = {
        lessonId: selectedLesson.id,
        code,
        baseCode: getLessonBaseCode(selectedLesson, lessonWorkById),
        checklistResult,
        checklistEvaluatedCode: code,
        starterCodeVersion: selectedLesson.starterCodeVersion ?? null,
      };

      persistLessonWork(nextLessonWork);

      setLessonProgress((current) => {
        const currentActiveHintItemIds = getActiveCheckpointHintIds(
          selectedLesson,
          checklistItems,
          checklistResult,
        );
        const currentHintProgress = getNextHintProgress(
          selectedLesson,
          checklistItems,
          checklistResult,
          checklistResult,
          current.hintProgress[selectedLesson.id] ?? {},
          currentActiveHintItemIds,
        );

        return {
          hintProgress: hasCheckpointHintLadder(selectedLesson)
            ? {
                ...current.hintProgress,
                [selectedLesson.id]: currentHintProgress,
              }
            : current.hintProgress,
          runCounts: {
            ...current.runCounts,
            [selectedLesson.id]: getNextRunCount(
              current,
              selectedLesson,
              previousChecklistResult,
            ),
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
      const previousChecklistResult = getEffectiveChecklistResult(
        selectedLesson,
        lessonWorkById,
        code,
      );
      const nextRunCount = getNextRunCount(lessonProgress, selectedLesson, previousChecklistResult);
      const failedLessonWork = {
        lessonId: selectedLesson.id,
        code,
        baseCode: getLessonBaseCode(selectedLesson, lessonWorkById),
        checklistResult: {},
        checklistEvaluatedCode: code,
        starterCodeVersion: selectedLesson.starterCodeVersion ?? null,
      };

      persistLessonWork(failedLessonWork);
      setActiveHintItemIds([]);

      setLessonProgress((current) => ({
        ...current,
        runCounts: {
          ...current.runCounts,
          [selectedLesson.id]: getNextRunCount(current, selectedLesson, previousChecklistResult),
        },
      }));

      setConsoleEntry({
        type: 'error',
        message: `Could not generate PDF. ${getFriendlyRunErrorMessage(error)} Run ${nextRunCount}.`,
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
  const checkedItems = getEffectiveChecklistResult(selectedLesson, lessonWorkById, code);
  const checkedItemCount = checklistItems.filter((item) => checkedItems[item.id]).length;
  const checklistGroups = getChecklistGroups(checklistItems, selectedLesson);
  const taskChecklistItems = checklistItems.filter(
    (item) => getChecklistItemScope(item) === 'task',
  );
  const baseChecklistItems = checklistItems.filter(
    (item) => getChecklistItemScope(item) === 'base',
  );
  const checkedTaskItemCount = countCheckedItems(taskChecklistItems, checkedItems);
  const checkedBaseItemCount = countCheckedItems(baseChecklistItems, checkedItems);
  const selectedLessonRunCount = lessonRunCounts[selectedLesson.id] ?? 0;
  const selectedHintProgress = lessonProgress.hintProgress[selectedLesson.id] ?? {};
  const lessonCompletionById = useMemo(
    () =>
      lessons.reduce((completionMap, lesson) => {
        const items = lesson.completionChecklist ?? [];
        const checklistResult =
          lesson.id === selectedLesson.id
            ? getEffectiveChecklistResult(lesson, lessonWorkById, code)
            : getEffectiveChecklistResult(lesson, lessonWorkById);

        return {
          ...completionMap,
          [lesson.id]: items.length > 0 && items.every((item) => checklistResult[item.id]),
        };
      }, {}),
    [code, lessonWorkById, selectedLesson.id],
  );
  const lessonUnlockById = useMemo(
    () =>
      lessons.reduce(
        (unlockMap, lesson) => ({
          ...unlockMap,
          [lesson.id]: isLessonUnlocked(lesson, lessonCompletionById),
        }),
        {},
      ),
    [lessonCompletionById],
  );
  const checkpointPrerequisites = useMemo(
    () => getCheckpointPrerequisites(selectedLesson),
    [selectedLesson],
  );
  const isSelectedLessonLocked = !lessonUnlockById[selectedLesson.id];
  const isCheckpointLocked =
    selectedLesson.type === 'checkpoint' &&
    checkpointPrerequisites.some((lesson) => !lessonCompletionById[lesson.id]);
  const isDataReferenceUnlocked = Boolean(lessonCompletionById['checkpoint-project-summary']);
  const isSelectedLessonComplete = Boolean(lessonCompletionById[selectedLesson.id]);
  const isCodeTargetOpen = Boolean(openCodeTargetById[selectedLesson.id]);
  const lessonTargetCode = selectedLesson.solutionCode ?? '';
  const completedPrerequisiteCount = checkpointPrerequisites.filter(
    (lesson) => lessonCompletionById[lesson.id],
  ).length;
  const taskHeading = selectedLesson.challenge
    ? 'Challenge'
    : selectedLesson.practice
      ? 'Practice'
      : 'Mini Task';
  const isTargetCardCollapsed = Boolean(collapsedLessonCards.target);
  const isWorkCardCollapsed = Boolean(collapsedLessonCards.work);
  const isCodeCardCollapsed = Boolean(collapsedLessonCards.code);

  const appShellClassName = [
    'appShell',
    viewMode === 'lesson' || viewMode === 'reference' || viewMode === 'data-reference'
      ? 'isLessonMode'
      : 'isCourseMapMode',
    (viewMode === 'lesson' || viewMode === 'reference' || viewMode === 'data-reference') &&
    roadmapRailMode === 'compact'
      ? 'isRoadmapCompact'
      : '',
    (viewMode === 'lesson' || viewMode === 'reference' || viewMode === 'data-reference') &&
    roadmapRailMode === 'rail'
      ? 'isRoadmapRailOpen'
      : '',
  ]
    .filter(Boolean)
    .join(' ');

  function renderChecklistItem(item) {
    const isComplete = Boolean(checkedItems[item.id]);
    const hintProgress = selectedHintProgress[item.id] ?? 0;
    const hintText = getChecklistHint(item, hintProgress);
    const hintLevel = getHintLevel(hintProgress);
    const guide = getChecklistGuide(selectedLesson, item, hintText);
    const guideKey = `${selectedLesson.id}:${item.id}`;
    const openGuideType = openChecklistGuideById[guideKey];
    const shouldShowAnswer = Boolean(guide.answerCode);
    const shouldShowHintBadge =
      !isComplete && activeHintItemIds.includes(item.id) && Boolean(hintText);

    return (
      <li
        key={item.id}
        className={`${isComplete ? 'isComplete' : ''} ${openGuideType ? 'hasGuide' : ''}`}
      >
        <span className="checkStatus" aria-label={isComplete ? 'Passed' : 'Pending'} />
        <div className="checklistItemBody">
          <div className="checklistItemMain">
            <span>{item.label}</span>
            {!isComplete ? (
              <span className="checklistGuideActions">
                <button
                  type="button"
                  onClick={() => handleToggleChecklistGuide(item.id, 'hint')}
                  aria-expanded={openGuideType === 'hint'}
                >
                  Hint
                </button>
                {shouldShowAnswer ? (
                  <button
                    type="button"
                    onClick={() => handleToggleChecklistGuide(item.id, 'answer')}
                    aria-expanded={openGuideType === 'answer'}
                  >
                    ดูเฉลย
                  </button>
                ) : null}
                {shouldShowHintBadge ? (
                  <span className="hintLevelBadge">Lv {hintLevel}</span>
                ) : null}
              </span>
            ) : null}
          </div>
          {openGuideType ? (
            <div className="checklistGuidePanel">
              {openGuideType === 'hint' ? (
                <>
                  <p className="checkpointHintLevel">
                    {shouldShowHintBadge ? `คำใบ้ระดับ ${hintLevel}` : 'Hint'}
                  </p>
                  <p>{guide.hint}</p>
                </>
              ) : (
                <>
                  <p className="checkpointHintLevel">ตัวอย่าง code ที่ผ่านข้อนี้</p>
                  <p className="checklistGuideCopyHint">
                    นำ snippet นี้ไปเติมหรือเทียบใน function generate() เฉพาะส่วนของข้อนี้
                    แล้วกด Run เพื่อตรวจอีกครั้ง
                  </p>
                  <CopyableCodeBlock code={guide.answerCode} />
                </>
              )}
            </div>
          ) : null}
        </div>
      </li>
    );
  }

  return (
    <main className={appShellClassName}>
      <LessonRoadmap
        lessons={lessons}
        selectedLessonId={selectedLessonId}
        viewMode={viewMode}
        railMode={roadmapRailMode}
        lessonCompletionById={lessonCompletionById}
        lessonUnlockById={lessonUnlockById}
        lessonRunCounts={lessonRunCounts}
        isDataReferenceUnlocked={isDataReferenceUnlocked}
        onSelectLesson={handleSelectLesson}
        onSelectReference={handleSelectReference}
        onSelectDataReference={handleSelectDataReference}
        onAdvanceRoadmap={handleAdvanceRoadmap}
      />

      <div
        className={`workspaceShell ${
          viewMode === 'lesson' ? 'isLessonWorkspace' : 'isReferenceWorkspace'
        }`}
        aria-hidden={
          viewMode !== 'lesson' && viewMode !== 'reference' && viewMode !== 'data-reference'
        }
        inert={
          viewMode !== 'lesson' && viewMode !== 'reference' && viewMode !== 'data-reference'
            ? true
            : undefined
        }
      >
        {viewMode === 'reference' ? (
          <ReferenceWorkspace />
        ) : viewMode === 'data-reference' ? (
          <DataReferenceWorkspace />
        ) : (
          <>
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
            <section
              className={`lessonCard targetCard ${isTargetCardCollapsed ? 'isCollapsed' : ''}`}
              aria-label="Lesson target"
            >
              <div className="lessonCardHeader">
                <div>
                  <p className="eyebrow">Target</p>
                  <h3>เป้าหมายและภาพรวม</h3>
                </div>
                <button
                  type="button"
                  className="lessonCardToggle"
                  aria-expanded={!isTargetCardCollapsed}
                  onClick={() => handleToggleLessonCard('target')}
                >
                  <span className="srOnly">
                    {isTargetCardCollapsed ? 'Open target card' : 'Collapse target card'}
                  </span>
                </button>
              </div>
              {!isTargetCardCollapsed ? (
                <div className="lessonCardBody">
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

                </div>
              ) : null}
            </section>

            <section
              className={`lessonCard workCard ${isWorkCardCollapsed ? 'isCollapsed' : ''}`}
              aria-label="Lesson work"
            >
              <div className="lessonCardHeader">
                <div>
                  <p className="eyebrow">Work</p>
                  <h3>เช็คงานและคำใบ้</h3>
                </div>
                <button
                  type="button"
                  className="lessonCardToggle"
                  aria-expanded={!isWorkCardCollapsed}
                  onClick={() => handleToggleLessonCard('work')}
                >
                  <span className="srOnly">
                    {isWorkCardCollapsed ? 'Open work card' : 'Collapse work card'}
                  </span>
                </button>
              </div>

              {!isWorkCardCollapsed ? (
                <div className="lessonCardBody">
            {checklistItems.length > 0 && !isSelectedLessonLocked && !isCheckpointLocked ? (
              <section className="lessonInfoBlock">
                <div className="checklistHeader">
                  <h3>Lesson Checklist</h3>
                  <div className="checklistStats">
                    {taskChecklistItems.length > 0 ? (
                      <span>งานใหม่ {checkedTaskItemCount}/{taskChecklistItems.length}</span>
                    ) : null}
                    {baseChecklistItems.length > 0 ? (
                      <span>ฐาน {checkedBaseItemCount}/{baseChecklistItems.length}</span>
                    ) : null}
                    <span>ทั้งหมด {checkedItemCount}/{checklistItems.length}</span>
                    <span>Runs {selectedLessonRunCount}</span>
                  </div>
                </div>
                <p className="checklistHint">
                  ตรวจอัตโนมัติจาก code และ PDF หลังจากกด Run โดยแยกงานใหม่ออกจากฐานที่แบกมาจากบทก่อน
                </p>
                <div className="checklistGroups">
                  {checklistGroups.map((group) => (
                    <section
                      key={group.scope}
                      className={`checklistGroup is${group.scope[0].toUpperCase()}${group.scope.slice(1)}`}
                    >
                      <div className="checklistGroupHeader">
                        <div>
                          <h4>{group.title}</h4>
                          <p>{group.description}</p>
                        </div>
                        <span>
                          {countCheckedItems(group.items, checkedItems)}/{group.items.length}
                        </span>
                      </div>
                      <ul className="autoChecklist">{group.items.map(renderChecklistItem)}</ul>
                    </section>
                  ))}
                </div>
              </section>
            ) : (
              <p className="lessonMutedText">Checklist จะพร้อมใช้งานเมื่อบทนี้เปิดให้ทำ</p>
            )}
                </div>
              ) : null}
            </section>

            <section
              className={`lessonCard codeCard ${isCodeCardCollapsed ? 'isCollapsed' : ''}`}
              aria-label="Lesson code"
            >
              <div className="lessonCardHeader">
                <div>
                  <p className="eyebrow">Code</p>
                  <h3>เขียนและทดสอบ code</h3>
                </div>
                <button
                  type="button"
                  className="lessonCardToggle"
                  aria-expanded={!isCodeCardCollapsed}
                  onClick={() => handleToggleLessonCard('code')}
                >
                  <span className="srOnly">
                    {isCodeCardCollapsed ? 'Open code card' : 'Collapse code card'}
                  </span>
                </button>
              </div>

              {!isCodeCardCollapsed ? (
                <div className="lessonCardBody">
          <div className="editorHeader">
            <p className="editorLabel">Code</p>
            {!isSelectedLessonLocked && !isCheckpointLocked ? (
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
          {isSelectedLessonLocked || isCheckpointLocked ? (
            <div className="lockedCodeNotice">
              <p className="checklistTitle">Code hidden</p>
              <p>
                {isCheckpointLocked
                  ? 'Starter code and Run are available after lessons 1-9 are complete.'
                  : 'Code and Run are available after the previous lesson is complete.'}
              </p>
            </div>
          ) : (
            <>
              <CodeEditor
                id="lesson-code-editor"
                value={code}
                onChange={handleCodeChange}
                height={editorHeight}
              />

              <p className="editorFootnote">
                ใช้ปุ่ม Run ทางขวาเพื่อสร้าง preview และตรวจ checklist ของบทนี้
              </p>

              <section
                className={`codeTargetPanel ${isSelectedLessonComplete ? '' : 'isLocked'}`}
                aria-label="Code target example"
              >
                <div className="codeTargetHeader">
                  <div>
                    <p className="eyebrow">Code Target</p>
                    <h3>ตัวอย่างโค้ดหลังจบบทนี้</h3>
                  </div>
                  {isSelectedLessonComplete && lessonTargetCode ? (
                    <button
                      type="button"
                      onClick={handleToggleCodeTarget}
                      aria-expanded={isCodeTargetOpen}
                    >
                      {isCodeTargetOpen ? 'Hide' : 'View'}
                    </button>
                  ) : null}
                </div>
                <p>
                  {isSelectedLessonComplete
                    ? 'เป็นตัวอย่างหนึ่งที่ให้ผลลัพธ์ผ่านโจทย์ โค้ดของเราต่างได้ถ้า preview และ checklist ตรงกัน'
                    : 'ผ่านบทนี้ก่อน แล้วค่อยเปิดดูตัวอย่างไว้ทาบกับ code ของเรา'}
                </p>
                {isSelectedLessonComplete && isCodeTargetOpen && lessonTargetCode ? (
                  <CopyableCodeBlock code={lessonTargetCode} copyLabel="Copy target code" />
                ) : null}
              </section>
            </>
          )}
                </div>
              ) : null}
            </section>
          </div>
            </section>

            <section className="previewPane lessonPreviewPane" aria-labelledby="preview-title">
              <div className="previewHeader">
                <p className="eyebrow">Preview</p>
                <h2 id="preview-title">PDF output</h2>
              </div>
              <PdfPreview pdfUrl={pdfUrl} />
              <div className="previewActionPanel">
                <div className="actionBar" aria-label="Lesson actions">
                  <button
                    type="button"
                    onClick={handleRunLesson}
                    disabled={isSelectedLessonLocked || isCheckpointLocked}
                  >
                    Run
                  </button>
                  <button
                    type="button"
                    className="secondaryButton"
                    onClick={handleResetLesson}
                    disabled={isSelectedLessonLocked || isCheckpointLocked}
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    className="secondaryButton"
                    onClick={handleDownloadPdf}
                    disabled={!lastDoc || isSelectedLessonLocked || isCheckpointLocked}
                  >
                    Download
                  </button>
                </div>
                <ConsolePanel entry={consoleEntry} />
              </div>
            </section>
          </>
        )}
      </div>
      <QuickReference isEnabled={viewMode === 'lesson'} />
    </main>
  );
}

export default App;
