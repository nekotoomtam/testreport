const projectBriefStarterVersion = 7;

const blankStarterCode = `function generate() {

}
`;

const stage1 = `function generate() {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  return doc;
}
`;

const stage2 = `function generate() {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const pageMargin = 20;
  const contentWidth = 170;
  const headerY = 24;
  const dateX = pageMargin + contentWidth;

  doc.text('Project Brief', pageMargin, headerY);
  doc.text('2026-06-13', dateX, headerY, { align: 'right' });

  return doc;
}
`;

const stage3 = `function generate() {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const pageMargin = 20;
  const contentWidth = 170;
  const headerY = 24;
  const dateX = pageMargin + contentWidth;
  const dividerY = 32;
  const infoY = 44;
  const summaryY = 106;
  const milestoneY = 178;

  doc.text('Project Brief', pageMargin, headerY);
  doc.text('2026-06-13', dateX, headerY, { align: 'right' });
  doc.line(pageMargin, dividerY, pageMargin + contentWidth, dividerY);

  doc.rect(pageMargin, infoY, contentWidth, 44);
  doc.rect(pageMargin, summaryY, contentWidth, 56);
  doc.rect(pageMargin, milestoneY, contentWidth, 48);

  return doc;
}
`;

const stage4 = `function generate() {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const pageMargin = 20;
  const contentWidth = 170;
  const headerY = 24;
  const dateX = pageMargin + contentWidth;
  const dividerY = 32;
  const infoY = 44;
  const summaryY = 106;
  const milestoneY = 178;

  doc.setTextColor(17, 24, 39);
  doc.setFontSize(22);
  doc.text('Project Brief', pageMargin, headerY);

  doc.setFontSize(12);
  doc.setTextColor(71, 85, 105);
  doc.text('2026-06-13', dateX, headerY, { align: 'right' });

  doc.setDrawColor(36, 87, 214);
  doc.setLineWidth(0.8);
  doc.line(pageMargin, dividerY, pageMargin + contentWidth, dividerY);

  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.rect(pageMargin, infoY, contentWidth, 44, 'FD');
  doc.rect(pageMargin, summaryY, contentWidth, 56, 'FD');
  doc.rect(pageMargin, milestoneY, contentWidth, 48, 'FD');

  doc.setTextColor(17, 24, 39);
  doc.setFontSize(18);
  doc.text('Project Info', pageMargin + 8, infoY + 14);
  doc.text('Summary', pageMargin + 8, summaryY + 14);
  doc.text('Milestones', pageMargin + 8, milestoneY + 14);

  doc.setTextColor(71, 85, 105);
  doc.setFontSize(16);
  doc.text('Name: jsPDF Visual Lessons', pageMargin + 8, infoY + 30);
  doc.text('Owner: Learning Team', pageMargin + 8, infoY + 39);
  doc.text('Summary text will be wrapped in a later lesson.', pageMargin + 8, summaryY + 30);
  doc.text('Foundation: page, text, shapes, and style', pageMargin + 8, milestoneY + 30);

  return doc;
}
`;

const stage5 = `function generate() {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const pageMargin = 20;
  const contentWidth = 170;
  const headerY = 24;
  const dateX = pageMargin + contentWidth;
  const dividerY = 32;
  const infoY = 44;
  const summaryY = 106;
  const milestoneY = 178;
  const imagePath = '/images/lesson-image-sample.svg';
  const imageData = getLessonImage(imagePath);
  const imageX = 150;
  const imageY = 54;
  const imageWidth = 36;
  const imageHeight = 24;

  doc.setTextColor(17, 24, 39);
  doc.setFontSize(22);
  doc.text('Project Brief', pageMargin, headerY);

  doc.setFontSize(12);
  doc.setTextColor(71, 85, 105);
  doc.text('2026-06-13', dateX, headerY, { align: 'right' });

  doc.setDrawColor(36, 87, 214);
  doc.setLineWidth(0.8);
  doc.line(pageMargin, dividerY, pageMargin + contentWidth, dividerY);

  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.rect(pageMargin, infoY, contentWidth, 44, 'FD');
  doc.rect(pageMargin, summaryY, contentWidth, 56, 'FD');
  doc.rect(pageMargin, milestoneY, contentWidth, 48, 'FD');

  doc.addImage(imageData, 'PNG', imageX, imageY, imageWidth, imageHeight);

  doc.setTextColor(17, 24, 39);
  doc.setFontSize(18);
  doc.text('Project Info', pageMargin + 8, infoY + 14);
  doc.text('Summary', pageMargin + 8, summaryY + 14);
  doc.text('Milestones', pageMargin + 8, milestoneY + 14);

  doc.setTextColor(71, 85, 105);
  doc.setFontSize(16);
  doc.text('Name: jsPDF Visual Lessons', pageMargin + 8, infoY + 30);
  doc.text('Owner: Learning Team', pageMargin + 8, infoY + 39);
  doc.text('Summary text will be wrapped in a later lesson.', pageMargin + 8, summaryY + 30);
  doc.text('Foundation: page, text, shapes, and style', pageMargin + 8, milestoneY + 30);

  return doc;
}
`;

