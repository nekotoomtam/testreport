import {
  getQuotationBlueprintCode,
} from '../blueprints/quotationBlueprint.js';

const quotationStarterVersion = 2;

const blankStarterCode = `function generate() {

}
`;

const quotationImagePaths = [
  '/images/bg-blue-triangles.png',
  '/images/bg-green-rectangles.png',
  '/images/bg-pink-circles.png',
  '/images/lesson-image-sample.svg',
];

const quotationRowsDataSource = {
  id: 'quotationRows',
  title: 'Quotation raw rows',
  description:
    'ข้อมูลดิบจำลองจากระบบขาย มีหลาย theme ปนกันและยังใช้ชื่อ field แบบ DB ก่อนถูกจัดเป็น quotation model',
};

const themesSource = `[
  {
    id: 'blue',
    primary: [36, 87, 214],
    text: [17, 24, 39],
    muted: [100, 116, 139],
    border: [203, 213, 225],
    rowBorder: [216, 225, 236],
    cardFill: [248, 250, 252],
    totalFill: [239, 246, 255],
    backgroundPath: '/images/bg-blue-triangles.png',
    logoText: 'GP',
    brandName: 'BLUE PACK',
    brandSubText: 'Triangle quotation',
  },
  {
    id: 'green',
    primary: [47, 125, 79],
    text: [17, 24, 39],
    muted: [100, 116, 139],
    border: [203, 213, 225],
    rowBorder: [216, 225, 236],
    cardFill: [248, 252, 249],
    totalFill: [240, 253, 244],
    backgroundPath: '/images/bg-green-rectangles.png',
    logoText: 'GP',
    brandName: 'GREEN PACK',
    brandSubText: 'Rectangle quotation',
  },
  {
    id: 'pink',
    primary: [203, 62, 131],
    text: [17, 24, 39],
    muted: [100, 116, 139],
    border: [203, 213, 225],
    rowBorder: [216, 225, 236],
    cardFill: [255, 248, 251],
    totalFill: [253, 242, 248],
    backgroundPath: '/images/bg-pink-circles.png',
    logoText: 'GP',
    brandName: 'PINK PACK',
    brandSubText: 'Circle quotation',
  },
]`;

const q1 = `function generate() {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  registerThaiFont(doc);
  doc.setFont(PDF_FONTS.thai.family, PDF_FONTS.thai.style);

  const rawRows = getLessonData('quotationRows');
  const selectedThemeId = 'blue';

  doc.setFontSize(18);
  doc.text('Quotation data starter', 20, 24);
  doc.setFontSize(12);
  doc.text('raw rows: ' + rawRows.length, 20, 36);
  doc.text('selected theme: ' + selectedThemeId, 20, 44);

  return doc;
}
`;

const q2 = `const themes = ${themesSource};

function generate() {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  registerThaiFont(doc);
  doc.setFont(PDF_FONTS.thai.family, PDF_FONTS.thai.style);

  const rawRows = getLessonData('quotationRows');
  const selectedThemeId = 'blue';
  const selectedRows = rawRows.filter((row) => row.theme_code === selectedThemeId);
  const themeIndex = themes.findIndex((theme) => theme.id === selectedThemeId);
  const theme = themes.find((theme) => theme.id === selectedThemeId);

  if (themeIndex === -1 || !theme) {
    throw new Error('ไม่พบ theme: ' + selectedThemeId);
  }

  doc.setFontSize(18);
  doc.text('Quotation selected rows', 20, 24);
  doc.setFontSize(12);
  doc.text('theme: ' + theme.brandName, 20, 36);
  doc.text('selected rows: ' + selectedRows.length, 20, 44);

  return doc;
}
`;

const normalizeWithoutTotals = `function normalizeQuotationData(rawRows, selectedThemeId) {
  const formatThaiDate = (value) => {
    const [year, month, day] = String(value || '').split('-');

    if (!year || !month || !day) {
      return '-';
    }

    return day + '/' + month + '/' + (Number(year) + 543);
  };
  const themeIndex = themes.findIndex((theme) => theme.id === selectedThemeId);
  const theme = themes.find((item) => item.id === selectedThemeId);

  if (themeIndex === -1 || !theme) {
    throw new Error('ไม่พบ theme: ' + selectedThemeId);
  }

  const selectedRows = rawRows.filter((row) => row.theme_code === selectedThemeId);

  if (selectedRows.length === 0) {
    throw new Error('ไม่มีข้อมูลสำหรับ theme: ' + selectedThemeId);
  }

  const firstRow = selectedRows[0];
  const items = selectedRows.map((row) => {
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

  return {
    title: 'ใบเสนอราคา',
    theme,
    themeIndex,
    themeId: firstRow.theme_code,
    document: {
      quoteNo: firstRow.quo_no,
      quoteDate: formatThaiDate(firstRow.quo_date),
      validUntil: formatThaiDate(firstRow.quo_valid_until),
    },
    customer: {
      name: firstRow.quo_cus_name,
      contact: firstRow.quo_cus_contact,
      address: firstRow.quo_cus_address,
      tel: firstRow.quo_tel,
      email: firstRow.quo_email,
    },
    remark: firstRow.quo_remark,
    items,
  };
}`;

const normalizeWithTotals = `function normalizeQuotationData(rawRows, selectedThemeId) {
  const toNumber = (value) => Number(value || 0);
  const formatThaiDate = (value) => {
    const [year, month, day] = String(value || '').split('-');

    if (!year || !month || !day) {
      return '-';
    }

    return day + '/' + month + '/' + (Number(year) + 543);
  };
  const themeIndex = themes.findIndex((theme) => theme.id === selectedThemeId);
  const theme = themes.find((item) => item.id === selectedThemeId);

  if (themeIndex === -1 || !theme) {
    throw new Error('ไม่พบ theme: ' + selectedThemeId);
  }

  const selectedRows = rawRows.filter((row) => row.theme_code === selectedThemeId);

  if (selectedRows.length === 0) {
    throw new Error('ไม่มีข้อมูลสำหรับ theme: ' + selectedThemeId);
  }

  const firstRow = selectedRows[0];
  const items = selectedRows.map((row) => {
    const quantity = toNumber(row.quantity);
    const unitPrice = toNumber(row.unit_price);

    return {
      code: row.product_code,
      name: row.product_name,
      size: row.product_size,
      description: row.product_description,
      quantity,
      unit: row.unit,
      unitPrice,
      lineTotal: quantity * unitPrice,
      imagePath: row.imagePath,
    };
  });
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const discount = toNumber(firstRow.discount);
  const shipping = toNumber(firstRow.shipping);
  const afterDiscount = subtotal - discount;
  const vat = (afterDiscount + shipping) * (toNumber(firstRow.vat_rate) / 100);

  return {
    title: 'ใบเสนอราคา',
    theme,
    themeIndex,
    themeId: firstRow.theme_code,
    document: {
      quoteNo: firstRow.quo_no,
      quoteDate: formatThaiDate(firstRow.quo_date),
      validUntil: formatThaiDate(firstRow.quo_valid_until),
    },
    customer: {
      name: firstRow.quo_cus_name,
      contact: firstRow.quo_cus_contact,
      address: firstRow.quo_cus_address,
      tel: firstRow.quo_tel,
      email: firstRow.quo_email,
    },
    remark: firstRow.quo_remark,
    items,
    totals: {
      subtotal,
      discount,
      shipping,
      vat,
      grandTotal: afterDiscount + shipping + vat,
    },
  };
}`;

const q3 = `const themes = ${themesSource};

${normalizeWithoutTotals}

function generate() {
  const rawRows = getLessonData('quotationRows');
  const selectedThemeId = 'blue';
  const data = normalizeQuotationData(rawRows, selectedThemeId);
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  registerThaiFont(doc);
  doc.setFont(PDF_FONTS.thai.family, PDF_FONTS.thai.style);
  doc.setFontSize(18);
  doc.text(data.title, 20, 24);
  doc.setFontSize(12);
  doc.text('เลขที่: ' + data.document.quoteNo, 20, 36);
  doc.text('ลูกค้า: ' + data.customer.name, 20, 44);
  doc.text('รายการ: ' + data.items.length + ' แถว', 20, 52);

  return doc;
}
`;

const q4 = `const themes = ${themesSource};

${normalizeWithTotals}

function generate() {
  const rawRows = getLessonData('quotationRows');
  const selectedThemeId = 'blue';
  const data = normalizeQuotationData(rawRows, selectedThemeId);
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  registerThaiFont(doc);
  doc.setFont(PDF_FONTS.thai.family, PDF_FONTS.thai.style);
  doc.setFontSize(18);
  doc.text(data.title, 20, 24);
  doc.setFontSize(12);
  doc.text('เลขที่: ' + data.document.quoteNo, 20, 36);
  doc.text('ลูกค้า: ' + data.customer.name, 20, 44);
  doc.text('ยอดก่อน VAT: ' + data.totals.subtotal.toFixed(2), 20, 56);
  doc.text('ยอดสุทธิ: ' + data.totals.grandTotal.toFixed(2), 20, 64);

  return doc;
}
`;

