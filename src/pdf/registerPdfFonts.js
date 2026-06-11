import { Get_font } from '../../pdf_font.js';

const THAI_FONT_FAMILY = 'THSarabunNew';
const THAI_FONT_FILE = `${THAI_FONT_FAMILY}.ttf`;

export const PDF_FONTS = Object.freeze({
  thai: Object.freeze({
    family: THAI_FONT_FAMILY,
    fileName: THAI_FONT_FILE,
    style: 'normal',
  }),
});

export function registerThaiFont(doc) {
  if (!doc || typeof doc.addFileToVFS !== 'function' || typeof doc.addFont !== 'function') {
    throw new Error('registerThaiFont(doc) expects a jsPDF document.');
  }

  const fontData = Get_font();

  if (!fontData) {
    throw new Error('TH Sarabun font data was not found in pdf_font.js.');
  }

  doc.addFileToVFS(THAI_FONT_FILE, fontData);
  doc.addFont(THAI_FONT_FILE, THAI_FONT_FAMILY, PDF_FONTS.thai.style);

  return PDF_FONTS.thai;
}
