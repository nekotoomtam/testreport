const commonGuides = {
  'run-preview': {
    hint: "กด Run หลังเขียน code แล้ว function generate() ต้องสร้าง doc ด้วย new jsPDF(...) และท้ายสุด return doc",
    answerCode: "const doc = new jsPDF({ unit: 'mm', format: 'a4' });\n\nreturn doc;",
  },
};

const checklistGuides = {
  'hello-pdf': {
    'unit-mm': {
      hint: "unit อยู่ใน object ตอนสร้าง doc เช่น new jsPDF({ unit: 'mm', ... })",
      answerCode: "const doc = new jsPDF({ unit: 'mm', format: 'a3', orientation: 'landscape' });",
    },
    'format-a3': {
      hint: "format คือขนาดกระดาษสำเร็จรูป เช่น 'a4' หรือ 'a3'",
      answerCode: "const doc = new jsPDF({ unit: 'mm', format: 'a3', orientation: 'landscape' });",
    },
    'orientation-landscape': {
      hint: "orientation คือแนวกระดาษ ใส่เป็น property อีกตัวใน object ของ new jsPDF(...)",
      answerCode: "const doc = new jsPDF({ unit: 'mm', format: 'a3', orientation: 'landscape' });",
    },
  },
  'xy-position': {
    'left-text': {
      hint: "วางข้อความด้วย doc.text(text, x, y). ข้อความ Left ใช้ x ใกล้ขอบซ้าย เช่น 20",
      answerCode: "doc.text('Left', 20, 55);",
    },
    'center-text': {
      hint: 'หน้า A4 กว้างประมาณ 210 mm จุดกลางแนวนอนคือ x ประมาณ 105',
      answerCode: "doc.text('Center', 105, 90, { align: 'center' });",
    },
    'center-align': {
      hint: "เอา { align: 'center' } ใส่เป็น argument ตัวที่ 4 ของ doc.text(...)",
      answerCode: "doc.text('Center', 105, 90, { align: 'center' });",
    },
    'right-text': {
      hint: 'ข้อความ Right ใช้ x ใกล้ขอบขวา เช่น 190',
      answerCode: "doc.text('Right', 190, 125, { align: 'right' });",
    },
    'right-align': {
      hint: "เอา { align: 'right' } ใส่เป็น argument ตัวที่ 4 ของ doc.text(...)",
      answerCode: "doc.text('Right', 190, 125, { align: 'right' });",
    },
  },
  'line-rect': {
    'rect-call': {
      hint: 'rect คือ box สี่เหลี่ยม ใช้ doc.rect(x, y, width, height)',
      answerCode: 'doc.rect(60, 80, 90, 60);',
    },
    'center-rect': {
      hint: 'วาง box ใกล้กลางหน้าโดยให้ x + width / 2 ใกล้ 105',
      answerCode: 'doc.rect(60, 80, 90, 60);',
    },
    'diagonal-down-line': {
      hint: 'ใช้มุมซ้ายบนของ box เป็นจุดเริ่ม และมุมขวาล่างเป็นจุดปลาย',
      answerCode: 'doc.line(60, 80, 150, 140);',
    },
    'diagonal-up-line': {
      hint: 'เส้นที่สองลากจากมุมขวาบนของ box ไปมุมซ้ายล่าง',
      answerCode: 'doc.line(150, 80, 60, 140);',
    },
    'two-lines': {
      hint: 'ต้องมี doc.line(...) สองบรรทัดเพื่อทำกากบาท',
      answerCode: "doc.line(60, 80, 150, 140);\ndoc.line(150, 80, 60, 140);",
    },
  },
  style: {
    'card-variables': {
      hint: 'ใช้ตัวแปรตำแหน่งและขนาด เพื่อให้ rect, line และ text อิงจาก box เดียวกัน',
      answerCode:
        'const cardX = 25;\nconst cardY = 45;\nconst cardWidth = 160;\nconst cardHeight = 70;',
    },
    'font-size': {
      hint: 'doc.setFontSize เป็น state: ตั้งก่อน แล้ว doc.text(...) หลังจากนั้นจะใช้ขนาดนี้',
      answerCode: "doc.setFontSize(18);\ndoc.text('Status Card', cardX, 30);\ndoc.setFontSize(11);",
    },
    'text-color': {
      hint: 'doc.setTextColor ตั้งสีข้อความสำหรับ doc.text(...) ถัดไป',
      answerCode: 'doc.setTextColor(17, 24, 39);',
    },
    'fill-color': {
      hint: 'doc.setFillColor คือสีพื้นของ box ต้องใช้คู่กับ rect style แบบ F หรือ FD',
      answerCode: 'doc.setFillColor(248, 250, 252);',
    },
    'draw-color': {
      hint: 'doc.setDrawColor คือสีเส้นหรือสีขอบ ไม่ใช่สีพื้น',
      answerCode: 'doc.setDrawColor(36, 87, 214);',
    },
    'rect-fd': {
      hint: "'FD' หมายถึง fill + draw คือมีทั้งสีพื้นและเส้นขอบ",
      answerCode: "doc.rect(cardX, cardY, cardWidth, cardHeight, 'FD');",
    },
    'divider-line': {
      hint: 'ใช้ doc.line(...) วาดเส้นคั่น โดยอิงจาก cardX/cardY/cardWidth',
      answerCode: 'doc.line(cardX + 10, cardY + 44, cardX + cardWidth - 10, cardY + 44);',
    },
  },
  'thai-font': {
    'register-thai-font': {
      hint: 'register คือบอก jsPDF ให้รู้จักฟอนต์นี้ก่อนใช้งาน',
      answerCode: 'registerThaiFont(doc);',
    },
    'set-thai-font': {
      hint: 'หลัง register แล้วให้เลือกฟอนต์ด้วย doc.setFont(...) ก่อน doc.text(...) ภาษาไทย',
      answerCode: 'doc.setFont(PDF_FONTS.thai.family, PDF_FONTS.thai.style);',
    },
    'use-font-metadata': {
      hint: 'PDF_FONTS.thai คือข้อมูลชื่อฟอนต์และ style ที่ helper register ไว้ให้ใช้ต่อ',
      answerCode: 'doc.setFont(PDF_FONTS.thai.family, PDF_FONTS.thai.style);',
    },
    'thai-text': {
      hint: 'หลังเลือกฟอนต์ไทยแล้ว ให้ส่งข้อความไทยเข้า doc.text(...)',
      answerCode: "doc.text('สวัสดี jsPDF', 20, 32);",
    },
    'normal-style': {
      hint: "ตัวอย่างนี้มีฟอนต์ style 'normal' ให้ใช้ ไม่ต้องเดา bold/italic เอง",
      answerCode: 'doc.setFont(PDF_FONTS.thai.family, PDF_FONTS.thai.style);',
    },
  },
  image: {
    'image-path': {
      hint: 'imagePath คือ string ที่บอกว่ารูปอยู่ที่ไหนใน public/images',
      answerCode: "const imagePath = '/images/lesson-image-sample.svg';",
    },
    'get-lesson-image': {
      hint: 'getLessonImage(imagePath) แปลง path ให้เป็น image data ที่ jsPDF ใช้ได้',
      answerCode: 'const imageData = getLessonImage(imagePath);',
    },
    'add-image': {
      hint: 'doc.addImage(...) คือคำสั่งวางรูปลงกรอบบน PDF',
      answerCode: "doc.addImage(imageData, 'PNG', 20, 40, 120, 68);",
    },
    'image-size': {
      hint: 'ตัวเลขสองตัวท้ายของ addImage คือ width และ height ของรูปบน PDF',
      answerCode: "doc.addImage(imageData, 'PNG', 20, 40, 120, 68);",
    },
  },
  'data-mapping': {
    'data-object': {
      hint: 'project คือ object สำหรับข้อมูลหนึ่งชุด เช่นชื่อ วันที่ เจ้าของ และสถานะ',
      answerCode:
        "const project = {\n  name: 'Visual Lesson Playground',\n  date: '2026-06-11',\n  owner: 'Toom',\n  status: 'Draft',\n};",
    },
    'data-array': {
      hint: 'milestones คือ array รายการหลายแถว เช่น รายการสถานะหรืองานย่อย',
      answerCode:
        "const milestones = [\n  { label: 'Brief', value: 'Ready' },\n  { label: 'Layout', value: 'In progress' },\n];",
    },
    'array-iteration': {
      hint: 'ใช้ forEach หรือ map เพื่อทำซ้ำ doc.text(...) ให้แต่ละ milestone',
      answerCode:
        'milestones.forEach((item, index) => {\n  const y = 108 + index * 12;\n  doc.text(item.label, 28, y);\n});',
    },
    'row-y-position': {
      hint: 'ใช้ index คูณระยะห่าง เพื่อให้แต่ละแถวเลื่อนลงไม่ทับกัน',
      answerCode: 'const y = 108 + index * 12;',
    },
    'property-values': {
      hint: 'อ่านค่าจาก object ด้วยจุด เช่น project.name แล้วส่งเข้า doc.text(...)',
      answerCode: 'doc.text(project.name, 60, 45);',
    },
  },
  'text-wrap': {
    'long-summary': {
      hint: 'summary ต้องยาวพอที่จะเห็นว่า wrap แล้วแตกเป็นหลายบรรทัด',
      answerCode:
        "const project = {\n  summary: 'This lesson summary is intentionally long so it can show how text wraps when the available PDF space is narrow.',\n};",
    },
    'max-width': {
      hint: 'maxWidth คือความกว้างสูงสุดของกรอบข้อความในหน่วย mm',
      answerCode: 'const maxWidth = 145;',
    },
    'split-text': {
      hint: 'ส่งข้อความยาวและ maxWidth เข้า doc.splitTextToSize(...)',
      answerCode: 'const wrappedSummary = doc.splitTextToSize(project.summary, maxWidth);',
    },
    'wrapped-variable': {
      hint: 'เก็บผลลัพธ์จาก splitTextToSize ไว้ใน wrappedSummary เพื่อเอาไปวาดต่อ',
      answerCode: 'const wrappedSummary = doc.splitTextToSize(project.summary, maxWidth);',
    },
    'text-wrapped-lines': {
      hint: 'doc.text(...) รับ array ของบรรทัดได้ ให้ส่ง wrappedSummary เข้าไปตรง text',
      answerCode: 'doc.text(wrappedSummary, 24, 62);',
    },
  },
  'one-page-layout': {
    'page-margin': {
      hint: 'pageMargin คือขอบมาตรฐานของหน้า ช่วยให้ทุก section เริ่มตรงกัน',
      answerCode: 'const pageMargin = 20;',
    },
    'content-width': {
      hint: 'contentWidth คือความกว้างพื้นที่ทำงานหลัก ใช้ซ้ำกับ rect/line/text เพื่อ layout ไม่หลุด',
      answerCode: 'const contentWidth = 170;',
    },
    'section-boxes': {
      hint: 'ใช้ doc.rect(...) เป็นกล่อง section เช่น info และ summary',
      answerCode: 'doc.rect(pageMargin, 48, contentWidth, 42);\ndoc.rect(pageMargin, 104, contentWidth, 58);',
    },
    'divider-line': {
      hint: 'divider หรือ footer line ใช้ doc.line(x1, y1, x2, y2)',
      answerCode: 'doc.line(pageMargin, 32, pageMargin + contentWidth, 32);',
    },
    'wrapped-summary': {
      hint: 'summary ยาวควร wrap ก่อนวางลง section',
      answerCode: 'const wrappedSummary = doc.splitTextToSize(project.summary, contentWidth - 16);',
    },
    'project-data': {
      hint: 'ใช้ค่าจาก project object ไม่ใช่พิมพ์ข้อความคงที่ทั้งหมด',
      answerCode: "doc.text(project.name, pageMargin + 8, 62);",
    },
    footer: {
      hint: 'footer ควรอยู่ใกล้ท้ายหน้า เช่น y ประมาณ 278',
      answerCode: "doc.text('Generated with jsPDF Visual Lessons', pageMargin, 278);",
    },
  },
  'checkpoint-project-summary': {
    'project-object': {
      hint: 'เริ่มจาก object ชื่อ project แล้วเก็บข้อมูลทุก field ของโจทย์ไว้ในนี้',
      answerCode: 'const project = {\n  name: \'สนามเรียนรู้ jsPDF แบบเห็นภาพ\',\n  date: \'2026-06-11\',\n};',
    },
    footer: {
      hint: 'ใช้ footerY ที่โจทย์เตรียมไว้ เพื่อให้ footer อยู่ใกล้ท้ายหน้าอย่างสม่ำเสมอ',
      answerCode: "doc.line(pageMargin, footerY - 8, pageMargin + contentWidth, footerY - 8);\ndoc.text('Generated by jsPDF Visual Lesson Playground', pageMargin, footerY);",
    },
  },
};

function getFallbackHint(item) {
  return `ข้อนี้ต้องการหลักฐานใน code/PDF ตามข้อความ: ${item.label}`;
}

export function getChecklistGuide(lesson, item, fallbackHint = null) {
  const guide = checklistGuides[lesson.id]?.[item.id] ?? commonGuides[item.id] ?? {};
  const isCheckpoint = lesson.type === 'checkpoint';

  return {
    hint: isCheckpoint
      ? fallbackHint ?? guide.hint ?? item.hints?.[0] ?? getFallbackHint(item)
      : guide.hint ?? fallbackHint ?? item.hints?.[0] ?? getFallbackHint(item),
    answerCode: isCheckpoint ? null : guide.answerCode ?? null,
  };
}
