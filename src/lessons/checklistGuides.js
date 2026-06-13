const checklistHints = {
  'hello-pdf': {
    'page-a4-mm': "สร้าง doc ด้วย new jsPDF({ unit: 'mm', format: 'a4' }) เพื่อให้ตำแหน่งในบทต่อ ๆ ไปใช้ mm",
    'return-doc': 'หลังสร้าง doc แล้วต้อง return doc ท้าย function เพื่อให้ preview และ checklist ใช้เอกสารนี้ได้',
  },
  'xy-position': {
    'previous-stage': 'อย่าลบฐานจากบท 1: ต้องยังมี new jsPDF({ unit: \'mm\', format: \'a4\' }) และ return doc',
    'layout-vars': 'กำหนด pageMargin = 20 และ contentWidth = 170 ก่อน แล้วใช้สองค่านี้คำนวณตำแหน่ง header',
    'header-title': "วาง doc.text('Project Brief', pageMargin, headerY) โดย headerY ควรเป็น 24",
    'header-date': "วางวันที่ที่ x = pageMargin + contentWidth, y = headerY เพื่อให้ไปอยู่ฝั่งขวาของพื้นที่ทำงาน",
    'date-align-right': "ใส่ { align: 'right' } เป็น argument ตัวที่ 4 ของ doc.text(...) วันที่",
  },
  'line-rect': {
    'previous-stage': 'ฐานจากบท 2 ต้องยังมี pageMargin/contentWidth, title Project Brief และวันที่ด้านขวา',
    'header-divider': 'ใช้ doc.line(pageMargin, 32, pageMargin + contentWidth, 32) เป็นเส้นใต้ header',
    'info-card': 'Info card ใช้ doc.rect(pageMargin, 44, contentWidth, 44)',
    'summary-card': 'Summary card ใช้ doc.rect(pageMargin, 106, contentWidth, 56)',
    'milestone-card': 'Milestones card ใช้ doc.rect(pageMargin, 178, contentWidth, 64)',
  },
  style: {
    'previous-stage': 'ฐานจากบท 3 ต้องยังมี header, divider และ card ทั้งสามใบตาม blueprint',
    'title-style': 'ตั้งสีหลักและขนาดก่อน title: doc.setTextColor(17, 24, 39) แล้ว doc.setFontSize(22)',
    'heading-style': 'ก่อนหัวข้อ card เช่น Project Info / Summary / Milestones ให้ใช้ doc.setFontSize(18)',
    'body-style': 'ก่อนเนื้อหาใน card ให้ใช้สีรอง doc.setTextColor(71, 85, 105) และ doc.setFontSize(16)',
    'card-style': "ตั้ง setDrawColor + setFillColor แล้วใช้ doc.rect(..., 'FD') กับ card ทั้งสามใบ",
  },
  image: {
    'previous-stage': 'ฐานจากบท 4 ต้องยังมี header/card และ style contract ครบก่อนค่อยเพิ่มรูป',
    'image-path': "เพิ่ม const imagePath = '/images/lesson-image-sample.svg' ก่อนเรียก helper",
    'image-data': 'ใช้ const imageData = getLessonImage(imagePath) เพื่อเตรียมรูปให้ jsPDF',
    'image-placement': "วางรูปด้วย doc.addImage(imageData, 'PNG', 150, 54, 36, 24)",
    'image-size': 'ขนาดรูปตาม blueprint คือ width 36 และ height 24 mm',
  },
  'thai-font': {
    'previous-stage': 'ฐานจากบท 5 ต้องยังมีภาพใน Info card และ style/card เดิมครบ',
    'register-thai-font': 'เรียก registerThaiFont(doc) ทันทีหลังสร้าง doc',
    'set-thai-font': 'หลัง register ให้ใช้ doc.setFont(PDF_FONTS.thai.family, PDF_FONTS.thai.style)',
    'thai-heading': 'เปลี่ยน section heading ใน card เป็นภาษาไทย เช่น ข้อมูลโปรเจกต์ / สรุปภาพรวม / หมุดหมายงาน',
    'thai-body': 'เพิ่มข้อความรายละเอียดภาษาไทยใน body text หลังเลือกฟอนต์ไทยแล้ว',
  },
  'data-mapping': {
    'previous-stage': 'ฐานจากบท 6 ต้องยัง register ฟอนต์ไทย เลือกฟอนต์ และมีข้อความไทยใน layout เดิม',
    'project-object': 'สร้าง const project = { ... } แล้วเก็บ name/date/owner/status/imagePath/summary/milestones ไว้ในนั้น',
    'project-fields': 'แทนข้อความคงที่ด้วย project.name, project.date, project.owner, project.status และ project.imagePath',
    'milestones-array': 'เก็บรายการหลายแถวไว้ใน project.milestones: [{ label, value }, ...]',
    'milestones-loop': 'ใช้ project.milestones.forEach((item, index) => { ... }) เพื่อวาดแต่ละ row',
    'row-y-position': 'คำนวณ rowY จาก milestoneY + 30 + index * 10 เพื่อให้แต่ละ row อยู่ใน Milestones card',
  },
  'text-wrap': {
    'previous-stage': 'ฐานจากบท 7 ต้องยังใช้ project object, project fields และ loop project.milestones อยู่',
    'long-summary': 'ทำให้ project.summary ยาวพอจะเห็นการตัดบรรทัดใน Summary card',
    'summary-width': 'กำหนด summaryWidth = contentWidth - 16 เพื่อเหลือ padding ซ้ายขวาใน card',
    'split-summary': 'ใช้ const wrappedSummary = doc.splitTextToSize(project.summary, summaryWidth)',
    'wrapped-summary-text': 'ส่ง wrappedSummary เข้า doc.text(wrappedSummary, pageMargin + 8, summaryY + 30)',
  },
  'one-page-layout': {
    'previous-stage': 'ฐานจากบท 8 ต้องยัง wrap project.summary ด้วย splitTextToSize และวางใน Summary card',
    'section-stack': 'เช็กว่ามี header, divider, Info card, Summary card และ Milestones card ครบในตำแหน่งเดิม',
    'image-in-info': 'รูปยังต้องอยู่ใน Info card ที่ x 150, y 54, size 36 x 24',
    'wrapped-summary': 'Summary card ต้องวาง wrappedSummary ไม่ใช่ project.summary ตรง ๆ',
    'milestone-rows': 'Milestones card ต้อง render row จาก project.milestones',
    footer: 'เติม footer line ที่ y 270 และ footer text ที่ y 278',
  },
};

