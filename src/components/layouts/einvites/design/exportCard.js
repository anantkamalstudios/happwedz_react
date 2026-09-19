import {
  CARD_WIDTH,
  SLIDE_DISTANCE,
  animationFrameCount,
  entranceState,
  fontStack,
  loadFonts,
  pageAspect,
  pageFonts,
} from "./einviteDesign";

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not load the card background"));
    image.src = src;
  });

const wrapParagraph = (ctx, paragraph, maxWidth) => {
  if (!maxWidth) return [paragraph];
  const words = paragraph.split(" ");
  const lines = [];
  let line = "";
  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(candidate).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  });
  lines.push(line);
  return lines;
};

// Mirrors fieldTextStyle in EinvitePage.jsx on a canvas.
const drawField = (ctx, field, scale, width, height) => {
  const text = field.uppercase ? field.defaultText.toUpperCase() : field.defaultText;
  if (!text) return;

  const fontSize = field.fontSize * scale;
  ctx.font = `${field.fontStyle} ${field.fontWeight} ${fontSize}px ${fontStack(field.fontFamily)}`;
  ctx.fillStyle = field.color;
  ctx.textBaseline = "middle";
  if ("letterSpacing" in ctx) ctx.letterSpacing = `${field.letterSpacing * scale}px`;

  const boxLeft = field.x * width;
  const boxWidth = field.width ? field.width * width : null;
  const lines = text.split("\n").flatMap((paragraph) => wrapParagraph(ctx, paragraph, boxWidth));

  let anchorX = boxLeft;
  ctx.textAlign = "left";
  if (boxWidth && field.align === "center") {
    ctx.textAlign = "center";
    anchorX = boxLeft + boxWidth / 2;
  } else if (boxWidth && field.align === "right") {
    ctx.textAlign = "right";
    anchorX = boxLeft + boxWidth;
  }

  const lineHeight = fontSize * field.lineHeight;
  const top = field.y * height;
  lines.forEach((line, index) => {
    ctx.fillText(line, anchorX, top + lineHeight * (index + 0.5));
  });
};

// `transparent` draws only the text (the layers laid over a video).
export const renderPageToCanvas = async (page, outputWidth = CARD_WIDTH, { transparent = false } = {}) => {
  const width = Math.round(outputWidth);
  const height = Math.round(outputWidth * pageAspect(page));
  const scale = width / CARD_WIDTH;

  await loadFonts(pageFonts(page));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!transparent) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
  }
  if (page.backgroundUrl && !transparent) {
    const background = await loadImage(page.backgroundUrl);
    ctx.drawImage(background, 0, 0, width, height);
  }

  (page.fields || []).forEach((field) => drawField(ctx, field, scale, width, height));
  return canvas;
};

const slug = (value) =>
  String(value || "invitation")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "invitation";

const saveCanvas = (canvas, fileName) =>
  new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Could not create the image"));
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      resolve();
    }, "image/png");
  });

// Downloads each page as a full-resolution PNG.
export const downloadCardPages = async (cardName, pages, pageIndexes) => {
  const indexes = pageIndexes || pages.map((_, index) => index);
  for (const index of indexes) {
    const canvas = await renderPageToCanvas(pages[index], CARD_WIDTH);
    const suffix = pages.length > 1 ? `-page-${index + 1}` : "";
    await saveCanvas(canvas, `${slug(cardName)}${suffix}.png`);
  }
};

const canvasBlob = (canvas) =>
  new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Could not create the image"))), "image/png");
  });

// ----- Video text layers -----

const VIDEO_OUT_WIDTH = 720;
const LAYER_FPS = 15;

