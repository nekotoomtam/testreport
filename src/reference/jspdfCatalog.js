export const jspdfCatalogSections = [
  {
    id: 'overview',
    title: 'Big Picture',
    summary: 'มองภาพรวมก่อนว่า jsPDF สร้างเอกสาร วางเนื้อหา จัดหน้า และส่งออกอย่างไร',
    items: [
      {
        id: 'pdf-flow',
        name: 'ภาพรวม jsPDF workflow',
        apiType: 'overview',
        signature: 'create document -> place content -> export PDF',
        mentalModel:
          'ให้มอง jsPDF เหมือนโต๊ะทำเอกสาร: สร้าง doc เป็นกระดาษ PDF เปล่า ตั้งปากกา/สี/ฟอนต์ วางข้อความ รูป และกล่องตามพิกัด แล้วค่อยส่งออกเป็น preview หรือไฟล์',
        visualKind: 'overview',
        parameters: [
          { name: 'create', detail: 'เริ่มด้วย const doc = new jsPDF(...) เพื่อสร้างกระดาษ PDF' },
          { name: 'state', detail: 'ตั้งค่าปากกา ฟอนต์ สี และขนาด ก่อนวาดสิ่งถัดไป' },
          { name: 'place', detail: 'ใช้ doc.text, doc.addImage, doc.line, doc.rect เพื่อวางของบนกระดาษ' },
          { name: 'measure/export', detail: 'อ่าน pageSize หรือวัด text เพื่อจัด layout แล้ว output/save ออกไป' },
        ],
        example:
          "const doc = new jsPDF({ unit: 'mm', format: 'a4' });\ndoc.setFontSize(16);\ndoc.text('Project brief', 20, 30);\ndoc.save('brief.pdf');",
      },
    ],
  },
  {
    id: 'document',
    title: 'Document',
    summary: 'สร้างเอกสาร กำหนดกระดาษ เพิ่มหน้า และอ่านขนาดหน้าปัจจุบัน',
    items: [
      {
        id: 'new-jspdf',
        name: 'new jsPDF(options)',
        apiType: 'constructor',
        signature: "new jsPDF({ unit, format, orientation })",
        mentalModel:
          'จุดเริ่มของเอกสารทั้งเล่ม ให้คิดว่าได้ตัวแปร doc ซึ่งเป็นกระดาษ PDF ที่คำสั่งอื่น ๆ จะวาดลงไป',
        visualKind: 'constructor',
        parameters: [
          { name: 'unit', detail: "หน่วยวัดตำแหน่งและขนาด เช่น 'mm' ทำให้ x/y/width/height เป็นมิลลิเมตร" },
          { name: 'format', detail: "ขนาดกระดาษสำเร็จรูป เช่น 'a4', 'a3', 'letter' หรือ [width, height]" },
          { name: 'orientation', detail: "แนวกระดาษ: 'portrait' คือแนวตั้ง, 'landscape' คือแนวนอน" },
        ],
        example: "const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });",
      },
      {
        id: 'page-size',
        name: 'doc.internal.pageSize',
        apiType: 'internal',
        signature: 'doc.internal.pageSize.getWidth() / getHeight()',
        mentalModel:
          'ตัวอ่านขนาดหน้าปัจจุบัน หลังจากเลือก format/orientation แล้ว ค่านี้ช่วยให้คำนวณ center, right edge, footer หรือ content width ได้แม่น',
        visualKind: 'page-size',
        parameters: [
          { name: 'getWidth()', detail: 'คืนความกว้างของหน้าปัจจุบันตาม unit ของเอกสาร' },
          { name: 'getHeight()', detail: 'คืนความสูงของหน้าปัจจุบันตาม unit ของเอกสาร' },
          { name: 'pageSize.width/height', detail: 'ค่าขนาดที่เปลี่ยนตามหน้าและ format ที่ใช้อยู่' },
        ],
        example: 'const pageWidth = doc.internal.pageSize.getWidth();',
      },
      {
        id: 'add-page',
        name: 'doc.addPage()',
        apiType: 'page',
        signature: 'doc.addPage(format, orientation)',
        mentalModel:
          'เพิ่มกระดาษแผ่นใหม่เข้าเอกสาร จะใช้ขนาดเดิมก็ได้ หรือเปลี่ยน format/orientation ของหน้านั้นได้',
        visualKind: 'add-page',
        parameters: [
          { name: 'format', detail: 'ขนาดกระดาษของหน้าที่เพิ่ม เช่น a4, a3 หรือ custom array' },
          { name: 'orientation', detail: 'แนวกระดาษของหน้าที่เพิ่ม' },
        ],
        example: "doc.addPage('a3', 'landscape');",
      },
    ],
  },
  {
    id: 'text',
    title: 'Text',
    summary: 'วางข้อความ ตั้งขนาด สี ฟอนต์ และวัดความกว้างของข้อความ',
    items: [
      {
        id: 'text',
        name: 'doc.text()',
        apiType: 'method',
        signature: 'doc.text(text, x, y, options)',
        mentalModel:
          'วางข้อความลงบนจุดหนึ่งของกระดาษ x ขยับซ้าย/ขวา, y ขยับขึ้น/ลง และ options เป็น argument ตัวที่ 4 สำหรับ align หรือพฤติกรรมเพิ่ม',
        visualKind: 'text-position',
        parameters: [
          { name: 'text', detail: 'string หรือ array ของบรรทัดข้อความ' },
          { name: 'x', detail: 'ตำแหน่งแนวนอนจากขอบซ้ายของหน้า' },
          { name: 'y', detail: 'ตำแหน่งแนวตั้งจากขอบบนของหน้า' },
          { name: 'options.align', detail: "ใส่เป็น argument ตัวที่ 4 เช่น { align: 'center' } หรือ { align: 'right' }" },
        ],
        example: "doc.text('Hello', 40, 60, { align: 'left' });",
      },
      {
        id: 'font-size',
        name: 'doc.setFontSize()',
        apiType: 'state',
        signature: 'doc.setFontSize(size)',
        mentalModel:
          'ตั้ง state ของขนาดตัวอักษร ไม่ได้วาดอะไรทันที แต่ doc.text() หลังจากนี้จะใช้ขนาดนี้จนกว่าจะเปลี่ยนอีกครั้ง',
        visualKind: 'font-size',
        parameters: [{ name: 'size', detail: 'ขนาดตัวอักษร เช่น 10, 16, 22' }],
        example: "doc.setFontSize(22);\ndoc.text('Heading', 20, 30);",
      },
      {
        id: 'set-text-color',
        name: 'doc.setTextColor()',
        apiType: 'state',
        signature: 'doc.setTextColor(r, g, b)',
        mentalModel:
          'ตั้ง state สีข้อความ ทุก doc.text() ที่วาดหลังจากนี้จะใช้สีนี้จนกว่าจะเรียก setTextColor ใหม่',
        visualKind: 'text-color',
        parameters: [
          { name: 'r', detail: 'ค่าสีแดง 0-255 หรือใช้ hex string ได้' },
          { name: 'g', detail: 'ค่าสีเขียว 0-255' },
          { name: 'b', detail: 'ค่าสีน้ำเงิน 0-255' },
        ],
        example: 'doc.setTextColor(36, 87, 214);',
      },
      {
        id: 'get-text-width',
        name: 'doc.getTextWidth()',
        apiType: 'measurement',
        signature: 'doc.getTextWidth(text)',
        mentalModel:
          'วัดความกว้างของข้อความก่อนวาด ใช้ช่วยจัดกลาง จัดขวา หรือคำนวณว่าข้อความจะกินพื้นที่เท่าไร',
        visualKind: 'text-width',
        parameters: [{ name: 'text', detail: 'ข้อความที่ต้องการวัดความกว้าง' }],
        example: "const width = doc.getTextWidth('Total');",
      },
      {
        id: 'split-text',
        name: 'doc.splitTextToSize()',
        apiType: 'plugin',
        signature: 'doc.splitTextToSize(text, maxWidth)',
        mentalModel:
          'แปลงข้อความยาวให้เป็นหลายบรรทัดตามกรอบความกว้างที่กำหนด ก่อนส่ง array ของบรรทัดไปให้ doc.text()',
        visualKind: 'wrap',
        parameters: [
          { name: 'text', detail: 'ข้อความยาวที่ต้องการแบ่งบรรทัด' },
          { name: 'maxWidth', detail: 'ความกว้างสูงสุดของแต่ละบรรทัด' },
        ],
        example: 'const lines = doc.splitTextToSize(summary, 160);',
      },
    ],
  },
  {
    id: 'shapes',
    title: 'Shapes',
    summary: 'วาดเส้น กล่อง วงกลม และตั้ง style ของเส้น/พื้น',
    items: [
      {
        id: 'line',
        name: 'doc.line()',
        apiType: 'method',
        signature: 'doc.line(x1, y1, x2, y2)',
        mentalModel:
          'วาดเส้นจากจุดเริ่มไปจุดปลาย เหมือนลากปากกาจากพิกัดแรกไปพิกัดที่สอง',
        visualKind: 'line',
        parameters: [
          { name: 'x1, y1', detail: 'จุดเริ่มต้นของเส้น' },
          { name: 'x2, y2', detail: 'จุดปลายของเส้น' },
        ],
        example: 'doc.line(20, 40, 120, 80);',
      },
      {
        id: 'rect',
        name: 'doc.rect() (box / rectangle)',
        apiType: 'method',
        signature: 'doc.rect(x, y, width, height, style)',
        mentalModel:
          'rect ย่อจาก rectangle ให้คิดเป็น box สี่เหลี่ยม: เริ่มจากมุมซ้ายบน x/y แล้วขยายออกตาม width และ height ส่วน style บอกว่าจะวาดเส้น เติมสี หรือทั้งคู่',
        visualKind: 'rect',
        parameters: [
          { name: 'x, y', detail: 'มุมซ้ายบนของกล่อง' },
          { name: 'width, height', detail: 'ขนาดของกล่อง' },
          { name: 'style', detail: "'S' วาดขอบ, 'F' เติมสีพื้น, 'FD' เติมสีพื้น + วาดขอบ" },
        ],
        example: "doc.rect(30, 50, 90, 55, 'FD');",
      },
      {
        id: 'rounded-rect',
        name: 'doc.roundedRect()',
        apiType: 'method',
        signature: 'doc.roundedRect(x, y, w, h, rx, ry, style)',
        mentalModel:
          'เหมือน rect แต่เพิ่มรัศมีมุมโค้ง rx/ry ทำให้กล่องดูนุ่มขึ้น',
        visualKind: 'rounded-rect',
        parameters: [
          { name: 'rx, ry', detail: 'รัศมีมุมโค้งแนวนอนและแนวตั้ง' },
          { name: 'style', detail: 'รูปแบบ stroke/fill เช่นเดียวกับ rect' },
        ],
        example: "doc.roundedRect(30, 50, 90, 55, 4, 4, 'FD');",
      },
      {
        id: 'circle',
        name: 'doc.circle() / doc.ellipse()',
        apiType: 'method',
        signature: 'doc.circle(x, y, r) / doc.ellipse(x, y, rx, ry)',
        mentalModel:
          'วาดวงจากจุดศูนย์กลาง ไม่ได้เริ่มจากมุมซ้ายบนเหมือน rect',
        visualKind: 'circle',
        parameters: [
          { name: 'x, y', detail: 'จุดศูนย์กลางของวง' },
          { name: 'r / rx / ry', detail: 'รัศมีวงกลมหรือวงรี' },
        ],
        example: 'doc.circle(80, 80, 20);',
      },
      {
        id: 'stroke-fill-state',
        name: 'setDrawColor() / setFillColor() / setLineWidth()',
        apiType: 'state',
        signature: 'doc.setDrawColor(...); doc.setFillColor(...); doc.setLineWidth(width)',
        mentalModel:
          'ตั้ง state ของเส้น สีพื้น และความหนา ก่อนวาด shape ถัดไป เหมือนเลือกปากกาและสีถังก่อนลงมือวาด ค่านี้จะติดไปกับ shape ถัดไปจนกว่าจะเปลี่ยนใหม่',
        visualKind: 'shape-style',
        parameters: [
          { name: 'drawColor', detail: 'สีเส้นหรือสีขอบของ line/shape ถัดไป ไม่ใช่สีพื้น' },
          { name: 'fillColor', detail: 'สีพื้นที่ใช้กับ shape ถัดไปเมื่อ style เป็น F หรือ FD' },
          { name: 'lineWidth', detail: 'ความหนาของเส้นหรือขอบถัดไป' },
        ],
        example: "doc.setFillColor(248, 250, 252);\ndoc.setLineWidth(0.6);",
      },
    ],
  },
  {
    id: 'media-fonts',
    title: 'Media And Fonts',
    summary: 'วางรูปภาพและเตรียมฟอนต์ก่อนใช้กับข้อความ',
    items: [
      {
        id: 'add-image',
        name: 'doc.addImage()',
        apiType: 'plugin',
        signature: 'doc.addImage(imageData, format, x, y, width, height)',
        mentalModel:
          'วางรูปลงในกรอบที่กำหนดเอง imageData คือรูป ส่วน x/y/width/height คือกล่องที่รูปจะถูกวางบนกระดาษ',
        visualKind: 'image',
        parameters: [
          { name: 'imageData', detail: 'ข้อมูลรูป เช่น data URL, image element, canvas, Uint8Array' },
          { name: 'format', detail: "ชนิดรูป เช่น 'PNG' หรือ 'JPEG'" },
          { name: 'x, y, width, height', detail: 'ตำแหน่งและขนาดกรอบรูปบน PDF' },
        ],
        example: "doc.addImage(imageData, 'PNG', 20, 40, 120, 68);",
      },
      {
        id: 'vfs-font',
        name: 'addFileToVFS() / addFont() / setFont()',
        apiType: 'plugin',
        signature: 'doc.addFileToVFS(file, data); doc.addFont(file, family, style)',
        mentalModel:
          'register คือบอก jsPDF ให้รู้จักฟอนต์นี้ก่อนใช้จริง: ใส่ข้อมูลไฟล์เข้า virtual file system ด้วย addFileToVFS แล้วตั้งชื่อ family/style ด้วย addFont ก่อนจึง setFont เพื่อใช้กับ text ถัดไปได้',
        visualKind: 'font-registry',
        parameters: [
          { name: 'addFileToVFS', detail: 'ใส่ข้อมูลไฟล์ฟอนต์เข้า memory ของ jsPDF' },
          { name: 'addFont', detail: 'ลงทะเบียนชื่อ family/style เพื่อให้ setFont เรียกใช้ได้' },
          { name: 'setFont', detail: 'เลือกฟอนต์ที่ลงทะเบียนแล้วก่อนวาดข้อความ' },
          { name: 'glyph', detail: 'รูปวาดของตัวอักษรแต่ละตัวในฟอนต์ ถ้าฟอนต์ไม่มี glyph ภาษาไทย ข้อความไทยอาจเพี้ยน' },
        ],
        example: "doc.addFileToVFS('THSarabunNew.ttf', fontData);\ndoc.addFont('THSarabunNew.ttf', 'THSarabunNew', 'normal');",
      },
    ],
  },
  {
    id: 'output',
    title: 'Output',
    summary: 'ส่งออกเอกสารเป็น blob, arraybuffer, data URL หรือดาวน์โหลดไฟล์',
    items: [
      {
        id: 'output',
        name: 'doc.output()',
        apiType: 'method',
        signature: "doc.output('blob') / doc.output('arraybuffer')",
        mentalModel:
          'แปลงเอกสารใน memory ออกมาเป็นรูปแบบข้อมูลที่เอาไป preview, upload หรือส่งต่อให้ระบบอื่นได้',
        visualKind: 'output',
        parameters: [
          { name: 'blob', detail: 'เหมาะกับสร้าง Object URL เพื่อ preview' },
          { name: 'arraybuffer', detail: 'เหมาะกับส่ง binary ต่อให้ระบบอื่น' },
          { name: 'dataurlstring', detail: 'เหมาะกับฝังเป็น string base64' },
        ],
        example: "const blob = doc.output('blob');",
      },
      {
        id: 'save',
        name: 'doc.save()',
        apiType: 'method',
        signature: "doc.save('file-name.pdf')",
        mentalModel:
          'สั่ง browser ดาวน์โหลดไฟล์ PDF จากเอกสารที่สร้างไว้ใน memory',
        visualKind: 'save',
        parameters: [{ name: 'filename', detail: 'ชื่อไฟล์ PDF ที่ผู้ใช้จะดาวน์โหลด' }],
        example: "doc.save('lesson-output.pdf');",
      },
    ],
  },
];