const stage6 = `function generate() {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  registerThaiFont(doc);
  doc.setFont(PDF_FONTS.thai.family, PDF_FONTS.thai.style);

  const pageMargin = 20;
  const contentWidth = 170;
  const headerY = 24;
  const dateX = pageMargin + contentWidth;
  const dividerY = 32;
  const infoY = 44;
  const summaryY = 106;
  const milestoneY = 178;
  const imagePath = '/images/lesson-image-sample.svg';
  const imageData = getLessonImage(imagePath);
  const imageX = 150;
  const imageY = 54;
  const imageWidth = 36;
  const imageHeight = 24;

  doc.setTextColor(17, 24, 39);
  doc.setFontSize(22);
  doc.text('Project Brief', pageMargin, headerY);

  doc.setFontSize(12);
  doc.setTextColor(71, 85, 105);
  doc.text('2026-06-13', dateX, headerY, { align: 'right' });

  doc.setDrawColor(36, 87, 214);
  doc.setLineWidth(0.8);
  doc.line(pageMargin, dividerY, pageMargin + contentWidth, dividerY);

  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.rect(pageMargin, infoY, contentWidth, 44, 'FD');
  doc.rect(pageMargin, summaryY, contentWidth, 56, 'FD');
  doc.rect(pageMargin, milestoneY, contentWidth, 48, 'FD');

  doc.addImage(imageData, 'PNG', imageX, imageY, imageWidth, imageHeight);

  doc.setTextColor(17, 24, 39);
  doc.setFontSize(18);
  doc.text('ข้อมูลโปรเจกต์', pageMargin + 8, infoY + 14);
  doc.text('สรุปภาพรวม', pageMargin + 8, summaryY + 14);
  doc.text('หมุดหมายงาน', pageMargin + 8, milestoneY + 14);

  doc.setTextColor(71, 85, 105);
  doc.setFontSize(16);
  doc.text('ชื่อ: บทเรียน jsPDF แบบเห็นภาพ', pageMargin + 8, infoY + 30);
  doc.text('เจ้าของ: ทีมเรียนรู้', pageMargin + 8, infoY + 39);
  doc.text('ข้อความสรุปภาษาไทยจะถูก wrap ในบทถัดไป', pageMargin + 8, summaryY + 30);
  doc.text('พื้นฐาน: หน้าเอกสาร ข้อความ กล่อง และ style', pageMargin + 8, milestoneY + 30);

  return doc;
}
`;

const stage7 = `function generate() {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  registerThaiFont(doc);
  doc.setFont(PDF_FONTS.thai.family, PDF_FONTS.thai.style);

  const project = {
    name: 'บทเรียน jsPDF แบบเห็นภาพ',
    date: '2026-06-13',
    owner: 'ทีมเรียนรู้',
    status: 'พร้อมตรวจทาน',
    imagePath: '/images/lesson-image-sample.svg',
    summary: 'พื้นที่ฝึกสร้าง PDF ที่ค่อย ๆ ประกอบเอกสารหนึ่งใบจากหน้าเปล่า ไปสู่เอกสาร Project Brief ที่มีข้อมูล รูปภาพ สไตล์ และรายการหมุดหมายครบถ้วน',
    milestones: [
      { label: 'พื้นฐาน', value: 'หน้าเอกสาร ข้อความ กล่อง และ style' },
      { label: 'เนื้อหา', value: 'รูปภาพ ฟอนต์ไทย ข้อมูล และการ wrap' },
    ],
  };

  const pageMargin = 20;
  const contentWidth = 170;
  const headerY = 24;
  const dateX = pageMargin + contentWidth;
  const dividerY = 32;
  const infoY = 44;
  const summaryY = 106;
  const milestoneY = 178;
  const imageData = getLessonImage(project.imagePath);
  const imageX = 150;
  const imageY = 54;
  const imageWidth = 36;
  const imageHeight = 24;

  doc.setTextColor(17, 24, 39);
  doc.setFontSize(22);
  doc.text('Project Brief', pageMargin, headerY);

  doc.setFontSize(12);
  doc.setTextColor(71, 85, 105);
  doc.text(project.date, dateX, headerY, { align: 'right' });

  doc.setDrawColor(36, 87, 214);
  doc.setLineWidth(0.8);
  doc.line(pageMargin, dividerY, pageMargin + contentWidth, dividerY);

  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.rect(pageMargin, infoY, contentWidth, 44, 'FD');
  doc.rect(pageMargin, summaryY, contentWidth, 56, 'FD');
  doc.rect(pageMargin, milestoneY, contentWidth, 48, 'FD');

  doc.addImage(imageData, 'PNG', imageX, imageY, imageWidth, imageHeight);

  doc.setTextColor(17, 24, 39);
  doc.setFontSize(18);
  doc.text('ข้อมูลโปรเจกต์', pageMargin + 8, infoY + 14);
  doc.text('สรุปภาพรวม', pageMargin + 8, summaryY + 14);
  doc.text('หมุดหมายงาน', pageMargin + 8, milestoneY + 14);

  doc.setTextColor(71, 85, 105);
  doc.setFontSize(16);
  doc.text('ชื่อ: ' + project.name, pageMargin + 8, infoY + 30);
  doc.text('เจ้าของ: ' + project.owner, pageMargin + 8, infoY + 39);
  doc.text('สถานะ: ' + project.status, pageMargin + 74, infoY + 39);
  doc.text(project.summary, pageMargin + 8, summaryY + 30);

  project.milestones.forEach((item, index) => {
    const rowY = milestoneY + 30 + index * 10;
    doc.text(item.label + ': ' + item.value, pageMargin + 8, rowY);
  });

  return doc;
}
`;

