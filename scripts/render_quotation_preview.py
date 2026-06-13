from pathlib import Path
from shutil import copyfile
from textwrap import wrap

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "public" / "images"
FINAL_OUTPUT_PATH = OUTPUT_DIR / "document-2-quotation-final.png"

WIDTH = 900
HEIGHT = 1274
PAGE_X = 6
PAGE_Y = 4
PAGE_WIDTH = 888
PAGE_HEIGHT = 1264
SCALE = PAGE_WIDTH / 210.0

FONT_REGULAR = "C:/Windows/Fonts/tahoma.ttf"

THEMES = [
    {
        "id": "blue",
        "primary": (36, 87, 214),
        "background": "bg-blue-triangles.png",
        "output": "document-2-quotation-blue.png",
        "brand": "BLUE PACK",
        "sub": "Triangle quotation",
        "card_fill": "#f8fafc",
        "total_fill": "#eff6ff",
    },
    {
        "id": "green",
        "primary": (47, 125, 79),
        "background": "bg-green-rectangles.png",
        "output": "document-2-quotation-green.png",
        "brand": "GREEN PACK",
        "sub": "Rectangle quotation",
        "card_fill": "#f8fcf9",
        "total_fill": "#f0fdf4",
    },
    {
        "id": "pink",
        "primary": (203, 62, 131),
        "background": "bg-pink-circles.png",
        "output": "document-2-quotation-pink.png",
        "brand": "PINK PACK",
        "sub": "Circle quotation",
        "card_fill": "#fff8fb",
        "total_fill": "#fdf2f8",
    },
]

RAW_ROWS = [
    {
        "product_code": "BIO-001",
        "product_name": "ถุงเพาะชำ Bio",
        "product_size": "8 x 12 นิ้ว",
        "product_description": "วัสดุย่อยสลายได้ เหมาะสำหรับต้นกล้า",
        "quantity": 1200,
        "unit": "ชิ้น",
        "unit_price": 2.5,
    },
    {
        "product_code": "GREEN-014",
        "product_name": "กล่องกระดาษรักษ์โลก",
        "product_size": "20 x 14 x 8 ซม.",
        "product_description": "พิมพ์โลโก้ 1 สี พร้อมเคลือบกันชื้น",
        "quantity": 350,
        "unit": "กล่อง",
        "unit_price": 18.75,
    },
    {
        "product_code": "VIA-220",
        "product_name": "สติกเกอร์สินค้า",
        "product_size": "A6",
        "product_description": "กระดาษกันน้ำ ไดคัทตามแบบ",
        "quantity": 500,
        "unit": "แผ่น",
        "unit_price": 4.2,
    },
    {
        "product_code": "PACK-090",
        "product_name": "ค่าจัดชุดสินค้า",
        "product_size": "-",
        "product_description": "แพ็กสินค้าแยกชุด พร้อมติดฉลากรอบจัดส่ง",
        "quantity": 80,
        "unit": "ชุด",
        "unit_price": 35,
    },
]


def load_font(size):
    return ImageFont.truetype(FONT_REGULAR, size)


def rgb_to_hex(rgb):
    return "#{:02x}{:02x}{:02x}".format(*rgb)


def mmx(value):
    return PAGE_X + value * SCALE


def mmy(value):
    return PAGE_Y + value * SCALE


def draw_text(draw, text, x, y, fill="#172033", size=18, anchor="la"):
    draw.text((mmx(x), mmy(y)), text, fill=fill, font=load_font(size), anchor=anchor)


def draw_line(draw, x1, y1, x2, y2, fill="#cbd5e1", width=2):
    draw.line([mmx(x1), mmy(y1), mmx(x2), mmy(y2)], fill=fill, width=width)


def draw_rect(draw, x, y, width, height, fill=None, outline="#cbd5e1", line_width=2):
    draw.rectangle(
        [mmx(x), mmy(y), mmx(x + width), mmy(y + height)],
        fill=fill,
        outline=outline,
        width=line_width,
    )


def money(value):
    return f"{value:,.2f}"


