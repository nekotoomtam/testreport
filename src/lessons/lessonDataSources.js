import { quotationRawRows } from '../blueprints/quotationBlueprint.js';

const lessonDataSets = {
  quotationRows: quotationRawRows,
};

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

export function getLessonDataSet(dataSourceId) {
  return lessonDataSets[dataSourceId] ?? null;
}

export function createLessonDataGetter(allowedDataSourceIds = []) {
  const allowedDataSourceIdSet = new Set(allowedDataSourceIds);

  return function getLessonData(dataSourceId) {
    if (!allowedDataSourceIdSet.has(dataSourceId)) {
      throw new Error(`Data source "${dataSourceId}" is not available for this lesson.`);
    }

    const dataSet = getLessonDataSet(dataSourceId);

    if (!dataSet) {
      throw new Error(`Unknown lesson data source: ${dataSourceId}`);
    }

    return cloneData(dataSet);
  };
}