const stage8 = `function generate() {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  registerThaiFont(doc);
  doc.setFont(PDF_FONTS.thai.family, PDF_FONTS.thai.style);

  const project = {
    name: 'บทเรียน jsPDF แบบเห็นภาพ',
    date: '2026-06-13',
    owner: 'ทีมเรียนรู้',
    status: 'พร้อมตรวจทาน',
    imagePath: '/images/lesson-image-sample.svg',
    summary: 'พื้นที่ฝึกสร้าง PDF ที่ค่อย ๆ ประกอบเอกสารหนึ่งใบจากหน้าเปล่า ไปสู่เอกสาร Project Brief ที่มีข้อมูล รูปภาพ สไตล์ และรายการหมุดหมายครบถ้วน เพื่อให้ผู้เรียนเห็นว่าเอกสารจริงเกิดจากการวางองค์ประกอบหลายส่วนร่วมกัน',
    milestones: [
      { label: 'พื้นฐาน', value: 'หน้าเอกสาร ข้อความ กล่อง และ style' },
      { label: 'เนื้อหา', value: 'รูปภาพ ฟอนต์ไทย ข้อมูล และการ wrap' },
    ],
  };

  const pageMargin = 20;
  const contentWidth = 170;
  const headerY = 24;
  const dateX = pageMargin + contentWidth;
  const dividerY = 32;
  const infoY = 44;
  const summaryY = 106;
  const milestoneY = 178;
  const imageData = getLessonImage(project.imagePath);
  const imageX = 150;
  const imageY = 54;
  const imageWidth = 36;
  const imageHeight = 24;
  const summaryWidth = contentWidth - 16;
  const wrappedSummary = doc.splitTextToSize(project.summary, summaryWidth);

  doc.setTextColor(17, 24, 39);
  doc.setFontSize(22);
  doc.text('Project Brief', pageMargin, headerY);

  doc.setFontSize(12);
  doc.setTextColor(71, 85, 105);
  doc.text(project.date, dateX, headerY, { align: 'right' });

  doc.setDrawColor(36, 87, 214);
  doc.setLineWidth(0.8);
  doc.line(pageMargin, dividerY, pageMargin + contentWidth, dividerY);

  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.rect(pageMargin, infoY, contentWidth, 44, 'FD');
  doc.rect(pageMargin, summaryY, contentWidth, 56, 'FD');
  doc.rect(pageMargin, milestoneY, contentWidth, 48, 'FD');

  doc.addImage(imageData, 'PNG', imageX, imageY, imageWidth, imageHeight);

  doc.setTextColor(17, 24, 39);
  doc.setFontSize(18);
  doc.text('ข้อมูลโปรเจกต์', pageMargin + 8, infoY + 14);
  doc.text('สรุปภาพรวม', pageMargin + 8, summaryY + 14);
  doc.text('หมุดหมายงาน', pageMargin + 8, milestoneY + 14);

  doc.setTextColor(71, 85, 105);
  doc.setFontSize(16);
  doc.text('ชื่อ: ' + project.name, pageMargin + 8, infoY + 30);
  doc.text('เจ้าของ: ' + project.owner, pageMargin + 8, infoY + 39);
  doc.text('สถานะ: ' + project.status, pageMargin + 74, infoY + 39);
  doc.text(wrappedSummary, pageMargin + 8, summaryY + 30);

  project.milestones.forEach((item, index) => {
    const rowY = milestoneY + 30 + index * 10;
    doc.text(item.label + ': ' + item.value, pageMargin + 8, rowY);
  });

  return doc;
}
`;

const stage9 = `function generate() {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  registerThaiFont(doc);
  doc.setFont(PDF_FONTS.thai.family, PDF_FONTS.thai.style);

  const project = {
    name: 'บทเรียน jsPDF แบบเห็นภาพ',
    date: '2026-06-13',
    owner: 'ทีมเรียนรู้',
    status: 'พร้อมตรวจทาน',
    imagePath: '/images/lesson-image-sample.svg',
    summary: 'พื้นที่ฝึกสร้าง PDF ที่ค่อย ๆ ประกอบเอกสารหนึ่งใบจากหน้าเปล่า ไปสู่เอกสาร Project Brief ที่มีข้อมูล รูปภาพ สไตล์ และรายการหมุดหมายครบถ้วน เพื่อให้ผู้เรียนเห็นว่าเอกสารจริงเกิดจากการวางองค์ประกอบหลายส่วนร่วมกัน',
    milestones: [
      { label: 'พื้นฐาน', value: 'หน้าเอกสาร ข้อความ กล่อง และ style' },
      { label: 'เนื้อหา', value: 'รูปภาพ ฟอนต์ไทย ข้อมูล และการ wrap' },
    ],
  };

  const pageMargin = 20;
  const contentWidth = 170;
  const headerY = 24;
  const dateX = pageMargin + contentWidth;
  const dividerY = 32;
  const infoY = 44;
  const summaryY = 106;
  const milestoneY = 178;
  const footerY = 278;
  const imageData = getLessonImage(project.imagePath);
  const imageX = 150;
  const imageY = 54;
  const imageWidth = 36;
  const imageHeight = 24;
  const summaryWidth = contentWidth - 16;
  const wrappedSummary = doc.splitTextToSize(project.summary, summaryWidth);

  doc.setTextColor(17, 24, 39);
  doc.setFontSize(22);
  doc.text('Project Brief', pageMargin, headerY);

  doc.setFontSize(12);
  doc.setTextColor(71, 85, 105);
  doc.text(project.date, dateX, headerY, { align: 'right' });

  doc.setDrawColor(36, 87, 214);
  doc.setLineWidth(0.8);
  doc.line(pageMargin, dividerY, pageMargin + contentWidth, dividerY);

  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.rect(pageMargin, infoY, contentWidth, 44, 'FD');
  doc.rect(pageMargin, summaryY, contentWidth, 56, 'FD');
  doc.rect(pageMargin, milestoneY, contentWidth, 48, 'FD');

  doc.addImage(imageData, 'PNG', imageX, imageY, imageWidth, imageHeight);

  doc.setTextColor(17, 24, 39);
  doc.setFontSize(18);
  doc.text('ข้อมูลโปรเจกต์', pageMargin + 8, infoY + 14);
  doc.text('สรุปภาพรวม', pageMargin + 8, summaryY + 14);
  doc.text('หมุดหมายงาน', pageMargin + 8, milestoneY + 14);

  doc.setTextColor(71, 85, 105);
  doc.setFontSize(16);
  doc.text('ชื่อ: ' + project.name, pageMargin + 8, infoY + 30);
  doc.text('เจ้าของ: ' + project.owner, pageMargin + 8, infoY + 39);
  doc.text('สถานะ: ' + project.status, pageMargin + 74, infoY + 39);
  doc.text(wrappedSummary, pageMargin + 8, summaryY + 30);

  project.milestones.forEach((item, index) => {
    const rowY = milestoneY + 30 + index * 10;
    doc.text(item.label + ': ' + item.value, pageMargin + 8, rowY);
  });

  doc.setDrawColor(203, 213, 225);
  doc.line(pageMargin, footerY - 8, pageMargin + contentWidth, footerY - 8);
  doc.setFontSize(12);
  doc.text('Generated by jsPDF Visual Lesson Playground', pageMargin, footerY);

  return doc;
}
`;

export const projectBriefSnapshots = [
  blankStarterCode,
  stage1,
  stage2,
  stage3,
  stage4,
  stage5,
  stage6,
  stage7,
  stage8,
  stage9,
];

