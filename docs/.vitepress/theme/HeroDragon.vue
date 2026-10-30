<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { withBase } from 'vitepress'

// The hero's one moment of motion: the dragon assembles from its own pixels,
// left to right, the way the logo's pixels trail off to the left. Runs once.
const SRC = withBase('/brand/bacon-dragon-mark.webp')
const FALLBACK = withBase('/brand/bacon-dragon-mark.png')

// Plays once per page load; client-side navigation back home shows it settled.
let played = false

const canvas = ref<HTMLCanvasElement | null>(null)
const assembling = ref(false)
const done = ref(false)
let raf = 0

onMounted(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (played || reduce || !canvas.value) {
    done.value = true
    return
  }
  played = true
  const img = new Image()
  img.decoding = 'async'
  img.src = SRC
  img.onload = () => run(img)
  img.onerror = () => (done.value = true)
})

onBeforeUnmount(() => cancelAnimationFrame(raf))

function run(img: HTMLImageElement) {
  const cv = canvas.value
  if (!cv) return
  const ctx = cv.getContext('2d')
  if (!ctx) {
    done.value = true
    return
  }
  const S = img.naturalWidth
  cv.width = S
  cv.height = S

  // Read alpha so empty cells are skipped.
  const probe = document.createElement('canvas')
  probe.width = S
  probe.height = S
  const pctx = probe.getContext('2d', { willReadFrequently: true })!
  pctx.drawImage(img, 0, 0)
  const data = pctx.getImageData(0, 0, S, S).data

  const N = 24
  const cell = S / N
  type Block = { sx: number; sy: number; delay: number; dx: number; dy: number }
  const blocks: Block[] = []
  for (let gy = 0; gy < N; gy++) {
    for (let gx = 0; gx < N; gx++) {
      const sx = Math.floor(gx * cell)
      const sy = Math.floor(gy * cell)
      const cx = Math.min(S - 1, Math.floor(sx + cell / 2))
      const cy = Math.min(S - 1, Math.floor(sy + cell / 2))
      let solid = false
      for (let oy = 0; oy < cell && !solid; oy += 4) {
        for (let ox = 0; ox < cell && !solid; ox += 4) {
          const i = ((Math.min(S - 1, sy + oy)) * S + Math.min(S - 1, sx + ox)) * 4 + 3
          if (data[i] > 10) solid = true
        }
      }
      if (!solid && data[(cy * S + cx) * 4 + 3] <= 10) continue
      const t = gx / N
      blocks.push({
        sx,
        sy,
        delay: t * 520 + Math.random() * 380,
        dx: -(40 + Math.random() * 120) * (1 - t * 0.6),
        dy: (Math.random() - 0.5) * 60
      })
    }
  }

  const size = Math.ceil(cell) + 1
  const DUR = 420
  const total = Math.max(...blocks.map((b) => b.delay)) + DUR
  const start = performance.now()
  assembling.value = true

  const ease = (p: number) => 1 - Math.pow(1 - p, 3)
  // Snap to the cell grid while travelling so pieces read as pixels, not a blur.
  const snap = (v: number) => Math.round(v / (cell / 2)) * (cell / 2)

  const frame = (now: number) => {
    const el = now - start
    ctx.clearRect(0, 0, S, S)
    for (const b of blocks) {
      const p = Math.min(1, Math.max(0, (el - b.delay) / DUR))
      if (p <= 0) continue
      const e = ease(p)
      const ox = p < 1 ? snap(b.dx * (1 - e)) : 0
      const oy = p < 1 ? snap(b.dy * (1 - e)) : 0
      ctx.globalAlpha = Math.min(1, p * 2.2)
      ctx.drawImage(img, b.sx, b.sy, size, size, b.sx + ox, b.sy + oy, size, size)
    }
    ctx.globalAlpha = 1
    if (el < total) {
      raf = requestAnimationFrame(frame)
    } else {
      assembling.value = false
      done.value = true
    }
  }
  raf = requestAnimationFrame(frame)
}
</script>

<template>
  <div class="bd-hero-dragon" :class="{ 'is-assembling': assembling, 'is-done': done }">
    <picture>
      <source :srcset="SRC" type="image/webp" />
      <img
        class="bd-hero-dragon__img"
        :src="FALLBACK"
        alt="Bacon Dragon"
        width="640"
        height="640"
        fetchpriority="high"
      />
    </picture>
    <canvas ref="canvas" class="bd-hero-dragon__canvas" aria-hidden="true" />
  </div>
</template>

<style scoped>
.bd-hero-dragon {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 220px;
  aspect-ratio: 1;
  transform: translate(-50%, -58%);
}

@media (min-width: 640px) {
  .bd-hero-dragon {
    width: 280px;
    transform: translate(-50%, -54%);
  }
}

@media (min-width: 960px) {
  .bd-hero-dragon {
    width: 420px;
    transform: translate(-50%, -50%);
  }
}

.bd-hero-dragon picture,
.bd-hero-dragon__img,
.bd-hero-dragon__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.bd-hero-dragon__canvas {
  opacity: 0;
  pointer-events: none;
}

/* With motion allowed (class set in <head> before paint), the static image
   waits for the assembly instead of flashing in first. If scripts never run,
   it reveals itself after a moment anyway. */
:global(html.bd-motion) .bd-hero-dragon:not(.is-done) .bd-hero-dragon__img {
  opacity: 0;
  animation: bd-dragon-fallback 0.3s ease-out 2.5s forwards;
}

.bd-hero-dragon.is-assembling .bd-hero-dragon__img {
  opacity: 0;
  animation: none;
}

@keyframes bd-dragon-fallback {
  to {
    opacity: 1;
  }
}

.bd-hero-dragon.is-assembling .bd-hero-dragon__canvas {
  opacity: 1;
}
</style>