const sharedChecklistHints = {
  'run-preview':
    'ข้อนี้ไม่ต้องเพิ่มคำสั่งใหม่โดยตรง ให้กด Run แล้วดู Console: ถ้ามี error ให้แก้ syntax, ชื่อตัวแปร และ return doc ก่อน',
};

const checklistAnswers = {
  'hello-pdf': {
    'page-a4-mm': "const doc = new jsPDF({ unit: 'mm', format: 'a4' });",
    'return-doc': 'return doc;',
    'run-preview': null,
  },
  'xy-position': {
    'previous-stage': `const doc = new jsPDF({ unit: 'mm', format: 'a4' });

return doc;`,
    'layout-vars': `const pageMargin = 20;
const contentWidth = 170;
const headerY = 24;
const dateX = pageMargin + contentWidth;`,
    'header-title': "doc.text('Project Brief', pageMargin, headerY);",
    'header-date': "doc.text('2026-06-13', dateX, headerY, { align: 'right' });",
    'date-align-right': `doc.text('2026-06-13', dateX, headerY, {
  align: 'right',
});`,
    'run-preview': null,
  },
  'line-rect': {
    'previous-stage': `const pageMargin = 20;
const contentWidth = 170;
const headerY = 24;
const dateX = pageMargin + contentWidth;

doc.text('Project Brief', pageMargin, headerY);
doc.text('2026-06-13', dateX, headerY, { align: 'right' });`,
    'header-divider': `const dividerY = 32;
doc.line(pageMargin, dividerY, pageMargin + contentWidth, dividerY);`,
    'info-card': `const infoY = 44;
doc.rect(pageMargin, infoY, contentWidth, 44);`,
    'summary-card': `const summaryY = 106;
doc.rect(pageMargin, summaryY, contentWidth, 56);`,
    'milestone-card': `const milestoneY = 178;
doc.rect(pageMargin, milestoneY, contentWidth, 64);`,
    'run-preview': null,
  },
  style: {
    'previous-stage': `doc.text('Project Brief', pageMargin, headerY);
doc.text('2026-06-13', dateX, headerY, { align: 'right' });
doc.line(pageMargin, dividerY, pageMargin + contentWidth, dividerY);
doc.rect(pageMargin, infoY, contentWidth, 44);
doc.rect(pageMargin, summaryY, contentWidth, 56);
doc.rect(pageMargin, milestoneY, contentWidth, 64);`,
    'title-style': `doc.setTextColor(17, 24, 39);
doc.setFontSize(22);
doc.text('Project Brief', pageMargin, headerY);`,
    'heading-style': `doc.setTextColor(17, 24, 39);
doc.setFontSize(18);
doc.text('Project Info', pageMargin + 8, infoY + 14);
doc.text('Summary', pageMargin + 8, summaryY + 14);
doc.text('Milestones', pageMargin + 8, milestoneY + 14);`,
    'body-style': `doc.setTextColor(71, 85, 105);
doc.setFontSize(16);
doc.text('Name: jsPDF Visual Lessons', pageMargin + 8, infoY + 30);
doc.text('Owner: Learning Team', pageMargin + 8, infoY + 39);`,
    'card-style': `doc.setDrawColor(203, 213, 225);
doc.setFillColor(248, 250, 252);
doc.rect(pageMargin, infoY, contentWidth, 44, 'FD');
doc.rect(pageMargin, summaryY, contentWidth, 56, 'FD');
doc.rect(pageMargin, milestoneY, contentWidth, 64, 'FD');`,
    'run-preview': null,
  },
  image: {
    'previous-stage': `doc.setDrawColor(203, 213, 225);
doc.setFillColor(248, 250, 252);
doc.rect(pageMargin, infoY, contentWidth, 44, 'FD');
doc.rect(pageMargin, summaryY, contentWidth, 56, 'FD');
doc.rect(pageMargin, milestoneY, contentWidth, 64, 'FD');`,
    'image-path': "const imagePath = '/images/lesson-image-sample.svg';",
    'image-data': 'const imageData = getLessonImage(imagePath);',
    'image-placement': "doc.addImage(imageData, 'PNG', imageX, imageY, imageWidth, imageHeight);",
    'image-size': `const imageX = 150;
const imageY = 54;
const imageWidth = 36;
const imageHeight = 24;`,
    'run-preview': null,
  },
  'thai-font': {
    'previous-stage': `const imagePath = '/images/lesson-image-sample.svg';
const imageData = getLessonImage(imagePath);
doc.addImage(imageData, 'PNG', 150, 54, 36, 24);`,
    'register-thai-font': 'registerThaiFont(doc);',
    'set-thai-font': 'doc.setFont(PDF_FONTS.thai.family, PDF_FONTS.thai.style);',
    'thai-heading': `doc.text('ข้อมูลโปรเจกต์', pageMargin + 8, infoY + 14);
doc.text('สรุปภาพรวม', pageMargin + 8, summaryY + 14);
doc.text('หมุดหมายงาน', pageMargin + 8, milestoneY + 14);`,
    'thai-body': `doc.text('ชื่อ: บทเรียน jsPDF แบบเห็นภาพ', pageMargin + 8, infoY + 30);
doc.text('เจ้าของ: ทีมเรียนรู้', pageMargin + 8, infoY + 39);`,
    'run-preview': null,
  },
  'data-mapping': {
    'previous-stage': `registerThaiFont(doc);
doc.setFont(PDF_FONTS.thai.family, PDF_FONTS.thai.style);
doc.text('ข้อมูลโปรเจกต์', pageMargin + 8, infoY + 14);`,
    'project-object': `const project = {
  name: 'บทเรียน jsPDF แบบเห็นภาพ',
  date: '2026-06-13',
  owner: 'ทีมเรียนรู้',
  status: 'พร้อมตรวจทาน',
  imagePath: '/images/lesson-image-sample.svg',
  summary: 'พื้นที่ฝึกสร้าง PDF ที่ค่อย ๆ ประกอบเอกสารหนึ่งใบจากหน้าเปล่า',
  milestones: [
    { label: 'พื้นฐาน', value: 'หน้าเอกสาร ข้อความ กล่อง และ style' },
    { label: 'เนื้อหา', value: 'รูปภาพ ฟอนต์ไทย ข้อมูล และการ wrap' },
    { label: 'ตรวจทาน', value: 'ทาบ preview กับ blueprint แล้วปรับตำแหน่ง' },
  ],
};`,
    'project-fields': `const imageData = getLessonImage(project.imagePath);
doc.text(project.date, dateX, headerY, { align: 'right' });
doc.text('ชื่อ: ' + project.name, pageMargin + 8, infoY + 30);
doc.text('เจ้าของ: ' + project.owner, pageMargin + 8, infoY + 39);
doc.text('สถานะ: ' + project.status, pageMargin + 74, infoY + 39);`,
    'milestones-array': `milestones: [
  { label: 'พื้นฐาน', value: 'หน้าเอกสาร ข้อความ กล่อง และ style' },
  { label: 'เนื้อหา', value: 'รูปภาพ ฟอนต์ไทย ข้อมูล และการ wrap' },
  { label: 'ตรวจทาน', value: 'ทาบ preview กับ blueprint แล้วปรับตำแหน่ง' },
],`,
    'milestones-loop': `project.milestones.forEach((item, index) => {
  const rowY = milestoneY + 30 + index * 10;
  doc.text(item.label + ': ' + item.value, pageMargin + 8, rowY);
});`,
    'row-y-position': 'const rowY = milestoneY + 30 + index * 10;',
    'run-preview': null,
  },
  'text-wrap': {
    'previous-stage': `const project = {
  name: 'บทเรียน jsPDF แบบเห็นภาพ',
  date: '2026-06-13',
  owner: 'ทีมเรียนรู้',
  status: 'พร้อมตรวจทาน',
  imagePath: '/images/lesson-image-sample.svg',
  summary: 'พื้นที่ฝึกสร้าง PDF ที่ค่อย ๆ ประกอบเอกสารหนึ่งใบจากหน้าเปล่า',
  milestones: [
    { label: 'พื้นฐาน', value: 'หน้าเอกสาร ข้อความ กล่อง และ style' },
    { label: 'เนื้อหา', value: 'รูปภาพ ฟอนต์ไทย ข้อมูล และการ wrap' },
    { label: 'ตรวจทาน', value: 'ทาบ preview กับ blueprint แล้วปรับตำแหน่ง' },
  ],
};`,
    'long-summary':
      "summary: 'พื้นที่ฝึกสร้าง PDF ที่ค่อย ๆ ประกอบเอกสารหนึ่งใบจากหน้าเปล่า ไปสู่เอกสาร Project Brief ที่มีข้อมูล รูปภาพ สไตล์ และรายการหมุดหมายครบถ้วน เพื่อให้ผู้เรียนเห็นว่าเอกสารจริงเกิดจากการวางองค์ประกอบหลายส่วนร่วมกัน',",
    'summary-width': 'const summaryWidth = contentWidth - 16;',
    'split-summary': 'const wrappedSummary = doc.splitTextToSize(project.summary, summaryWidth);',
    'wrapped-summary-text': 'doc.text(wrappedSummary, pageMargin + 8, summaryY + 30);',
    'run-preview': null,
  },
  'one-page-layout': {
    'previous-stage': `const summaryWidth = contentWidth - 16;
const wrappedSummary = doc.splitTextToSize(project.summary, summaryWidth);
doc.text(wrappedSummary, pageMargin + 8, summaryY + 30);`,
    'section-stack': `doc.line(pageMargin, dividerY, pageMargin + contentWidth, dividerY);
doc.rect(pageMargin, infoY, contentWidth, 44, 'FD');
doc.rect(pageMargin, summaryY, contentWidth, 56, 'FD');
doc.rect(pageMargin, milestoneY, contentWidth, 64, 'FD');`,
    'image-in-info': "doc.addImage(imageData, 'PNG', 150, 54, 36, 24);",
    'wrapped-summary': `const wrappedSummary = doc.splitTextToSize(project.summary, contentWidth - 16);
doc.text(wrappedSummary, pageMargin + 8, summaryY + 30);`,
    'milestone-rows': `project.milestones.forEach((item, index) => {
  const rowY = milestoneY + 30 + index * 10;
  doc.text(item.label + ': ' + item.value, pageMargin + 8, rowY);
});`,
    footer: `const footerY = 278;
doc.setDrawColor(203, 213, 225);
doc.line(pageMargin, footerY - 8, pageMargin + contentWidth, footerY - 8);
doc.setFontSize(12);
doc.text('Generated by jsPDF Visual Lesson Playground', pageMargin, footerY);`,
    'run-preview': null,
  },
};

function getFallbackHint(item) {
  return `ข้อนี้ต้องการหลักฐานใน code/PDF ตามข้อความ: ${item.label}`;
}

function getCatalogHint(lesson, item) {
  return checklistHints[lesson.id]?.[item.id] ?? sharedChecklistHints[item.id] ?? null;
}

function getCatalogAnswer(lesson, item) {
  const lessonAnswers = checklistAnswers[lesson.id] ?? {};

  if (Object.prototype.hasOwnProperty.call(lessonAnswers, item.id)) {
    return lessonAnswers[item.id];
  }

  return null;
}

export function getChecklistGuide(lesson, item, fallbackHint = null) {
  const isCheckpoint = lesson.type === 'checkpoint';

  return {
    hint:
      fallbackHint ??
      getCatalogHint(lesson, item) ??
      item.hints?.[0] ??
      getFallbackHint(item),
    answerCode: isCheckpoint ? null : getCatalogAnswer(lesson, item),
  };
}