def draw_product_thumb(draw, x, y, theme):
    primary = rgb_to_hex(theme["primary"])

    draw_rect(draw, x, y, 12, 12, fill="#ffffff", outline="#d8e1ec", line_width=1)
    draw.rounded_rectangle([mmx(x + 1.5), mmy(y + 2), mmx(x + 6), mmy(y + 7)], radius=2, fill="#eef2ff")
    draw.ellipse([mmx(x + 2.2), mmy(y + 2.7), mmx(x + 3.8), mmy(y + 4.3)], fill=primary)
    draw.polygon(
        [(mmx(x + 2), mmy(y + 7)), (mmx(x + 4.2), mmy(y + 4.6)), (mmx(x + 6.2), mmy(y + 7))],
        fill="#16a34a",
    )
    draw_line(draw, x + 7, y + 3, x + 10.4, y + 3, "#111827", 2)
    draw_line(draw, x + 7, y + 5.4, x + 10.2, y + 5.4, "#64748b", 2)
    draw_line(draw, x + 7, y + 7.8, x + 9.8, y + 7.8, "#64748b", 2)


def draw_logo(draw, theme):
    primary = rgb_to_hex(theme["primary"])

    draw.rounded_rectangle([mmx(15), mmy(13), mmx(42), mmy(29)], radius=6, fill=primary)
    draw_text(draw, "GP", 28.5, 23.4, fill="#ffffff", size=27, anchor="ma")
    draw_text(draw, theme["brand"], 45, 18, fill="#111827", size=16)
    draw_text(draw, theme["sub"], 45, 25, fill="#64748b", size=11)


def create_page_canvas(theme):
    image = Image.new("RGB", (WIDTH, HEIGHT), "#111111")
    draw = ImageDraw.Draw(image)

    for offset, color in [(8, "#222222"), (4, "#333333")]:
        draw.rectangle(
            [
                PAGE_X + offset,
                PAGE_Y + offset,
                PAGE_X + PAGE_WIDTH + offset,
                PAGE_Y + PAGE_HEIGHT + offset,
            ],
            fill=color,
        )

    background_path = OUTPUT_DIR / theme["background"]
    page_background = Image.open(background_path).convert("RGB").resize((PAGE_WIDTH, PAGE_HEIGHT))
    image.paste(page_background, (PAGE_X, PAGE_Y))

    return image


