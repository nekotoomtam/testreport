const pdfOptions = "{ unit: 'mm', format: 'a4' }";

export const lessons = [
  {
    id: 'hello-pdf',
    order: 1,
    phase: 'Phase 1: Basic API',
    type: 'lesson',
    title: 'Hello PDF',
    shortTitle: 'Hello PDF',
    goal: 'สร้างเอกสาร A4 เปล่า แล้ววางข้อความแรกลงบนหน้า PDF',
    explanation:
      'เริ่มจากโปรแกรม jsPDF ที่เล็กที่สุดแต่ใช้งานได้จริง: สร้างเอกสาร กำหนดขนาดตัวอักษรให้อ่านง่าย วาดข้อความ แล้ว return เอกสารกลับไปให้ preview แสดงผล',
    concepts: ['new jsPDF()', 'doc.text()', 'ขนาดฟอนต์', 'return doc'],
    visualKind: 'none',
    miniTask: 'ลองเปลี่ยนข้อความ แล้วขยับตำแหน่งลงมาด้านล่างของหน้าอีกนิด',
    starterCode: `function generate() {
  const doc = new jsPDF(${pdfOptions});

  doc.setFontSize(24);
  doc.text('Hello jsPDF', 20, 30);

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
    goal: 'ใช้พิกัด x และ y เพื่อวางข้อความบนหน้า A4 ให้ควบคุมตำแหน่งได้',
    explanation:
      'jsPDF วางข้อความด้วยค่า x และ y โดยนับจากมุมซ้ายบนของหน้า การเปลี่ยนตัวเลขเพียงเล็กน้อยควรทำให้เห็นการขยับใน preview ได้ชัดเจน',
    concepts: ['พิกัด x', 'พิกัด y', 'จุดเริ่มต้นของหน้า', 'ระยะห่าง'],
    visualKind: 'xy-bars',
    miniTask: 'ลองเปลี่ยนค่า y ของข้อความบรรทัดที่สอง แล้วกด Run อีกครั้ง',
    starterCode: `function generate() {
  const doc = new jsPDF(${pdfOptions});

  doc.setFontSize(14);
  doc.text('Top-left area', 20, 25);
  doc.text('Lower on the page', 20, 70);
  doc.text('Farther right', 90, 45);

  return doc;
}
`,
  },
  {
    id: 'text-style',
    order: 3,
    phase: 'Phase 1: Basic API',
    type: 'lesson',
    title: 'Text Style',
    shortTitle: 'Text Style',
    goal: 'ใช้ style พื้นฐานของข้อความ เพื่อให้ลำดับความสำคัญใน PDF อ่านง่ายขึ้น',
    explanation:
      'ใช้ขนาดฟอนต์ น้ำหนักตัวอักษร และสีข้อความ เพื่อแยกหัวเรื่อง label และเนื้อหาออกจากกัน การปรับ style เล็ก ๆ แบบนี้ช่วยให้ PDF ที่สร้างออกมา scan อ่านได้ง่ายขึ้น',
    concepts: ['setFontSize()', 'setFont()', 'setTextColor()', 'ลำดับชั้นข้อความ'],
    visualKind: 'text-style',
    miniTask: 'ลองเปลี่ยนสีหัวเรื่อง แล้วเพิ่มข้อความเนื้อหาอีกหนึ่งบรรทัด',
    starterCode: `function generate() {
  const doc = new jsPDF(${pdfOptions});

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(24, 48, 86);
  doc.text('Project Summary', 20, 28);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(55, 65, 81);
  doc.text('A readable PDF starts with clear text hierarchy.', 20, 42);

  return doc;
}
`,
  },
  {
    id: 'line-rect',
    order: 4,
    phase: 'Phase 1: Basic API',
    type: 'lesson',
    title: 'Line / Rect',
    shortTitle: 'Line / Rect',
    goal: 'วาดเส้นและกรอบสี่เหลี่ยมง่าย ๆ เพื่อจัดโครงพื้นที่ของเนื้อหา',
    explanation:
      'เส้นและกรอบเป็นตัวช่วยจัดสายตาที่สำคัญมากใน PDF เราใช้มันทำเส้นคั่น กล่องเน้นข้อมูล ช่องฟอร์ม หรือขอบเขต layout ได้โดยไม่ต้องใช้ library เพิ่ม',
    concepts: ['doc.line()', 'doc.rect()', 'setDrawColor()', 'setLineWidth()'],
    visualKind: 'box-model',
    miniTask: 'ลองเพิ่มกล่องอีกใบ หรือขยับเส้นคั่นไปตำแหน่งใหม่',
    starterCode: `function generate() {
  const doc = new jsPDF(${pdfOptions});

  doc.setFontSize(18);
  doc.text('Simple Layout Blocks', 20, 25);

  doc.setDrawColor(37, 87, 214);
  doc.setLineWidth(0.6);
  doc.line(20, 32, 190, 32);

  doc.setDrawColor(148, 163, 184);
  doc.rect(20, 45, 75, 35);
  doc.rect(105, 45, 75, 35);

  doc.setFontSize(11);
  doc.text('Box A', 28, 62);
  doc.text('Box B', 113, 62);

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
    goal: 'ใส่ภาพตัวอย่างลงใน PDF พร้อมควบคุมขนาดและตำแหน่งให้คงที่',
    explanation:
      'บทภาพรอบแรกนี้ใช้ canvas ที่สร้างขึ้นใน browser เป็น asset จำลองก่อน รอบถัดไปค่อยเปลี่ยนเป็นการ upload หรืออ่านไฟล์จริงได้',
    concepts: ['canvas data URL', 'doc.addImage()', 'ความกว้างภาพ', 'ความสูงภาพ'],
    visualKind: 'image-ratio',
    miniTask: 'ลองเปลี่ยนความกว้างหรือความสูงของภาพ แล้วสังเกตว่า preview เปลี่ยนอย่างไร',
    starterCode: `function generate() {
  const doc = new jsPDF(${pdfOptions});

  const canvas = document.createElement('canvas');
  canvas.width = 320;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#dbeafe';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#2457d6';
  ctx.fillRect(18, 18, 284, 124);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px Arial';
  ctx.fillText('Image placeholder', 42, 88);

  const imageData = canvas.toDataURL('image/png');

  doc.setFontSize(18);
  doc.text('Image example', 20, 25);
  doc.addImage(imageData, 'PNG', 20, 38, 110, 55);

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
    goal: 'register ฟอนต์ TH Sarabun New จาก pdf_font.js แล้ววาดข้อความภาษาไทยใน PDF',
    explanation:
      'ฟอนต์ที่มากับ jsPDF โดยตรงมีข้อจำกัดกับภาษาไทย บทนี้เลย register ฟอนต์ TH Sarabun New ที่แนบมากับโปรเจกต์ก่อนวาดข้อความไทย ตัว runner inject registerThaiFont() ให้แล้ว จึงไม่ต้องเขียน import ใน code ของบทเรียน',
    concepts: ['registerThaiFont()', 'PDF_FONTS', 'setFont()', 'ข้อความภาษาไทย'],
    visualKind: 'font',
    miniTask: 'ลองแก้ประโยคภาษาไทยหนึ่งบรรทัด แล้วกด Run เพื่อเช็กว่าฟอนต์ยังแสดงผลถูกต้อง',
    starterCode: `function generate() {
  const doc = new jsPDF(${pdfOptions});

  registerThaiFont(doc);

  doc.setFont(PDF_FONTS.thai.family, 'normal');
  doc.setFontSize(24);
  doc.text('สวัสดี jsPDF', 20, 30);

  doc.setFontSize(16);
  doc.text('นี่คือตัวอย่างการใช้ฟอนต์ไทยจาก pdf_font.js', 20, 48);
  doc.text('ลองแก้ประโยคนี้แล้วกด Run อีกครั้ง', 20, 62);

  return doc;
}
`,
  },
  {
    id: 'data-mapping',
    order: 7,
    phase: 'Phase 1: Basic API',
    type: 'lesson',
    title: 'Array Data Mapping',
    shortTitle: 'Array Mapping',
    goal: 'สร้างแถวข้อมูลซ้ำ ๆ ใน PDF จาก JavaScript data array ขนาดเล็ก',
    explanation:
      'ถ้าข้อมูลเป็นรายการหลายแถว ให้ loop ผ่าน array แล้วใช้ index ของแต่ละแถวช่วยคำนวณตำแหน่ง y เพื่อวางเนื้อหาซ้ำอย่างเป็นระบบ',
    concepts: ['data array', 'forEach()', 'index ของแถว', 'คำนวณตำแหน่ง y'],
    visualKind: 'data-array',
    miniTask: 'ลองเพิ่ม item อีกหนึ่งตัวใน data array แล้วกด Run อีกครั้ง',
    starterCode: `function generate() {
  const doc = new jsPDF(${pdfOptions});

  const tasks = [
    { name: 'Design brief', owner: 'Mina' },
    { name: 'PDF layout', owner: 'Ko' },
    { name: 'Review pass', owner: 'Toom' },
  ];

  doc.setFontSize(18);
  doc.text('Task Owners', 20, 25);

  doc.setFontSize(11);
  tasks.forEach((task, index) => {
    const y = 42 + index * 12;
    doc.text(task.name, 20, y);
    doc.text(task.owner, 95, y);
  });

  return doc;
}
`,
  },
  {
    id: 'json-object-mapping',
    order: 8,
    phase: 'Phase 1: Basic API',
    type: 'lesson',
    title: 'JSON Object Mapping',
    shortTitle: 'JSON Mapping',
    goal: 'นำค่าจาก object แบบ JSON หนึ่งชุด ไปวางใน field ที่มี label บน PDF',
    explanation:
      'PDF ที่ generate ไม่ได้เริ่มจากตารางเสมอไป เอกสารหลายแบบใช้ข้อมูลหนึ่ง record เช่น object สรุปโปรเจกต์ แล้วนำ property แต่ละตัวไปวางในตำแหน่งที่ออกแบบไว้บนหน้า',
    concepts: ['data object', 'เข้าถึง property', 'label และ value', 'ข้อมูลหนึ่ง record'],
    visualKind: 'data-object',
    miniTask: 'ลองเปลี่ยนค่า owner หรือ status ใน object แล้วกด Run อีกครั้ง',
    starterCode: `function generate() {
  const doc = new jsPDF(${pdfOptions});

  const project = {
    name: 'Visual Lesson Playground',
    date: '2026-06-11',
    owner: 'Toom',
    status: 'Draft',
    summary: 'A focused practice page for learning jsPDF output.',
  };

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('Project Snapshot', 20, 26);

  doc.setDrawColor(203, 213, 225);
  doc.rect(20, 40, 170, 62);

  doc.setFontSize(11);
  doc.text('Project', 28, 56);
  doc.text('Date', 28, 70);
  doc.text('Owner', 28, 84);
  doc.text('Status', 110, 84);

  doc.setFont('helvetica', 'normal');
  doc.text(project.name, 58, 56);
  doc.text(project.date, 58, 70);
  doc.text(project.owner, 58, 84);
  doc.text(project.status, 140, 84);

  doc.setFontSize(10);
  doc.text(project.summary, 28, 118, { maxWidth: 150 });

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
    goal: 'รวมข้อความ กล่อง และระยะห่างให้กลายเป็น layout PDF แบบหน้าเดียว',
    explanation:
      'บทนี้รวมเครื่องมือพื้นฐานที่เรียนมาก่อนหน้าเข้าด้วยกัน: หัวเรื่อง กล่อง section ข้อความสรุป และ footer เพื่อให้เห็นภาพการจัดหน้าแบบง่าย',
    concepts: ['section ของ layout', 'จังหวะระยะห่าง', 'footer', 'รวม primitive หลายแบบ'],
    visualKind: 'layout',
    miniTask: 'ลองเปลี่ยนชื่อ section หนึ่งจุด แล้วปรับความสูงของกล่องโดยไม่ให้ layout หลุดออกนอกหน้า',
    starterCode: `function generate() {
  const doc = new jsPDF(${pdfOptions});

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('One-page Layout', 20, 26);

  doc.setDrawColor(203, 213, 225);
  doc.rect(20, 40, 170, 48);
  doc.rect(20, 100, 80, 54);
  doc.rect(110, 100, 80, 54);

  doc.setFontSize(13);
  doc.text('Overview', 28, 55);
  doc.text('Status', 28, 115);
  doc.text('Next Steps', 118, 115);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Use boxes and spacing to make generated PDFs easier to scan.', 28, 68);
  doc.text('Draft', 28, 130);
  doc.text('Run, inspect, then refine.', 118, 130);

  doc.setFontSize(9);
  doc.text('Generated with jsPDF Visual Lessons', 20, 282);

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
    goal: 'นำพื้นฐาน API ที่เรียนมาไปสร้างเอกสารสรุปโปรเจกต์แบบหน้าเดียว',
    explanation:
      'checkpoint นี้เป็นโจทย์ลงมือทำจริง ให้ใช้ data object ที่เตรียมไว้ วางชื่อเอกสารให้ชัด สร้างกล่องข้อมูลอย่างน้อยหนึ่งจุด และจัดทุกอย่างให้อยู่ในหน้าเดียว',
    concepts: ['layout แบบประยุกต์', 'data object', 'ตกแต่งข้อความ', 'กล่องหรือเส้นคั่น', 'ตรวจงานด้วยตัวเอง'],
    visualKind: 'checkpoint',
    challenge: {
      prompt:
        'สร้าง PDF สรุปโปรเจกต์แบบหน้าเดียวจาก data object ที่ให้ไว้ งานควรรู้สึกเหมือนเอกสาร handoff โปรเจกต์จริง ไม่ใช่คำตอบแบบ quiz',
      requirements: [
        'มีชื่อเอกสาร',
        'มีชื่อโปรเจกต์จาก data object',
        'มีวันที่จาก data object',
        'มีกล่องข้อมูลอย่างน้อย 1 กล่อง',
        'มีเส้นคั่นหรือกรอบ',
        'มีการตกแต่งข้อความอย่างน้อย 1 จุด',
        'มี footer หรือลายเซ็นอย่างง่าย',
      ],
      checklist: [
        'ใช้ doc.text()',
        'ใช้ doc.rect() หรือ doc.line()',
        'ใช้ค่าจาก data object',
        'layout อยู่ในหน้าเดียว',
        'กด Run แล้วเห็น PDF preview',
      ],
    },
    starterCode: `function generate() {
  const doc = new jsPDF(${pdfOptions});

  const data = {
    projectName: 'jsPDF Visual Lesson Playground',
    date: '2026-06-11',
    owner: 'Learning Team',
    summary: 'A small playground for learning PDF generation visually.',
  };

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('Project Summary', 20, 26);

  doc.setDrawColor(37, 87, 214);
  doc.setLineWidth(0.7);
  doc.line(20, 34, 190, 34);

  doc.setFontSize(13);
  doc.text(data.projectName, 20, 50);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Date: ' + data.date, 20, 62);
  doc.text('Owner: ' + data.owner, 20, 72);

  doc.setDrawColor(203, 213, 225);
  doc.rect(20, 88, 170, 48);
  doc.text(data.summary, 28, 106);

  doc.setFont('helvetica', 'italic');
  doc.text('Prepared for review', 20, 282);

  return doc;
}
`,
  },
];

export const starterLesson = lessons[0];
