export const dataReferenceSections = [
  {
    id: 'big-picture',
    title: 'Big Picture',
    summary: 'มองข้อมูลเป็นวัตถุดิบที่ต้องจัดรูปก่อนส่งเข้า renderer',
    items: [
      {
        id: 'data-flow',
        name: 'Raw data -> clean model -> render',
        apiType: 'workflow',
        signature: 'raw API data -> normalize(raw) -> generatePdf(model)',
        mentalModel:
          'ให้มองงานเอกสารเป็นสายพาน: รับข้อมูลดิบจาก API ก่อน จัดชื่อ field และชนิดข้อมูลให้สะอาด แล้วค่อยส่ง clean model เข้า function ที่วาด PDF',
        visualKind: 'data-flow',
        parameters: [
          { name: 'raw data', detail: 'ข้อมูลจริงอาจชื่อ field ไม่ชัด เป็น string ปน number หรือมีค่า null' },
          { name: 'normalize', detail: 'แปลงข้อมูลดิบให้เป็น shape เดียวที่ renderer อ่านง่าย' },
          { name: 'clean model', detail: 'object ที่ใช้ในเอกสารจริง เช่น customer, items, totals' },
          { name: 'render', detail: 'function วาด PDF ควรรับ clean model ไม่ควรคุ้ย raw data เอง' },
        ],
        example:
          'const quotation = normalizeQuotation(rawQuotation);\nconst doc = generateQuotationPdf(quotation);\nreturn doc;',
      },
    ],
  },
  {
    id: 'shape',
    title: 'Shape',
    summary: 'ออกแบบ object และ array ให้ตรงกับเอกสารที่จะวาด',
    items: [
      {
        id: 'raw-vs-clean',
        name: 'Raw vs clean data',
        apiType: 'concept',
        signature: 'quo_cus_name -> quotation.customer.name',
        mentalModel:
          'raw data คือข้อมูลตามระบบเดิม ส่วน clean data คือข้อมูลที่ตั้งชื่อใหม่ให้ตรงกับภาษาของเอกสาร ทำให้ code วาด PDF อ่านออกทันที',
        visualKind: 'raw-clean',
        parameters: [
          { name: 'raw key', detail: 'ชื่อจาก API หรือฐานข้อมูล เช่น quo_cus_name, qrp_toal' },
          { name: 'clean key', detail: 'ชื่อใหม่ที่อ่านง่าย เช่น customer.name, item.unitPrice' },
          { name: 'document language', detail: 'ตั้งชื่อจากความหมายในเอกสาร ไม่ใช่จากชื่อตารางในระบบ' },
        ],
        example:
          'const quotation = {\n  customer: { name: raw.quo_cus_name },\n  document: { no: raw.quo_no },\n};',
      },
      {
        id: 'object-shape',
        name: 'Object shape',
        apiType: 'object',
        signature: 'quotation.customer.name',
        mentalModel:
          'object shape คือโครงของข้อมูลสะอาด ถ้าจัดกลุ่มดี renderer จะรู้ว่าข้อมูลลูกค้าอยู่ที่ customer และยอดเงินอยู่ที่ totals',
        visualKind: 'object-shape',
        parameters: [
          { name: 'document', detail: 'ข้อมูลเอกสาร เช่น เลขที่ วันที่ วันหมดอายุ' },
          { name: 'customer', detail: 'ข้อมูลลูกค้า เช่น ชื่อ ที่อยู่ เบอร์ อีเมล' },
          { name: 'items', detail: 'array ของแถวสินค้าในตาราง' },
          { name: 'totals', detail: 'ยอดรวม ส่วนลด VAT และยอดสุทธิ' },
        ],
        example:
          'const quotation = {\n  document: { no: "QT-001", date: "2026-06-13" },\n  customer: { name: "ACME" },\n  items: [],\n  totals: {},\n};',
      },
      {
        id: 'array-items',
        name: 'Array items',
        apiType: 'array',
        signature: 'quotation.items.map(item => ...)',
        mentalModel:
          'แถวในตารางควรเป็น array เพราะ renderer จะเดินทีละ item เพื่อวาด row, คำนวณราคา และตัดหน้าเมื่อพื้นที่ไม่พอ',
        visualKind: 'array-items',
        parameters: [
          { name: 'items', detail: 'รายการสินค้าแต่ละแถวใน quotation table' },
          { name: 'item', detail: 'ข้อมูลของแถวเดียว เช่น code, name, quantity, unitPrice' },
          { name: 'lineTotal', detail: 'ยอดรวมของแถวเดียว มักคำนวณจาก quantity * unitPrice' },
        ],
        example:
          'const items = raw.items.map((item) => ({\n  name: item.nameProduct,\n  quantity: Number(item.amount || 0),\n}));',
      },
    ],
  },
  {
    id: 'helpers',
    title: 'Helpers',
    summary: 'ใช้ helper เล็ก ๆ ลดความรกของ code และกันค่าพัง',
    items: [
      {
        id: 'safe-value',
        name: 'Safe value / default',
        apiType: 'helper',
        signature: "textOrDash(value) / toNumber(value)",
        mentalModel:
          'ข้อมูลจริงมักมี null, undefined หรือ string ว่าง helper จะทำให้ renderer ไม่ต้องเช็คซ้ำทุกจุดก่อนวางข้อความหรือคำนวณ',
        visualKind: 'safe-value',
        parameters: [
          { name: 'textOrDash', detail: "ถ้าไม่มีข้อความให้คืน '-'" },
          { name: 'toNumber', detail: 'แปลงค่าที่อาจเป็น string/null ให้เป็น number ที่คำนวณได้' },
          { name: 'single rule', detail: 'ตั้งกติกาค่า default ไว้ที่เดียว แล้วใช้ทั้งเอกสาร' },
        ],
        example:
          "function textOrDash(value) {\n  return value ? String(value) : '-';\n}\n\nfunction toNumber(value) {\n  return Number(value || 0);\n}",
      },
      {
        id: 'money-format',
        name: 'Number and money format',
        apiType: 'format',
        signature: 'money(total)',
        mentalModel:
          'ตัวเลขควรเป็น number ตอนคำนวณ และค่อย format เป็น string ตอนแสดงในเอกสาร ไม่ควรเอา string ที่มี comma กลับไปคำนวณ',
        visualKind: 'money-format',
        parameters: [
          { name: 'calculate', detail: 'คำนวณด้วย number เช่น 1200.5' },
          { name: 'format', detail: "แสดงเป็น string เช่น '1,200.50'" },
          { name: 'align right', detail: 'ตัวเลขในตารางราคาอ่านง่ายเมื่อจัดขวา' },
        ],
        example:
          "function money(value) {\n  return Number(value || 0).toLocaleString('th-TH', {\n    minimumFractionDigits: 2,\n    maximumFractionDigits: 2,\n  });\n}",
      },
      {
        id: 'date-format',
        name: 'Date format',
        apiType: 'format',
        signature: 'thaiDate(rawDate)',
        mentalModel:
          'วันที่จากระบบควรถูกแปลงก่อนเข้า renderer เพื่อให้ทุกจุดในเอกสารใช้ format เดียวกัน เช่น DD/MM/YYYY หรือปี พ.ศ.',
        visualKind: 'date-format',
        parameters: [
          { name: 'raw date', detail: 'ค่าจาก API เช่น 2026-06-13 หรือ ISO string' },
          { name: 'display date', detail: 'ค่าที่แสดงในเอกสาร เช่น 13/06/2569' },
          { name: 'fallback', detail: "ถ้าไม่มีวันที่ ให้คืน '-' หรือข้อความที่ตกลงไว้" },
        ],
        example:
          "function thaiDate(value) {\n  if (!value) return '-';\n  const date = new Date(value);\n  return date.toLocaleDateString('th-TH');\n}",
      },
    ],
  },
  {
    id: 'transform',
    title: 'Transform',
    summary: 'เดินข้อมูลเป็นรอบที่ชัดเจน แทนการวาดไปคำนวณไป',
    items: [
      {
        id: 'map',
        name: 'map() for rows',
        apiType: 'array',
        signature: 'rawItems.map(normalizeItem)',
        mentalModel:
          'map() เหมาะกับการแปลง array หนึ่งชุดเป็น array อีกชุด เช่น raw product rows กลายเป็น quotation.items ที่พร้อมวาด',
        visualKind: 'map',
        parameters: [
          { name: 'input array', detail: 'รายการดิบจาก API' },
          { name: 'normalizeItem', detail: 'function ที่แปลง item ดิบหนึ่งตัวให้สะอาด' },
          { name: 'output array', detail: 'รายการที่ renderer วาดได้ทันที' },
        ],
        example:
          'const items = rawItems.map((rawItem) => ({\n  code: textOrDash(rawItem.code),\n  quantity: toNumber(rawItem.amount),\n}));',
      },
      {
        id: 'reduce',
        name: 'reduce() for totals',
        apiType: 'array',
        signature: 'items.reduce((sum, item) => sum + item.lineTotal, 0)',
        mentalModel:
          'reduce() เหมาะกับการรวม array ให้เหลือค่าเดียว เช่น subtotal, total quantity หรือจำนวนแถวทั้งหมด',
        visualKind: 'reduce',
        parameters: [
          { name: 'sum', detail: 'ค่าที่สะสมระหว่างเดิน array' },
          { name: 'item', detail: 'แถวปัจจุบันที่เอามาบวก' },
          { name: 'initial value', detail: 'ค่าเริ่มต้น เช่น 0' },
        ],
        example:
          'const subtotal = items.reduce(\n  (sum, item) => sum + item.lineTotal,\n  0,\n);',
      },
    ],
  },
  {
    id: 'contract',
    title: 'Contract',
    summary: 'กำหนดสัญญาระหว่างข้อมูลสะอาดกับ renderer ให้ชัด',
    items: [
      {
        id: 'normalize-function',
        name: 'normalize function',
        apiType: 'pattern',
        signature: 'function normalizeQuotation(raw) { return quotation; }',
        mentalModel:
          'normalize function คือประตูแปลงข้อมูลดิบทั้งหมดให้เป็น clean model หนึ่งชุด ก่อนที่เอกสารจะเริ่มวาดจริง',
        visualKind: 'normalize',
        parameters: [
          { name: 'input', detail: 'รับ raw data ที่ชื่อ field อาจยังรก' },
          { name: 'output', detail: 'คืน quotation object ที่ renderer ใช้ได้' },
          { name: 'responsibility', detail: 'จัด field, default, number, date และ totals ให้พร้อม' },
        ],
        example:
          'function normalizeQuotation(raw) {\n  const items = raw.items.map(normalizeItem);\n  return {\n    document: normalizeDocument(raw),\n    customer: normalizeCustomer(raw),\n    items,\n    totals: buildTotals(items, raw),\n  };\n}',
      },
      {
        id: 'render-contract',
        name: 'Render contract',
        apiType: 'pattern',
        signature: 'generateQuotationPdf(quotation)',
        mentalModel:
          'renderer ควรรู้วิธีวาด PDF แต่ไม่ควรรู้ว่า raw API field ชื่ออะไร ถ้า renderer รับ clean model อย่างเดียว code จะอ่านง่ายและย้ายไปใช้กับเอกสารอื่นได้',
        visualKind: 'render-contract',
        parameters: [
          { name: 'clean input only', detail: 'generate function รับ quotation ที่ normalize แล้ว' },
          { name: 'no raw lookup', detail: 'หลีกเลี่ยงการเขียน raw.quo_cus_name ใน renderer' },
          { name: 'stable output', detail: 'ถ้า model shape คงที่ ผลลัพธ์ PDF จะตรวจง่ายกว่า' },
        ],
        example:
          'function generateQuotationPdf(quotation) {\n  drawHeader(quotation.document, quotation.customer);\n  drawItemsTable(quotation.items);\n  drawTotals(quotation.totals);\n  return doc;\n}',
      },
    ],
  },
];
