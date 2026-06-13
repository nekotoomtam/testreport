import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, extname, resolve } from 'node:path';

import {
  getQuotationBlueprintCode,
  quotationThemes,
} from '../src/blueprints/quotationBlueprint.js';
import { createLessonDataGetter } from '../src/lessons/lessonDataSources.js';
import { runLessonCode } from '../src/pdf/runLessonCode.js';

const PRODUCT_THUMB_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABpUlEQVR4nO2aTU7DMBCFX558AhCK2LCqBHfoDQpHYMsNYMEJWMAN2HIFKnGTVsoGNqji5wogJApWBU0cuxmbx7dKk3gy88a1ZpxUs/vnNwhDiEOI4/wf+3vbUGD+8PJ1TIhDiEOIQ4hDiEOI4/oMap7iisfRToViZ0ATGXwqGyYCNAkdz0UEWjqcgwguhZHJ+XdpOb0oq5x2qQJfPVeKEA6FsLV70Hvs6+MsfR0w+SH7IddzgRDHoRDWTWOTGTBtWeRKWQQJcVzM4GWWZeuAUoP2IcQhxOEQDxnfHUFWgPFn8LmKwE0aXw06RxFcyDZWSP/eJdiQrbGTsyv04fryNN0MGHV0eF3wy2u57AsydECb410yn9NfofK/D4h9OVrfHAbdvzi+xZ95OVoHBt93TGoIcZjCSEwmrWcBYw2kCMBSBObiuJUIzMlhCxGYm6NDi8DSFi1TAeqBgh9SZJdr5j+e51eKoc1QWxMULMDCqGzdNIQ4VcpmqBT+vxT1IMQhxCHEIcQhxCHEIcQhxCHEIcQhxCHEIcQhxHG/9ckqEOLQ2gFr3gF2YXKNZShdwgAAAABJRU5ErkJggg==';

const MIME_BY_EXTENSION = new Map([
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.svg', 'image/svg+xml'],
]);

function normalizeImagePath(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return normalizedPath;
}

function readPublicImage(path) {
  const normalizedPath = normalizeImagePath(path);
  const extension = extname(normalizedPath).toLowerCase();
  const mimeType = MIME_BY_EXTENSION.get(extension);

  if (!mimeType) {
    throw new Error(`Unsupported image extension: ${normalizedPath}`);
  }

  const imagePath = resolve(process.cwd(), 'public', normalizedPath.slice(1));
  const imageBytes = readFileSync(imagePath);

  return `data:${mimeType};base64,${imageBytes.toString('base64')}`;
}

function getLessonImage(path) {
  const normalizedPath = normalizeImagePath(path);

  if (normalizedPath !== '/images/lesson-image-sample.svg') {
    return readPublicImage(normalizedPath);
  }

  return PRODUCT_THUMB_DATA_URL;
}

function getArgValue(name) {
  const prefix = `--${name}=`;
  const match = process.argv.find((arg) => arg.startsWith(prefix));

  return match ? match.slice(prefix.length) : null;
}

function writeQuotationPdf(themeId, outputPath) {
  const code = getQuotationBlueprintCode(themeId);
  const getLessonData = createLessonDataGetter(['quotationRows']);
  const doc = runLessonCode(code, { getLessonImage, getLessonData });
  const pdfBytes = Buffer.from(doc.output('arraybuffer'));

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, pdfBytes);

  console.log(`wrote ${outputPath}`);
  console.log(`theme ${themeId}`);
  console.log(`pages ${doc.getNumberOfPages()}`);
  console.log(`bytes ${pdfBytes.length}`);
}

const args = process.argv.slice(2);
const shouldExportAll = args.includes('--all');
const themeArg = getArgValue('theme') ?? 'blue';
const outputArg = args.find((arg) => !arg.startsWith('--'));

if (shouldExportAll) {
  quotationThemes.forEach((theme) => {
    writeQuotationPdf(
      theme.id,
      resolve(process.cwd(), `outputs/quotation-blueprint-${theme.id}.pdf`),
    );
  });
} else {
  writeQuotationPdf(
    themeArg,
    resolve(process.cwd(), outputArg ?? 'outputs/quotation-blueprint-output.pdf'),
  );
}
