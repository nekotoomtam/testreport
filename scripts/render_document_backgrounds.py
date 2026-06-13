from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "public" / "images"

WIDTH = 900
HEIGHT = 1274


def save_composite(name, draw_background):
    base = Image.new("RGBA", (WIDTH, HEIGHT), "#ffffff")
    layer = Image.new("RGBA", (WIDTH, HEIGHT), (255, 255, 255, 0))
    draw = ImageDraw.Draw(layer)

    draw_background(draw)
    image = Image.alpha_composite(base, layer).convert("RGB")
    output_path = OUTPUT_DIR / name
    image.save(output_path)
    print(f"wrote {output_path}")


def triangle_background(draw):
    draw.polygon([(0, 0), (310, 0), (0, 360)], fill=(36, 87, 214, 30))
    draw.polygon([(0, 0), (185, 0), (0, 210)], fill=(36, 87, 214, 14))
    draw.polygon([(900, 1274), (900, 850), (515, 1274)], fill=(36, 87, 214, 22))
    draw.polygon([(900, 1274), (900, 1015), (660, 1274)], fill=(36, 87, 214, 12))
    draw.line([(86, 1180), (385, 1180)], fill=(36, 87, 214, 36), width=8)


def rectangle_background(draw):
    draw.rounded_rectangle([670, -70, 980, 170], radius=34, fill=(47, 125, 79, 26))
    draw.rounded_rectangle([722, -20, 930, 128], radius=24, fill=(47, 125, 79, 18))
    draw.rounded_rectangle([-58, 920, 230, 1240], radius=36, fill=(47, 125, 79, 24))
    draw.rounded_rectangle([30, 1002, 296, 1170], radius=28, fill=(47, 125, 79, 14))
    draw.rectangle([92, 94, 362, 112], fill=(47, 125, 79, 30))
    draw.rectangle([92, 122, 270, 132], fill=(47, 125, 79, 18))


def circle_background(draw):
    draw.ellipse([650, 820, 1108, 1278], fill=(236, 72, 153, 18))
    draw.ellipse([758, 928, 1000, 1170], fill=(236, 72, 153, 12))
    draw.ellipse([-164, -154, 252, 262], fill=(236, 72, 153, 14))
    draw.ellipse([34, 108, 120, 194], fill=(236, 72, 153, 20))
    draw.ellipse([128, 120, 176, 168], fill=(236, 72, 153, 14))
    draw.arc([650, 820, 1108, 1278], 204, 292, fill=(236, 72, 153, 48), width=9)
    draw.arc([-164, -154, 252, 262], 20, 112, fill=(236, 72, 153, 38), width=7)


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    save_composite("bg-blue-triangles.png", triangle_background)
    save_composite("bg-green-rectangles.png", rectangle_background)
    save_composite("bg-pink-circles.png", circle_background)


if __name__ == "__main__":
    main()