const renderShell = `function renderQuotation(data) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const theme = data.theme;
  const backgroundImage = getLessonImage(theme.backgroundPath);
  const pageMargin = 16;
  const pageWidth = 210;
  const contentWidth = 178;

  registerThaiFont(doc);
  doc.setFont(PDF_FONTS.thai.family, PDF_FONTS.thai.style);
  doc.addImage(backgroundImage, 'PNG', 0, 0, 210, 297);

  doc.setTextColor(...theme.text);
  doc.setFontSize(20);
  doc.text(data.title, pageMargin, 24);
  doc.setFontSize(10);
  doc.text('เลขที่: ' + data.document.quoteNo, pageWidth - pageMargin, 18, { align: 'right' });
  doc.text('วันที่: ' + data.document.quoteDate, pageWidth - pageMargin, 25, { align: 'right' });

  doc.setDrawColor(...theme.primary);
  doc.setLineWidth(0.8);
  doc.line(pageMargin, 32, pageMargin + contentWidth, 32);

  return doc;
}`;

const renderCustomer = `function renderQuotation(data) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const theme = data.theme;
  const backgroundImage = getLessonImage(theme.backgroundPath);
  const pageMargin = 16;
  const pageWidth = 210;
  const contentWidth = 178;

  registerThaiFont(doc);
  doc.setFont(PDF_FONTS.thai.family, PDF_FONTS.thai.style);
  doc.addImage(backgroundImage, 'PNG', 0, 0, 210, 297);

  doc.setTextColor(...theme.text);
  doc.setFontSize(20);
  doc.text(data.title, pageMargin, 24);
  doc.setFontSize(10);
  doc.text('เลขที่: ' + data.document.quoteNo, pageWidth - pageMargin, 18, { align: 'right' });
  doc.text('วันที่: ' + data.document.quoteDate, pageWidth - pageMargin, 25, { align: 'right' });

  doc.setDrawColor(...theme.primary);
  doc.setLineWidth(0.8);
  doc.line(pageMargin, 32, pageMargin + contentWidth, 32);

  doc.setDrawColor(...theme.border);
  doc.setFillColor(...theme.cardFill);
  doc.rect(pageMargin, 42, contentWidth, 36, 'FD');
  doc.setFontSize(13);
  doc.text('ข้อมูลลูกค้า', pageMargin + 6, 53);
  doc.setFontSize(10);
  doc.setTextColor(...theme.muted);
  doc.text('ชื่อ: ' + data.customer.name, pageMargin + 6, 62);
  doc.text('ผู้ติดต่อ: ' + data.customer.contact, pageMargin + 6, 69);
  doc.text('ยืนราคาถึง: ' + data.document.validUntil, 128, 69);

  return doc;
}`;

const renderTableHeader = `function renderQuotation(data) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const theme = data.theme;
  const backgroundImage = getLessonImage(theme.backgroundPath);
  const pageMargin = 16;
  const pageWidth = 210;
  const contentWidth = 178;
  const tableTop = 90;
  const columns = [
    { label: 'รายการ', x: pageMargin + 6, width: 74 },
    { label: 'จำนวน', x: 104, width: 20, align: 'right' },
    { label: 'หน่วย', x: 128, width: 18 },
    { label: 'ราคา', x: 150, width: 20, align: 'right' },
    { label: 'รวม', x: 180, width: 20, align: 'right' },
  ];

  registerThaiFont(doc);
  doc.setFont(PDF_FONTS.thai.family, PDF_FONTS.thai.style);
  doc.addImage(backgroundImage, 'PNG', 0, 0, 210, 297);

  doc.setTextColor(...theme.text);
  doc.setFontSize(20);
  doc.text(data.title, pageMargin, 24);
  doc.setFontSize(10);
  doc.text('เลขที่: ' + data.document.quoteNo, pageWidth - pageMargin, 18, { align: 'right' });
  doc.text('วันที่: ' + data.document.quoteDate, pageWidth - pageMargin, 25, { align: 'right' });

  doc.setDrawColor(...theme.primary);
  doc.setLineWidth(0.8);
  doc.line(pageMargin, 32, pageMargin + contentWidth, 32);

  doc.setDrawColor(...theme.border);
  doc.setFillColor(...theme.cardFill);
  doc.rect(pageMargin, 42, contentWidth, 36, 'FD');
  doc.setFontSize(13);
  doc.text('ข้อมูลลูกค้า', pageMargin + 6, 53);
  doc.setFontSize(10);
  doc.setTextColor(...theme.muted);
  doc.text('ชื่อ: ' + data.customer.name, pageMargin + 6, 62);
  doc.text('ผู้ติดต่อ: ' + data.customer.contact, pageMargin + 6, 69);
  doc.text('ยืนราคาถึง: ' + data.document.validUntil, 128, 69);

  doc.setTextColor(...theme.text);
  doc.setDrawColor(...theme.primary);
  doc.setFillColor(...theme.primary);
  doc.rect(pageMargin, tableTop, contentWidth, 10, 'F');
  doc.setTextColor(255, 255, 255);
  columns.forEach((column) => {
    doc.text(column.label, column.x, tableTop + 7, {
      align: column.align || 'left',
    });
  });

  return doc;
}`;

const renderRows = `function renderQuotation(data) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const theme = data.theme;
  const backgroundImage = getLessonImage(theme.backgroundPath);
  const pageMargin = 16;
  const pageWidth = 210;
  const contentWidth = 178;
  const tableTop = 90;
  const rowHeight = 18;
  let currentY = tableTop + 10;
  const columns = [
    { label: 'รายการ', x: pageMargin + 6, width: 74 },
    { label: 'จำนวน', x: 104, width: 20, align: 'right' },
    { label: 'หน่วย', x: 128, width: 18 },
    { label: 'ราคา', x: 150, width: 20, align: 'right' },
    { label: 'รวม', x: 180, width: 20, align: 'right' },
  ];

  registerThaiFont(doc);
  doc.setFont(PDF_FONTS.thai.family, PDF_FONTS.thai.style);
  doc.addImage(backgroundImage, 'PNG', 0, 0, 210, 297);

  doc.setTextColor(...theme.text);
  doc.setFontSize(20);
  doc.text(data.title, pageMargin, 24);
  doc.setFontSize(10);
  doc.text('เลขที่: ' + data.document.quoteNo, pageWidth - pageMargin, 18, { align: 'right' });
  doc.text('วันที่: ' + data.document.quoteDate, pageWidth - pageMargin, 25, { align: 'right' });
  doc.setDrawColor(...theme.primary);
  doc.line(pageMargin, 32, pageMargin + contentWidth, 32);

  doc.setDrawColor(...theme.border);
  doc.setFillColor(...theme.cardFill);
  doc.rect(pageMargin, 42, contentWidth, 36, 'FD');
  doc.setFontSize(13);
  doc.text('ข้อมูลลูกค้า', pageMargin + 6, 53);
  doc.setFontSize(10);
  doc.setTextColor(...theme.muted);
  doc.text('ชื่อ: ' + data.customer.name, pageMargin + 6, 62);
  doc.text('ผู้ติดต่อ: ' + data.customer.contact, pageMargin + 6, 69);
  doc.text('ยืนราคาถึง: ' + data.document.validUntil, 128, 69);

  doc.setTextColor(...theme.text);
  doc.setDrawColor(...theme.primary);
  doc.setFillColor(...theme.primary);
  doc.rect(pageMargin, tableTop, contentWidth, 10, 'F');
  doc.setTextColor(255, 255, 255);
  columns.forEach((column) => {
    doc.text(column.label, column.x, tableTop + 7, { align: column.align || 'left' });
  });

  doc.setTextColor(...theme.text);
  doc.setDrawColor(...theme.rowBorder);
  data.items.forEach((item, index) => {
    const rowY = currentY + index * rowHeight;

    doc.line(pageMargin, rowY, pageMargin + contentWidth, rowY);
    doc.text(item.name, columns[0].x, rowY + 7);
    doc.setTextColor(...theme.muted);
    doc.text(item.code + ' / ' + item.size, columns[0].x, rowY + 13);
    doc.setTextColor(...theme.text);
    doc.text(String(item.quantity), columns[1].x + columns[1].width, rowY + 7, { align: 'right' });
    doc.text(item.unit, columns[2].x, rowY + 7);
    doc.text(item.unitPrice.toFixed(2), columns[3].x + columns[3].width, rowY + 7, { align: 'right' });
    doc.text(item.lineTotal.toFixed(2), columns[4].x + columns[4].width, rowY + 7, { align: 'right' });
  });

  return doc;
}`;

