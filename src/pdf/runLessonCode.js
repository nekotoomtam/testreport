import { jsPDF } from 'jspdf';
import { PDF_FONTS, registerThaiFont } from './registerPdfFonts.js';

function getErrorMessage(error) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return String(error);
}

function createUnavailableImageGetter() {
  throw new Error('Image assets are not available for this lesson.');
}

function createUnavailableLessonDataGetter(dataSourceId) {
  throw new Error(`Data source "${dataSourceId}" is not available for this lesson.`);
}

export function runLessonCode(code, helpers = {}) {
  if (!code || !code.trim()) {
    throw new Error('Code is empty. Define function generate() and return a jsPDF document.');
  }

  let getGenerate;
  const getLessonImage = helpers.getLessonImage ?? createUnavailableImageGetter;
  const getLessonData = helpers.getLessonData ?? createUnavailableLessonDataGetter;

  try {
    getGenerate = new Function(
      'jsPDF',
      'registerThaiFont',
      'PDF_FONTS',
      'getLessonImage',
      'getLessonData',
      `"use strict";
${code}

return typeof generate === "function" ? generate : undefined;`,
    );
  } catch (error) {
    throw new Error(`Could not parse lesson code: ${getErrorMessage(error)}`);
  }

  let generate;

  try {
    generate = getGenerate(jsPDF, registerThaiFont, PDF_FONTS, getLessonImage, getLessonData);
  } catch (error) {
    throw new Error(`Could not prepare lesson code: ${getErrorMessage(error)}`);
  }

  if (typeof generate !== 'function') {
    throw new Error('Missing function generate(). Define function generate() { ... return doc; }.');
  }

  let doc;

  try {
    doc = generate();
  } catch (error) {
    throw new Error(`generate() failed: ${getErrorMessage(error)}`);
  }

  if (!doc || typeof doc.output !== 'function') {
    throw new Error('generate() must return a jsPDF document created with new jsPDF(...).');
  }

  return doc;
}