const imagePaths = ['/images/lesson-image-sample.svg'];

const blueprint = [
  {
    label: 'Header',
    detail: 'x 20, y 24: Project Brief อยู่ฝั่งซ้าย, project.date อยู่ฝั่งขวาที่ x 190 พร้อม align right',
  },
  {
    label: 'Divider',
    detail: 'เส้นใต้ header จาก x 20 ถึง x 190 ที่ y 32',
  },
  {
    label: 'Info card',
    detail: 'กล่องข้อมูลโปรเจกต์ x 20, y 44, width 170, height 44 และมีภาพที่ x 150, y 54, size 36 x 24 mm',
  },
  {
    label: 'Summary card',
    detail: 'กล่อง summary x 20, y 106, width 170, height 56 และใช้ wrappedSummary วางในกล่อง',
  },
  {
    label: 'Milestones card',
    detail: 'กล่อง milestones x 20, y 178, width 170, height 48 และ render rows ด้วย project.milestones',
  },
  {
    label: 'Footer',
    detail: 'footer line ที่ y 270 และข้อความ signature ที่ y 278',
  },
];

const designContract = [
  { label: 'Page', detail: "ใช้ A4 หน่วย mm ด้วย new jsPDF({ unit: 'mm', format: 'a4' })" },
  { label: 'Margin', detail: 'ใช้ pageMargin = 20 และ contentWidth = 170 เป็นแกน layout' },
  { label: 'Title', detail: 'หัวเอกสารใช้ doc.setFontSize(22) และสี #111827' },
  { label: 'Section heading', detail: 'หัวข้อ card ใช้ doc.setFontSize(18)' },
  { label: 'Body', detail: 'ข้อความรายละเอียดใช้ doc.setFontSize(16) และสี #475569' },
  { label: 'Accent line', detail: 'เส้นหลักใช้ doc.setDrawColor(36, 87, 214)' },
  { label: 'Card', detail: 'card ใช้ border #cbd5e1 และ fill #f8fafc' },
];