const createGeneratedStage = (renderFunction, themeId = 'blue') => `const themes = ${themesSource};

${normalizeWithTotals}

${renderFunction}

function generate() {
  const rawRows = getLessonData('quotationRows');
  const selectedThemeId = '${themeId}';
  const data = normalizeQuotationData(rawRows, selectedThemeId);

  return renderQuotation(data);
}
`;

const q5 = createGeneratedStage(renderShell);
const q6 = createGeneratedStage(renderCustomer);
const q7 = createGeneratedStage(renderTableHeader);
const q8 = createGeneratedStage(renderRows);
const q9 = getQuotationBlueprintCode('pink');

const qRawData = `function generate() {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  registerThaiFont(doc);
  doc.setFont(PDF_FONTS.thai.family, PDF_FONTS.thai.style);

  const rawRows = getLessonData('quotationRows');

  doc.setTextColor(17, 24, 39);
  doc.setFontSize(22);
  doc.text('ใบเสนอราคา', 20, 24);
  doc.setDrawColor(36, 87, 214);
  doc.line(20, 32, 190, 32);

  doc.setFontSize(14);
  doc.text('ข้อมูลดิบจากระบบ', 20, 48);
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  doc.text('rawRows ทั้งหมด: ' + rawRows.length + ' แถว', 20, 60);
  doc.text('บทนี้ยังไม่เลือกเอกสาร แค่ดึงข้อมูลเข้ามาให้ PDF ใช้ได้ก่อน', 20, 68);

  return doc;
}
`;

const qThemeId = `function generate() {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  registerThaiFont(doc);
  doc.setFont(PDF_FONTS.thai.family, PDF_FONTS.thai.style);

  const rawRows = getLessonData('quotationRows');
  const selectedThemeId = 'blue';

  doc.setTextColor(17, 24, 39);
  doc.setFontSize(22);
  doc.text('ใบเสนอราคา', 20, 24);
  doc.setDrawColor(36, 87, 214);
  doc.line(20, 32, 190, 32);

  doc.setFontSize(14);
  doc.text('เลือกชุดเอกสาร', 20, 48);
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  doc.text('rawRows ทั้งหมด: ' + rawRows.length + ' แถว', 20, 60);
  doc.text('selectedThemeId: ' + selectedThemeId, 20, 68);
  doc.text('ค่าตัวนี้จะใช้แยก rows ของใบเสนอราคาหนึ่งใบในบทถัดไป', 20, 76);

  return doc;
}
`;

const qFilterRows = `function generate() {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  registerThaiFont(doc);
  doc.setFont(PDF_FONTS.thai.family, PDF_FONTS.thai.style);

  const rawRows = getLessonData('quotationRows');
  const selectedThemeId = 'blue';
  const selectedRows = rawRows.filter((row) => row.theme_code === selectedThemeId);

  doc.setTextColor(17, 24, 39);
  doc.setFontSize(22);
  doc.text('ใบเสนอราคา', 20, 24);
  doc.setDrawColor(36, 87, 214);
  doc.line(20, 32, 190, 32);

  doc.setFontSize(14);
  doc.text('คัดข้อมูลของเอกสารนี้', 20, 48);
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  doc.text('rawRows ทั้งหมด: ' + rawRows.length + ' แถว', 20, 60);
  doc.text('selectedRows ของ ' + selectedThemeId + ': ' + selectedRows.length + ' แถว', 20, 68);
  doc.text('หลังจากนี้ renderer จะใช้ selectedRows แทน rawRows ทั้งก้อน', 20, 76);

  return doc;
}
`;

const qThemeConfig = `const themes = ${themesSource};

function generate() {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  registerThaiFont(doc);
  doc.setFont(PDF_FONTS.thai.family, PDF_FONTS.thai.style);

  const rawRows = getLessonData('quotationRows');
  const selectedThemeId = 'blue';
  const selectedRows = rawRows.filter((row) => row.theme_code === selectedThemeId);
  const themeIndex = themes.findIndex((theme) => theme.id === selectedThemeId);
  const theme = themes.find((theme) => theme.id === selectedThemeId);

  if (themeIndex === -1 || !theme) {
    throw new Error('ไม่พบ theme: ' + selectedThemeId);
  }

  doc.setTextColor(...theme.text);
  doc.setFontSize(22);
  doc.text('ใบเสนอราคา', 20, 24);
  doc.setDrawColor(...theme.primary);
  doc.line(20, 32, 190, 32);

  doc.setFontSize(14);
  doc.text('Theme config ของเอกสาร', 20, 48);
  doc.setFontSize(11);
  doc.setTextColor(...theme.muted);
  doc.text('brand: ' + theme.brandName, 20, 60);
  doc.text('backgroundPath: ' + theme.backgroundPath, 20, 68);
  doc.text('selectedRows: ' + selectedRows.length + ' แถว', 20, 76);

  return doc;
}
`;

const normalizeStart = `function normalizeQuotationData(rawRows, selectedThemeId) {
  const themeIndex = themes.findIndex((theme) => theme.id === selectedThemeId);
  const theme = themes.find((item) => item.id === selectedThemeId);

  if (themeIndex === -1 || !theme) {
    throw new Error('ไม่พบ theme: ' + selectedThemeId);
  }

  const selectedRows = rawRows.filter((row) => row.theme_code === selectedThemeId);

  if (selectedRows.length === 0) {
    throw new Error('ไม่มีข้อมูลสำหรับ theme: ' + selectedThemeId);
  }

  return {
    title: 'ใบเสนอราคา',
    theme,
    themeIndex,
    themeId: selectedThemeId,
    selectedRows,
  };
}`;

const normalizeDocumentCustomer = `function normalizeQuotationData(rawRows, selectedThemeId) {
  const formatThaiDate = (value) => {
    const [year, month, day] = String(value || '').split('-');

    if (!year || !month || !day) {
      return '-';
    }

    return day + '/' + month + '/' + (Number(year) + 543);
  };
  const themeIndex = themes.findIndex((theme) => theme.id === selectedThemeId);
  const theme = themes.find((item) => item.id === selectedThemeId);

  if (themeIndex === -1 || !theme) {
    throw new Error('ไม่พบ theme: ' + selectedThemeId);
  }

  const selectedRows = rawRows.filter((row) => row.theme_code === selectedThemeId);

  if (selectedRows.length === 0) {
    throw new Error('ไม่มีข้อมูลสำหรับ theme: ' + selectedThemeId);
  }

  const firstRow = selectedRows[0];

  return {
    title: 'ใบเสนอราคา',
    theme,
    themeIndex,
    themeId: firstRow.theme_code,
    document: {
      quoteNo: firstRow.quo_no,
      quoteDate: formatThaiDate(firstRow.quo_date),
      validUntil: formatThaiDate(firstRow.quo_valid_until),
    },
    customer: {
      name: firstRow.quo_cus_name,
      contact: firstRow.quo_cus_contact,
      address: firstRow.quo_cus_address,
      tel: firstRow.quo_tel,
      email: firstRow.quo_email,
    },
    remark: firstRow.quo_remark,
    selectedRows,
  };
}`;

const normalizeItemsText = `function normalizeQuotationData(rawRows, selectedThemeId) {
  const formatThaiDate = (value) => {
    const [year, month, day] = String(value || '').split('-');

    if (!year || !month || !day) {
      return '-';
    }

    return day + '/' + month + '/' + (Number(year) + 543);
  };
  const themeIndex = themes.findIndex((theme) => theme.id === selectedThemeId);
  const theme = themes.find((item) => item.id === selectedThemeId);

  if (themeIndex === -1 || !theme) {
    throw new Error('ไม่พบ theme: ' + selectedThemeId);
  }

  const selectedRows = rawRows.filter((row) => row.theme_code === selectedThemeId);

  if (selectedRows.length === 0) {
    throw new Error('ไม่มีข้อมูลสำหรับ theme: ' + selectedThemeId);
  }

  const firstRow = selectedRows[0];
  const items = selectedRows.map((row) => {
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

  return {
    title: 'ใบเสนอราคา',
    theme,
    themeIndex,
    themeId: firstRow.theme_code,
    document: {
      quoteNo: firstRow.quo_no,
      quoteDate: formatThaiDate(firstRow.quo_date),
      validUntil: formatThaiDate(firstRow.quo_valid_until),
    },
    customer: {
      name: firstRow.quo_cus_name,
      contact: firstRow.quo_cus_contact,
      address: firstRow.quo_cus_address,
      tel: firstRow.quo_tel,
      email: firstRow.quo_email,
    },
    remark: firstRow.quo_remark,
    items,
  };
}`;

