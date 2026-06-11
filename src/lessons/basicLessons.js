const pdfOptions = "{ unit: 'mm', format: 'a4' }";

export const lessons = [
  {
    id: 'hello-pdf',
    order: 1,
    phase: 'Phase 1: Basic API',
    type: 'lesson',
    title: 'Hello PDF',
    shortTitle: 'Hello PDF',
    goal: 'เข้าใจการสร้างเอกสาร PDF ใหม่ และตั้งค่าหน่วยวัด ขนาดกระดาษ และแนวกระดาษ',
    explanation:
      "บรรทัด const doc = new jsPDF({ unit: 'mm', format: 'a4' }); คือจุดเริ่มของเอกสาร PDF ทั้งหน้า เรากำหนดได้ว่าใช้หน่วยอะไร กระดาษขนาดไหน และจะเป็นแนวตั้งหรือแนวนอน",
    teachingPoints: [
      "new jsPDF(...) คือการสร้างเอกสาร PDF ใหม่ก่อนเริ่มวาดอะไรลงไป",
      "unit: 'mm' ทำให้ตำแหน่ง x/y และขนาดต่าง ๆ ใช้หน่วยมิลลิเมตร",
      "format: 'a4' คือกระดาษ A4 ขนาดประมาณ 210 x 297 mm",
      "orientation: 'landscape' ทำให้กระดาษเป็นแนวนอน โดย A3 แนวนอนมีขนาดประมาณ 420 x 297 mm",
    ],
    concepts: ['new jsPDF()', 'unit', 'format', 'orientation'],
    visualKind: 'none',
    miniTask: 'เปลี่ยนเอกสารจาก A4 แนวตั้งให้เป็น A3 แนวนอน',
    practice: {
      prompt: 'แก้ code ให้สร้าง PDF แบบ A3 แนวนอน โดยยังใช้หน่วย millimeter เหมือนเดิม',
      requirements: [
        "ยังใช้ unit: 'mm'",
        "เปลี่ยน format เป็น 'a3'",
        "เพิ่ม orientation: 'landscape'",
        'กด Run แล้วเห็นหน้ากระดาษกว้างขึ้นใน preview',
      ],
    },
    completionChecklist: [
      { id: 'unit-mm', label: "ใช้ unit: 'mm' ใน new jsPDF(...)" },
      { id: 'format-a3', label: "สร้างเอกสารด้วย format: 'a3'" },
      { id: 'orientation-landscape', label: "ตั้ง orientation: 'landscape'" },
      { id: 'run-preview', label: 'กด Run แล้วสร้าง PDF preview สำเร็จ' },
    ],
    starterCode: `function generate() {
  const doc = new jsPDF(${pdfOptions});

  doc.text('Hello jsPDF', 20, 30);
  doc.text('Change this document to A3 landscape.', 20, 44);

  return doc;
}
`,
  },
  {
    id: 'xy-position',
    order: 2,
    phase: 'Phase 1: Basic API',
    type: 'lesson',
    title: 'X/Y Position',
    shortTitle: 'X/Y Position',
    goal: 'ใช้พิกัด x/y และ align เพื่อวางข้อความชิดซ้าย กลางหน้า และชิดขวาบนหน้า A4',
    explanation:
      'jsPDF วางข้อความด้วยค่า x และ y โดยนับจากมุมซ้ายบนของหน้า ค่า x เพิ่มแล้วข้อความไปทางขวา ค่า y เพิ่มแล้วข้อความเลื่อนลงด้านล่าง สำหรับ A4 แนวตั้ง ความกว้างหน้าประมาณ 210 mm จึงใช้ x = 105 เป็นกลางหน้าได้',
    teachingPoints: [
      'x คือแกนแนวนอน นับจากซ้ายไปขวา',
      'y คือแกนแนวตั้ง นับจากบนลงล่าง',
      'A4 แนวตั้งกว้างประมาณ 210 mm จึงมีจุดกึ่งกลางแนวนอนที่ x = 105',
      "ข้อความชิดซ้ายใช้ x ใกล้ขอบซ้าย เช่น 20 และไม่ต้องใส่ align",
      "ข้อความกลางหน้าใช้ x = 105 พร้อม { align: 'center' }",
      "ข้อความชิดขวาใช้ x ใกล้ขอบขวา เช่น 190 พร้อม { align: 'right' }",
    ],
    concepts: ['x coordinate', 'y coordinate', 'page origin', 'align center', 'align right'],
    visualKind: 'xy-bars',
    miniTask: 'วางข้อความ Left, Center, Right ด้วยพิกัดและ align ที่เหมาะสม',
    practice: {
      prompt: 'แก้ code ให้วางข้อความ Left, Center และ Right บนหน้า A4 ในตำแหน่งที่อ่านแล้วเห็นความต่างของ alignment ชัดเจน',
      requirements: [
        "วาง 'Left' ใกล้ขอบซ้าย เช่น x = 20",
        "วาง 'Center' ใกล้กลางหน้า เช่น x = 105 และใช้ align: 'center'",
        "วาง 'Right' ใกล้ขอบขวา เช่น x = 190 และใช้ align: 'right'",
        'ให้แต่ละข้อความอยู่คนละระดับ y เพื่อเห็นการเลื่อนลงของแกน y',
        'กด Run แล้วเห็น PDF preview สำเร็จ',
      ],
    },
    completionChecklist: [
      { id: 'left-text', label: "มีข้อความ 'Left' วางใกล้ขอบซ้าย" },
      { id: 'center-text', label: "มีข้อความ 'Center' วางใกล้กลางหน้า" },
      { id: 'center-align', label: "ใช้ align: 'center' กับข้อความ Center" },
      { id: 'right-text', label: "มีข้อความ 'Right' วางใกล้ขอบขวา" },
      { id: 'right-align', label: "ใช้ align: 'right' กับข้อความ Right" },
      { id: 'run-preview', label: 'กด Run แล้วสร้าง PDF preview สำเร็จ' },
    ],
    starterCode: `function generate() {
  const doc = new jsPDF(${pdfOptions});

  doc.text('Left', 20, 55);
  doc.text('Move Center here', 20, 90);
  doc.text('Move Right here', 20, 125);

  return doc;
}
`,
  },
  {
    id: 'line-rect',
    order: 3,
    phase: 'Phase 1: Basic API',
    type: 'lesson',
    title: 'Line / Rect',
    shortTitle: 'Line / Rect',
    goal: 'เข้าใจความต่างระหว่างการวาดกล่องด้วย rect และการลากเส้นด้วย line',
    explanation:
      'doc.rect(x, y, width, height) คิดแบบกล่อง: x/y คือจุดเริ่มที่มุมซ้ายบน แล้ว width/height คือระยะที่ลากออกไป ส่วน doc.line(x1, y1, x2, y2) คิดแบบเส้น: มีจุดเริ่มและจุดปลายเท่านั้น',
    teachingPoints: [
      'rect ใช้ x/y เป็นมุมซ้ายบนของกล่อง',
      'rect ใช้ width/height เป็นขนาด ไม่ใช่พิกัดปลายทาง',
      'ถ้าต้องการมุมขวาล่างของ rect ให้คิด x + width และ y + height',
      'line ใช้ x1/y1 เป็นจุดเริ่ม และ x2/y2 เป็นจุดปลาย',
      'เส้นกากบาทในกล่องเกิดจากการใช้มุมของ rect เป็น endpoint ของ line',
    ],
    concepts: ['doc.rect(x, y, width, height)', 'doc.line(x1, y1, x2, y2)', 'width / height', 'line endpoints'],
    visualKind: 'box-model',
    miniTask: 'สร้างกล่องหนึ่งใบ แล้วลากเส้นทแยงสองเส้นให้เป็นกากบาทภายในกล่อง',
    practice: {
      prompt: 'สร้าง rect ใกล้กลางหน้า แล้วใช้ line 2 เส้นลากจากมุมหนึ่งไปอีกมุมหนึ่งเพื่อทำเครื่องหมายกากบาทในกล่อง',
      requirements: [
        'ใช้ doc.rect(60, 80, 90, 60) เป็นกล่องหลัก',
        'ลากเส้นจากมุมซ้ายบนไปมุมขวาล่างของกล่อง',
        'ลากเส้นจากมุมขวาบนไปมุมซ้ายล่างของกล่อง',
        'มี doc.line() อย่างน้อย 2 เส้น',
        'กด Run แล้วเห็น PDF preview สำเร็จ',
      ],
    },
    completionChecklist: [
      { id: 'rect-call', label: 'ใช้ doc.rect() เพื่อสร้างกล่อง' },
      { id: 'center-rect', label: 'วาง rect ใกล้กลางหน้าและกำหนด width/height ชัดเจน' },
      { id: 'diagonal-down-line', label: 'ลาก line จากมุมซ้ายบนไปมุมขวาล่าง' },
      { id: 'diagonal-up-line', label: 'ลาก line จากมุมขวาบนไปมุมซ้ายล่าง' },
      { id: 'two-lines', label: 'มี doc.line() อย่างน้อย 2 เส้น' },
      { id: 'run-preview', label: 'กด Run แล้วสร้าง PDF preview สำเร็จ' },
    ],
    starterCode: `function generate() {
  const doc = new jsPDF(${pdfOptions});

  doc.text('Rect and Line', 20, 25);

  doc.rect(60, 80, 90, 60);

  doc.line(60, 80, 150, 140);
  // Add the second diagonal line here.

  return doc;
}
`,
  },
  {
    id: 'style',
    order: 4,
    phase: 'Phase 1: Basic API',
    type: 'lesson',
    title: 'Style',
    shortTitle: 'Style',
    goal: 'ใช้ style APIs เพื่อกำหนดสีข้อความ สีเส้น สีขอบ สีพื้นกล่อง และขนาดฟอนต์',
    explanation:
      "style ใน jsPDF จะมีผลกับคำสั่งวาดที่ตามมาหลังจากตั้งค่า เช่น setTextColor() ใช้กับข้อความ, setDrawColor() ใช้กับเส้นหรือขอบ, setFillColor() ใช้กับพื้นกล่อง และ rect(..., 'FD') หมายถึง fill + draw ถ้าใส่ mode ผิด สีพื้นหรือขอบอาจไม่ออกตามที่ต้องการ",
    teachingPoints: [
      'setFontSize() ใช้เปลี่ยนขนาดตัวอักษรก่อนเรียก doc.text()',
      'setTextColor(r, g, b) ใช้กำหนดสีข้อความ',
      'setDrawColor(r, g, b) ใช้กำหนดสีเส้นและสีขอบของ shape',
      'setFillColor(r, g, b) ใช้กำหนดสีพื้นของ shape',
      "rect(x, y, width, height, 'FD') คือวาดกล่องที่มีทั้งสีพื้นและขอบ",
      "เก็บค่า x/y/width/height เป็นตัวแปร เช่น cardX, cardY, cardWidth, cardHeight เพื่อให้ rect, line และ text อ่านง่ายและลด bug",
    ],
    concepts: ['setFontSize()', 'setTextColor()', 'setDrawColor()', 'setFillColor()', "rect(..., 'FD')", 'style variables'],
    visualKind: 'text-style',
    miniTask: 'สร้าง status card ที่มีสีพื้น สีขอบ เส้นคั่น สีข้อความ และขนาดฟอนต์ที่ต่างกัน',
    practice: {
      prompt: 'แก้ code ให้ status card มีสีพื้นอ่อน สีขอบชัดเจน เส้นคั่น สีข้อความ และขนาดฟอนต์ที่อ่านเป็นลำดับชั้น',
      requirements: [
        'ใช้ตัวแปร cardX, cardY, cardWidth, cardHeight เพื่อคุมตำแหน่งกล่อง',
        'ใช้ setFillColor() เพื่อกำหนดสีพื้นกล่อง',
        'ใช้ setDrawColor() เพื่อกำหนดสีขอบหรือสีเส้น',
        "ใช้ doc.rect(cardX, cardY, cardWidth, cardHeight, 'FD')",
        'ใช้ doc.line() เป็นเส้นคั่นในกล่อง',
        'ใช้ setTextColor() เพื่อกำหนดสีข้อความ',
        'ใช้ setFontSize() อย่างน้อย 2 ขนาด',
        'กด Run แล้วเห็น PDF preview สำเร็จ',
      ],
    },
    completionChecklist: [
      { id: 'card-variables', label: 'ใช้ตัวแปร cardX, cardY, cardWidth, cardHeight' },
      { id: 'font-size', label: 'ใช้ setFontSize() อย่างน้อย 2 ขนาด' },
      { id: 'text-color', label: 'ใช้ setTextColor() เพื่อกำหนดสีข้อความ' },
      { id: 'fill-color', label: 'ใช้ setFillColor() เพื่อกำหนดสีพื้นกล่อง' },
      { id: 'draw-color', label: 'ใช้ setDrawColor() เพื่อกำหนดสีขอบหรือเส้น' },
      { id: 'rect-fd', label: "ใช้ rect(..., 'FD') เพื่อให้กล่องมีทั้งพื้นและขอบ" },
      { id: 'divider-line', label: 'ใช้ doc.line() เป็นเส้นคั่นใน card' },
      { id: 'run-preview', label: 'กด Run แล้วสร้าง PDF preview สำเร็จ' },
    ],
    starterCode: `function generate() {
  const doc = new jsPDF(${pdfOptions});

  const cardX = 25;
  const cardY = 45;
  const cardWidth = 160;
  const cardHeight = 70;

  doc.text('Status Card', cardX, 30);
  doc.rect(cardX, cardY, cardWidth, cardHeight);
  doc.text('Project', cardX + 10, cardY + 22);
  doc.text('Visual Lesson Playground', cardX + 10, cardY + 38);
  doc.text('Status: Draft', cardX + 10, cardY + 56);

  return doc;
}
`,
  },
  {
    id: 'image',
    order: 5,
    phase: 'Phase 1: Basic API',
    type: 'lesson',
    title: 'Image',
    shortTitle: 'Image',
    goal: 'ใส่ภาพจาก path ที่เตรียมไว้ลงใน PDF พร้อมควบคุมขนาดและตำแหน่งให้คงที่',
    explanation:
      "รูปในบทนี้อยู่ใน public/images และถูกเรียกผ่าน path เช่น '/images/lesson-image-sample.svg' ก่อนส่งให้ jsPDF ต้องใช้ getLessonImage(path) เพื่อดึงรูปที่ระบบ preload ไว้ แล้วค่อยส่งให้ doc.addImage() พร้อมตำแหน่งและขนาด",
    teachingPoints: [
      "ไฟล์ใน public สามารถอ้างด้วย path ที่ขึ้นต้นด้วย / เช่น '/images/lesson-image-sample.svg'",
      'getLessonImage(path) คือ helper ที่ระบบ inject ให้ เพื่อแปลง path เป็น image data ที่ jsPDF ใช้ได้',
      "doc.addImage(imageData, 'PNG', x, y, width, height) ใช้วางภาพลงหน้า PDF",
      'x/y คือมุมซ้ายบนของภาพ ส่วน width/height คือขนาดภาพบน PDF ไม่ใช่ขนาด pixel ของไฟล์ต้นฉบับ',
    ],
    concepts: ['image path', 'getLessonImage()', 'doc.addImage()', 'image width / height'],
    visualKind: 'image-ratio',
    imagePaths: ['/images/lesson-image-sample.svg'],
    miniTask: 'ลองเปลี่ยนความกว้างหรือความสูงของภาพ แล้วสังเกตว่า preview เปลี่ยนอย่างไร',
    practice: {
      prompt: 'ใช้ path รูปที่เตรียมไว้ วางภาพลงใน PDF แล้วปรับตำแหน่งกับขนาดให้เห็นภาพชัดเจน',
      requirements: [
        "เก็บ path รูปไว้ในตัวแปร imagePath",
        'ใช้ getLessonImage(imagePath) เพื่อเตรียม image data',
        'ใช้ doc.addImage() เพื่อวางภาพลง PDF',
        'กำหนด width และ height ของภาพให้ชัดเจน',
        'กด Run แล้วเห็น PDF preview สำเร็จ',
      ],
    },
    completionChecklist: [
      { id: 'image-path', label: 'เก็บ path รูปไว้ในตัวแปร imagePath' },
      { id: 'get-lesson-image', label: 'ใช้ getLessonImage(imagePath)' },
      { id: 'add-image', label: 'ใช้ doc.addImage() เพื่อวางภาพ' },
      { id: 'image-size', label: 'กำหนด width และ height ของภาพใน doc.addImage()' },
      { id: 'run-preview', label: 'กด Run แล้วสร้าง PDF preview สำเร็จ' },
    ],
    starterCode: `function generate() {
  const doc = new jsPDF(${pdfOptions});

  const imagePath = '/images/lesson-image-sample.svg';
  const imageData = getLessonImage(imagePath);

  doc.setFontSize(18);
  doc.text('Image example', 20, 25);
  doc.addImage(imageData, 'PNG', 20, 40, 120, 68);

  doc.setFontSize(10);
  doc.text(imagePath, 20, 120);

  return doc;
}
`,
  },
  {
    id: 'thai-font',
    order: 6,
    phase: 'Phase 1: Basic API',
    type: 'lesson',
    title: 'Thai Font',
    shortTitle: 'Thai Font',
    goal: 'เข้าใจว่าฟอนต์ใน PDF ต้องมีไฟล์ฟอนต์ ต้อง register ก่อนใช้ และต้องเลือกฟอนต์ที่รองรับภาษานั้นจริง',
    explanation:
      'ฟอนต์ใน PDF ไม่เหมือน font บนเว็บที่เรียกชื่อแล้วใช้ได้เลย ก่อนวาดภาษาไทยต้องมีข้อมูลฟอนต์จากไฟล์ TTF ก่อน จากนั้นต้อง register เข้า jsPDF แล้วจึง setFont() เพื่อบอกเอกสารว่าจะใช้ฟอนต์นั้นกับข้อความถัดไป ตัวอย่างนี้มีฟอนต์ TH Sarabun New หนึ่งชุดใน pdf_font.js และใช้ style normal เท่านั้น',
    teachingPoints: [
      'การมีไฟล์ .ttf อย่างเดียวไม่พอ ต้องแปลงหรือเตรียมข้อมูลฟอนต์ให้ jsPDF อ่านได้ก่อน',
      'registerThaiFont(doc) คือ helper ของบทเรียนนี้ที่ทำ addFileToVFS() และ addFont() ให้เบื้องหลัง',
      'PDF_FONTS.thai เก็บชื่อ family, fileName และ style ที่ระบบ register ไว้',
      'ต้องเรียก doc.setFont(PDF_FONTS.thai.family, PDF_FONTS.thai.style) ก่อนวาดข้อความภาษาไทย',
      'ฟอนต์หนึ่งไฟล์อาจมีแค่บาง style เช่น normal ถ้าต้องการ bold หรือ italic จริง ๆ ต้องมีไฟล์หรือข้อมูลฟอนต์ของ style นั้นเพิ่ม',
      'ต้องเลือกฟอนต์ที่รองรับภาษาที่จะใช้ เพราะฟอนต์บางตัวไม่มี glyph ภาษาไทย ต่อให้ code ถูกก็อาจแสดงผลผิด',
    ],
    concepts: ['TTF font file', 'registerThaiFont()', 'PDF_FONTS', 'setFont()', 'language glyph support'],
    visualKind: 'font',
    miniTask: 'register ฟอนต์ไทย เลือกฟอนต์นั้น แล้ววาดข้อความภาษาไทยให้แสดงผลใน PDF',
    practice: {
      prompt: 'ใช้ฟอนต์ไทยที่ระบบเตรียมไว้ วาดหัวเรื่องและข้อความภาษาไทยอย่างน้อยหนึ่งบรรทัด โดยไม่ใช้ import และไม่เรียกชื่อฟอนต์ลอย ๆ',
      requirements: [
        'เรียก registerThaiFont(doc) หลังสร้างเอกสาร',
        'ใช้ doc.setFont() ด้วยข้อมูลจาก PDF_FONTS.thai',
        'วาดข้อความภาษาไทยอย่างน้อยหนึ่งบรรทัด',
        'ใช้ style ที่มีอยู่จริงในตัวอย่างนี้คือ normal',
        'กด Run แล้วเห็น PDF preview สำเร็จ',
      ],
    },
    completionChecklist: [
      { id: 'register-thai-font', label: 'เรียก registerThaiFont(doc) เพื่อ register ฟอนต์ไทย' },
      { id: 'use-font-metadata', label: 'ใช้ข้อมูลฟอนต์จาก PDF_FONTS.thai' },
      { id: 'set-thai-font', label: 'เรียก doc.setFont() เป็นฟอนต์ไทยก่อนวาดข้อความ' },
      { id: 'thai-text', label: 'มีข้อความภาษาไทยใน doc.text()' },
      { id: 'normal-style', label: "ใช้ style 'normal' ที่มีอยู่ในตัวอย่างนี้" },
      { id: 'run-preview', label: 'กด Run แล้วสร้าง PDF preview สำเร็จ' },
    ],
    starterCode: `function generate() {
  const doc = new jsPDF(${pdfOptions});

  registerThaiFont(doc);

  doc.setFont(PDF_FONTS.thai.family, PDF_FONTS.thai.style);
  doc.setFontSize(24);
  doc.text('สวัสดี jsPDF', 20, 32);

  doc.setFontSize(16);
  doc.text('ข้อความนี้ใช้ฟอนต์จาก pdf_font.js', 20, 52);
  doc.text('ฟอนต์ตัวอย่างนี้ register เป็น style normal', 20, 68);

  return doc;
}
`,
  },
  {
    id: 'data-mapping',
    order: 7,
    phase: 'Phase 1: Basic API',
    type: 'lesson',
    title: 'Data Mapping',
    shortTitle: 'Data Mapping',
    goal: 'นำข้อมูลจาก object และ array ไปวางลง PDF โดยแยก label, value และแถวข้อมูลให้เป็นระบบ',
    explanation:
      'PDF ที่ generate มักเริ่มจากข้อมูลจริง เช่น object หนึ่งชุดสำหรับข้อมูลโปรเจกต์ และ array สำหรับรายการหลายแถว บทนี้ให้ map ค่า property ไปลงตำแหน่งที่ออกแบบไว้ และใช้ index ของ array เพื่อคำนวณตำแหน่ง y ของแต่ละแถว',
    teachingPoints: [
      'object เหมาะกับข้อมูลหนึ่ง record เช่น project.name, project.date, project.owner',
      'array เหมาะกับข้อมูลหลายแถว เช่น milestones หรือ task list',
      'เวลา render array ให้ใช้ index ช่วยคำนวณ y เพื่อให้แต่ละแถวไม่ทับกัน',
      'แยก label กับ value ให้ชัด จะทำให้ layout อ่านง่ายและแก้ code ทีหลังง่ายขึ้น',
      'หลังจาก map ข้อมูลลง PDF ได้แล้ว บทถัดไปจะดูว่าถ้าข้อความ value ยาวเกินพื้นที่ควร wrap อย่างไร',
    ],
    concepts: ['data object', 'data array', 'property mapping', 'forEach()', 'row y position'],
    visualKind: 'data-mapping',
    miniTask: 'ลองเพิ่ม milestone อีกหนึ่งแถว แล้วกด Run เพื่อดูการคำนวณตำแหน่ง y',
    practice: {
      prompt: 'ใช้ข้อมูล project object และ milestones array วางข้อมูลสรุปโปรเจกต์กับรายการ milestone ลงใน PDF',
      requirements: [
        'มี object ชื่อ project สำหรับข้อมูลหลัก',
        'มี array ชื่อ milestones สำหรับรายการหลายแถว',
        'ใช้ property เช่น project.name หรือ project.date ใน doc.text()',
        'loop ผ่าน milestones ด้วย forEach() หรือ map()',
        'ใช้ index เพื่อคำนวณตำแหน่ง y ของแต่ละแถว',
        'กด Run แล้วเห็น PDF preview สำเร็จ',
      ],
    },
    completionChecklist: [
      { id: 'data-object', label: 'มี object ชื่อ project สำหรับข้อมูลหลัก' },
      { id: 'data-array', label: 'มี array ชื่อ milestones สำหรับรายการหลายแถว' },
      { id: 'property-values', label: 'ใช้ค่า property จาก project ใน doc.text()' },
      { id: 'array-iteration', label: 'loop ผ่าน milestones ด้วย forEach() หรือ map()' },
      { id: 'row-y-position', label: 'ใช้ index คำนวณตำแหน่ง y ของแต่ละแถว' },
      { id: 'run-preview', label: 'กด Run แล้วสร้าง PDF preview สำเร็จ' },
    ],
    starterCode: `function generate() {
  const doc = new jsPDF(${pdfOptions});

  const project = {
    name: 'Visual Lesson Playground',
    date: '2026-06-11',
    owner: 'Toom',
    status: 'Draft',
  };

  const milestones = [
    { label: 'Brief', value: 'Ready' },
    { label: 'Layout', value: 'In progress' },
    { label: 'Review', value: 'Next' },
  ];

  doc.setFontSize(18);
  doc.text('Project Snapshot', 20, 25);

  doc.setFontSize(11);
  doc.text('Project', 20, 45);
  doc.text(project.name, 60, 45);
  doc.text('Date', 20, 58);
  doc.text(project.date, 60, 58);
  doc.text('Owner', 20, 71);
  doc.text(project.owner, 60, 71);
  doc.text('Status', 115, 71);
  doc.text(project.status, 145, 71);

  doc.text('Milestones', 20, 92);

  milestones.forEach((item, index) => {
    const y = 108 + index * 12;
    doc.text(item.label, 28, y);
    doc.text(item.value, 95, y);
  });

  return doc;
}
`,
  },
  {
    id: 'text-wrap',
    order: 8,
    phase: 'Phase 1: Basic API',
    type: 'lesson',
    title: 'Text Wrap',
    shortTitle: 'Text Wrap',
    goal: 'ใช้ doc.splitTextToSize() เพื่อแบ่งข้อความยาวจากตัวแปรให้พอดีกับความกว้างที่กำหนด',
    explanation:
      'เมื่อเอาข้อมูลจริงมาใส่ PDF ค่าในตัวแปรอาจยาวเกินพื้นที่ที่ออกแบบไว้ doc.text() ไม่ได้เดา layout ให้เสมอไป จึงใช้ doc.splitTextToSize(text, maxWidth) เพื่อแบ่งข้อความเป็นหลายบรรทัดก่อนส่งให้ doc.text()',
    teachingPoints: [
      'กำหนด maxWidth เป็นความกว้างของพื้นที่ข้อความในหน่วยเดียวกับเอกสาร เช่น mm',
      'doc.splitTextToSize(text, maxWidth) คืนค่าเป็น array ของบรรทัดข้อความ',
      'doc.text() รับ array ของบรรทัดได้ และจะวาดลงมาเป็นหลายบรรทัด',
      'ควรเก็บผล wrap ไว้ในตัวแปร เช่น wrappedSummary เพื่ออ่าน code ง่ายและนำจำนวนบรรทัดไปคำนวณต่อได้',
      'การ wrap เป็นขั้นพื้นฐานก่อนคิดเรื่องความสูงกล่อง การตัดหน้า หรือ layout ที่ซับซ้อนขึ้น',
    ],
    concepts: ['doc.splitTextToSize()', 'maxWidth', 'wrapped lines', 'long text value'],
    visualKind: 'text-wrap',
    miniTask: 'ลองปรับ maxWidth ให้แคบลง แล้วดูจำนวนบรรทัดที่เพิ่มขึ้นใน preview',
    practice: {
      prompt: 'นำ summary จาก data object มาทำ wrap ด้วย splitTextToSize() ก่อนวางลงในกล่องข้อความ',
      requirements: [
        'มีข้อมูล summary เป็นข้อความยาวใน project object',
        'กำหนด maxWidth สำหรับพื้นที่ข้อความ',
        'ใช้ doc.splitTextToSize(project.summary, maxWidth)',
        'เก็บผลลัพธ์ไว้ในตัวแปร wrappedSummary',
        'ส่ง wrappedSummary เข้า doc.text()',
        'กด Run แล้วเห็น PDF preview สำเร็จ',
      ],
    },
    completionChecklist: [
      { id: 'long-summary', label: 'มี project.summary เป็นข้อความยาว' },
      { id: 'max-width', label: 'กำหนดตัวแปร maxWidth สำหรับพื้นที่ข้อความ' },
      { id: 'split-text', label: 'ใช้ doc.splitTextToSize(project.summary, maxWidth)' },
      { id: 'wrapped-variable', label: 'เก็บผล wrap ไว้ในตัวแปร wrappedSummary' },
      { id: 'text-wrapped-lines', label: 'ส่ง wrappedSummary เข้า doc.text()' },
      { id: 'run-preview', label: 'กด Run แล้วสร้าง PDF preview สำเร็จ' },
    ],
    starterCode: `function generate() {
  const doc = new jsPDF(${pdfOptions});

  const project = {
    name: 'Visual Lesson Playground',
    summary: 'This lesson summary is intentionally long so it can show how text wraps when the available PDF space is narrower than the original sentence.',
  };

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Wrapped Summary', 20, 25);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text('Project: ' + project.name, 20, 42);

  const textX = 24;
  const textY = 62;
  const maxWidth = 145;
  const wrappedSummary = doc.splitTextToSize(project.summary, maxWidth);

  doc.rect(20, 50, maxWidth + 8, 58);
  doc.text(wrappedSummary, textX, textY);

  doc.setFontSize(10);
  doc.text('Wrapped lines: ' + wrappedSummary.length, textX, 122);

  return doc;
}
`,
  },
  {
    id: 'one-page-layout',
    order: 9,
    phase: 'Phase 1: Basic API',
    type: 'lesson',
    title: 'Basic One-page Layout',
    shortTitle: 'One-page Layout',
    goal: 'รวมสิ่งที่เรียนมาก่อนหน้าให้กลายเป็นเอกสาร Project Brief แบบหน้าเดียวที่จัดพื้นที่ชัดเจน',
    explanation:
      'บทนี้ไม่เพิ่ม API ใหม่เยอะ แต่ให้คิดแบบ layout: แบ่งหน้าเป็น header, กล่องข้อมูล, summary, milestone/status และ footer แล้วใช้ตัวแปรคุม margin กับความกว้าง เพื่อให้ตำแหน่งต่าง ๆ สัมพันธ์กันและแก้ง่าย',
    teachingPoints: [
      'เริ่มจากตัวแปร layout เช่น pageMargin และ contentWidth เพื่อคุมขอบและพื้นที่หลักของหน้า',
      'แบ่งหน้าเป็น section ก่อนค่อยวาด: header, project info, summary, milestones, footer',
      'ใช้ rect และ line เป็นโครงสร้างสายตา ไม่ใช่แค่ตกแต่ง',
      'ใช้ splitTextToSize() กับ summary ยาว ๆ เพื่อให้เนื้อหาไม่ล้นพื้นที่ที่ตั้งใจไว้',
      'footer ควรอยู่ใกล้ท้ายหน้าและใช้เป็นสัญญาณว่าเอกสารหนึ่งหน้าจบแล้ว',
    ],
    concepts: ['layout variables', 'sections', 'contentWidth', 'wrapped summary', 'footer'],
    visualKind: 'layout',
    miniTask: 'ประกอบ Project Brief PDF หน้าเดียวด้วย header, กล่องข้อมูล, summary, milestones และ footer',
    practice: {
      prompt: 'สร้าง layout หน้าเดียวสำหรับ Project Brief โดยใช้ข้อมูลจาก project object และคุมตำแหน่งหลักด้วยตัวแปร layout',
      requirements: [
        'กำหนด pageMargin และ contentWidth',
        'มี header/title ด้านบน',
        'ใช้ doc.rect() อย่างน้อย 2 กล่องสำหรับ section',
        'ใช้ doc.line() เป็น divider หรือ footer line',
        'ใช้ doc.splitTextToSize() เพื่อ wrap summary',
        'ใช้ข้อมูลจาก project object เช่น project.name',
        'มี footer ใกล้ท้ายหน้า',
        'กด Run แล้วเห็น PDF preview สำเร็จ',
      ],
    },
    completionChecklist: [
      { id: 'page-margin', label: 'กำหนดตัวแปร pageMargin สำหรับขอบหน้า' },
      { id: 'content-width', label: 'กำหนดตัวแปร contentWidth สำหรับพื้นที่หลัก' },
      { id: 'section-boxes', label: 'ใช้ doc.rect() อย่างน้อย 2 กล่องเพื่อแบ่ง section' },
      { id: 'divider-line', label: 'ใช้ doc.line() เป็น divider หรือ footer line' },
      { id: 'wrapped-summary', label: 'ใช้ doc.splitTextToSize() เพื่อ wrap project.summary' },
      { id: 'project-data', label: 'ใช้ข้อมูลจาก project object ใน layout' },
      { id: 'footer', label: 'มี footer ใกล้ท้ายหน้า' },
      { id: 'run-preview', label: 'กด Run แล้วสร้าง PDF preview สำเร็จ' },
    ],
    starterCode: `function generate() {
  const doc = new jsPDF(${pdfOptions});

  const pageMargin = 20;
  const contentWidth = 170;
  const headerY = 24;
  const sectionGap = 12;

  const project = {
    name: 'Visual Lesson Playground',
    date: '2026-06-11',
    owner: 'Toom',
    status: 'Ready for checkpoint',
    summary: 'This one-page brief combines data mapping, styled boxes, wrapped text, divider lines, and a footer so the generated PDF feels like a complete document.',
    milestones: [
      { label: 'Lessons 1-4', value: 'Core drawing APIs' },
      { label: 'Lessons 5-8', value: 'Assets, fonts, data, wrap' },
    ],
  };

  const infoY = headerY + 24;
  const summaryY = infoY + 52;
  const milestoneY = summaryY + 66;
  const footerY = 278;
  const summaryMaxWidth = contentWidth - 16;
  const wrappedSummary = doc.splitTextToSize(project.summary, summaryMaxWidth);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('Project Brief', pageMargin, headerY);

  doc.setDrawColor(37, 87, 214);
  doc.line(pageMargin, headerY + 8, pageMargin + contentWidth, headerY + 8);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.rect(pageMargin, infoY, contentWidth, 40, 'FD');

  doc.setFontSize(13);
  doc.text(project.name, pageMargin + 8, infoY + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Date: ' + project.date, pageMargin + 8, infoY + 27);
  doc.text('Owner: ' + project.owner, pageMargin + 70, infoY + 27);
  doc.text('Status: ' + project.status, pageMargin + 118, infoY + 27);

  doc.rect(pageMargin, summaryY, contentWidth, 52);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Summary', pageMargin + 8, summaryY + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(wrappedSummary, pageMargin + 8, summaryY + 27);

  doc.rect(pageMargin, milestoneY, contentWidth, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Milestones', pageMargin + 8, milestoneY + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  project.milestones.forEach((item, index) => {
    const y = milestoneY + 27 + index * sectionGap;
    doc.text(item.label, pageMargin + 8, y);
    doc.text(item.value, pageMargin + 80, y);
  });

  doc.line(pageMargin, footerY - 8, pageMargin + contentWidth, footerY - 8);
  doc.setFontSize(9);
  doc.text('Generated with jsPDF Visual Lessons', pageMargin, footerY);

  return doc;
}
`,
  },
  {
    id: 'checkpoint-project-summary',
    order: 10,
    phase: 'Phase 1: Basic API',
    type: 'checkpoint',
    title: 'Checkpoint 1: Build a Simple Project Summary PDF',
    shortTitle: 'Checkpoint 1',
    goal: 'สร้างเอกสารสรุปโปรเจกต์หน้าเดียวให้ใกล้เคียง blueprint โดยเลือกวิธีวาง layout เอง',
    explanation:
      'checkpoint นี้จะถูกซ่อนไว้จนกว่าบท 1-9 จะครบ เมื่อปลดล็อกแล้ว ให้ทำเอกสารหน้าเดียวจาก data object โดยอ้างอิง blueprint ที่คาดหวัง ไม่ต้องเหมือน pixel-perfect แต่ต้องมีหลักฐานใน code ว่าใช้ข้อมูลจริง ใส่ภาพจาก asset ที่เตรียมไว้ จัด section ชัดเจน wrap ข้อความ และมี footer',
    concepts: ['locked checkpoint', 'expected blueprint', 'code evidence', 'image evidence', 'one-page document'],
    visualKind: 'checkpoint',
    imagePaths: ['/images/lesson-image-sample.svg'],
    challenge: {
      prompt:
        'สร้าง PDF สรุปโปรเจกต์แบบหน้าเดียวให้ใกล้เคียง Expected blueprint ด้านล่าง ทำ layout เองได้ แต่ตำแหน่งหลักต้องอิงจาก blueprint ไม่ใช่วางตรงไหนก็ได้',
      requirements: [
        'ใช้ project data object ที่เตรียมไว้',
        'ตั้งฟอนต์ด้วย doc.setFont() ก่อนวางข้อความหลัก',
        'วาง header ด้านบนตาม blueprint: title ฝั่งซ้าย, date ฝั่งขวา, divider ใต้หัวเอกสาร',
        'ใช้ typography scale ตาม design contract: title 22, section heading 18, body 16',
        'ใช้สีหลักตาม design contract สำหรับข้อความ เส้น กรอบ และพื้นกล่อง',
        'วางภาพจาก project.imagePath ไว้ด้านขวาของ Project Info card ตาม blueprint',
        'มี Project Info card ที่ใช้ name, date, owner และ status ในช่วงบนของหน้า',
        'มี Summary card ถัดลงมาที่ wrap ข้อความยาว',
        'มี Status / Milestones card ถัดลงมาอย่างน้อยหนึ่งกล่อง',
        'มี footer line และ footer text ใกล้ท้ายหน้า',
      ],
      blueprint: [
        {
          label: 'Header',
          detail: 'Zone y 16-34: วาง Project Summary ที่ x ประมาณ 20, วาง project.date ด้านขวา, และตี divider ใต้หัวเอกสาร',
        },
        {
          label: 'Info card',
          detail: 'Zone y 40-94: วางกล่องกว้างเกือบเต็มหน้า ข้อมูล project อยู่ฝั่งซ้าย ภาพอยู่ฝั่งขวา',
        },
        {
          label: 'Image',
          detail: 'Target x 150-170, y 50-70, size ประมาณ 30 x 18 mm: ใช้ project.imagePath ผ่าน getLessonImage(project.imagePath) และ doc.addImage()',
        },
        {
          label: 'Summary',
          detail: 'Zone y 105-155: วาง project.summary ที่ผ่าน doc.splitTextToSize() ในกล่องอ่านง่าย',
        },
        {
          label: 'Status / milestones',
          detail: 'Zone y 175-225: วาง milestone/status rows จาก project.milestones ให้เป็นส่วนงานถัดลงมา',
        },
        {
          label: 'Footer',
          detail: 'Zone y 270-286: วาง footer line และ generated-by note ใกล้ท้ายหน้า',
        },
      ],
      layoutSketch: `┌──────────────────────────────────────────────┐
│ Project Summary                    2026-06-11│
│ ──────────────────────────────────────────── │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ Project Info                 ┌─────────┐ │ │
│ │ Name   : jsPDF Visual...     │ Image   │ │ │
│ │ Owner  : Learning Team       │ visual  │ │ │
│ │ Date   : 2026-06-11          └─────────┘ │ │
│ │ Status : Ready for review                │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ Summary                                      │
│ ┌──────────────────────────────────────────┐ │
│ │ A visual-first playground for learning...│ │
│ │ The final checkpoint should feel like... │ │
│ │ clean one-page project summary...        │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ Status / Milestones                          │
│ ┌──────────────────────────────────────────┐ │
│ │ Foundation : Page, position, shape...    │ │
│ │ Content    : Image, font, data, wrap...  │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ ──────────────────────────────────────────── │
│ Generated by jsPDF Visual Lesson Playground  │
└──────────────────────────────────────────────┘`,
      designContract: [
        {
          label: 'Font',
          detail: 'Set an explicit font with doc.setFont() before writing the main document text. Thai content should use a font that supports Thai glyphs.',
        },
        {
          label: 'Title',
          detail: '22pt, bold, primary text #111827 using doc.setFontSize(22).',
        },
        {
          label: 'Section heading',
          detail: '18pt, bold, primary text #111827 using doc.setFontSize(18).',
        },
        {
          label: 'Body',
          detail: '16pt, normal, muted text #475569 using doc.setFontSize(16).',
        },
        {
          label: 'Accent line',
          detail: 'Blue #2457d6 using doc.setDrawColor(36, 87, 214).',
        },
        {
          label: 'Card border',
          detail: 'Slate border #cbd5e1 using doc.setDrawColor(203, 213, 225).',
        },
        {
          label: 'Card fill',
          detail: 'Soft background #f8fafc using doc.setFillColor(248, 250, 252).',
        },
      ],
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
        'ตั้งฟอนต์ด้วย doc.setFont() ก่อนวางข้อความหลัก',
        'วาง header ตาม Expected blueprint',
        'ใช้ title 22, section heading 18 และ body 16',
        'ใช้สีหลักตาม design contract',
        'จัด Info / Summary / Status cards เป็นลำดับบน-กลาง-ล่างตาม blueprint',
        'วางภาพจาก project.imagePath ใน Project Info card ตาม Expected blueprint',
        'wrap summary ด้วย doc.splitTextToSize() ใน Summary card',
        'ใช้ค่าจาก project data object ใน section ที่ตรงกับ blueprint',
        'มี footer line และ footer text ใกล้ท้ายหน้า',
        'กด Run แล้วเห็น PDF preview',
      ],
    },
    completionChecklist: [
      {
        id: 'project-object',
        label: 'มี project data object สำหรับข้อมูลโจทย์',
        hints: [
          'เริ่มจากดู Required data fields ก่อน ข้อนี้ต้องมี object ชื่อ project',
          'ประกาศ const project = { ... } ใน generate() แล้วเก็บข้อมูลทั้งหมดไว้ใน object นี้',
          'ระบบกำลังมองหา const project = { ใน code เพื่อยืนยันว่าเอกสารเริ่มจาก data object',
        ],
      },
      {
        id: 'font-family',
        label: 'ตั้งฟอนต์ด้วย doc.setFont() ก่อนวางข้อความหลัก',
        hints: [
          'ดู Design contract ส่วน Font ก่อนเริ่มวางข้อความ',
          'ตั้งฟอนต์ให้ชัดด้วย doc.setFont() ก่อนเขียน title หรือเนื้อหาหลัก ถ้ามีภาษาไทยควรใช้ฟอนต์ที่รองรับภาษาไทย',
          'ระบบมองหา doc.setFont(...) ใน code เพื่อยืนยันว่าไม่ได้ปล่อยให้เอกสารใช้ฟอนต์ default แบบไม่ตั้งใจ',
        ],
      },
      {
        id: 'blueprint-header',
        label: 'วาง header และ divider ใน zone บนตาม Expected blueprint',
        hints: [
          'กลับไปดู Header ใน Expected blueprint',
          'หัวเอกสารควรอยู่ช่วง y 16-34: title ซ้าย date ขวา และมีเส้นใต้',
          'ระบบมองหา Project Summary แถว x ประมาณ 20, y ประมาณ 24 และ doc.line() ใต้หัวเอกสารประมาณ y 32',
        ],
      },
      {
        id: 'title-size',
        label: 'ใช้ doc.setFontSize(22) สำหรับ title',
        hints: [
          'ดู Design contract ส่วน Title',
          'ก่อนวาง title ให้ใช้ doc.setFontSize(22)',
          'ระบบมองหา doc.setFontSize(22) ใน code',
        ],
      },
      {
        id: 'heading-size',
        label: 'ใช้ doc.setFontSize(18) สำหรับ section heading',
        hints: [
          'ดู Design contract ส่วน Section heading',
          'ก่อนหัวข้อ section เช่น Project Info หรือ Summary ให้ใช้ doc.setFontSize(18)',
          'ระบบมองหา doc.setFontSize(18) ใน code',
        ],
      },
      {
        id: 'body-size',
        label: 'ใช้ doc.setFontSize(16) สำหรับ body text',
        hints: [
          'ดู Design contract ส่วน Body',
          'ก่อนข้อความรายละเอียดใน card ให้ใช้ doc.setFontSize(16)',
          'ระบบมองหา doc.setFontSize(16) ใน code',
        ],
      },
      {
        id: 'contract-colors',
        label: 'ใช้สีตาม design contract สำหรับ text, line, border และ fill',
        hints: [
          'ดู Design contract สีหลัก',
          'ใช้ text color, draw color และ fill color ให้ตรงกับ contract',
          'ระบบมองหา setTextColor(17, 24, 39) หรือ setTextColor(71, 85, 105), setDrawColor(36, 87, 214), setDrawColor(203, 213, 225) และ setFillColor(248, 250, 252)',
        ],
      },
      {
        id: 'section-cards',
        label: 'วาง Info / Summary / Status cards เป็น stack ตาม Expected blueprint',
        hints: [
          'ดู stack ของ Info / Summary / Status ใน blueprint',
          'สร้าง card ด้วย doc.rect() สามกล่องในช่วงบน กลาง และล่าง',
          'ระบบมองหา rect กว้างใน zone ประมาณ y 40-94, y 105-155 และ y 175-225',
        ],
      },
      {
        id: 'divider-line',
        label: 'ใช้ doc.line() เป็น divider หรือ footer line',
        hints: [
          'ดูเส้นใต้ header หรือ footer line ใน blueprint',
          'ใช้ doc.line() สำหรับเส้นคั่น ไม่ใช่ rect อย่างเดียว',
          'ระบบมองหาอย่างน้อยหนึ่ง doc.line(...) ใน code',
        ],
      },
      {
        id: 'image-evidence',
        label: 'วางภาพจาก project.imagePath ด้านขวาของ Project Info card ตาม Expected blueprint',
        hints: [
          'ดูตำแหน่ง Image ใน Project Info card',
          'ใช้ const imageData = getLessonImage(project.imagePath) แล้ววางภาพด้านขวาของ card',
          'ระบบมองหา doc.addImage(...) ที่ใช้ imageData อยู่ช่วง x 150-170, y 50-70, ขนาดประมาณ 30 x 18 mm',
        ],
      },
      {
        id: 'wrapped-summary',
        label: 'ใช้ doc.splitTextToSize() เพื่อ wrap project.summary',
        hints: [
          'ดู Summary card ใน blueprint',
          'อย่าส่ง summary ยาวเข้า doc.text() ตรง ๆ ให้ wrap ก่อน',
          'ระบบมองหา doc.splitTextToSize(project.summary, ...) และใช้ผลลัพธ์นั้นกับ doc.text()',
        ],
      },
      {
        id: 'project-fields',
        label: 'ใช้ name, date, owner, status, summary และ imagePath จาก project',
        hints: [
          'ดูรายการ Required data fields แล้วใช้ค่าจาก project ในแต่ละ section',
          'หลังจากมีโครง section แล้ว ให้แทนข้อความตัวอย่างด้วย project.name, project.date, project.owner, project.status, project.summary และ project.imagePath',
          'ระบบมองหา field เหล่านี้ถูกอ้างด้วย project.<field> ไม่ใช่พิมพ์ข้อความคงที่แทนทั้งหมด',
        ],
      },
      {
        id: 'footer',
        label: 'มี footer หรือ signature ใกล้ท้ายหน้า',
        hints: [
          'ดู Footer ใน Expected blueprint',
          'วางเส้นหรือข้อความท้ายหน้าใกล้ y 270-286',
          'ระบบมองหาข้อความ footer ที่ y ตั้งแต่ประมาณ 260 ขึ้นไป หรือใช้ตัวแปร footerY กับ doc.text()',
        ],
      },
      {
        id: 'run-preview',
        label: 'กด Run แล้วสร้าง PDF preview สำเร็จ',
        hints: [
          'ข้อนี้จะผ่านเมื่อ Run สำเร็จและมี PDF preview',
          'ถ้ามี error ให้แก้ syntax หรือ return doc ก่อนดู checklist อื่น',
          'ระบบมองหา doc ที่ return มาและมี method output() จาก jsPDF',
        ],
      },
    ],
    starterCode: `function generate() {
  const doc = new jsPDF(${pdfOptions});

  const project = {
    name: 'สนามเรียนรู้ jsPDF แบบเห็นภาพ',
    date: '2026-06-11',
    owner: 'ทีมเรียนรู้',
    status: 'พร้อมตรวจทาน',
    imagePath: '/images/lesson-image-sample.svg',
    summary: 'พื้นที่ฝึก jsPDF แบบเห็นภาพที่ช่วยให้ผู้เรียนเข้าใจว่า code แต่ละบรรทัดส่งผลต่อ PDF อย่างไร checkpoint สุดท้ายควรรู้สึกเหมือนเอกสารสรุปโปรเจกต์หน้าเดียวที่อ่านง่ายและส่งต่อให้ทีมได้',
    milestones: [
      { label: 'พื้นฐาน', value: 'ผ่านบทเรื่องหน้าเอกสาร พิกัด รูปทรง และ style แล้ว' },
      { label: 'เนื้อหา', value: 'ผ่านบทเรื่องภาพ ฟอนต์ ข้อมูล การ wrap และ layout แล้ว' },
    ],
  };

  const imageData = getLessonImage(project.imagePath);

  const pageMargin = 20;
  const contentWidth = 170;
  const headerY = 24;
  const infoY = 40;
  const summaryY = 106;
  const statusY = 176;
  const footerY = 282;
  const imageX = 154;
  const imageY = 54;
  const imageWidth = 30;
  const imageHeight = 18;

  // Build a one-page project summary that follows the expected blueprint.
  // Header: title at y 24, date on the right, divider around y 32.
  // Info card: y 40-94, project data on the left, image on the right.
  // Summary card: y 106-158. Status card: y 176-224. Footer: y 270-286.
  // Use project fields, imageData, section boxes, wrapped summary text, styling, and a footer.

  doc.text('Start your checkpoint layout here.', pageMargin, headerY);
  doc.text(project.name, pageMargin, infoY + 12);
  doc.text(project.imagePath, pageMargin, infoY + 26);

  return doc;
}
`,
  },
];

export const starterLesson = lessons[0];