export const lessons = [
  {
    id: 'hello-pdf',
    order: 1,
    phase: 'Document 1: Project Brief',
    type: 'lesson',
    title: 'Start the Project Brief',
    shortTitle: 'Start',
    goal: 'สร้างหน้า A4 หน่วย mm สำหรับเอกสาร Project Brief และ return doc ให้ preview ใช้ได้',
    explanation:
      "บทแรกคือฐานของเอกสารทั้งใบ เราไม่ได้สร้างตัวอย่างลอย ๆ แต่เริ่มกระดาษ A4 ที่บทถัดไปจะค่อย ๆ เติม header, card, image, data และ footer ลงไป",
    teachingPoints: [
      "new jsPDF({ unit: 'mm', format: 'a4' }) คือการสร้างกระดาษ A4 ที่ใช้หน่วยมิลลิเมตร",
      'doc คือเอกสารใบเดียวที่ทุกบทจะค่อย ๆ วาดเพิ่ม',
      'ต้อง return doc ทุกครั้งเพื่อให้ระบบ render preview และตรวจ checklist ได้',
    ],
    concepts: ['doc = เอกสารใบเดียว', 'A4', 'unit mm', 'return doc'],
    visualKind: 'none',
    miniTask: 'สร้างหน้าเอกสารเปล่าที่พร้อมให้บทถัดไปเติม header',
    practice: {
      prompt: 'ใน function generate() ให้สร้าง doc เป็น A4/mm แล้ว return doc',
      requirements: [
        "ใช้ new jsPDF({ unit: 'mm', format: 'a4' })",
        'เก็บเอกสารไว้ในตัวแปร doc',
        'ท้าย function ต้อง return doc',
      ],
    },
    completionChecklist: [
      { id: 'page-a4-mm', label: 'สร้างเอกสาร A4 ด้วยหน่วย mm' },
      { id: 'return-doc', label: 'return doc จาก function generate()' },
      { id: 'run-preview', label: 'กด Run แล้วสร้าง PDF preview สำเร็จ' },
    ],
    starterCode: blankStarterCode,
    starterCodeVersion: projectBriefStarterVersion,
    solutionCode: stage1,
  },
  {
    id: 'xy-position',
    order: 2,
    phase: 'Document 1: Project Brief',
    type: 'lesson',
    title: 'Header Text',
    shortTitle: 'Header',
    goal: 'วางหัวเอกสาร Project Brief และวันที่ลงตำแหน่งบนของหน้าให้ตรง blueprint',
    explanation:
      "บทนี้ใช้ doc.text(text, x, y, options) เพื่อสร้าง header จริงของเอกสาร ค่า x/y จึงไม่ใช่แค่ทดลอง แต่เป็นตำแหน่งบน blueprint ของเอกสาร Project Brief",
    teachingPoints: [
      'pageMargin = 20 คือจุดเริ่มฝั่งซ้ายของเอกสาร',
      'dateX = pageMargin + contentWidth คือขอบขวาของพื้นที่ทำงาน',
      "ใช้ { align: 'right' } เป็น argument ตัวที่ 4 เพื่อให้วันที่ชิดขวาที่ x = 190",
    ],
    concepts: ['doc.text()', 'x/y', 'align right', 'header zone'],
    visualKind: 'xy-bars',
    miniTask: 'เติมหัวเอกสารและวันที่ให้เอกสารเริ่มมี identity',
    practice: {
      prompt: 'ต่อจากบท 1 ให้เพิ่ม pageMargin/contentWidth แล้ววาง Project Brief กับวันที่บน header',
      requirements: [
        'กำหนด pageMargin = 20 และ contentWidth = 170',
        "วาง 'Project Brief' ที่ x = 20, y = 24",
        "วางวันที่ '2026-06-13' ที่ x = 190, y = 24 พร้อม align right",
      ],
    },
    completionChecklist: [
      { id: 'previous-stage', label: 'ฐานจากบท 1 ยังอยู่ครบ' },
      { id: 'layout-vars', label: 'มี pageMargin และ contentWidth สำหรับ layout ของเอกสาร' },
      { id: 'header-title', label: "วาง 'Project Brief' ที่ตำแหน่ง header ฝั่งซ้าย" },
      { id: 'header-date', label: 'วางวันที่ที่ตำแหน่ง header ฝั่งขวา' },
      { id: 'date-align-right', label: "ใช้ { align: 'right' } กับวันที่" },
      { id: 'run-preview', label: 'กด Run แล้วสร้าง PDF preview สำเร็จ' },
    ],
    starterCode: stage1,
    starterCodeVersion: projectBriefStarterVersion,
    solutionCode: stage2,
  },
  {
    id: 'line-rect',
    order: 3,
    phase: 'Document 1: Project Brief',
    type: 'lesson',
    title: 'Document Skeleton',
    shortTitle: 'Skeleton',
    goal: 'วาด divider และ card 3 ใบเพื่อสร้างโครงเอกสาร Project Brief',
    explanation:
      "บทนี้เปลี่ยนจากข้อความบนหน้าเปล่าให้เป็น layout จริง เอกสารหนึ่งใบต้องมีพื้นที่ชัดเจนก่อนใส่ข้อมูล: Info, Summary และ Milestones",
    teachingPoints: [
      'doc.line() ใช้ทำ divider ใต้ header',
      'doc.rect(x, y, width, height) ใช้สร้างกรอบ card',
      'ตำแหน่ง card ถูก fix ตาม blueprint เพื่อให้ผลลัพธ์มั่นคง',
    ],
    concepts: ['doc.line()', 'doc.rect()', 'card zone', 'blueprint'],
    visualKind: 'box-model',
    miniTask: 'เติมโครง card ให้เอกสารมีพื้นที่สำหรับข้อมูลจริง',
    practice: {
      prompt: 'ต่อจาก header ให้เพิ่ม divider และ card 3 ใบตาม blueprint',
      requirements: [
        'วาด divider จาก x 20 ถึง x 190 ที่ y 32',
        'วาด Info card ที่ y 44',
        'วาด Summary card ที่ y 106',
        'วาด Milestones card ที่ y 178',
      ],
    },
    completionChecklist: [
      { id: 'previous-stage', label: 'ฐานจากบท 2 ยังอยู่ครบ' },
      { id: 'header-divider', label: 'วาด divider ใต้ header ที่ y 32' },
      { id: 'info-card', label: 'วาด Info card ตาม blueprint' },
      { id: 'summary-card', label: 'วาด Summary card ตาม blueprint' },
      { id: 'milestone-card', label: 'วาด Milestones card ตาม blueprint' },
      { id: 'run-preview', label: 'กด Run แล้วสร้าง PDF preview สำเร็จ' },
    ],
    starterCode: stage2,
    starterCodeVersion: projectBriefStarterVersion,
    solutionCode: stage3,
  },
  {
    id: 'style',
    order: 4,
    phase: 'Document 1: Project Brief',
    type: 'lesson',
    title: 'Style Contract',
    shortTitle: 'Style',
    goal: 'ใส่ขนาดตัวอักษร สี เส้น และพื้น card ให้เอกสารอ่านเป็นระบบเดียวกัน',
    explanation:
      "style ใน jsPDF เป็น state ที่มีผลกับสิ่งที่วาดถัดไป บทนี้จึงใช้ setFontSize, setTextColor, setDrawColor และ setFillColor เพื่อทำให้ skeleton กลายเป็นเอกสารที่อ่านง่าย",
    teachingPoints: [
      'ตั้ง font size ก่อนวาง title, heading และ body',
      'setTextColor ใช้กับข้อความถัดไป',
      'setDrawColor ใช้กับเส้นและขอบ card',
      "setFillColor ใช้กับพื้น card เมื่อ rect ใช้ style 'F' หรือ 'FD'",
    ],
    concepts: ['style state', 'font size', 'text color', 'card fill', 'card border'],
    visualKind: 'text-style',
    miniTask: 'เปลี่ยนโครงขาวดำให้เป็น document style contract',
    practice: {
      prompt: 'ต่อจาก skeleton ให้เติม style และข้อความตัวอย่างในแต่ละ card',
      requirements: [
        'title ใช้ font size 22',
        'section heading ใช้ font size 18',
        'body ใช้ font size 16',
        'ใช้สี text, draw และ fill ตาม design contract',
        "card ใช้ rect(..., 'FD') เพื่อมีทั้งพื้นและขอบ",
      ],
    },
    completionChecklist: [
      { id: 'previous-stage', label: 'ฐานจากบท 3 ยังอยู่ครบ' },
      { id: 'title-style', label: 'ตั้ง title เป็น font size 22 และสีหลัก' },
      { id: 'heading-style', label: 'ตั้ง section heading เป็น font size 18' },
      { id: 'body-style', label: 'ตั้ง body text เป็น font size 16 และสีรอง' },
      { id: 'card-style', label: 'ใช้สีขอบและสีพื้นกับ card ทั้งสามใบ' },
      { id: 'run-preview', label: 'กด Run แล้วสร้าง PDF preview สำเร็จ' },
    ],
    starterCode: stage3,
    starterCodeVersion: projectBriefStarterVersion,
    solutionCode: stage4,
  },
  {
    id: 'image',
    order: 5,
    phase: 'Document 1: Project Brief',
    type: 'lesson',
    title: 'Project Image',
    shortTitle: 'Image',
    goal: 'วางภาพประกอบไว้ด้านขวาของ Info card ตาม blueprint',
    explanation:
      "เอกสารจริงมักมีภาพหรือโลโก้ บทนี้เพิ่ม imagePath, getLessonImage และ doc.addImage เข้าไปในเอกสารเดิม โดยตำแหน่งภาพต้องอยู่ในกรอบ Info card",
    teachingPoints: [
      "imagePath คือ path ของไฟล์ใน public เช่น '/images/lesson-image-sample.svg'",
      'getLessonImage(imagePath) เตรียมข้อมูลรูปให้ jsPDF',
      'doc.addImage(imageData, format, x, y, width, height) วางรูปลงตำแหน่งที่กำหนด',
    ],
    concepts: ['imagePath', 'getLessonImage()', 'doc.addImage()', 'image box'],
    visualKind: 'image-ratio',
    imagePaths,
    miniTask: 'เติมภาพลง Info card โดยไม่ให้ชนข้อความฝั่งซ้าย',
    practice: {
      prompt: 'ต่อจากบท 4 ให้เพิ่มภาพใน Info card ที่ x 150, y 54, size 36 x 24 mm',
      requirements: [
        'มี imagePath ที่ชี้ไปยังรูปตัวอย่าง',
        'ใช้ getLessonImage(imagePath)',
        'ใช้ doc.addImage(...) วางภาพ',
        'ภาพอยู่ด้านขวาของ Info card ตาม blueprint',
      ],
    },
    completionChecklist: [
      { id: 'previous-stage', label: 'ฐานจากบท 4 ยังอยู่ครบ' },
      { id: 'image-path', label: 'มี imagePath สำหรับรูปตัวอย่าง' },
      { id: 'image-data', label: 'เตรียม imageData ด้วย getLessonImage(imagePath)' },
      { id: 'image-placement', label: 'วางภาพใน Info card ตาม blueprint' },
      { id: 'image-size', label: 'กำหนดขนาดภาพ 36 x 24 mm' },
      { id: 'run-preview', label: 'กด Run แล้วสร้าง PDF preview สำเร็จ' },
    ],
    starterCode: stage4,
    starterCodeVersion: projectBriefStarterVersion,
    solutionCode: stage5,
  },
  {
    id: 'thai-font',
    order: 6,
    phase: 'Document 1: Project Brief',
    type: 'lesson',
    title: 'Thai Font',
    shortTitle: 'Thai Font',
    goal: 'register และเลือกฟอนต์ไทยก่อนวางข้อความภาษาไทยในเอกสารเดียวกัน',
    explanation:
      "ถ้าเอกสารมีภาษาไทย ต้องบอก jsPDF ให้รู้จักฟอนต์ก่อนด้วย registerThaiFont(doc) แล้วเลือกฟอนต์ด้วย doc.setFont(...) ก่อนวางข้อความไทย",
    teachingPoints: [
      'register คือการเตรียมฟอนต์ให้ jsPDF รู้จัก',
      'PDF_FONTS.thai เก็บ family/style ที่ helper เตรียมไว้',
      'หลัง setFont แล้ว doc.text ภาษาไทยจะแสดงด้วย glyph ที่ถูกต้อง',
    ],
    concepts: ['registerThaiFont()', 'PDF_FONTS.thai', 'doc.setFont()', 'glyph ภาษาไทย'],
    visualKind: 'font-register',
    imagePaths,
    miniTask: 'เปลี่ยนหัวข้อใน card เป็นภาษาไทยโดยยังคุม layout เดิม',
    practice: {
      prompt: 'ต่อจากบท 5 ให้ register ฟอนต์ไทย เลือกฟอนต์ และใช้ข้อความไทยในเอกสาร',
      requirements: [
        'เรียก registerThaiFont(doc)',
        'ใช้ doc.setFont(PDF_FONTS.thai.family, PDF_FONTS.thai.style)',
        'มีข้อความภาษาไทยใน doc.text()',
        'ยังคงภาพและ card layout เดิมไว้',
      ],
    },
    completionChecklist: [
      { id: 'previous-stage', label: 'ฐานจากบท 5 ยังอยู่ครบ' },
      { id: 'register-thai-font', label: 'เรียก registerThaiFont(doc)' },
      { id: 'set-thai-font', label: 'เลือกฟอนต์ไทยด้วย doc.setFont(...)' },
      { id: 'thai-heading', label: 'มีหัวข้อ section ภาษาไทยในเอกสาร' },
      { id: 'thai-body', label: 'มีข้อความรายละเอียดภาษาไทยในเอกสาร' },
      { id: 'run-preview', label: 'กด Run แล้วสร้าง PDF preview สำเร็จ' },
    ],
    starterCode: stage5,
    starterCodeVersion: projectBriefStarterVersion,
    solutionCode: stage6,
  },
  {
    id: 'data-mapping',
    order: 7,
    phase: 'Document 1: Project Brief',
    type: 'lesson',
    title: 'Data Mapping',
    shortTitle: 'Data',
    goal: 'เปลี่ยนข้อความคงที่ให้มาจาก project object และ project.milestones array',
    explanation:
      "เมื่อเอกสารเริ่มมีหน้าตาชัดแล้ว บทนี้เปลี่ยนเนื้อหาจากข้อความที่พิมพ์ตรง ๆ ให้มาจากข้อมูลจริง เพื่อให้เอกสารแก้ข้อมูลได้โดยไม่ต้องไล่แก้ทุก doc.text()",
    teachingPoints: [
      'project object เก็บข้อมูลหนึ่งเอกสาร เช่น name, date, owner, status, imagePath และ summary',
      'project.milestones เป็น array สำหรับรายการหลายแถว',
      'forEach/map ใช้ render rows และ index ใช้คำนวณตำแหน่ง y ของแต่ละแถว',
    ],
    concepts: ['project object', 'project.field', 'project.milestones', 'forEach()', 'index -> y'],
    visualKind: 'data-mapping',
    imagePaths,
    miniTask: 'ให้เอกสารอ่านค่าจาก data object แทนข้อความคงที่',
    practice: {
      prompt: 'ต่อจากบท 6 ให้เพิ่ม project object แล้วนำ field กับ milestones ไปวางในเอกสาร',
      requirements: [
        'มี project object พร้อม field หลัก',
        'ใช้ project.date, project.name, project.owner, project.status ใน doc.text()',
        'ใช้ project.imagePath กับ getLessonImage(...)',
        'วน project.milestones ด้วย forEach/map',
        'ใช้ index คำนวณ rowY',
      ],
    },
    completionChecklist: [
      { id: 'previous-stage', label: 'ฐานจากบท 6 ยังอยู่ครบ' },
      { id: 'project-object', label: 'สร้าง project object สำหรับข้อมูลเอกสาร' },
      { id: 'project-fields', label: 'ใช้ project fields ใน doc.text() และ image' },
      { id: 'milestones-array', label: 'มี project.milestones เป็น array' },
      { id: 'milestones-loop', label: 'วน project.milestones ด้วย forEach() หรือ map()' },
      { id: 'row-y-position', label: 'ใช้ index คำนวณตำแหน่ง y ของแต่ละ row' },
      { id: 'run-preview', label: 'กด Run แล้วสร้าง PDF preview สำเร็จ' },
    ],
    starterCode: stage6,
    starterCodeVersion: projectBriefStarterVersion,
    solutionCode: stage7,
  },
  {
    id: 'text-wrap',
    order: 8,
    phase: 'Document 1: Project Brief',
    type: 'lesson',
    title: 'Summary Wrap',
    shortTitle: 'Wrap',
    goal: 'wrap project.summary ให้อยู่ใน Summary card โดยไม่ล้นออกนอก layout',
    explanation:
      "ข้อมูลจริงมักยาวกว่า placeholder บทนี้ใช้ doc.splitTextToSize(project.summary, summaryWidth) เพื่อแบ่งข้อความก่อนวางลง Summary card",
    teachingPoints: [
      'summaryWidth คือความกว้างสูงสุดของข้อความใน card',
      'splitTextToSize คืน array ของบรรทัด',
      'doc.text() รับ array และวางเป็นหลายบรรทัดได้',
    ],
    concepts: ['long text', 'summaryWidth', 'splitTextToSize()', 'wrappedSummary'],
    visualKind: 'text-wrap',
    imagePaths,
    miniTask: 'ทำให้ summary ยาว ๆ อยู่ในกรอบเดียวกับ blueprint',
    practice: {
      prompt: 'ต่อจากบท 7 ให้ wrap project.summary ก่อนวางลง Summary card',
      requirements: [
        'summary ยาวพอให้ต้อง wrap',
        'กำหนด summaryWidth จาก contentWidth',
        'ใช้ doc.splitTextToSize(project.summary, summaryWidth)',
        'ส่ง wrappedSummary เข้า doc.text()',
      ],
    },
    completionChecklist: [
      { id: 'previous-stage', label: 'ฐานจากบท 7 ยังอยู่ครบ' },
      { id: 'long-summary', label: 'project.summary เป็นข้อความยาวของเอกสาร' },
      { id: 'summary-width', label: 'กำหนด summaryWidth สำหรับ Summary card' },
      { id: 'split-summary', label: 'ใช้ doc.splitTextToSize(project.summary, summaryWidth)' },
      { id: 'wrapped-summary-text', label: 'ส่ง wrappedSummary เข้า doc.text() ใน Summary card' },
      { id: 'run-preview', label: 'กด Run แล้วสร้าง PDF preview สำเร็จ' },
    ],
    starterCode: stage7,
    starterCodeVersion: projectBriefStarterVersion,
    solutionCode: stage8,
  },
  {
    id: 'one-page-layout',
    order: 9,
    phase: 'Document 1: Project Brief',
    type: 'lesson',
    title: 'Complete One-page Brief',
    shortTitle: 'Complete',
    goal: 'เติม footer และจัดทุก section ให้เป็น Project Brief หนึ่งหน้าที่ครบถ้วน',
    explanation:
      "บทนี้รวมทุกอย่างจากบทก่อนหน้าให้กลายเป็นเอกสารใช้งานได้จริง: header, info card, image, summary, milestones และ footer อยู่ครบตาม blueprint",
    teachingPoints: [
      'footer เป็นส่วนปิดท้ายเอกสารและช่วยให้หน้าอ่านจบชัด',
      'ทุก section ใช้ margin/contentWidth เดียวกันเพื่อให้เอกสารนิ่ง',
      'ผลลัพธ์ควรใกล้ blueprint มากกว่า code ต้องเหมือนตัวอย่างทุกบรรทัด',
    ],
    concepts: ['one-page layout', 'footerY', 'section stack', 'strict output'],
    visualKind: 'layout',
    imagePaths,
    miniTask: 'ทำ Project Brief หนึ่งหน้าที่ครบก่อนเข้าสู่ checkpoint',
    practice: {
      prompt: 'ต่อจากบท 8 ให้เติม footer line และ footer text แล้วตรวจว่า section ทั้งหมดอยู่ครบ',
      requirements: [
        'มี header, divider, Info card, Summary card, Milestones card',
        'มีภาพอยู่ใน Info card',
        'มี wrapped summary อยู่ใน Summary card',
        'มี milestones rows จาก data',
        'มี footer line และ footer text ที่ y ใกล้ 278',
      ],
    },
    completionChecklist: [
      { id: 'previous-stage', label: 'ฐานจากบท 8 ยังอยู่ครบ' },
      { id: 'section-stack', label: 'จัด Header / Info / Summary / Milestones ครบตาม blueprint' },
      { id: 'image-in-info', label: 'ภาพยังอยู่ใน Info card ตามตำแหน่งเดิม' },
      { id: 'wrapped-summary', label: 'Summary card ใช้ wrappedSummary' },
      { id: 'milestone-rows', label: 'Milestones card แสดง rows จาก project.milestones' },
      { id: 'footer', label: 'มี footer line และ footer text ใกล้ท้ายหน้า' },
      { id: 'run-preview', label: 'กด Run แล้วสร้าง PDF preview สำเร็จ' },
    ],
    starterCode: stage8,
    starterCodeVersion: projectBriefStarterVersion,
    solutionCode: stage9,
  },
  {
    id: 'checkpoint-project-summary',
    order: 10,
    phase: 'Document 1: Project Brief',
    type: 'checkpoint',
    title: 'Checkpoint: Project Brief PDF',
    shortTitle: 'Checkpoint',
    goal: 'ตรวจเอกสาร Project Brief ทั้งใบให้ตรง blueprint: ผลลัพธ์ต้องนิ่ง แต่ code เขียนยืดหยุ่นได้',
    explanation:
      'checkpoint นี้ตรวจเอกสารที่ประกอบมาตั้งแต่บท 1-9 ทั้งหน้า ระบบให้ความสำคัญกับผลลัพธ์ตาม blueprint เช่นตำแหน่ง card, image, summary และ footer มากกว่าการบังคับให้ code เหมือนตัวอย่างทุกบรรทัด',
    concepts: ['strict output', 'flexible code', 'Project Brief blueprint', 'document contract'],
    visualKind: 'checkpoint',
    imagePaths,
    challenge: {
      prompt:
        'ทำ Project Brief ให้ตรง Expected blueprint ของเอกสารพื้นฐานใบแรก โดยใช้ code style ของตัวเองได้ แต่ผลลัพธ์ต้องอยู่ในตำแหน่งและขนาดตาม contract',
      requirements: [
        "ใช้ A4/mm และ return doc",
        'ใช้ project object เป็นแหล่งข้อมูลหลัก',
        'ใช้ฟอนต์ไทยกับข้อความไทย',
        'วาง header, divider, Info, Summary, Milestones และ Footer ตาม blueprint',
        'วางภาพจาก project.imagePath ใน Info card',
        'wrap project.summary ก่อนวางใน Summary card',
      ],
      blueprint,
      layoutSketch: `┌──────────────────────────────────────────────┐
│ Project Brief                      2026-06-13│
│ ──────────────────────────────────────────── │
│ ┌──────────────────────────────────────────┐ │
│ │ ข้อมูลโปรเจกต์              ┌─────────┐ │ │
│ │ ชื่อ / เจ้าของ / สถานะ      │ Image   │ │ │
│ └──────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────┐ │
│ │ สรุปภาพรวม                              │ │
│ │ wrapped project.summary                  │ │
│ └──────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────┐ │
│ │ หมุดหมายงาน                              │ │
│ │ project.milestones rows                  │ │
│ └──────────────────────────────────────────┘ │
│ ──────────────────────────────────────────── │
│ Generated by jsPDF Visual Lesson Playground  │
└──────────────────────────────────────────────┘`,
      designContract,
      dataFields: [
        'project.name',
        'project.date',
        'project.owner',
        'project.status',
        'project.summary',
        'project.milestones',
        'project.imagePath',
      ],
      checklist: [
        'หน้า A4/mm และ return doc สำเร็จ',
        'header/date/divider ตรง blueprint',
        'card stack ทั้งสามใบตรง blueprint',
        'style contract ครบ',
        'image อยู่ใน Info card',
        'summary ถูก wrap',
        'milestones มาจาก array',
        'footer อยู่ท้ายหน้า',
      ],
    },
    completionChecklist: [
      {
        id: 'final-page',
        label: 'สร้างหน้า A4/mm และ return doc',
        hints: [
          "เริ่มจากฐานบท 1: new jsPDF({ unit: 'mm', format: 'a4' })",
          'ถ้า Run ไม่ผ่าน ให้เช็ก syntax และ return doc ก่อน',
          'ท้าย function ต้อง return doc ที่สร้างจาก jsPDF',
        ],
      },
      {
        id: 'final-header',
        label: 'Header และ divider ตรง blueprint',
        hints: [
          'ดู Header ใน Expected blueprint',
          'Project Brief ควรอยู่ x 20, y 24 และ date อยู่ x 190, y 24 แบบ align right',
          'divider อยู่ y 32 จาก x 20 ถึง x 190',
        ],
      },
      {
        id: 'final-cards',
        label: 'Info / Summary / Milestones cards ตรง blueprint',
        hints: [
          'ใช้ pageMargin 20 และ contentWidth 170 กับทุก card',
          'Info y 44, Summary y 106, Milestones y 178',
          "ใช้ doc.rect(..., 'FD') เพื่อให้ card มีพื้นและขอบ",
        ],
      },
      {
        id: 'final-style',
        label: 'ใช้ style contract ครบ',
        hints: [
          'ดู Design contract',
          'title 22, heading 18, body 16 และใช้สีหลัก/รอง/ขอบ/พื้น',
          'setTextColor, setDrawColor และ setFillColor ต้องถูกใช้ก่อนวาดส่วนที่เกี่ยวข้อง',
        ],
      },
      {
        id: 'final-image',
        label: 'วางภาพใน Info card จาก project.imagePath',
        hints: [
          'ใช้ getLessonImage(project.imagePath)',
          'วางภาพที่ x 150, y 54, size 36 x 24 mm',
          "doc.addImage(imageData, 'PNG', imageX, imageY, imageWidth, imageHeight)",
        ],
      },
      {
        id: 'final-data',
        label: 'ใช้ project data และ project.milestones',
        hints: [
          'ข้อมูลหลักควรมาจาก project object',
          'milestones ควรเป็น array และ render ด้วย forEach/map',
          'ใช้ project.name/date/owner/status/summary/imagePath ในเอกสาร',
        ],
      },
      {
        id: 'final-wrap',
        label: 'wrap project.summary ใน Summary card',
        hints: [
          'summary ยาวควรผ่าน splitTextToSize ก่อน',
          'summaryWidth ควรอิงจาก contentWidth - 16',
          'ส่ง wrappedSummary เข้า doc.text(...) ใน Summary card',
        ],
      },
      {
        id: 'final-footer',
        label: 'Footer line และ footer text อยู่ท้ายหน้า',
        hints: [
          'footer line อยู่ประมาณ y 270',
          'footer text อยู่ประมาณ y 278',
          'ใช้ pageMargin และ contentWidth เดิมเพื่อให้เส้นตรงกับ layout หลัก',
        ],
      },
      {
        id: 'run-preview',
        label: 'กด Run แล้วสร้าง PDF preview สำเร็จ',
        hints: [
          'ข้อนี้ผ่านเมื่อ generate() return doc สำเร็จ',
          'ถ้า error ให้ดู console ก่อน',
          'Run สำเร็จแล้ว checklist อื่นจะเริ่มตรวจผลลัพธ์ตาม blueprint',
        ],
      },
    ],
    starterCode: stage9,
    starterCodeVersion: projectBriefStarterVersion,
    solutionCode: stage9,
  },
];

export const starterLesson = lessons[0];