const normalizeItemsNumber = `function normalizeQuotationData(rawRows, selectedThemeId) {
  const toNumber = (value) => Number(value || 0);
  const formatThaiDate = (value) => {
    const [year, month, day] = String(value || '').split('-');

    if (!year || !month || !day) {
      return '-';
    }

    return day + '/' + month + '/' + (Number(year) + 543);
  };
  const themeIndex = themes.findIndex((theme) => theme.id === selectedThemeId);
  const theme = themes.find((item) => item.id === selectedThemeId);

  if (themeIndex === -1 || !theme) {
    throw new Error('ไม่พบ theme: ' + selectedThemeId);
  }

  const selectedRows = rawRows.filter((row) => row.theme_code === selectedThemeId);

  if (selectedRows.length === 0) {
    throw new Error('ไม่มีข้อมูลสำหรับ theme: ' + selectedThemeId);
  }

  const firstRow = selectedRows[0];
  const items = selectedRows.map((row) => {
    const quantity = toNumber(row.quantity);
    const unitPrice = toNumber(row.unit_price);

    return {
      code: row.product_code,
      name: row.product_name,
      size: row.product_size,
      description: row.product_description,
      quantity,
      unit: row.unit,
      unitPrice,
      lineTotal: quantity * unitPrice,
      imagePath: row.imagePath,
    };
  });

  return {
    title: 'ใบเสนอราคา',
    theme,
    themeIndex,
    themeId: firstRow.theme_code,
    document: {
      quoteNo: firstRow.quo_no,
      quoteDate: formatThaiDate(firstRow.quo_date),
      validUntil: formatThaiDate(firstRow.quo_valid_until),
    },
    customer: {
      name: firstRow.quo_cus_name,
      contact: firstRow.quo_cus_contact,
      address: firstRow.quo_cus_address,
      tel: firstRow.quo_tel,
      email: firstRow.quo_email,
    },
    remark: firstRow.quo_remark,
    items,
  };
}`;

const createDataStage = (normalizeFunction, bodyLines) => `const themes = ${themesSource};

${normalizeFunction}

function generate() {
  const rawRows = getLessonData('quotationRows');
  const selectedThemeId = 'blue';
  const data = normalizeQuotationData(rawRows, selectedThemeId);
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  registerThaiFont(doc);
  doc.setFont(PDF_FONTS.thai.family, PDF_FONTS.thai.style);
  doc.setFontSize(18);
${bodyLines}

  return doc;
}
`;

const qNormalizeStart = createDataStage(
  normalizeStart,
  `  doc.setTextColor(...data.theme.text);
  doc.text(data.title, 20, 24);
  doc.setDrawColor(...data.theme.primary);
  doc.line(20, 32, 190, 32);
  doc.setFontSize(12);
  doc.setTextColor(...data.theme.muted);
  doc.text('theme index: ' + data.themeIndex, 20, 46);
  doc.text('selected rows: ' + data.selectedRows.length, 20, 54);
  doc.text('ตอนนี้ข้อมูลเริ่มถูกจัดเป็น data object แล้ว', 20, 62);`,
);

const qDocumentCustomer = createDataStage(
  normalizeDocumentCustomer,
  `  doc.setTextColor(...data.theme.text);
  doc.text(data.title, 20, 24);
  doc.setDrawColor(...data.theme.primary);
  doc.line(20, 32, 190, 32);
  doc.setDrawColor(...data.theme.border);
  doc.setFillColor(...data.theme.cardFill);
  doc.rect(20, 44, 170, 36, 'FD');
  doc.setFontSize(12);
  doc.text('เลขที่: ' + data.document.quoteNo, 28, 56);
  doc.text('วันที่: ' + data.document.quoteDate, 128, 56);
  doc.text('ลูกค้า: ' + data.customer.name, 28, 68);
  doc.text('ผู้ติดต่อ: ' + data.customer.contact, 128, 68);`,
);

const qMapItems = createDataStage(
  normalizeItemsText,
  `  doc.setTextColor(...data.theme.text);
  doc.text(data.title, 20, 24);
  doc.setDrawColor(...data.theme.primary);
  doc.line(20, 32, 190, 32);
  doc.setFontSize(12);
  doc.text('ลูกค้า: ' + data.customer.name, 20, 48);
  doc.text('items: ' + data.items.length + ' rows', 20, 60);
  doc.setDrawColor(...data.theme.border);
  doc.rect(20, 70, 170, 18);
  doc.text('รายการแรก: ' + data.items[0].name, 28, 82);`,
);

const qConvertNumbers = createDataStage(
  normalizeItemsNumber,
  `  doc.setTextColor(...data.theme.text);
  doc.text(data.title, 20, 24);
  doc.setDrawColor(...data.theme.primary);
  doc.line(20, 32, 190, 32);
  doc.setFontSize(12);
  doc.text('items: ' + data.items.length + ' rows', 20, 48);
  doc.text('จำนวน x ราคา/หน่วย = รวมรายบรรทัด', 20, 60);
  doc.text('first line total: ' + data.items[0].lineTotal.toFixed(2), 20, 72);`,
);

const qReduceTotals = createDataStage(
  normalizeWithTotals,
  `  doc.setTextColor(...data.theme.text);
  doc.text(data.title, 20, 24);
  doc.setDrawColor(...data.theme.primary);
  doc.line(20, 32, 190, 32);
  doc.setFontSize(12);
  doc.text('subtotal: ' + data.totals.subtotal.toFixed(2), 20, 48);
  doc.text('discount: ' + data.totals.discount.toFixed(2), 20, 60);
  doc.text('shipping: ' + data.totals.shipping.toFixed(2), 20, 72);
  doc.setFontSize(14);
  doc.text('grand total: ' + data.totals.grandTotal.toFixed(2), 20, 88);`,
);

const renderStart = `function renderQuotation(data) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  registerThaiFont(doc);
  doc.setFont(PDF_FONTS.thai.family, PDF_FONTS.thai.style);
  doc.setFontSize(18);
  doc.text(data.title, 20, 24);

  return doc;
}`;

const qRenderStart = createGeneratedStage(renderStart);

const quotationBlueprint = [
  { label: 'Data layer', detail: 'rawRows -> filter(theme_code) -> normalizeQuotationData(...)' },
  { label: 'Theme', detail: 'เลือก theme ด้วย selectedThemeId แล้วใช้สีและ background ของ theme นั้น' },
  { label: 'Header', detail: 'ใบเสนอราคา เลขที่ วันที่ และข้อมูลลูกค้าอยู่ส่วนบนของหน้า' },
  { label: 'Table', detail: 'columns array คุมหัวตาราง และ data.items เป็นแถวสินค้า' },
  { label: 'Totals', detail: 'subtotal, discount, shipping, VAT และ grandTotal มาจากค่าที่ normalize แล้ว' },
  { label: 'Pagination', detail: 'เมื่อ row หรือ summary ไม่พอหน้า ให้ addPage และวาด header/table ซ้ำ' },
];

const quotationDesignContract = [
  { label: 'A4/mm', detail: "ใช้ new jsPDF({ unit: 'mm', format: 'a4' })" },
  { label: 'Data first', detail: 'จัดข้อมูลให้ clean ก่อนเข้า renderQuotation(data)' },
  { label: 'Manual render', detail: 'ในเอกสาร 2 ยังวาดตรงใน renderQuotation ไม่บังคับแยก helper ย่อย' },
  { label: 'Flexible code', detail: 'เขียนต่างจากตัวอย่างได้ ถ้า data flow และผลลัพธ์สำคัญยังครบ' },
];