def render_preview(theme):
    image = create_page_canvas(theme)
    draw = ImageDraw.Draw(image)
    primary = rgb_to_hex(theme["primary"])

    draw_logo(draw, theme)
    draw_text(draw, "ใบเสนอราคา", 112, 23, fill="#111827", size=40, anchor="ma")
    draw_text(draw, "เลขที่: QT-2026-014", 195, 20, fill="#475569", size=15, anchor="ra")
    draw_text(draw, "วันที่: 13/06/2569", 195, 27, fill="#475569", size=15, anchor="ra")
    draw_line(draw, 15, 35, 195, 35, primary, 4)

    draw_rect(draw, 15, 41, 180, 35, fill=theme["card_fill"], outline="#cbd5e1", line_width=2)
    draw_text(draw, "ข้อมูลลูกค้า", 21, 49, fill="#111827", size=20)
    draw_text(draw, "บริษัท: บริษัท ตัวอย่างผลิตภัณฑ์ จำกัด", 21, 57, fill="#475569", size=14)
    draw_text(draw, "ผู้ติดต่อ: คุณมะปราง", 21, 64, fill="#475569", size=14)
    draw_text(draw, "โทร: 02-123-4567", 128, 57, fill="#475569", size=14)
    draw_text(draw, "ยืนราคาถึง: 30/06/2569", 128, 64, fill="#475569", size=14)
    draw_text(draw, "อีเมล: purchase@example.co.th", 21, 69, fill="#475569", size=13, anchor="lt")

    columns = [
        ("ลำดับ", 15, 10),
        ("รหัส", 25, 22),
        ("รูป", 47, 20),
        ("รายการ", 67, 52),
        ("จำนวน", 119, 16),
        ("หน่วย", 135, 12),
        ("ราคา/หน่วย", 147, 22),
        ("รวมราคา", 169, 26),
    ]
    table_y = 87
    table_head_h = 9
    row_h = 22
    for label, x, width in columns:
        draw_rect(draw, x, table_y, width, table_head_h, fill=primary, outline=primary, line_width=1)
        draw_text(draw, label, x + width / 2, table_y + table_head_h / 2, fill="#ffffff", size=13, anchor="mm")

    subtotal = 0
    for index, row in enumerate(RAW_ROWS):
        row_y = table_y + table_head_h + index * row_h
        line_total = row["quantity"] * row["unit_price"]
        subtotal += line_total
        for _, x, width in columns:
            draw_rect(draw, x, row_y, width, row_h, fill=None, outline="#d8e1ec", line_width=1)
        draw_text(draw, str(index + 1), 20, row_y + 12, fill="#111827", size=13, anchor="ma")
        draw_text(draw, row["product_code"], 36, row_y + 12, fill="#111827", size=10, anchor="ma")
        draw_product_thumb(draw, 51, row_y + 5, theme)
        description = f"{row['product_name']} / {row['product_size']} / {row['product_description']}"
        for line_index, line in enumerate(wrap(description, width=33)[:3]):
            draw_text(draw, line, 70, row_y + 7 + line_index * 5, fill="#475569", size=11)
        draw_text(draw, f"{row['quantity']:,}", 134, row_y + 12, fill="#111827", size=12, anchor="ra")
        draw_text(draw, row["unit"], 141, row_y + 12, fill="#111827", size=12, anchor="ma")
        draw_text(draw, money(row["unit_price"]), 167, row_y + 12, fill="#111827", size=12, anchor="ra")
        draw_text(draw, money(line_total), 193, row_y + 12, fill="#111827", size=12, anchor="ra")

    totals_y = table_y + table_head_h + len(RAW_ROWS) * row_h + 10
    draw_rect(draw, 15, totals_y, 104, 26, fill="#ffffff", outline="#cbd5e1", line_width=2)
    draw_text(draw, "หมายเหตุ", 20, totals_y + 8, fill="#111827", size=16)
    remark = "ราคานี้รวมการออกแบบไฟล์ตั้งต้น และจัดส่งภายในกรุงเทพฯ"
    for line_index, line in enumerate(wrap(remark, width=42)[:2]):
        draw_text(draw, line, 20, totals_y + 16 + line_index * 5, fill="#64748b", size=11)

    discount = 500
    shipping = 300
    after_discount = subtotal - discount
    vat = (after_discount + shipping) * 0.07
    total_rows = [
        ("ยอดรวม", subtotal),
        ("ส่วนลด", discount),
        ("ค่าขนส่ง", shipping),
        ("ภาษีมูลค่าเพิ่ม 7%", vat),
        ("รวมจำนวนเงินทั้งหมด", after_discount + shipping + vat),
    ]
    for index, (label, value) in enumerate(total_rows):
        y = totals_y + index * 7
        fill = theme["total_fill"] if index == len(total_rows) - 1 else "#ffffff"
        draw_rect(draw, 123, y, 46, 7, fill=fill, outline="#cbd5e1", line_width=1)
        draw_rect(draw, 169, y, 26, 7, fill=fill, outline="#cbd5e1", line_width=1)
        row_size = 12 if index == len(total_rows) - 1 else 11
        draw_text(draw, label, 167, y + 3.5, fill="#111827", size=row_size, anchor="rm")
        draw_text(draw, money(value), 193, y + 3.5, fill="#111827", size=row_size, anchor="rm")

    for x, label in [(46, "ผู้สอบทาน"), (106, "ผู้เสนอราคา"), (166, "อนุมัติสั่งซื้อ")]:
        draw_line(draw, x - 26, 256, x + 26, 256, "#94a3b8", 2)
        draw_text(draw, label, x, 264, fill="#64748b", size=13, anchor="ma")

    draw_text(draw, "Document 2 target: Quotation from normalized rows", 15, 281, fill="#94a3b8", size=11)

    output_path = OUTPUT_DIR / theme["output"]
    image.save(output_path)
    print(f"wrote {output_path}")

    return output_path


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    blue_output_path = None

    for theme in THEMES:
        output_path = render_preview(theme)

        if theme["id"] == "blue":
            blue_output_path = output_path

    if blue_output_path:
        copyfile(blue_output_path, FINAL_OUTPUT_PATH)
        print(f"wrote {FINAL_OUTPUT_PATH}")


if __name__ == "__main__":
    main()
