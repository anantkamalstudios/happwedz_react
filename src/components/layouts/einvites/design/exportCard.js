import { CARD_WIDTH, fontStack, loadFonts, pageAspect, pageFonts } from "./einviteDesign";

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

// One transparent 720×1280 PNG of each scene's text, for the server to lay
// over the video.
export const renderVideoOverlays = async (pages) => {
  const blobs = [];
  for (const page of pages) {
    const canvas = await renderPageToCanvas(page, 720, { transparent: true });
    blobs.push(await canvasBlob(canvas));
  }
  return blobs;
};