const quotationLessonItems = [
  {
    id: 'quotation-get-data',
    order: 1,
    phase: 'Document 2: Quotation',
    type: 'lesson',
    title: 'Get Raw Data',
    shortTitle: 'Raw Data',
    goal: "เรียก getLessonData('quotationRows') เพื่อรับข้อมูลดิบจาก Data card เข้ามาใน code",
    explanation:
      'เอกสาร 2 เริ่มจากข้อมูลที่อยู่นอก editor ก่อน เหมือนสนามจริงที่เราไม่ได้พิมพ์ rows เอง แต่รับข้อมูลจากระบบแล้วค่อยจัดรูปต่อ',
    teachingPoints: [
      "getLessonData('quotationRows') คือ data source ของบทเรียน",
      'rawRows ยังเป็นข้อมูลดิบที่มีหลาย theme ปนกัน',
      'บทนี้ยังไม่เลือกเอกสารและยังไม่ normalize แค่ยืนยันว่าดึงข้อมูลเข้ามาได้',
    ],
    concepts: ['getLessonData()', 'rawRows', 'Data card', 'external data'],
    visualKind: 'data-mapping',
    imagePaths: quotationImagePaths,
    miniTask: 'สร้างฐานเอกสาร A4 แล้วดึง rawRows จาก data source',
    practice: {
      prompt: "สร้าง doc A4/mm เรียก getLessonData('quotationRows') แล้วแสดงจำนวน rows แบบง่าย ๆ",
      requirements: [
        "มี rawRows จาก getLessonData('quotationRows')",
        'register ฟอนต์ไทยก่อนใช้ข้อความไทย',
        'return doc สำเร็จ',
      ],
    },
    completionChecklist: [
      { id: 'page-a4-mm', label: 'สร้างหน้า A4 หน่วย mm' },
      { id: 'thai-font-ready', label: 'register และเลือกฟอนต์ไทย' },
      { id: 'raw-rows', label: "เรียก getLessonData('quotationRows') เพื่อรับ rawRows" },
      { id: 'return-doc', label: 'return doc' },
      { id: 'run-preview', label: 'กด Run แล้วสร้าง PDF preview สำเร็จ', scope: 'run' },
    ],
    starterCode: blankStarterCode,
    starterCodeVersion: quotationStarterVersion,
    solutionCode: qRawData,
  },
  {
    id: 'quotation-pick-theme',
    order: 2,
    phase: 'Document 2: Quotation',
    type: 'lesson',
    title: 'Pick Theme ID',
    shortTitle: 'Theme ID',
    goal: 'กำหนด selectedThemeId เพื่อบอกว่าเอกสารรอบนี้จะใช้กลุ่มข้อมูลไหน',
    explanation:
      'rawRows มีหลายเอกสารปนกัน เราจึงต้องมี selectedThemeId เป็นตัวเลือกเล็ก ๆ ก่อนค่อย filter ข้อมูลในบทถัดไป',
    teachingPoints: [
      "selectedThemeId เช่น 'blue', 'green', 'pink'",
      'ค่าเล็ก ๆ นี้จะใช้ทั้งเลือก rows และเลือก theme config',
      'ยังไม่ต้อง filter ในบทนี้ แค่กำหนดตัวเลือกให้ชัด',
    ],
    concepts: ['selectedThemeId', 'theme_code', 'selection state'],
    visualKind: 'data-mapping',
    imagePaths: quotationImagePaths,
    miniTask: 'เพิ่ม selectedThemeId ต่อจาก rawRows',
    practice: {
      prompt: "ต่อจากบท 1 ให้เพิ่ม selectedThemeId = 'blue' แล้วแสดงค่าใน preview",
      requirements: [
        'ฐาน rawRows จาก data source ยังอยู่',
        'มี selectedThemeId',
        'ยัง return doc ได้',
      ],
    },
    completionChecklist: [
      { id: 'previous-stage', label: 'ฐานจากบท 1 ยังดึง rawRows ได้', scope: 'base' },
      { id: 'selected-theme-id', label: 'มี selectedThemeId สำหรับเลือกเอกสาร' },
      { id: 'run-preview', label: 'กด Run แล้วสร้าง PDF preview สำเร็จ', scope: 'run' },
    ],
    starterCode: qRawData,
    starterCodeVersion: quotationStarterVersion,
    solutionCode: qThemeId,
  },
  {
    id: 'quotation-filter-rows',
    order: 3,
    phase: 'Document 2: Quotation',
    type: 'lesson',
    title: 'Filter Rows',
    shortTitle: 'Filter',
    goal: 'ใช้ filter() คัด rawRows ให้เหลือเฉพาะ rows ของ selectedThemeId',
    explanation:
      'ขั้นนี้คือการแยกข้อมูลของเอกสารใบเดียวออกจากกองข้อมูลทั้งหมด เพื่อไม่ให้ renderer ต้องรับ rows ที่ไม่เกี่ยวข้อง',
    teachingPoints: [
      'filter() คืน array ใหม่ ไม่แก้ rawRows เดิม',
      'เงื่อนไขหลักคือ row.theme_code === selectedThemeId',
      'selectedRows คือข้อมูลที่พร้อมส่งต่อไปหา theme และ normalize',
    ],
    concepts: ['filter()', 'selectedRows', 'row.theme_code'],
    visualKind: 'data-mapping',
    imagePaths: quotationImagePaths,
    miniTask: 'คัด rows ของเอกสารที่เลือก',
    practice: {
      prompt: 'ต่อจากบท 2 ให้สร้าง selectedRows ด้วย rawRows.filter(...)',
      requirements: [
        'ใช้ rawRows.filter(...)',
        'เทียบ row.theme_code กับ selectedThemeId',
        'เก็บผลลัพธ์เป็น selectedRows',
      ],
    },
    completionChecklist: [
      { id: 'previous-stage', label: 'ฐานจากบท 2 ยังมี rawRows และ selectedThemeId', scope: 'base' },
      { id: 'filter-selected-rows', label: 'ใช้ filter() เลือก rows ตาม selectedThemeId' },
      { id: 'run-preview', label: 'กด Run แล้วสร้าง PDF preview สำเร็จ', scope: 'run' },
    ],
    starterCode: qThemeId,
    starterCodeVersion: quotationStarterVersion,
    solutionCode: qFilterRows,
  },
  {
    id: 'quotation-theme-config',
    order: 4,
    phase: 'Document 2: Quotation',
    type: 'lesson',
    title: 'Find Theme Config',
    shortTitle: 'Theme',
    goal: 'เพิ่ม themes array แล้วใช้ find()/findIndex() หา theme config ของเอกสารนี้',
    explanation:
      'นอกจาก rows แล้ว เอกสารยังต้องมีสี background และแบรนด์ของตัวเอง บทนี้แยก config เหล่านั้นออกมาให้เลือกด้วย selectedThemeId',
    teachingPoints: [
      'themes array เก็บสี backgroundPath และชื่อแบรนด์',
      'find() คืน theme object ที่ตรง id',
      'findIndex() ช่วยเช็คว่าหาเจอไหม ถ้าได้ -1 แปลว่าไม่มี theme นี้',
    ],
    concepts: ['themes array', 'find()', 'findIndex()', 'theme config'],
    visualKind: 'data-mapping',
    imagePaths: quotationImagePaths,
    miniTask: 'หา theme config ให้ตรงกับ selectedThemeId',
    practice: {
      prompt: 'ต่อจากบท 3 ให้เพิ่ม themes แล้วหา theme ด้วย find()/findIndex()',
      requirements: [
        'มี themes array',
        'ใช้ themes.find(...) เพื่อหา theme',
        'ใช้ themes.findIndex(...) หรือเช็คกรณีหา theme ไม่เจอ',
      ],
    },
    completionChecklist: [
      { id: 'previous-stage', label: 'ฐานจากบท 3 ยัง filter selectedRows ได้', scope: 'base' },
      { id: 'themes-array', label: 'มี themes array สำหรับสีและ background' },
      { id: 'find-theme', label: 'ใช้ find() หา theme config' },
      { id: 'find-theme-index', label: 'ใช้ findIndex() หรือเช็ค theme ที่หาไม่เจอ' },
      { id: 'run-preview', label: 'กด Run แล้วสร้าง PDF preview สำเร็จ', scope: 'run' },
    ],
    starterCode: qFilterRows,
    starterCodeVersion: quotationStarterVersion,
    solutionCode: qThemeConfig,
  },
  {
    id: 'quotation-normalize-start',
    order: 5,
    phase: 'Document 2: Quotation',
    type: 'lesson',
    title: 'Start Normalize Function',
    shortTitle: 'Normalize',
    goal: 'ย้าย logic คัด rows และหา theme เข้า normalizeQuotationData(rawRows, selectedThemeId)',
    explanation:
      'บทนี้เริ่มแยก data layer ออกจาก generate() เพื่อให้ generate() เหลือหน้าที่เชื่อม flow ส่วนการจัดข้อมูลอยู่ใน normalizeQuotationData',
    teachingPoints: [
      'normalizeQuotationData รับ rawRows และ selectedThemeId',
      'function นี้คืน clean model ขั้นแรก เช่น title, theme, selectedRows',
      'generate() เรียก normalize แล้วใช้ data ที่ได้',
    ],
    concepts: ['normalizeQuotationData()', 'data layer', 'clean model'],
    visualKind: 'data-mapping',
    imagePaths: quotationImagePaths,
    miniTask: 'เริ่มสร้าง normalizeQuotationData',
    practice: {
      prompt: 'ต่อจากบท 4 ให้ย้าย filter/find เข้า normalizeQuotationData(...)',
      requirements: [
        'มี function normalizeQuotationData(rawRows, selectedThemeId)',
        'function คืน object ที่มี title/theme/selectedRows',
        'generate() เรียก normalizeQuotationData(...)',
      ],
    },
    completionChecklist: [
      { id: 'previous-stage', label: 'ฐานจากบท 4 ยังมี filter และ theme config', scope: 'base' },
      { id: 'normalize-function', label: 'มี normalizeQuotationData(rawRows, selectedThemeId)' },
      { id: 'generate-uses-data', label: 'generate() ใช้ data ที่ normalize แล้ว' },
      { id: 'run-preview', label: 'กด Run แล้วสร้าง PDF preview สำเร็จ', scope: 'run' },
    ],
    starterCode: qThemeConfig,
    starterCodeVersion: quotationStarterVersion,
    solutionCode: qNormalizeStart,
  },
  {
    id: 'quotation-document-customer',
    order: 6,
    phase: 'Document 2: Quotation',
    type: 'lesson',
    title: 'Document and Customer Model',
    shortTitle: 'Doc/Customer',
    goal: 'สร้าง data.document และ data.customer จาก firstRow',
    explanation:
      'ข้อมูลระดับเอกสารและข้อมูลลูกค้ามักซ้ำอยู่ทุก row เราจึงหยิบจาก firstRow แล้วจัดชื่อ field ใหม่ให้อ่านง่าย',
    teachingPoints: [
      'firstRow คือ row แรกของ selectedRows',
      'document เก็บเลขที่ วันที่ และวันยืนราคา',
      'customer เก็บข้อมูลลูกค้าที่จะใช้บนหัวใบเสนอราคา',
    ],
    concepts: ['firstRow', 'document model', 'customer model', 'formatThaiDate()'],
    visualKind: 'data-mapping',
    imagePaths: quotationImagePaths,
    miniTask: 'เพิ่ม document/customer ใน quotation model',
    practice: {
      prompt: 'ต่อจากบท 5 ให้ return document และ customer object จาก firstRow',
      requirements: [
        'มี firstRow = selectedRows[0]',
        'ถ้าใช้ formatThaiDate ให้ประกาศ helper นี้ก่อนเรียกใช้',
        'return document object',
        'return customer object',
      ],
    },
    completionChecklist: [
      { id: 'previous-stage', label: 'ฐาน normalize จากบท 5 ยังอยู่ครบ', scope: 'base' },
      { id: 'first-row', label: 'กำหนด firstRow จาก selectedRows[0]' },
      { id: 'document-model', label: 'return document object จาก field เอกสาร' },
      { id: 'customer-model', label: 'return customer object จาก field ลูกค้า' },
      { id: 'run-preview', label: 'กด Run แล้วสร้าง PDF preview สำเร็จ', scope: 'run' },
    ],
    starterCode: qNormalizeStart,
    starterCodeVersion: quotationStarterVersion,
    solutionCode: qDocumentCustomer,
  },
  {
    id: 'quotation-map-items',
    order: 7,
    phase: 'Document 2: Quotation',
    type: 'lesson',
    title: 'Map Item Rows',
    shortTitle: 'Items',
    goal: 'ใช้ selectedRows.map(...) แปลง rows สินค้าเป็น data.items',
    explanation:
      'สินค้าเป็นข้อมูลหลายแถว จึงควร map จาก selectedRows เป็น items ที่ renderer อ่านง่าย ก่อนค่อยไปคำนวณตัวเลขในบทถัดไป',
    teachingPoints: [
      'map() แปลง array หนึ่งเป็น array ใหม่ที่ shape ชัดกว่าเดิม',
      'ใน map แต่ละรอบ row คือข้อมูลหนึ่งแถว และค่าที่ return จะกลายเป็น item หนึ่งตัวใน items',
      'ถ้าใช้ callback แบบ { ... } ต้องมี return object ชัดเจน',
      'item ควรมี code, name, size, description, quantity, unit, unitPrice',
      'บทนี้ยังไม่แปลง number เพื่อให้เห็นขั้น map อย่างเดียวก่อน',
    ],
    concepts: ['map()', 'items', 'row -> item'],
    visualKind: 'data-mapping',
    imagePaths: quotationImagePaths,
    miniTask: 'เพิ่ม data.items จาก selectedRows',
    practice: {
      prompt: 'ต่อจากบท 6 ให้สร้าง items ด้วย selectedRows.map(...)',
      requirements: [
        'ใช้ selectedRows.map(...)',
        'ใน callback ต้อง return object ของ item หนึ่งตัว',
        'return items ใน quotation model',
        'ใช้ชื่อ field ของ item ให้อ่านง่ายกว่า raw row',
      ],
    },
    completionChecklist: [
      { id: 'previous-stage', label: 'ฐาน document/customer จากบท 6 ยังอยู่ครบ', scope: 'base' },
      { id: 'items-model', label: 'ใช้ selectedRows.map(...) สร้าง items' },
      { id: 'run-preview', label: 'กด Run แล้วสร้าง PDF preview สำเร็จ', scope: 'run' },
    ],
    starterCode: qDocumentCustomer,
    starterCodeVersion: quotationStarterVersion,
    solutionCode: qMapItems,
  },
  {
    id: 'quotation-convert-numbers',
    order: 8,
    phase: 'Document 2: Quotation',
    type: 'lesson',
    title: 'Convert Numbers',
    shortTitle: 'Numbers',
    goal: 'แปลง quantity/unitPrice เป็น number และคำนวณ lineTotal ต่อ item',
    explanation:
      'ค่าจากระบบมักมาเป็น string ถ้าไม่แปลงก่อนคำนวณ อาจทำให้ผลรวมผิด บทนี้จึงแปลงตัวเลขในระดับ item ก่อน',
    teachingPoints: [
      'Number(value || 0) ช่วยกันค่าว่าง',
      'quantity และ unitPrice ควรเป็น number',
      'lineTotal = quantity * unitPrice',
    ],
    concepts: ['Number()', 'quantity', 'unitPrice', 'lineTotal'],
    visualKind: 'data-mapping',
    imagePaths: quotationImagePaths,
    miniTask: 'แปลงตัวเลขใน items',
    practice: {
      prompt: 'ต่อจากบท 7 ให้แปลง quantity/unitPrice และเพิ่ม lineTotal ใน item',
      requirements: [
        'ใช้ Number(...) หรือ helper toNumber',
        'คำนวณ lineTotal ใน item',
        'ยัง return items ครบ',
      ],
    },
    completionChecklist: [
      { id: 'previous-stage', label: 'ฐาน items จากบท 7 ยังอยู่ครบ', scope: 'base' },
      { id: 'number-conversion', label: 'แปลง quantity / unitPrice เป็น number ก่อนคำนวณ' },
      { id: 'line-total', label: 'คำนวณ lineTotal ต่อ item' },
      { id: 'run-preview', label: 'กด Run แล้วสร้าง PDF preview สำเร็จ', scope: 'run' },
    ],
    starterCode: qMapItems,
    starterCodeVersion: quotationStarterVersion,
    solutionCode: qConvertNumbers,
  },
  {
    id: 'quotation-reduce-totals',
    order: 9,
    phase: 'Document 2: Quotation',
    type: 'lesson',
    title: 'Reduce Totals',
    shortTitle: 'Totals',
    goal: 'ใช้ reduce() รวม subtotal แล้วสร้าง data.totals',
    explanation:
      'เมื่อ item มี lineTotal แล้ว เราสามารถรวมยอดทั้งหมดด้วย reduce() แล้วนำ discount, shipping และ VAT มาสร้าง grandTotal',
    teachingPoints: [
      'reduce() เหมาะกับการรวมค่าใน array',
      'subtotal มาจาก lineTotal ของทุก item',
      'totals object เป็นก้อนข้อมูลที่ render section สรุปยอดจะใช้ต่อ',
    ],
    concepts: ['reduce()', 'subtotal', 'discount', 'vat', 'grandTotal'],
    visualKind: 'data-mapping',
    imagePaths: quotationImagePaths,
    miniTask: 'เพิ่ม totals เข้า quotation model',
    practice: {
      prompt: 'ต่อจากบท 8 ให้ใช้ reduce() คำนวณ subtotal และ return totals',
      requirements: [
        'ใช้ reduce() คำนวณ subtotal',
        'return totals ที่มี subtotal และ grandTotal',
        'ยังเก็บ discount/shipping/vat ไว้ใน totals',
      ],
    },
    completionChecklist: [
      { id: 'previous-stage', label: 'ฐานตัวเลขจากบท 8 ยังอยู่ครบ', scope: 'base' },
      { id: 'subtotal-reduce', label: 'ใช้ reduce() รวม subtotal' },
      { id: 'grand-total', label: 'return totals.grandTotal' },
      { id: 'run-preview', label: 'กด Run แล้วสร้าง PDF preview สำเร็จ', scope: 'run' },
    ],
    starterCode: qConvertNumbers,
    starterCodeVersion: quotationStarterVersion,
    solutionCode: qReduceTotals,
  },
  {
    id: 'quotation-render-start',
    order: 10,
    phase: 'Document 2: Quotation',
    type: 'lesson',
    title: 'Start Render Function',
    shortTitle: 'Render',
    goal: 'แยก renderQuotation(data) ออกจาก generate()',
    explanation:
      'หลัง data layer เริ่มครบแล้ว บทนี้เปลี่ยน generate() ให้ทำหน้าที่เชื่อม flow ส่วน renderQuotation(data) เป็นคนสร้าง PDF',
    teachingPoints: [
      'generate() ควรอ่านเป็น rawRows -> normalize -> render',
      'renderQuotation(data) รับ clean model ไม่รับ raw rows ตรง ๆ',
      'การแยกสองชั้นนี้ทำให้เอกสารต่อไปดูแลได้ง่ายขึ้น',
    ],
    concepts: ['renderQuotation(data)', 'generate flow', 'data layer', 'render layer'],
    visualKind: 'layout',
    imagePaths: quotationImagePaths,
    miniTask: 'สร้าง renderQuotation(data) และให้ generate() return renderQuotation(data)',
    practice: {
      prompt: 'ต่อจากบท 9 ให้แยก renderQuotation(data) ออกมาเป็น function ใหม่',
      requirements: [
        'มี function renderQuotation(data)',
        'generate() เรียก normalizeQuotationData(...)',
        'generate() return renderQuotation(data)',
      ],
    },
    completionChecklist: [
      { id: 'previous-stage', label: 'ฐาน totals จากบท 9 ยังอยู่ครบ', scope: 'base' },
      { id: 'render-function', label: 'มี renderQuotation(data)' },
      { id: 'generate-render-flow', label: 'generate() ส่ง data เข้า renderQuotation(data)' },
      { id: 'run-preview', label: 'กด Run แล้วสร้าง PDF preview สำเร็จ', scope: 'run' },
    ],
    starterCode: qReduceTotals,
    starterCodeVersion: quotationStarterVersion,
    solutionCode: qRenderStart,
  },
  {
    id: 'quotation-header-background',
    order: 11,
    phase: 'Document 2: Quotation',
    type: 'lesson',
    title: 'Header and Background',
    shortTitle: 'Header',
    goal: 'ใช้ theme.backgroundPath, theme.primary และ data.document วาดหัวเอกสาร',
    explanation:
      'บทนี้ทำให้ renderQuotation เริ่มเป็นเอกสารจริง: มีพื้นหลังตาม theme, หัวใบเสนอราคา เลขที่ วันที่ และเส้นคั่น',
    teachingPoints: [
      'getLessonImage(theme.backgroundPath) ใช้รูปพื้นหลังของ theme',
      'data.title และ data.document คือข้อมูลสะอาดจาก normalize',
      'สีจาก theme.primary ทำให้เอกสารเปลี่ยนหน้าตาตาม selectedThemeId',
    ],
    concepts: ['theme.backgroundPath', 'doc.addImage()', 'header', 'data.document'],
    visualKind: 'image',
    imagePaths: quotationImagePaths,
    miniTask: 'วาดหัวเอกสารและ background',
    practice: {
      prompt: 'ต่อจากบท 10 ให้เพิ่ม background และ header ลงใน renderQuotation(data)',
      requirements: [
        'ใช้ theme.backgroundPath กับ getLessonImage(...)',
        'วาด data.title',
        'วาด data.document.quoteNo และ quoteDate',
      ],
    },
    completionChecklist: [
      { id: 'previous-stage', label: 'ฐาน render function จากบท 10 ยังอยู่ครบ', scope: 'base' },
      { id: 'theme-background', label: 'ใช้ theme.backgroundPath กับ getLessonImage(...)' },
      { id: 'quotation-header', label: 'วาดหัวเอกสาร ใบเสนอราคา / เลขที่ / วันที่' },
      { id: 'run-preview', label: 'กด Run แล้วสร้าง PDF preview สำเร็จ', scope: 'run' },
    ],
    starterCode: qRenderStart,
    starterCodeVersion: quotationStarterVersion,
    solutionCode: q5,
  },
  {
    id: 'quotation-customer-card',
    order: 12,
    phase: 'Document 2: Quotation',
    type: 'lesson',
    title: 'Customer Card',
    shortTitle: 'Customer',
    goal: 'วาด card ข้อมูลลูกค้าจาก data.customer และ data.document.validUntil',
    explanation:
      'ใบเสนอราคาจะอ่านง่ายขึ้นเมื่อข้อมูลลูกค้าอยู่เป็น block ชัดเจน บทนี้ใช้ data.customer ที่ normalize แล้วไปวางใน card ด้านบน',
    teachingPoints: [
      'card ทำหน้าที่จัดกลุ่มข้อมูลระดับเอกสาร',
      'data.customer.name/contact มาจาก normalize ไม่ใช่ raw field โดยตรง',
      'validUntil อยู่ใน document เพราะเป็นข้อมูลระดับใบเสนอราคา',
    ],
    concepts: ['customer card', 'data.customer', 'data.document.validUntil', 'doc.rect()'],
    visualKind: 'line-rect',
    imagePaths: quotationImagePaths,
    miniTask: 'เพิ่ม card ข้อมูลลูกค้าใน renderQuotation(data)',
    practice: {
      prompt: 'ต่อจากบท 11 ให้วาด customer card และใช้ data.customer ใน doc.text()',
      requirements: [
        'วาด card ด้วย doc.rect(..., "FD")',
        'ใช้ data.customer.name',
        'ใช้ data.customer.contact',
        'ใช้ data.document.validUntil',
      ],
    },
    completionChecklist: [
      { id: 'previous-stage', label: 'ฐาน header/background จากบท 11 ยังอยู่ครบ', scope: 'base' },
      { id: 'customer-card-rect', label: 'วาด customer card ด้วย doc.rect(..., "FD")' },
      { id: 'customer-name-text', label: 'ใช้ data.customer.name ใน doc.text()' },
      { id: 'customer-contact-text', label: 'ใช้ data.customer.contact ใน doc.text()' },
      { id: 'valid-until-text', label: 'ใช้ data.document.validUntil ใน doc.text()' },
      { id: 'run-preview', label: 'กด Run แล้วสร้าง PDF preview สำเร็จ', scope: 'run' },
    ],
    starterCode: q5,
    starterCodeVersion: quotationStarterVersion,
    solutionCode: q6,
  },
  {
    id: 'quotation-table-columns',
    order: 13,
    phase: 'Document 2: Quotation',
    type: 'lesson',
    title: 'Table Columns',
    shortTitle: 'Columns',
    goal: 'สร้าง columns array เพื่อคุมหัวตารางสินค้าให้เป็นระบบ',
    explanation:
      'ตารางที่วาดมือควรมี columns array เป็นแผนที่ก่อน เพื่อไม่ต้องจำ x ของทุกคอลัมน์กระจัดกระจายใน code',
    teachingPoints: [
      'tableTop คือ y เริ่มต้นของหัวตาราง ต้องกำหนดก่อนเอาไปใช้ใน doc.rect() และ doc.text()',
      'columns array เก็บ label, x, width และ align ของแต่ละคอลัมน์',
      'forEach() ใช้วาดหัวตารางจาก columns ได้',
      'align right ใช้กับตัวเลขเพื่อให้อ่านยอดง่ายขึ้น',
    ],
    concepts: ['columns array', 'tableTop', 'align right', 'forEach()'],
    visualKind: 'layout',
    imagePaths: quotationImagePaths,
    miniTask: 'เพิ่มหัวตารางรายการสินค้า',
    practice: {
      prompt: 'ต่อจากบท 12 ให้สร้าง columns array แล้ววาดหัวตารางด้วย columns.forEach(...)',
      requirements: [
        'มี columns array',
        'มี label รายการ / จำนวน / หน่วย / ราคา / รวม',
        'กำหนด tableTop เป็นตำแหน่ง y ของหัวตารางก่อนใช้',
        'วาดหัวตารางด้วย columns.forEach(...) โดยอิง tableTop',
        'ใช้ align right กับคอลัมน์ตัวเลข',
      ],
    },
    completionChecklist: [
      { id: 'previous-stage', label: 'ฐาน customer card จากบท 12 ยังอยู่ครบ', scope: 'base' },
      { id: 'columns-array', label: 'มี columns array สำหรับหัวตาราง' },
      { id: 'table-labels', label: 'มี label รายการ / จำนวน / หน่วย / ราคา / รวม' },
      { id: 'columns-loop', label: 'กำหนด tableTop แล้ววาดหัวตารางด้วย columns.forEach(...)' },
      { id: 'numeric-align', label: 'คอลัมน์ตัวเลขใช้ align right' },
      { id: 'run-preview', label: 'กด Run แล้วสร้าง PDF preview สำเร็จ', scope: 'run' },
    ],
    starterCode: q6,
    starterCodeVersion: quotationStarterVersion,
    solutionCode: q7,
  },
  {
    id: 'quotation-item-rows',
    order: 14,
    phase: 'Document 2: Quotation',
    type: 'lesson',
    title: 'Item Rows',
    shortTitle: 'Rows',
    goal: 'loop data.items เพื่อวาดแถวสินค้า จำนวน ราคา และยอดรวมต่อบรรทัด',
    explanation:
      'หลังมีหัวตารางแล้ว บทนี้ให้ข้อมูลแต่ละ item กลายเป็น row จริง โดยใช้ index หรือ currentY คุมตำแหน่ง y ของแต่ละแถว',
    teachingPoints: [
      'data.items.forEach(...) คือส่วนที่ทำให้จำนวนสินค้าเปลี่ยนได้',
      'rowHeight ใช้เว้นจังหวะระหว่างแถวให้เท่ากัน',
      'ตัวเลขควร toFixed(2) ก่อนแสดงในใบเสนอราคา',
    ],
    concepts: ['data.items', 'rowHeight', 'rowY', 'lineTotal.toFixed(2)'],
    visualKind: 'data-mapping',
    imagePaths: quotationImagePaths,
    miniTask: 'เพิ่ม loop แถวสินค้าในตาราง',
    practice: {
      prompt: 'ต่อจากบท 13 ให้ loop data.items แล้ววาดข้อมูลสินค้าแต่ละแถว',
      requirements: [
        'ใช้ data.items.forEach(...) หรือ map(...)',
        'ใช้ rowHeight / rowY คุมตำแหน่งแต่ละแถว',
        'แสดง item.quantity, item.unitPrice และ item.lineTotal',
        'ใช้ toFixed(2) กับตัวเลขเงิน',
      ],
    },
    completionChecklist: [
      { id: 'previous-stage', label: 'ฐาน table header จากบท 13 ยังอยู่ครบ', scope: 'base' },
      { id: 'items-loop', label: 'loop data.items เพื่อวาด rows' },
      { id: 'row-position', label: 'ใช้ rowHeight / rowY / currentY คุมตำแหน่งแถว' },
      { id: 'item-fields', label: 'แสดงชื่อ จำนวน ราคา และยอดรวมต่อแถว' },
      { id: 'money-format', label: 'ใช้ toFixed(2) กับตัวเลขเงิน' },
      { id: 'run-preview', label: 'กด Run แล้วสร้าง PDF preview สำเร็จ', scope: 'run' },
    ],
    starterCode: q7,
    starterCodeVersion: quotationStarterVersion,
    solutionCode: q8,
  },
  {
    id: 'quotation-pages-totals',
    order: 15,
    phase: 'Document 2: Quotation',
    type: 'lesson',
    title: 'Pagination, Totals and Signatures',
    shortTitle: 'Pages',
    goal: 'เพิ่มการขึ้นหน้าใหม่เมื่อ rows/summary ไม่พอ และวาด totals กับช่องลงชื่อท้ายเอกสาร',
    explanation:
      'ข้อมูลแต่ละ theme มีจำนวนแถวไม่เท่ากัน บทนี้ทำให้เอกสารรับความยาวข้อมูลได้ โดย addPage เมื่อพื้นที่ไม่พอ แล้วสรุปยอดท้ายเอกสารให้ครบ',
    teachingPoints: [
      'pageBottomY เป็นเส้นเตือนว่าพื้นที่หน้าปัจจุบันใกล้หมดแล้ว',
      'doc.addPage() ควรวาด background/header/table header ซ้ำเพื่อไม่ให้หน้าถัดไปหลุดบริบท',
      'totals และช่องลงชื่อควรวาดหลัง rows และเช็คพื้นที่ก่อนวาง',
    ],
    concepts: ['pageBottomY', 'doc.addPage()', 'repeat header', 'totals', 'signature'],
    visualKind: 'layout',
    imagePaths: quotationImagePaths,
    miniTask: 'ทำให้ Quotation รองรับหลายหน้าและมี totals/signatures',
    practice: {
      prompt: 'ต่อจากบท 14 ให้เพิ่ม addPage เมื่อ rows หรือ totals ไม่พอหน้า แล้ววาด summary/totals/signatures',
      requirements: [
        'มี pageBottomY หรือค่าขอบล่างของหน้า',
        'ใช้ doc.addPage() เมื่อแถวหรือ summary ไม่พอ',
        'วาด header/table header ซ้ำบนหน้าถัดไป',
        'วาด totals.subtotal/discount/shipping/vat/grandTotal',
        'มีช่องผู้เสนอราคาและผู้อนุมัติ',
      ],
    },
    completionChecklist: [
      { id: 'previous-stage', label: 'ฐาน item rows จากบท 14 ยังอยู่ครบ', scope: 'base' },
      { id: 'page-bottom-y', label: 'มี pageBottomY หรือค่าขอบล่างสำหรับเช็คพื้นที่' },
      { id: 'add-page', label: 'ใช้ doc.addPage() เมื่อพื้นที่ไม่พอ' },
      { id: 'repeat-page-context', label: 'วาด header/table context ซ้ำบนหน้าถัดไป' },
      { id: 'totals-block', label: 'วาด totals ทั้ง subtotal, discount, shipping, VAT, grandTotal' },
      { id: 'signature-block', label: 'มีช่องผู้เสนอราคาและผู้อนุมัติ' },
      { id: 'run-preview', label: 'กด Run แล้วสร้าง PDF preview สำเร็จ', scope: 'run' },
    ],
    starterCode: q8,
    starterCodeVersion: quotationStarterVersion,
    solutionCode: q9,
  },
  {
    id: 'checkpoint-quotation-pdf',
    order: 16,
    phase: 'Document 2: Quotation',
    type: 'checkpoint',
    title: 'Checkpoint: Quotation PDF',
    shortTitle: 'Checkpoint',
    goal: 'ตรวจ Quotation PDF ทั้ง flow: raw data -> clean model -> render PDF ที่รับข้อมูลหลายความยาวได้',
    explanation:
      'checkpoint นี้ดูภาพรวมของเอกสาร 2 ทั้งหมด โดยให้ความสำคัญกับการแยก data layer ออกจาก render layer และผลลัพธ์ที่ยังนิ่งแม้จำนวน rows เปลี่ยน',
    concepts: ['raw rows', 'normalize', 'renderQuotation', 'manual table', 'pagination'],
    visualKind: 'checkpoint',
    imagePaths: quotationImagePaths,
    challenge: {
      prompt:
        'ทำ Quotation PDF จาก rawRows ให้ครบ data flow และ layout หลัก โดย code เขียนยืดหยุ่นได้ แต่ต้องยังแบ่ง normalize/render ชัดเจน',
      requirements: [
        'มี normalizeQuotationData(rawRows, selectedThemeId)',
        'generate() ส่ง data เข้า renderQuotation(data)',
        'filter rows ตาม selectedThemeId และหา theme config',
        'แปลงตัวเลขและคำนวณ totals',
        'วาด header, customer card, table, rows, totals และ signatures',
        'รองรับ addPage เมื่อข้อมูลยาว',
      ],
      blueprint: quotationBlueprint,
      layoutSketch: `┌──────────────────────────────────────────────┐
│ ใบเสนอราคา                 เลขที่ / วันที่ │
│ ──────────────────────────────────────────── │
│ ┌──────────── customer card ───────────────┐ │
│ │ ชื่อ / ผู้ติดต่อ / ยืนราคาถึง            │ │
│ └──────────────────────────────────────────┘ │
│ ┌──────── table header ────────────────────┐ │
│ │ รายการ    จำนวน หน่วย ราคา รวม          │ │
│ ├──────────────────────────────────────────┤ │
│ │ data.items rows                          │ │
│ └──────────────────────────────────────────┘ │
│ หมายเหตุ / subtotal / VAT / grandTotal       │
│ ผู้เสนอราคา                    ผู้อนุมัติ     │
└──────────────────────────────────────────────┘`,
      designContract: quotationDesignContract,
      dataFields: [
        'rawRows',
        'selectedThemeId',
        'theme',
        'data.document',
        'data.customer',
        'data.items',
        'data.totals',
      ],
      checklist: [
        'data layer แยกจาก render layer',
        'filter/find/map/reduce ใช้กับข้อมูลจริง',
        'ตารางวาดจาก columns และ data.items',
        'totals คำนวณจาก number ที่ normalize แล้ว',
        'รองรับหลายหน้าเมื่อ rows ยาว',
      ],
    },
    completionChecklist: [
      { id: 'final-normalize-render', label: 'แยก normalizeQuotationData และ renderQuotation ชัดเจน' },
      { id: 'final-filter-theme', label: 'filter rows และหา theme config จาก selectedThemeId' },
      { id: 'final-model-shape', label: 'model มี document, customer, items และ totals' },
      { id: 'final-table', label: 'table ใช้ columns และ loop data.items' },
      { id: 'final-pagination', label: 'รองรับ doc.addPage() เมื่อพื้นที่ไม่พอ' },
      { id: 'final-totals-signature', label: 'วาด totals และช่องลงชื่อครบ' },
      { id: 'run-preview', label: 'กด Run แล้วสร้าง PDF preview สำเร็จ', scope: 'run' },
    ],
    starterCode: q9,
    starterCodeVersion: quotationStarterVersion,
    solutionCode: q9,
  },
];

export const quotationLessons = quotationLessonItems.map((lesson) => ({
  ...lesson,
  dataSources: [quotationRowsDataSource],
}));
