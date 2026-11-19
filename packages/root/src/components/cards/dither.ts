/**
 * The lang docs background, ported to fill one element: soft blobs drift and are drawn as an
 * ordered (Bayer) dither, one canvas pixel per 4 CSS pixels, strongest at the sides.
 * Draws only while on screen, and once with reduced motion.
 */
const CELL = 4
const BAYER = [
  0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3,
  35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21,
].map((v) => (v + 0.5) / 64)

const BLOBS = [
  { x: 0.04, y: 0.2, r: 0.22, sx: 0.05, sy: 0.12, px: 11, py: 15 },
  { x: 0.97, y: 0.35, r: 0.26, sx: 0.04, sy: 0.15, px: 18, py: 13 },
  { x: 0.9, y: 0.92, r: 0.2, sx: 0.07, sy: 0.08, px: 14, py: 20 },
  { x: 0.12, y: 0.85, r: 0.18, sx: 0.06, sy: 0.1, px: 21, py: 9 },
]

export function initDither(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches
  let w = 0
  let h = 0
  let img = ctx.createImageData(1, 1)
  let rgb = [160, 120, 255]
  let visible = false

  function readColor() {
    ctx!.fillStyle = getComputedStyle(canvas).color
    ctx!.fillRect(0, 0, 1, 1)
    const [r = 0, g = 0, b = 0] = ctx!.getImageData(0, 0, 1, 1).data
    rgb = [r, g, b]
  }
  function resize() {
    w = Math.max(1, Math.ceil(canvas.clientWidth / CELL))
    h = Math.max(1, Math.ceil(canvas.clientHeight / CELL))
    canvas.width = w
    canvas.height = h
    img = ctx!.createImageData(w, h)
    readColor()
    draw(performance.now() / 1000)
  }

  function draw(t: number) {
    const data = img.data
    const blobs = BLOBS.map((b) => ({
      x: (b.x + Math.sin(t / b.px) * b.sx) * w,
      y: (b.y + Math.cos(t / b.py) * b.sy) * h,
      r2: (b.r * Math.max(w, h)) ** 2,
    }))
    const [r = 0, g = 0, bl = 0] = rgb
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let v = 0
        for (const b of blobs) v += Math.exp(-((x - b.x) ** 2 + (y - b.y) ** 2) / b.r2)
        // keep the middle quiet, where the text is
        const side = Math.abs(x / w - 0.5) * 2
        v *= side * side
        const i = (y * w + x) * 4
        data[i] = r
        data[i + 1] = g
        data[i + 2] = bl
        data[i + 3] = Math.min(0.35, v * 0.5) > (BAYER[(y & 7) * 8 + (x & 7)] ?? 1) ? 255 : 0
      }
    }
    ctx!.putImageData(img, 0, 0)
  }

  new ResizeObserver(resize).observe(canvas)
  new MutationObserver(() => (readColor(), draw(performance.now() / 1000))).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  })
  new IntersectionObserver(([entry]) => (visible = !!entry?.isIntersecting)).observe(canvas)
  if (still) return

  let last = 0
  const loop = (now: number) => {
    requestAnimationFrame(loop)
    if (!visible || document.hidden || now - last < 50) return
    last = now
    draw(now / 1000)
  }
  requestAnimationFrame(loop)
}