// The box a text box occupies (as in fieldTextStyle): its left/top, fixed width
// or widest line, and the height of its lines. Animations scale around its
// centre and "reveal" clips across it, like the CSS in the player.
const fieldBox = (ctx, field, scale, width, height) => {
  const fontSize = field.fontSize * scale;
  ctx.font = `${field.fontStyle} ${field.fontWeight} ${fontSize}px ${fontStack(field.fontFamily)}`;
  if ("letterSpacing" in ctx) ctx.letterSpacing = `${field.letterSpacing * scale}px`;
  const text = field.uppercase ? field.defaultText.toUpperCase() : field.defaultText;
  const boxWidth = field.width ? field.width * width : null;
  const lines = text.split("\n").flatMap((paragraph) => wrapParagraph(ctx, paragraph, boxWidth));
  const w = boxWidth || Math.max(...lines.map((line) => ctx.measureText(line).width), 1);
  const h = lines.length * fontSize * field.lineHeight;
  return { x: field.x * width, y: field.y * height, w, h };
};

// Draws one text box in an animation state onto ctx (already offset to the crop).
const drawFieldState = (ctx, field, scale, width, height, state, box) => {
  ctx.save();
  ctx.globalAlpha = state.opacity;
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  ctx.translate(cx, cy + state.dy * scale);
  ctx.scale(state.scale, state.scale);
  ctx.translate(-cx, -cy);
  if (state.reveal < 1) {
    ctx.beginPath();
    ctx.rect(box.x, box.y - box.h * 0.5, box.w * state.reveal, box.h * 2);
    ctx.clip();
  }
  drawField(ctx, field, scale, width, height);
  ctx.restore();
};

// Smallest rectangle holding every visible pixel of a canvas, or null.
const inkBounds = (canvas) => {
  const { width, height } = canvas;
  const data = canvas.getContext("2d").getImageData(0, 0, width, height).data;
  let x0 = width;
  let y0 = height;
  let x1 = -1;
  let y1 = -1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (data[(y * width + x) * 4 + 3] > 0) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  return x1 < 0 ? null : { x0, y0, x1, y1 };
};

// Every text box of a video as a small transparent PNG (plus the frames of its
// entrance animation), with where it goes. The server lays them over the video.
// Returns { layers: [{ scene, field, frames, fps, x, y }], blobs } — blobs in layer order.
export const renderVideoLayers = async (pages) => {
  const width = VIDEO_OUT_WIDTH;
  const layers = [];
  const blobs = [];

  for (let sceneIndex = 0; sceneIndex < pages.length; sceneIndex += 1) {
    const page = pages[sceneIndex];
    const height = Math.round(width * pageAspect(page));
    const scale = width / CARD_WIDTH;
    await loadFonts(pageFonts(page));

    for (const field of page.fields || []) {
      if (!String(field.defaultText || "").trim()) continue;
      const animation = field.animation || "fade";

      // Where the finished text sits, then room for where it moves from.
      const full = document.createElement("canvas");
      full.width = width;
      full.height = height;
      const fullCtx = full.getContext("2d");
      const box = fieldBox(fullCtx, field, scale, width, height);
      drawFieldState(fullCtx, field, scale, width, height, entranceState("none", 0), box);
      const ink = inkBounds(full);
      if (!ink) continue;
      const pad = 6;
      const slide = animation === "slide-up" ? Math.ceil(SLIDE_DISTANCE * scale) : 0;
      const crop = {
        x: Math.max(0, ink.x0 - pad),
        y: Math.max(0, ink.y0 - pad),
      };
      crop.w = Math.min(width, ink.x1 + pad + 1) - crop.x;
      crop.h = Math.min(height, ink.y1 + pad + 1 + slide) - crop.y;

      const frames = animationFrameCount(animation, LAYER_FPS);
      for (let frame = 0; frame < frames; frame += 1) {
        const state = frames === 1 ? entranceState("none", 0) : entranceState(animation, frame / LAYER_FPS);
        const canvas = document.createElement("canvas");
        canvas.width = crop.w;
        canvas.height = crop.h;
        const ctx = canvas.getContext("2d");
        ctx.translate(-crop.x, -crop.y);
        drawFieldState(ctx, field, scale, width, height, state, box);
        blobs.push(await canvasBlob(canvas));
      }
      layers.push({ scene: sceneIndex, field: field.id, frames, fps: LAYER_FPS, x: crop.x, y: crop.y });
    }
  }
  return { layers, blobs };
};
