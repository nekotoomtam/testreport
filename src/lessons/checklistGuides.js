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
  'quotation-get-data': {
    'page-a4-mm': "เริ่มเหมือนเอกสารแรก: const doc = new jsPDF({ unit: 'mm', format: 'a4' })",
    'thai-font-ready': 'หลังสร้าง doc ให้ registerThaiFont(doc) แล้ว setFont เป็น PDF_FONTS.thai',
    'raw-rows': "ใช้ const rawRows = getLessonData('quotationRows') เพื่อดึงข้อมูลดิบจาก Data card เข้ามาใน code",
    'return-doc': 'ท้าย generate() ต้อง return doc เพื่อให้ preview ใช้งานได้',
  },
  'quotation-pick-theme': {
    'previous-stage': 'ฐานจากบท 1 ต้องยังมี doc, rawRows, ฟอนต์ไทย และ return doc',
    'selected-theme-id': "กำหนด const selectedThemeId = 'blue' เพื่อบอกว่าจะทำเอกสารกลุ่มไหนก่อน",
  },
  'quotation-filter-rows': {
    'previous-stage': 'ฐานจากบท 2 ต้องยังมี rawRows และ selectedThemeId',
    'filter-selected-rows': 'ใช้ rawRows.filter((row) => row.theme_code === selectedThemeId) เพื่อเหลือเฉพาะ rows ของเอกสารนี้',
  },
  'quotation-theme-config': {
    'previous-stage': 'ฐานจากบท 3 ต้องยังมี selectedRows ที่ filter จาก selectedThemeId',
    'themes-array': 'เพิ่ม const themes = [...] เพื่อเก็บสี backgroundPath และชื่อแบรนด์ของแต่ละ theme',
    'find-theme': 'ใช้ themes.find((theme) => theme.id === selectedThemeId) เพื่อหา config สี/background',
    'find-theme-index': 'ใช้ findIndex() หรือเช็ค !theme เพื่อกันกรณีเลือก theme ที่ไม่มีอยู่',
  },
  'quotation-normalize-start': {
    'previous-stage': 'อย่าลบ filter/find จากบท 4 เพราะ normalize จะย้าย logic เหล่านั้นเข้า function',
    'normalize-function': 'สร้าง function normalizeQuotationData(rawRows, selectedThemeId) แล้วให้ function นี้ return clean model',
    'generate-uses-data': 'ใน generate() ให้ const data = normalizeQuotationData(rawRows, selectedThemeId) ก่อนนำไปใช้',
  },
  'quotation-document-customer': {
    'previous-stage': 'ฐานจากบท 5 ต้องยังมี normalizeQuotationData และ generate() เรียก data ที่ normalize แล้ว',
    'first-row': 'หลัง selectedRows ผ่านแล้ว ให้หยิบ const firstRow = selectedRows[0] เพื่อเป็นข้อมูลระดับเอกสารและลูกค้า',
    'document-model': 'วาง formatThaiDate และ const document หลัง firstRow จากนั้นเพิ่ม document ใน return object เดิม ไม่ต้องประกาศ firstRow ซ้ำ',
    'customer-model': 'วาง const customer หลัง document จากนั้นเพิ่ม customer ใน return object เดิม ไม่ต้องเขียน document/customer ทั้งก้อนซ้ำ',
  },
  'quotation-map-items': {
    'previous-stage': 'ฐานจากบท 6 ต้องยัง return document/customer จาก normalizeQuotationData',
    'items-model': 'วาง const items หลัง firstRow/document/customer โดย selectedRows.map((row) => { ... }) ต้อง return object ของ item หนึ่งตัว แล้วเพิ่ม items ใน return object เดิม',
  },
  'quotation-convert-numbers': {
    'previous-stage': 'ฐานจากบท 7 ต้องยังมี items ที่ map จาก selectedRows',
    'number-conversion': 'ใน selectedRows.map(...) ให้แปลง row.quantity และ row.unit_price เป็น quantity/unitPrice ก่อน return item',
    'line-total': 'ใน object ของ item ให้ใช้ quantity/unitPrice ที่แปลงแล้ว และเพิ่ม lineTotal: quantity * unitPrice',
  },
  'quotation-reduce-totals': {
    'previous-stage': 'ฐานจากบท 8 ต้องยังแปลง quantity/unitPrice และมี lineTotal ต่อ item',
    'subtotal-reduce': 'หลังสร้าง items แล้ว ใช้ items.reduce((sum, item) => sum + item.lineTotal, 0) เพื่อรวมยอดสินค้า',
    'grand-total': 'สร้าง const totals หลังคำนวณ vat แล้วเพิ่ม totals ใน return object เดิม',
  },
  'quotation-render-start': {
    'previous-stage': 'ฐานจากบท 9 ต้องยังมี data.totals และ clean model ครบ',
    'render-function': 'เพิ่ม function renderQuotation(data) เพื่อแยกงานวาด PDF ออกจากงานจัดข้อมูล',
    'generate-render-flow': 'ใน generate() ให้แทนส่วนสร้าง doc เดิมด้วย flow: rawRows -> normalizeQuotationData -> renderQuotation',
  },
  'quotation-header-background': {
    'previous-stage': 'ฐานจากบท 10 ต้องยังมี renderQuotation(data) และ generate() return renderQuotation(data)',
    'theme-background': 'ใน renderQuotation ใช้ const backgroundImage = getLessonImage(theme.backgroundPath) แล้ว addImage เต็มหน้า',
    'quotation-header': 'หัวเอกสารใช้ data.title, data.document.quoteNo และ data.document.quoteDate',
  },
  'quotation-customer-card': {
    'previous-stage': 'ฐานจากบท 11 ต้องยังมี renderQuotation(data), background และ header',
    'customer-card-rect': 'ใช้ doc.rect(pageMargin, 42, contentWidth, 36, "FD") หรือใกล้เคียงเพื่อทำ block ข้อมูลลูกค้า',
    'customer-name-text': 'วาง data.customer.name ใน doc.text() ไม่ใช้ raw field quo_cus_name ตรงๆ',
    'customer-contact-text': 'วาง data.customer.contact ใน doc.text()',
    'valid-until-text': 'วาง data.document.validUntil ใน doc.text() เพื่อบอกวันยืนราคา',
  },
  'quotation-table-columns': {
    'previous-stage': 'ฐานจากบท 12 ต้องยังมี customer card และข้อมูลลูกค้า',
    'columns-array': 'สร้าง const columns = [{ label, x, width, align }, ...] เป็นแผนที่ตาราง',
    'table-labels': 'label รายการ, จำนวน, หน่วย, ราคา, รวม ควรอยู่ใน columns array ชุดเดียว ไม่ต้องสร้าง array ซ้ำ',
    'columns-loop': 'ก่อน loop ให้กำหนด const tableTop เป็นตำแหน่ง y ของหัวตารางก่อน แล้วใช้ columns.forEach(...) วาด label แทนการเขียน doc.text ซ้ำทีละคอลัมน์',
    'numeric-align': "เพิ่ม align: 'right' ใน column ตัวเลขภายใน columns array เดิม",
  },
  'quotation-item-rows': {
    'previous-stage': 'ฐานจากบท 13 ต้องยังมี columns array และหัวตาราง',
    'items-loop': 'ใช้ data.items.forEach((item, index) => { ... }) เพื่อวาดแถวสินค้า',
    'row-position': 'คำนวณ rowY หนึ่งครั้งใน loop จาก currentY + index * rowHeight แล้วใช้ซ้ำใน doc.text ทุกช่อง',
    'item-fields': 'ใน loop เดิมให้วาง item.name, item.quantity, item.unitPrice และ item.lineTotal',
    'money-format': 'ค่าราคาใน loop เดิมให้ใช้ toFixed(2) ก่อนส่งเข้า doc.text()',
  },
  'quotation-pages-totals': {
    'previous-stage': 'ฐานจากบท 14 ต้องยัง loop data.items และวาดรายการสินค้าได้',
    'page-bottom-y': 'กำหนด pageBottomY เป็นเส้นล่างของพื้นที่วาด เช่น 270',
    'add-page': 'ก่อนวาด row หรือ summary ให้เช็คว่าพื้นที่พอไหม ถ้าไม่พอใช้ doc.addPage()',
    'repeat-page-context': 'ภายใน block addPage เดิม ให้วาด background/header/table header ซ้ำ ไม่ต้องสร้าง if addPage ซ้อนอีกชุด',
    'totals-block': 'หลังจบ rows ให้วาด data.totals.subtotal, discount, shipping, vat และ grandTotal ท้ายเอกสาร',
    'signature-block': 'เพิ่มช่อง ผู้เสนอราคา และ ผู้อนุมัติ เพื่อปิดท้ายใบเสนอราคา',
  },
  'checkpoint-quotation-pdf': {
    'final-normalize-render': 'ควรมีทั้ง normalizeQuotationData(rawRows, selectedThemeId) และ renderQuotation(data) โดย generate() เชื่อมสองส่วนนี้',
    'final-filter-theme': 'ใน normalize ให้ filter rows ตาม selectedThemeId และหา theme จาก themes array',
    'final-model-shape': 'model ที่คืนควรมี document, customer, items และ totals ครบ',
    'final-table': 'ตารางควรมี columns array และ loop data.items เพื่อรองรับจำนวนรายการที่เปลี่ยนได้',
    'final-pagination': 'ต้องมี logic doc.addPage() เมื่อพื้นที่ของ rows หรือ totals ไม่พอ',
    'final-totals-signature': 'ท้ายเอกสารควรมี totals และช่องลงชื่อครบ',
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
  'quotation-get-data': {
    'page-a4-mm': "const doc = new jsPDF({ unit: 'mm', format: 'a4' });",
    'thai-font-ready': `registerThaiFont(doc);
doc.setFont(PDF_FONTS.thai.family, PDF_FONTS.thai.style);`,
    'raw-rows': "const rawRows = getLessonData('quotationRows');",
    'return-doc': 'return doc;',
    'run-preview': null,
  },
  'quotation-pick-theme': {
    'selected-theme-id': "const selectedThemeId = 'blue';",
    'run-preview': null,
  },
  'quotation-filter-rows': {
    'filter-selected-rows':
      'const selectedRows = rawRows.filter((row) => row.theme_code === selectedThemeId);',
    'run-preview': null,
  },
  'quotation-theme-config': {
    'themes-array': `const themes = [
  { id: 'blue', backgroundPath: '/images/bg-blue-triangles.png' },
  { id: 'green', backgroundPath: '/images/bg-green-rectangles.png' },
  { id: 'pink', backgroundPath: '/images/bg-pink-circles.png' },
];`,
    'find-theme': 'const theme = themes.find((theme) => theme.id === selectedThemeId);',
    'find-theme-index': `const themeIndex = themes.findIndex((theme) => theme.id === selectedThemeId);
if (themeIndex === -1 || !theme) throw new Error('theme not found');`,
    'run-preview': null,
  },
  'quotation-normalize-start': {
    'normalize-function': `function normalizeQuotationData(rawRows, selectedThemeId) {
  const selectedRows = rawRows.filter((row) => row.theme_code === selectedThemeId);
  const theme = themes.find((theme) => theme.id === selectedThemeId);
  return { title: 'ใบเสนอราคา', theme, selectedRows };
}`,
    'generate-uses-data': 'const data = normalizeQuotationData(rawRows, selectedThemeId);',
    'run-preview': null,
  },
  'quotation-document-customer': {
    'first-row': 'const firstRow = selectedRows[0];',
    'document-model': `const formatThaiDate = (value) => {
  const [year, month, day] = String(value || '').split('-');

  if (!year || !month || !day) {
    return '-';
  }

  return day + '/' + month + '/' + (Number(year) + 543);
};

const document = {
  quoteNo: firstRow.quo_no,
  quoteDate: formatThaiDate(firstRow.quo_date),
  validUntil: formatThaiDate(firstRow.quo_valid_until),
};

// เพิ่ม document, เข้าไปใน return object เดิมของ normalizeQuotationData`,
    'customer-model': `const customer = {
  name: firstRow.quo_cus_name,
  contact: firstRow.quo_cus_contact,
  address: firstRow.quo_cus_address,
  tel: firstRow.quo_tel,
  email: firstRow.quo_email,
};

// เพิ่ม customer, เข้าไปใน return object เดิมของ normalizeQuotationData`,
    'run-preview': null,
  },
  'quotation-map-items': {
    'items-model': `const items = selectedRows.map((row) => {
  return {
    code: row.product_code,
    name: row.product_name,
    size: row.product_size,
    description: row.product_description,
    quantity: row.quantity,
    unit: row.unit,
    unitPrice: row.unit_price,
    imagePath: row.imagePath,
  };
});

// เพิ่ม items, เข้าไปใน return object เดิมของ normalizeQuotationData`,
    'run-preview': null,
  },
  'quotation-convert-numbers': {
    'number-conversion': `// วางไว้ใน selectedRows.map((row) => { ... }) ก่อน return item
const quantity = Number(row.quantity || 0);
const unitPrice = Number(row.unit_price || 0);`,
    'line-total': `// ใน object ของ item ให้ใช้ค่าที่แปลงแล้ว
  quantity,
  unitPrice,
  lineTotal: quantity * unitPrice,
`,
    'run-preview': null,
  },
  'quotation-reduce-totals': {
    'subtotal-reduce': `const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
const discount = Number(firstRow.discount || 0);
const shipping = Number(firstRow.shipping || 0);
const afterDiscount = subtotal - discount;
const vat = (afterDiscount + shipping) * (Number(firstRow.vat_rate || 0) / 100);`,
    'grand-total': `const totals = {
  subtotal,
  discount,
  afterDiscount,
  shipping,
  vat,
  grandTotal: afterDiscount + shipping + vat,
};

// เพิ่ม totals, เข้าไปใน return object เดิมของ normalizeQuotationData`,
    'run-preview': null,
  },
  'quotation-render-start': {
    'render-function': `function renderQuotation(data) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  registerThaiFont(doc);
  doc.setFont(PDF_FONTS.thai.family, PDF_FONTS.thai.style);
  doc.setFontSize(18);
  doc.text(data.title, 20, 24);
  return doc;
}`,
    'generate-render-flow': `// ใน generate() ให้แทนส่วนสร้าง doc เดิมด้วยสองบรรทัดนี้
const data = normalizeQuotationData(rawRows, selectedThemeId);
return renderQuotation(data);`,
    'run-preview': null,
  },
  'quotation-header-background': {
    'theme-background': `const theme = data.theme;
const backgroundImage = getLessonImage(theme.backgroundPath);
doc.addImage(backgroundImage, 'PNG', 0, 0, 210, 297);`,
    'quotation-header': `doc.setTextColor(...theme.text);
doc.setFontSize(20);
doc.text(data.title, 16, 24);
doc.setFontSize(10);
doc.text('เลขที่: ' + data.document.quoteNo, 194, 18, { align: 'right' });
doc.text('วันที่: ' + data.document.quoteDate, 194, 25, { align: 'right' });
doc.setDrawColor(...theme.primary);
doc.line(16, 32, 194, 32);`,
    'run-preview': null,
  },
  'quotation-customer-card': {
    'customer-card-rect': `doc.setDrawColor(...theme.border);
doc.setFillColor(...theme.cardFill);
doc.rect(pageMargin, 42, contentWidth, 36, 'FD');`,
    'customer-name-text': `doc.setFontSize(13);
doc.text('ข้อมูลลูกค้า', pageMargin + 6, 53);
doc.setFontSize(10);
doc.text('ชื่อ: ' + data.customer.name, pageMargin + 6, 62);`,
    'customer-contact-text': "doc.text('ผู้ติดต่อ: ' + data.customer.contact, pageMargin + 6, 69);",
    'valid-until-text': "doc.text('ยืนราคาถึง: ' + data.document.validUntil, 128, 69);",
    'run-preview': null,
  },
  'quotation-table-columns': {
    'columns-array': `const columns = [
  { label: 'รายการ', x: pageMargin + 6, width: 74 },
  { label: 'จำนวน', x: 104, width: 20 },
  { label: 'หน่วย', x: 128, width: 18 },
  { label: 'ราคา', x: 150, width: 20 },
  { label: 'รวม', x: 180, width: 20 },
];`,
    'table-labels': null,
    'columns-loop': `const tableTop = 90;

doc.setDrawColor(...theme.primary);
doc.setFillColor(...theme.primary);
doc.rect(pageMargin, tableTop, contentWidth, 10, 'F');
doc.setTextColor(255, 255, 255);

columns.forEach((column) => {
  doc.text(column.label, column.x, tableTop + 7, { align: column.align || 'left' });
});`,
    'numeric-align': `// เพิ่มใน column ตัวเลข เช่น จำนวน / ราคา / รวม
align: 'right'`,
    'run-preview': null,
  },
  'quotation-item-rows': {
    'items-loop': `data.items.forEach((item, index) => {
  // วาง rowY และ doc.text ของ item ใน block นี้
});`,
    'row-position': `// วางใน data.items.forEach(...) เพียงครั้งเดียว แล้วใช้ rowY ซ้ำทุกช่อง
const rowY = currentY + index * rowHeight;`,
    'item-fields': `doc.text(item.name, columns[0].x, rowY + 7);
doc.text(String(item.quantity), 124, rowY + 7, { align: 'right' });
doc.text(item.unitPrice.toFixed(2), 170, rowY + 7, { align: 'right' });
doc.text(item.lineTotal.toFixed(2), 200, rowY + 7, { align: 'right' });`,
    'money-format': `item.unitPrice.toFixed(2)
item.lineTotal.toFixed(2)`,
    'run-preview': null,
  },
  'quotation-pages-totals': {
    'page-bottom-y': 'const pageBottomY = 270;',
    'add-page': `if (currentY + rowHeight > pageBottomY) {
  doc.addPage();
  currentY = 45;
}`,
    'repeat-page-context': `const nextBackgroundImage = getLessonImage(theme.backgroundPath);
doc.addImage(nextBackgroundImage, 'PNG', 0, 0, 210, 297);
doc.text(data.title + ' (ต่อ)', 16, 25);
columns.forEach((column) => {
  doc.text(column.label, column.x, continuedTableStartY + 7, {
    align: column.align || 'left',
  });
});
currentY = continuedTableStartY + tableHeaderHeight;`,
    'totals-block': `doc.text(data.totals.subtotal.toFixed(2), 198, totalsY, { align: 'right' });
doc.text(data.totals.discount.toFixed(2), 198, totalsY + 8, { align: 'right' });
doc.text(data.totals.shipping.toFixed(2), 198, totalsY + 16, { align: 'right' });
doc.text(data.totals.vat.toFixed(2), 198, totalsY + 24, { align: 'right' });
doc.text(data.totals.grandTotal.toFixed(2), 198, totalsY + 32, { align: 'right' });`,
    'signature-block': `doc.text('ผู้เสนอราคา', 56, signatureY + 22, { align: 'center' });
doc.text('ผู้อนุมัติ', 146, signatureY + 22, { align: 'center' });`,
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
