const pdfOptions = "{ unit: 'mm', format: 'a4' }";
const blankStarterCodeVersion = 4;
const blankStarterCode = `function generate() {

}
`;

export const lessons = [
  {
    id: 'hello-pdf',
    order: 1,
    phase: 'Phase 1: Basic API',
    type: 'lesson',
    title: 'Hello PDF',
    shortTitle: 'Hello PDF',
    goal: 'สร้างกระดาษ PDF แผ่นแรก และเลือกหน่วยวัด ขนาดกระดาษ กับแนวกระดาษ',
    explanation:
      "ใน jsPDF เราต้องสร้างเอกสารก่อนเสมอด้วย const doc = new jsPDF(...). ให้คิดว่า doc คือกระดาษ PDF ที่เราจะวาดทุกอย่างลงไป ส่วน unit คือหน่วยวัด, format คือขนาดกระดาษ และ orientation คือแนวกระดาษ",
    teachingPoints: [
      "new jsPDF(...) คือการหยิบกระดาษ PDF เปล่าขึ้นมาก่อนเริ่มวาดอะไรลงไป",
      "unit: 'mm' ทำให้ตำแหน่ง x/y และขนาดต่าง ๆ ใช้หน่วยมิลลิเมตร",
      "format: 'a4' หรือ 'a3' คือเลือกขนาดกระดาษสำเร็จรูป",
      "orientation คือแนวกระดาษ: 'portrait' คือแนวตั้ง, 'landscape' คือแนวนอน",
      "orientation: 'landscape' ทำให้กระดาษเป็นแนวนอน โดย A3 แนวนอนมีขนาดประมาณ 420 x 297 mm",
    ],
    concepts: ['new jsPDF() = สร้างเอกสาร', 'unit = หน่วยวัด', 'format = ขนาดกระดาษ', 'orientation = แนวกระดาษ'],
    visualKind: 'none',
    miniTask: 'เปลี่ยนเอกสารจาก A4 แนวตั้งให้เป็น A3 แนวนอน',
    practice: {
      prompt: 'ใน function generate() ให้สร้างเอกสาร PDF แบบ A3 แนวนอน แล้ว return doc เพื่อให้ preview แสดงผล',
      requirements: [
        "สร้าง doc ด้วย new jsPDF(...)",
        "ใช้ unit: 'mm' เพื่อให้ตำแหน่งและขนาดเป็นมิลลิเมตร",
        "ใช้ format: 'a3' เพื่อเลือกกระดาษ A3",
        "ใช้ orientation: 'landscape' เพื่อให้กระดาษเป็นแนวนอน",
        'ท้าย function ต้อง return doc',
        'กด Run แล้วเห็นหน้ากระดาษกว้างขึ้นใน preview',
      ],
    },
    completionChecklist: [
      { id: 'unit-mm', label: "สร้าง doc ด้วย unit: 'mm'" },
      { id: 'format-a3', label: "เลือกขนาดกระดาษเป็น format: 'a3'" },
      { id: 'orientation-landscape', label: "เลือกแนวกระดาษเป็น orientation: 'landscape'" },
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
    goal: 'วางข้อความบนกระดาษด้วยตำแหน่ง x/y และจัดซ้าย กลาง ขวาด้วย align',
    explanation:
      'doc.text(text, x, y, options) ใช้วางข้อความลงบนกระดาษ ค่า x คือระยะจากขอบซ้าย ค่า y คือระยะจากขอบบน ถ้า x มากขึ้นข้อความจะไปทางขวา ถ้า y มากขึ้นข้อความจะลงล่าง ส่วน options เช่น { align: \'center\' } ใส่เป็นตัวที่ 4 ของ doc.text(...)',
    teachingPoints: [
      'x คือแกนแนวนอน นับจากซ้ายไปขวา',
      'y คือแกนแนวตั้ง นับจากบนลงล่าง',
      'A4 แนวตั้งกว้างประมาณ 210 mm จึงมีจุดกึ่งกลางแนวนอนที่ x = 105',
      "ข้อความชิดซ้ายใช้ x ใกล้ขอบซ้าย เช่น 20 และไม่ต้องใส่ align",
      "ข้อความกลางหน้าใช้ x = 105 แล้วใส่ { align: 'center' } เป็น argument ตัวที่ 4",
      "ข้อความชิดขวาใช้ x ใกล้ขอบขวา เช่น 190 แล้วใส่ { align: 'right' } เป็น argument ตัวที่ 4",
    ],
    concepts: ['doc.text(text, x, y, options)', 'x = ซ้าย/ขวา', 'y = บน/ล่าง', "align: 'center'", "align: 'right'"],
    visualKind: 'xy-bars',
    miniTask: 'วางข้อความ Left, Center, Right ด้วยพิกัดและ align ที่เหมาะสม',
    practice: {
      prompt: 'ใน function generate() ให้สร้าง doc แล้ววางข้อความ Left, Center และ Right ให้เห็นความต่างของตำแหน่งกับ align ชัดเจน',
      requirements: [
        "เริ่มด้วย const doc = new jsPDF({ unit: 'mm', format: 'a4' }) แล้วท้ายสุด return doc",
        "วาง 'Left' ด้วย doc.text('Left', x, y) ใกล้ขอบซ้าย เช่น x = 20",
        "วาง 'Center' ด้วย x ใกล้กลางหน้า เช่น 105 และใส่ { align: 'center' } เป็น argument ตัวที่ 4",
        "วาง 'Right' ด้วย x ใกล้ขอบขวา เช่น 190 และใส่ { align: 'right' } เป็น argument ตัวที่ 4",
        'ให้แต่ละข้อความอยู่คนละระดับ y เพื่อเห็นการเลื่อนลงของแกน y',
        'กด Run แล้วเห็น PDF preview สำเร็จ',
      ],
    },
    completionChecklist: [
      { id: 'left-text', label: "วางข้อความ 'Left' ใกล้ขอบซ้าย" },
      { id: 'center-text', label: "วางข้อความ 'Center' ใกล้กลางหน้า" },
      { id: 'center-align', label: "ใส่ { align: 'center' } เป็นตัวเลือกของข้อความ Center" },
      { id: 'right-text', label: "วางข้อความ 'Right' ใกล้ขอบขวา" },
      { id: 'right-align', label: "ใส่ { align: 'right' } เป็นตัวเลือกของข้อความ Right" },
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
    goal: 'วาดกล่องสี่เหลี่ยมและเส้น โดยเข้าใจว่าค่า x/y/width/height หมายถึงอะไร',
    explanation:
      'doc.rect(...) คือการวาดกล่องสี่เหลี่ยมบน PDF คำว่า rect ย่อจาก rectangle ให้คิดง่าย ๆ ว่าเป็น box: x/y คือมุมซ้ายบนของกล่อง ส่วน width/height คือความกว้างและความสูงของกล่อง ส่วน doc.line(...) คือการลากเส้นจากจุดเริ่มไปจุดปลาย',
    teachingPoints: [
      'rect คือ rectangle หรือ box สี่เหลี่ยมบน PDF',
      'rect ใช้ x/y เป็นตำแหน่งมุมซ้ายบนของกล่อง',
      'rect ใช้ width/height เป็นขนาดของกล่อง ไม่ใช่พิกัดปลายทาง',
      'ถ้าต้องการมุมขวาล่างของ rect ให้คิด x + width และ y + height',
      'line ใช้ x1/y1 เป็นจุดเริ่ม และ x2/y2 เป็นจุดปลาย',
      'เส้นกากบาทในกล่องเกิดจากการใช้มุมของ rect เป็น endpoint ของ line',
    ],
    concepts: ['doc.rect() = วาด box', 'x/y = มุมซ้ายบน', 'width/height = ขนาดกล่อง', 'doc.line() = ลากเส้น'],
    visualKind: 'box-model',
    miniTask: 'สร้างกล่องหนึ่งใบ แล้วลากเส้นทแยงสองเส้นให้เป็นกากบาทภายในกล่อง',
    practice: {
      prompt: 'ใน function generate() ให้สร้าง doc แล้ววาดกล่องหนึ่งใบ จากนั้นลากเส้นทแยง 2 เส้นให้เป็นกากบาทในกล่อง',
      requirements: [
        "เริ่มด้วย const doc = new jsPDF({ unit: 'mm', format: 'a4' }) แล้วท้ายสุด return doc",
        'ใช้ doc.rect(60, 80, 90, 60) เป็นกล่องหลัก: x=60, y=80, width=90, height=60',
        'ลากเส้นจากมุมซ้ายบนของกล่องไปมุมขวาล่าง',
        'ลากเส้นจากมุมขวาบนของกล่องไปมุมซ้ายล่าง',
        'มี doc.line() อย่างน้อย 2 เส้น',
        'กด Run แล้วเห็น PDF preview สำเร็จ',
      ],
    },
    completionChecklist: [
      { id: 'rect-call', label: 'ใช้ doc.rect() เพื่อวาด box สี่เหลี่ยม' },
      { id: 'center-rect', label: 'วาง box ใกล้กลางหน้าและกำหนด width/height ชัดเจน' },
      { id: 'diagonal-down-line', label: 'ลาก doc.line() จากมุมซ้ายบนไปมุมขวาล่างของ box' },
      { id: 'diagonal-up-line', label: 'ลาก doc.line() จากมุมขวาบนไปมุมซ้ายล่างของ box' },
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
    goal: 'ตั้งค่าหน้าตาก่อนวาด เช่น ขนาดตัวอักษร สีข้อความ สีขอบ และสีพื้นกล่อง',
    explanation:
      "คำสั่ง set... ใน jsPDF เป็นการตั้งค่าให้สิ่งที่จะวาดถัดไป ไม่ได้วาดอะไรทันที และต้องเรียกผ่าน doc เช่น doc.setFontSize(...). ให้คิดเหมือนเลือกปากกาก่อนเขียน: ถ้าตั้ง font size หรือสีไว้ด้านบน ข้อความ/เส้น/กล่องที่อยู่ด้านล่างจะติดค่านั้นไปจนกว่าจะเปลี่ยนใหม่",
    teachingPoints: [
      'ทุกคำสั่ง style ในบทนี้เป็น method ของ doc เช่น doc.setFontSize(...) ไม่ใช่ setFontSize(...) ลอย ๆ',
      'doc.setFontSize() ตั้งขนาดให้ doc.text() ที่อยู่หลังจากนั้น',
      'doc.setTextColor(r, g, b) ตั้งสีข้อความถัดไป',
      'doc.setDrawColor(r, g, b) ตั้งสีเส้นหรือสีขอบของ shape ถัดไป',
      'doc.setFillColor(r, g, b) ตั้งสีพื้นของ shape ถัดไป',
      "doc.rect(x, y, width, height, 'FD') คือวาดกล่องที่มีทั้งสีพื้นและขอบ",
      "เก็บค่า x/y/width/height เป็นตัวแปร เช่น cardX, cardY, cardWidth, cardHeight เพื่อให้ rect, line และ text อ่านง่ายและลด bug",
    ],
    concepts: ['doc.set... = ตั้งค่า state', 'setFontSize = ขนาดข้อความ', 'setTextColor = สีข้อความ', 'setDrawColor = สีขอบ/เส้น', 'setFillColor = สีพื้น'],
    visualKind: 'text-style',
    miniTask: 'สร้าง status card ที่มีสีพื้น สีขอบ เส้นคั่น สีข้อความ และขนาดฟอนต์ที่ต่างกัน',
    practice: {
      prompt: 'ใน function generate() ให้สร้าง status card ที่มีสีพื้น สีขอบ เส้นคั่น สีข้อความ และขนาดตัวอักษรต่างกัน',
      requirements: [
        "เริ่มด้วย const doc = new jsPDF({ unit: 'mm', format: 'a4' }) แล้วท้ายสุด return doc",
        'ใช้ตัวแปร cardX, cardY, cardWidth, cardHeight เพื่อคุมตำแหน่งและขนาดของกล่อง',
        'ใช้ doc.setFillColor() เพื่อกำหนดสีพื้นกล่อง',
        'ใช้ doc.setDrawColor() เพื่อกำหนดสีขอบหรือสีเส้น',
        "ใช้ doc.rect(cardX, cardY, cardWidth, cardHeight, 'FD')",
        'ใช้ doc.line() เป็นเส้นคั่นในกล่อง',
        'ใช้ doc.setTextColor() เพื่อกำหนดสีข้อความ',
        'ใช้ doc.setFontSize() อย่างน้อย 2 ขนาด',
        'กด Run แล้วเห็น PDF preview สำเร็จ',
      ],
    },
    completionChecklist: [
      { id: 'card-variables', label: 'ใช้ตัวแปร cardX, cardY, cardWidth, cardHeight คุมกล่อง' },
      { id: 'font-size', label: 'ใช้ doc.setFontSize() อย่างน้อย 2 ขนาด' },
      { id: 'text-color', label: 'ใช้ doc.setTextColor() เพื่อกำหนดสีข้อความ' },
      { id: 'fill-color', label: 'ใช้ doc.setFillColor() เพื่อกำหนดสีพื้นกล่อง' },
      { id: 'draw-color', label: 'ใช้ doc.setDrawColor() เพื่อกำหนดสีขอบหรือเส้น' },
      { id: 'rect-fd', label: "ใช้ doc.rect(..., 'FD') เพื่อให้กล่องมีทั้งพื้นและขอบ" },
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
    goal: 'วางรูปภาพลงบน PDF โดยกำหนดตำแหน่งและขนาดของกรอบรูปเอง',
    explanation:
      "รูปในบทนี้เตรียมไว้ให้แล้วใน public/images. ให้เก็บ path ของรูปไว้ก่อน จากนั้นใช้ getLessonImage(path) เพื่อแปลง path ให้เป็นข้อมูลรูปที่ jsPDF ใช้ได้ แล้วค่อยใช้ doc.addImage(...) วางรูปลงบนกระดาษ",
    teachingPoints: [
      "ไฟล์ใน public สามารถอ้างด้วย path ที่ขึ้นต้นด้วย / เช่น '/images/lesson-image-sample.svg'",
      'getLessonImage(path) คือ helper ที่ระบบเตรียมไว้ให้ เพื่อแปลง path เป็น image data',
      "doc.addImage(imageData, 'PNG', x, y, width, height) คือวางรูปลงในกรอบบนหน้า PDF",
      'x/y คือมุมซ้ายบนของกรอบรูป ส่วน width/height คือขนาดรูปบน PDF ไม่ใช่ขนาด pixel ของไฟล์ต้นฉบับ',
    ],
    concepts: ['imagePath = ที่อยู่รูป', 'getLessonImage() = เตรียมรูป', 'doc.addImage() = วางรูป', 'width/height = ขนาดรูปบน PDF'],
    visualKind: 'image-ratio',
    imagePaths: ['/images/lesson-image-sample.svg'],
    miniTask: 'ลองเปลี่ยนความกว้างหรือความสูงของภาพ แล้วสังเกตว่า preview เปลี่ยนอย่างไร',
    practice: {
      prompt: 'ใน function generate() ให้สร้าง doc, เตรียมรูปจาก imagePath แล้ววางรูปลงบน PDF ด้วย doc.addImage(...)',
      requirements: [
        "เริ่มด้วย const doc = new jsPDF({ unit: 'mm', format: 'a4' }) แล้วท้ายสุด return doc",
        "เก็บ path รูปไว้ในตัวแปร imagePath เช่น '/images/lesson-image-sample.svg'",
        'ใช้ getLessonImage(imagePath) เพื่อเตรียม image data',
        'ใช้ doc.addImage(imageData, ... ) เพื่อวางภาพลง PDF',
        'กำหนด x, y, width และ height ของรูปให้ชัดเจน',
        'กด Run แล้วเห็น PDF preview สำเร็จ',
      ],
    },
    completionChecklist: [
      { id: 'image-path', label: 'เก็บ path รูปไว้ในตัวแปร imagePath' },
      { id: 'get-lesson-image', label: 'ใช้ getLessonImage(imagePath)' },
      { id: 'add-image', label: 'ใช้ doc.addImage() เพื่อวางรูปลง PDF' },
      { id: 'image-size', label: 'กำหนด width และ height ของรูปใน doc.addImage()' },
      { id: 'run-preview', label: 'กด Run แล้วสร้าง PDF preview สำเร็จ' },
    ],
    starterCode: `function generate() {
  const doc = new jsPDF(${pdfOptions});

  const imagePath = '/images/lesson-image-sample.svg';

  doc.setFontSize(18);
  doc.text('Image example', 20, 25);

  // Helper available in this lesson: getLessonImage(path)
  // Create image data from imagePath, then place it with addImage.

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
    goal: 'ใช้ฟอนต์ไทยใน PDF โดย register ฟอนต์ก่อน แล้วค่อยเลือกฟอนต์นั้นไปวาดข้อความ',
    explanation:
      'ฟอนต์ใน PDF ไม่เหมือน font บนเว็บที่เรียกชื่อแล้วใช้ได้เลย ก่อนวาดภาษาไทยต้องมีข้อมูลฟอนต์จากไฟล์ TTF ก่อน จากนั้นต้อง register หรือบอกให้ jsPDF รู้จักฟอนต์นี้ แล้วจึง setFont() เพื่อบอกเอกสารว่าจะใช้ฟอนต์นั้นกับข้อความถัดไป ตัวอย่างนี้มีฟอนต์ TH Sarabun New หนึ่งชุดใน pdf_font.js และใช้ style normal เท่านั้น',
    teachingPoints: [
      'การมีไฟล์ .ttf อย่างเดียวไม่พอ ต้องแปลงหรือเตรียมข้อมูลฟอนต์ให้ jsPDF อ่านได้ก่อน',
      'register คือการลงชื่อฟอนต์ไว้ใน jsPDF เพื่อให้เรียกใช้ด้วย family/style ได้',
      'registerThaiFont(doc) คือ helper ของบทเรียนนี้ที่ทำ addFileToVFS() เพื่อใส่ไฟล์ฟอนต์เข้า jsPDF และ addFont() เพื่อตั้งชื่อ family/style ให้เบื้องหลัง',
      'PDF_FONTS.thai เก็บชื่อ family, fileName และ style ที่ระบบ register ไว้',
      'ต้องเรียก doc.setFont(PDF_FONTS.thai.family, PDF_FONTS.thai.style) ก่อนวาดข้อความภาษาไทย',
      'ฟอนต์หนึ่งไฟล์อาจมีแค่บาง style เช่น normal ถ้าต้องการ bold หรือ italic จริง ๆ ต้องมีไฟล์หรือข้อมูลฟอนต์ของ style นั้นเพิ่ม',
      'glyph คือรูปวาดของตัวอักษรแต่ละตัวในฟอนต์ เช่น ก ข A B ถ้าฟอนต์ไม่มี glyph ภาษาไทย ข้อความไทยอาจแสดงผลผิด',
      'ต้องเลือกฟอนต์ที่รองรับภาษาที่จะใช้ เพราะฟอนต์บางตัวไม่มี glyph ภาษาไทย ต่อให้ code ถูกก็อาจแสดงผลผิด',
    ],
    concepts: ['register = ให้ jsPDF รู้จักฟอนต์', 'TTF = ไฟล์ฟอนต์', 'PDF_FONTS = ข้อมูลฟอนต์', 'doc.setFont() = เลือกฟอนต์', 'glyph = รูปตัวอักษร'],
    visualKind: 'font',
    miniTask: 'register ฟอนต์ไทย เลือกฟอนต์นั้น แล้ววาดข้อความภาษาไทยให้แสดงผลใน PDF',
    practice: {
      prompt: 'ใน function generate() ให้สร้าง doc, register ฟอนต์ไทย, เลือกฟอนต์นั้นด้วย doc.setFont() แล้ววาดข้อความภาษาไทย',
      requirements: [
        "เริ่มด้วย const doc = new jsPDF({ unit: 'mm', format: 'a4' }) แล้วท้ายสุด return doc",
        'เรียก registerThaiFont(doc) หลังสร้างเอกสาร เพื่อให้ jsPDF รู้จักฟอนต์ไทย',
        'ใช้ doc.setFont() ด้วยข้อมูลจาก PDF_FONTS.thai ก่อนวาดข้อความไทย',
        'วาดข้อความภาษาไทยอย่างน้อยหนึ่งบรรทัด',
        'ใช้ style ที่มีอยู่จริงในตัวอย่างนี้คือ normal',
        'กด Run แล้วเห็น PDF preview สำเร็จ',
      ],
    },
    completionChecklist: [
      { id: 'register-thai-font', label: 'เรียก registerThaiFont(doc) เพื่อให้ jsPDF รู้จักฟอนต์ไทย' },
      { id: 'use-font-metadata', label: 'ใช้ข้อมูลฟอนต์จาก PDF_FONTS.thai' },
      { id: 'set-thai-font', label: 'เรียก doc.setFont() เลือกฟอนต์ไทยก่อนวาดข้อความ' },
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
    goal: 'นำข้อมูลจาก object และ array ไปวางบน PDF แทนการพิมพ์ข้อความคงที่ทุกบรรทัด',
    explanation:
      'PDF ที่ generate มักเริ่มจากข้อมูลจริง เช่น object หนึ่งชุดสำหรับข้อมูลโปรเจกต์ และ array สำหรับรายการหลายแถว milestones ในบทนี้หมายถึงรายการหมุดหมายหรือขั้นตอนของงาน บทนี้ให้ map ค่า property ไปลงตำแหน่งที่ออกแบบไว้ และใช้ index ของ array เพื่อคำนวณตำแหน่ง y ของแต่ละแถว',
    teachingPoints: [
      'object เหมาะกับข้อมูลหนึ่ง record เช่น project.name, project.date, project.owner',
      'array เหมาะกับข้อมูลหลายแถว เช่น milestones หรือ task list',
      'milestones คือรายการหมุดหมายของโปรเจกต์ แต่ละแถวมี label และ value',
      'เวลา render array ให้ใช้ index ช่วยคำนวณ y เพื่อให้แต่ละแถวไม่ทับกัน',
      'แยก label กับ value ให้ชัด จะทำให้ layout อ่านง่ายและแก้ code ทีหลังง่ายขึ้น',
      'หลังจาก map ข้อมูลลง PDF ได้แล้ว บทถัดไปจะดูว่าถ้าข้อความ value ยาวเกินพื้นที่ควร wrap อย่างไร',
    ],
    concepts: ['object = ข้อมูลหนึ่งชุด', 'array = รายการหลายแถว', 'project.name = อ่านค่า', 'forEach() = วนรายการ', 'index = เลื่อน y'],
    visualKind: 'data-mapping',
    miniTask: 'ลองเพิ่ม milestone อีกหนึ่งแถว แล้วกด Run เพื่อดูการคำนวณตำแหน่ง y',
    practice: {
      prompt: 'ใน function generate() ให้สร้าง doc, สร้าง project object กับ milestones array แล้วนำค่าจากข้อมูลเหล่านั้นไปวางบน PDF',
      requirements: [
        "เริ่มด้วย const doc = new jsPDF({ unit: 'mm', format: 'a4' }) แล้วท้ายสุด return doc",
        'มี object ชื่อ project สำหรับข้อมูลหลักหนึ่งชุด',
        'มี array ชื่อ milestones สำหรับรายการหลายแถว',
        'ใช้ property เช่น project.name หรือ project.date ใน doc.text()',
        'loop ผ่าน milestones ด้วย forEach() หรือ map()',
        'ใช้ index เพื่อคำนวณตำแหน่ง y ของแต่ละแถว',
        'กด Run แล้วเห็น PDF preview สำเร็จ',
      ],
    },
    completionChecklist: [
      { id: 'data-object', label: 'สร้าง object ชื่อ project สำหรับข้อมูลหลัก' },
      { id: 'data-array', label: 'สร้าง array ชื่อ milestones สำหรับรายการหลายแถว' },
      { id: 'property-values', label: 'นำค่า property จาก project ไปใช้ใน doc.text()' },
      { id: 'array-iteration', label: 'วนผ่าน milestones ด้วย forEach() หรือ map()' },
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
    goal: 'แบ่งข้อความยาวให้ขึ้นหลายบรรทัดก่อนวางลง PDF',
    explanation:
      'เมื่อเอาข้อมูลจริงมาใส่ PDF ค่าในตัวแปรอาจยาวเกินพื้นที่ที่ออกแบบไว้ doc.text() ไม่ได้เดา layout ให้เสมอไป จึงใช้ doc.splitTextToSize(text, maxWidth) เพื่อแบ่งข้อความเป็นหลายบรรทัดก่อนส่งให้ doc.text()',
    teachingPoints: [
      'กำหนด maxWidth เป็นความกว้างของพื้นที่ข้อความในหน่วยเดียวกับเอกสาร เช่น mm',
      'doc.splitTextToSize(text, maxWidth) คืนค่าเป็น array ของบรรทัดข้อความ',
      'doc.text() รับ array ของบรรทัดได้ และจะวาดลงมาเป็นหลายบรรทัด',
      'ควรเก็บผล wrap ไว้ในตัวแปร เช่น wrappedSummary เพื่ออ่าน code ง่ายและนำจำนวนบรรทัดไปคำนวณต่อได้',
      'การ wrap เป็นขั้นพื้นฐานก่อนคิดเรื่องความสูงกล่อง การตัดหน้า หรือ layout ที่ซับซ้อนขึ้น',
    ],
    concepts: ['long text = ข้อความยาว', 'maxWidth = ความกว้างกรอบ', 'splitTextToSize() = แบ่งบรรทัด', 'wrappedSummary = ผลลัพธ์หลายบรรทัด'],
    visualKind: 'text-wrap',
    miniTask: 'ลองปรับ maxWidth ให้แคบลง แล้วดูจำนวนบรรทัดที่เพิ่มขึ้นใน preview',
    practice: {
      prompt: 'ใน function generate() ให้สร้าง doc, เตรียม project.summary ที่ยาว, แบ่งบรรทัดด้วย splitTextToSize() แล้วค่อยส่งผลลัพธ์เข้า doc.text()',
      requirements: [
        "เริ่มด้วย const doc = new jsPDF({ unit: 'mm', format: 'a4' }) แล้วท้ายสุด return doc",
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
    goal: 'ประกอบสิ่งที่เรียนมาให้เป็นเอกสารหน้าเดียวที่มีหัวเรื่อง กล่องข้อมูล summary และ footer',
    explanation:
      'บทนี้คือการรวมพื้นฐานให้เป็น layout หน้าเดียว ให้คิดเป็นพื้นที่บนกระดาษก่อน: header อยู่บนสุด, กล่องข้อมูลอยู่ถัดลงมา, summary อยู่กลางหน้า, milestones/status อยู่ช่วงล่าง และ footer อยู่ท้ายหน้า ตัวแปรอย่าง pageMargin และ contentWidth ช่วยให้ทุกส่วนวางตรงกันและแก้ง่าย',
    teachingPoints: [
      'pageMargin คือระยะขอบซ้าย/ขวาที่ใช้ซ้ำทั้งหน้า',
      'contentWidth คือความกว้างพื้นที่หลักที่ใช้กับเส้นและกล่อง',
      'แบ่งหน้าเป็น section ก่อนค่อยวาด: header, project info, summary, milestones, footer',
      'ใช้ rect และ line เป็นโครงสร้างสายตา ไม่ใช่แค่ตกแต่ง',
      'ใช้ splitTextToSize() กับ summary ยาว ๆ เพื่อให้เนื้อหาไม่ล้นพื้นที่ที่ตั้งใจไว้',
      'footer ควรอยู่ใกล้ท้ายหน้าและใช้เป็นสัญญาณว่าเอกสารหนึ่งหน้าจบแล้ว',
    ],
    concepts: ['pageMargin = ขอบหน้า', 'contentWidth = พื้นที่หลัก', 'section = พื้นที่แต่ละช่วง', 'summary wrap', 'footer = ท้ายหน้า'],
    visualKind: 'layout',
    miniTask: 'ประกอบ Project Brief PDF หน้าเดียวด้วย header, กล่องข้อมูล, summary, milestones และ footer',
    practice: {
      prompt: 'ใน function generate() ให้สร้าง doc แล้วประกอบ Project Brief หน้าเดียว โดยใช้ข้อมูลจาก project object และตัวแปร layout คุมตำแหน่งหลัก',
      requirements: [
        "เริ่มด้วย const doc = new jsPDF({ unit: 'mm', format: 'a4' }) แล้วท้ายสุด return doc",
        'กำหนด pageMargin และ contentWidth เพื่อคุมขอบกับความกว้างหลักของหน้า',
        'มี header/title ด้านบนของหน้า',
        'ใช้ doc.rect() อย่างน้อย 2 กล่องเพื่อแบ่ง section',
        'ใช้ doc.line() เป็น divider หรือ footer line',
        'ใช้ doc.splitTextToSize() เพื่อ wrap summary',
        'ใช้ข้อมูลจาก project object เช่น project.name',
        'มี footer ใกล้ท้ายหน้า',
        'กด Run แล้วเห็น PDF preview สำเร็จ',
      ],
    },
    completionChecklist: [
      { id: 'page-margin', label: 'กำหนดตัวแปร pageMargin สำหรับขอบหน้า' },
      { id: 'content-width', label: 'กำหนดตัวแปร contentWidth สำหรับความกว้างพื้นที่หลัก' },
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
    goal: 'สร้างเอกสารสรุปโปรเจกต์หน้าเดียวจาก blueprint โดยใช้พื้นฐานที่เรียนมา',
    explanation:
      'checkpoint นี้จะถูกซ่อนไว้จนกว่าบท 1-9 จะครบ เมื่อปลดล็อกแล้ว ให้ทำเอกสารหน้าเดียวจาก data object โดยอ้างอิง blueprint ที่คาดหวัง ไม่ต้องเหมือน pixel-perfect แต่ควรใช้ตัวแปรตำแหน่งที่โจทย์เตรียมไว้ เพราะตัวเลขเหล่านี้เป็นข้อตกลงของ layout: ช่วยให้ header, card, image และ footer อยู่ใน zone เดียวกับ blueprint และทำให้ระบบตรวจเข้าใจหลักฐานใน code ได้',
    concepts: ['blueprint = ภาพเป้าหมาย', 'layout zone = ช่วงตำแหน่ง', 'project data', 'design contract', 'one-page document'],
    visualKind: 'checkpoint',
    imagePaths: ['/images/lesson-image-sample.svg'],
    challenge: {
      prompt:
        'สร้าง PDF สรุปโปรเจกต์แบบหน้าเดียวให้ใกล้เคียง Expected blueprint ด้านล่าง ทำ layout เองได้ แต่ตำแหน่งหลักต้องอิงจาก blueprint ไม่ใช่วางตรงไหนก็ได้',
      requirements: [
        "เริ่มด้วย const doc = new jsPDF({ unit: 'mm', format: 'a4' }) แล้วท้ายสุด return doc",
        'สร้าง project data object ที่มี field ตามรายการ Required data fields',
        'ตั้งฟอนต์ด้วย doc.setFont() ก่อนวางข้อความหลัก',
        'วาง header ด้านบนตาม blueprint: title ฝั่งซ้าย, date ฝั่งขวา, divider ใต้หัวเอกสาร',
        'ใช้ขนาดตัวอักษรตาม design contract: title 22, section heading 18, body 16',
        'ใช้สีตาม design contract สำหรับข้อความ เส้น กรอบ และพื้นกล่อง',
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
          detail: 'ตั้งฟอนต์ให้ชัดด้วย doc.setFont() ก่อนเขียนข้อความหลัก ถ้ามีภาษาไทยให้ใช้ฟอนต์ที่มี glyph ภาษาไทย',
        },
        {
          label: 'Title',
          detail: 'ตัวอักษรหัวเรื่องใช้ doc.setFontSize(22) และสีหลัก #111827',
        },
        {
          label: 'Section heading',
          detail: 'หัวข้อ section ใช้ doc.setFontSize(18) และสีหลัก #111827',
        },
        {
          label: 'Body',
          detail: 'ข้อความเนื้อหาใช้ doc.setFontSize(16) และสีรอง #475569',
        },
        {
          label: 'Accent line',
          detail: 'เส้นเน้นใช้สีน้ำเงิน #2457d6 ด้วย doc.setDrawColor(36, 87, 214)',
        },
        {
          label: 'Card border',
          detail: 'ขอบกล่องใช้สี #cbd5e1 ด้วย doc.setDrawColor(203, 213, 225)',
        },
        {
          label: 'Card fill',
          detail: 'พื้นกล่องใช้สีอ่อน #f8fafc ด้วย doc.setFillColor(248, 250, 252)',
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
        'ใช้ขนาดตัวอักษร title 22, section heading 18 และ body 16',
        'ใช้สีตาม design contract',
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
          'ให้ project มี name, date, owner, status, imagePath, summary และ milestones ก่อนวาด PDF แล้วให้แต่ละ section อ่านค่าจาก project.<field>',
        ],
      },
      {
        id: 'font-family',
        label: 'ตั้งฟอนต์ด้วย doc.setFont() ก่อนวางข้อความหลัก',
        hints: [
          'ดู Design contract ส่วน Font ก่อนเริ่มวางข้อความ',
          'ตั้งฟอนต์ให้ชัดด้วย doc.setFont() ก่อนเขียน title หรือเนื้อหาหลัก ถ้ามีภาษาไทยควรใช้ฟอนต์ที่รองรับภาษาไทย',
          'หลังสร้าง doc ให้เรียก doc.setFont(...) ไว้ช่วงต้น generate() ก่อน doc.setFontSize(...) และ doc.text(...) ชุดแรก',
        ],
      },
      {
        id: 'blueprint-header',
        label: 'วาง header และ divider ใน zone บนตาม Expected blueprint',
        hints: [
          'กลับไปดู Header ใน Expected blueprint',
          'หัวเอกสารควรอยู่ช่วง y 16-34: title ซ้าย date ขวา และมีเส้นใต้',
          "ทำ header เป็น 3 ชิ้น: doc.text('Project Summary', ฝั่งซ้ายบน), doc.text(project.date, ฝั่งขวาแถวเดียวกัน) แล้วค่อย doc.line(...) เป็นเส้นใต้หัวเอกสาร",
        ],
      },
      {
        id: 'title-size',
        label: 'ใช้ doc.setFontSize(22) สำหรับ title',
        hints: [
          'ดู Design contract ส่วน Title',
          'ก่อนวาง title ให้ใช้ doc.setFontSize(22)',
          "เรียงแบบนี้ในหัวเอกสาร: doc.setFontSize(22) ก่อน แล้วค่อย doc.text('Project Summary', ...)",
        ],
      },
      {
        id: 'heading-size',
        label: 'ใช้ doc.setFontSize(18) สำหรับ section heading',
        hints: [
          'ดู Design contract ส่วน Section heading',
          'ก่อนหัวข้อ section เช่น Project Info หรือ Summary ให้ใช้ doc.setFontSize(18)',
          "ก่อนเขียนหัวข้อ card เช่น 'Project Info', 'Summary' หรือ 'Status' ให้เปลี่ยนเป็น doc.setFontSize(18)",
        ],
      },
      {
        id: 'body-size',
        label: 'ใช้ doc.setFontSize(16) สำหรับ body text',
        hints: [
          'ดู Design contract ส่วน Body',
          'ก่อนข้อความรายละเอียดใน card ให้ใช้ doc.setFontSize(16)',
          'หลังวางหัวข้อ section แล้วให้เปลี่ยนเป็น doc.setFontSize(16) ก่อนเขียนรายละเอียดอย่าง owner, status, summary หรือ milestone',
        ],
      },
      {
        id: 'contract-colors',
        label: 'ใช้สีตาม design contract สำหรับ text, line, border และ fill',
        hints: [
          'ดู Design contract สีหลัก',
          'ใช้ text color, draw color และ fill color ให้ตรงกับ contract',
          'แยกสีเป็น 4 งาน: setTextColor สำหรับตัวอักษร, setDrawColor(36, 87, 214) สำหรับเส้น accent, setDrawColor(203, 213, 225) สำหรับขอบ card และ setFillColor(248, 250, 252) สำหรับพื้น card',
        ],
      },
      {
        id: 'section-cards',
        label: 'วาง Info / Summary / Status cards เป็น stack ตาม Expected blueprint',
        hints: [
          'ดู stack ของ Info / Summary / Status ใน blueprint',
          'สร้าง card ด้วย doc.rect() สามกล่องในช่วงบน กลาง และล่าง',
          'วาง doc.rect(...) 3 ใบด้วย x และ width ชุดเดียวกัน: Info อยู่ช่วงบน, Summary อยู่กลาง, Status/Milestones อยู่ช่วงล่าง เพื่อให้เป็น stack เดียวกัน',
        ],
      },
      {
        id: 'divider-line',
        label: 'ใช้ doc.line() เป็น divider หรือ footer line',
        hints: [
          'ดูเส้นใต้ header หรือ footer line ใน blueprint',
          'ใช้ doc.line() สำหรับเส้นคั่น ไม่ใช่ rect อย่างเดียว',
          'วาดเส้นด้วย doc.line(x1, y, x2, y): ใช้ได้ทั้งเส้นใต้ header หรือเส้นก่อน footer เลือกหนึ่งจุดที่ช่วยแบ่งเอกสารให้ชัด',
        ],
      },
      {
        id: 'image-evidence',
        label: 'วางภาพจาก project.imagePath ด้านขวาของ Project Info card ตาม Expected blueprint',
        hints: [
          'ดูตำแหน่ง Image ใน Project Info card',
          'ใช้ const imageData = getLessonImage(project.imagePath) แล้ววางภาพด้านขวาของ card',
          "คิดเป็น 2 จังหวะ: เตรียม imageData จาก project.imagePath ก่อน แล้วใช้ doc.addImage(imageData, 'PNG', imageX, imageY, imageW, imageH) ให้อยู่ด้านขวาของ Info card",
        ],
      },
      {
        id: 'wrapped-summary',
        label: 'ใช้ doc.splitTextToSize() เพื่อ wrap project.summary',
        hints: [
          'ดู Summary card ใน blueprint',
          'อย่าส่ง summary ยาวเข้า doc.text() ตรง ๆ ให้ wrap ก่อน',
          'ทำเป็น 2 บรรทัดความคิด: สร้าง wrappedSummary จาก doc.splitTextToSize(project.summary, summaryWidth) แล้วส่ง wrappedSummary เข้า doc.text(...) ใน Summary card',
        ],
      },
      {
        id: 'project-fields',
        label: 'ใช้ name, date, owner, status, summary และ imagePath จาก project',
        hints: [
          'ดูรายการ Required data fields แล้วใช้ค่าจาก project ในแต่ละ section',
          'หลังจากมีโครง section แล้ว ให้แทนข้อความตัวอย่างด้วย project.name, project.date, project.owner, project.status, project.summary และ project.imagePath',
          'ไล่เช็กทีละ field: name/date/owner/status อยู่ใน Info card, summary อยู่ใน Summary card, imagePath ใช้กับ getLessonImage(...)',
        ],
      },
      {
        id: 'footer',
        label: 'มี footer หรือ signature ใกล้ท้ายหน้า',
        hints: [
          'ดู Footer ใน Expected blueprint',
          'วางเส้นหรือข้อความท้ายหน้าใกล้ y 270-286',
          'กำหนด footerY ใกล้ท้ายหน้า เช่นช่วง 270-286 แล้วใช้ doc.line(...) เป็นเส้นก่อน footer และ doc.text(...) วาง signature ที่ footerY',
        ],
      },
      {
        id: 'run-preview',
        label: 'กด Run แล้วสร้าง PDF preview สำเร็จ',
        hints: [
          'ข้อนี้จะผ่านเมื่อ Run สำเร็จและมี PDF preview',
          'ถ้ามี error ให้แก้ syntax หรือ return doc ก่อนดู checklist อื่น',
          'เช็กโครงท้ายสุดให้ครบ: function generate() ปิดปีกกาถูก, สร้าง const doc = new jsPDF(...), วาดทุกอย่างลง doc แล้ว return doc',
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

lessons.forEach((lesson) => {
  lesson.starterCodeVersion = blankStarterCodeVersion;
  lesson.starterCode = blankStarterCode;
});

export const starterLesson = lessons[0];
