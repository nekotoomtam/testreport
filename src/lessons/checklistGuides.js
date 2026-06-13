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
    'milestone-card': 'Milestones card ใช้ doc.rect(pageMargin, 178, contentWidth, 48)',
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
    'row-y-position': 'คำนวณ rowY จาก milestoneY + 30 + index * 10 เพื่อให้แต่ละ row ไม่ทับกัน',
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

function getFallbackHint(item) {
  return `ข้อนี้ต้องการหลักฐานใน code/PDF ตามข้อความ: ${item.label}`;
}

function getGenerateBody(code) {
  const match = code?.match(/function\s+generate\s*\(\)\s*{\n?([\s\S]*)\n}\s*$/);

  return match ? match[1].trim() : code ?? null;
}

export function getChecklistGuide(lesson, item, fallbackHint = null) {
  const isCheckpoint = lesson.type === 'checkpoint';

  return {
    hint:
      fallbackHint ??
      checklistHints[lesson.id]?.[item.id] ??
      item.hints?.[0] ??
      getFallbackHint(item),
    answerCode: isCheckpoint ? null : getGenerateBody(lesson.solutionCode),
  };
}
