import zlib
import struct
import math
import os

def make_png(width, height, draw_func):
    """
    Creates a valid RGBA PNG binary buffer using standard Python zlib.
    """
    raw_data = bytearray()
    
    for y in range(height):
        # Filter type 0 (None) for scanline
        raw_data.append(0)
        for x in range(width):
            r, g, b, a = draw_func(x, y, width, height)
            raw_data.extend([r, g, b, a])
            
    compressed = zlib.compress(bytes(raw_data), level=9)
    
    png = bytearray(b'\x89PNG\r\n\x1a\n')
    
    # IHDR chunk
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data)
    png.extend(struct.pack('>I', 13) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc))
    
    # IDAT chunk
    idat_len = len(compressed)
    idat_crc = zlib.crc32(b'IDAT' + compressed)
    png.extend(struct.pack('>I', idat_len) + b'IDAT' + compressed + struct.pack('>I', idat_crc))
    
    # IEND chunk
    iend_crc = zlib.crc32(b'IEND')
    png.extend(struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc))
    
    return bytes(png)

def draw_focusflow_icon(x, y, w, h, is_maskable=False):
    # Normalized coordinates [-1, 1]
    nx = (x / (w - 1)) * 2 - 1
    ny = (y / (h - 1)) * 2 - 1
    dist = math.sqrt(nx * nx + ny * ny)
    
    # Background
    if is_maskable:
        # Full-bleed solid dark background for maskable
        bg_r, bg_g, bg_b, bg_a = 5, 5, 8, 255
    else:
        # Rounded squircle background for standard icons
        # Corner radius roughly 22%
        corner_limit = 0.88
        ax, ay = abs(nx), abs(ny)
        if ax > corner_limit and ay > corner_limit:
            cdist = math.sqrt((ax - corner_limit)**2 + (ay - corner_limit)**2)
            if cdist > (1.0 - corner_limit):
                return 0, 0, 0, 0
        bg_r, bg_g, bg_b, bg_a = 9, 9, 12, 255

    scale = 0.70 if is_maskable else 0.85
    r_dist = dist / scale

    # Outer cyan ring glow
    if 0.65 <= r_dist <= 0.85:
        alpha = int(255 * (1.0 - abs(r_dist - 0.75) / 0.10))
        return 6, 182, 212, max(bg_a, alpha)
    
    # Inner glowing sphere / pulse
    if r_dist < 0.45:
        # Gradient from Cyan (center) to Teal (outer)
        t = r_dist / 0.45
        r = int(6 * (1 - t) + 16 * t)
        g = int(220 * (1 - t) + 185 * t)
        b = int(240 * (1 - t) + 129 * t)
        return r, g, b, 255
        
    # Subtle inner dark ring
    if 0.45 <= r_dist < 0.65:
        # Dark pod
        return 18, 24, 38, 255

    return bg_r, bg_g, bg_b, bg_a

os.makedirs('public', exist_ok=True)

# Generate 192x192
png_192 = make_png(192, 192, lambda x, y, w, h: draw_focusflow_icon(x, y, w, h, is_maskable=False))
with open('public/pwa-192x192.png', 'wb') as f:
    f.write(png_192)
print("Generated public/pwa-192x192.png (", len(png_192), "bytes )")

# Generate 512x512
png_512 = make_png(512, 512, lambda x, y, w, h: draw_focusflow_icon(x, y, w, h, is_maskable=False))
with open('public/pwa-512x512.png', 'wb') as f:
    f.write(png_512)
print("Generated public/pwa-512x512.png (", len(png_512), "bytes )")

# Generate 512x512 Maskable
png_maskable = make_png(512, 512, lambda x, y, w, h: draw_focusflow_icon(x, y, w, h, is_maskable=True))
with open('public/pwa-maskable-512x512.png', 'wb') as f:
    f.write(png_maskable)
print("Generated public/pwa-maskable-512x512.png (", len(png_maskable), "bytes )")

# Generate 180x180 Apple Touch Icon
png_apple = make_png(180, 180, lambda x, y, w, h: draw_focusflow_icon(x, y, w, h, is_maskable=False))
with open('public/apple-touch-icon.png', 'wb') as f:
    f.write(png_apple)
print("Generated public/apple-touch-icon.png (", len(png_apple), "bytes )")
