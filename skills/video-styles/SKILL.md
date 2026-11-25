---
name: video-styles
description: >
  Film styles made entirely in code: 49 visual styles (pixel RPG, blueprint, ukiyo-e,
  Swiss motion, whiteboard explainer and more) with a live gallery to pick one, and the
  engines that render a silent 1080p video from a style. Optional install (about 28 MB).
description_pt-BR: >
  Estilos de vídeo feitos inteiramente em código: 49 estilos visuais (RPG em pixel, planta
  técnica, ukiyo-e, motion design suíço, explicação em quadro branco e outros), uma galeria
  ao vivo para escolher e os motores que renderizam um vídeo mudo em 1080p a partir de um
  estilo. Instalação opcional (cerca de 28 MB).
description_es: >
  Estilos de video hechos enteramente en código: 49 estilos visuales (RPG en píxeles, plano
  técnico, ukiyo-e, motion design suizo, pizarra explicativa y más), una galería en vivo para
  elegir y los motores que renderizan un video mudo en 1080p a partir de un estilo.
  Instalación opcional (unos 28 MB).
type: script
version: "1.0.0"
optional: true
size: "28 MB"
script:
  path: scripts/galeria.mjs
  runtime: node
  invoke: "node {skill_path}/scripts/galeria.mjs"
categories: [video, reels, motion-design, animation]
---

# Video Styles

Short films drawn frame by frame in code. Each style is a web page that draws any moment
of its film on request; the engines step through it and turn the frames into a video.
No video file, AI image or stock footage is needed to make a film in these styles.

## When to use

- The user wants a Reel, short, explainer, opener or animation and is choosing a look.
- The user asks which video styles exist, or wants to see them.
- A squad step produces a video in one of these styles.

## Files

```
skills/video-styles/
├── gallery/            Gallery page (index.html), style list (estilos.js), thumbnails (capas/)
├── styles/<slug>/      One folder per style
│   ├── style.json      Name, category, uses, film length
│   ├── FICHA.md        Style sheet in pt-BR: look, uses, where the content lives
│   └── demo/           The style's code: index.html + .js, fonts, data, CREDITS
├── core/               Engines: render/ (frames, video, stills, mux), lib.js (easing, noise),
│                       three/ (3D post-processing), post/ (CRT), fonts/
└── scripts/galeria.mjs Local server for the gallery
```

Every page follows one contract: `window.READY = true` once loaded, `window.DUR` is the film
length in seconds, and `window.render(t)` draws the frame at second `t` (deterministic).

## Instructions

### 1. Show the gallery

Run from the project root:

```bash
node skills/video-styles/scripts/galeria.mjs
```

It installs the skill's two dependencies on first run (`three`, `playwright-core`), starts a
local server and opens the gallery in the browser. Each card plays its style live, drawn by its
own code. Tell the user to click a card to watch it, and to tell you the style they want.
Stop the server (Ctrl+C or end the background task) when they are done.

The style list with names, categories and uses in Portuguese is in `gallery/estilos.js`;
`styles/<slug>/style.json` has the original data.

### 2. Make a film in a style

1. Read `styles/<slug>/FICHA.md` when it exists (pt-BR): what the style is good for, where
   its content lives, what to change and what to keep.
2. Copy the style's `demo/` folder into the run's output, e.g.
   `squads/{squad}/output/{run}/film/`. Never edit the original under `skills/`.
3. Read the copied code to find where the content lives: on-screen text, numbers, scene order
   and timing are usually in `film.js`, `main.js`, `timeline.json` or `lines.json`.
   Change the content, keep the drawing code. Keep text in Portuguese (pt-BR) with accents.
4. Check frames before rendering the whole film:
   ```bash
   node skills/video-styles/core/render/still.mjs <film-folder> 2 8 15 --out <film-folder>/stills
   ```
   Look at the stills; fix overlaps, cut-off text and empty frames.
5. Render the video (silent, 24 fps, 1920×1080; `--size 1080x1920` for vertical when the
   style's code supports it):
   ```bash
   node skills/video-styles/core/render/video.mjs <film-folder> --fps 24 --workers 3 --out <film-folder>/out/video.mp4
   ```
6. Hand over the `.mp4`. Sound is added outside this skill (the user's own audio flow).

Rendering needs `ffmpeg` on the PATH and, once per machine, the headless browser that matches
the skill's `playwright-core` (about 100 MB; ask the user before the first download):

```bash
npm --prefix skills/video-styles run setup-render
```

If the engine says "the headless browser for playwright-core … is not installed", run that command.

### Notes

- Fonts are subsets: each style's fonts hold the characters its demo uses plus Latin and
  Portuguese accents. If new text shows boxes or fallback letters, the font is missing that
  character; tell the user rather than switching the style's typeface silently.
- Some 3D styles read `?ssaa=1` to render faster at lower quality; use it only for previews.

## Credits and licence

The engines and the styles' code come from Lemo-Opuscar by Lemomo (LemoLab),
https://github.com/lemomo-ai/lemo-opuscar, under the MIT licence (`LICENSE-LEMO-OPUSCAR.txt`).
Only that MIT code is included: the original style guides and docs are not. Fonts keep their own
licences (SIL OFL 1.1; `core/fonts/OFL.md` and each demo's `CREDITS`). Third-party footage and data
used by a few demos (City Symphony, Countdown, Telestrator, Data Storytelling) keep their licences,
named in that demo's `CREDITS`. Films the user makes with these styles are theirs.
