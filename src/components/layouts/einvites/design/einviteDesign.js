// Shared e-invite design format. The admin panel keeps a copy of this file
// (happywedz_admin_new/src/pages/eInvites/design/einviteDesign.js); keep the two
// in sync so a card looks identical wherever it is drawn.
//
// A card has pages: [{ id, name, backgroundUrl, fields: [field] }]. Every page is
// drawn in a CARD_WIDTH × CARD_HEIGHT design space:
//   x, y, width  – fractions of the card width/height (width null = fit text)
//   fontSize, letterSpacing – pixels on a CARD_WIDTH-wide card

export const CARD_WIDTH = 1000;
export const CARD_HEIGHT = 1400;

export const CARD_TYPES = [
  { value: "wedding_einvite", label: "Wedding Cards", title: "Wedding Cards" },
  { value: "save_the_date", label: "Save the Date Cards", title: "Save the Date Cards" },
  { value: "video", label: "Video Cards", title: "Video Invitations" },
];

export const CULTURES = [
  "Hindu",
  "Muslim",
  "Sikh",
  "Christian",
  "South Indian",
  "Marathi",
  "Bengali",
  "Gujarati",
];

export const THEMES = [
  "Floral",
  "Royal",
  "Traditional",
  "Minimal",
  "Beach & Destination",
  "Illustrated",
  "Modern",
  "Vintage",
];

// Google Fonts with the weights each family actually ships (css2 rejects a
// request for a weight a family does not have).
export const FONT_LIBRARY = [
  { family: "Great Vibes", category: "Script", weights: [400] },
  { family: "Parisienne", category: "Script", weights: [400] },
  { family: "Alex Brush", category: "Script", weights: [400] },
  { family: "Pinyon Script", category: "Script", weights: [400] },
  { family: "Allura", category: "Script", weights: [400] },
  { family: "Italianno", category: "Script", weights: [400] },
  { family: "Rouge Script", category: "Script", weights: [400] },
  { family: "Sacramento", category: "Script", weights: [400] },
  { family: "Tangerine", category: "Script", weights: [400, 700] },
  { family: "Dancing Script", category: "Script", weights: [400, 700] },
{ family: "Satisfy", category: "Script", weights: [400] },
  { family: "Pacifico", category: "Script", weights: [400] },
  { family: "Kaushan Script", category: "Script", weights: [400] },
  { family: "Mr De Haviland", category: "Script", weights: [400] },
  { family: "Monsieur La Doulaise", category: "Script", weights: [400] },
  { family: "Herr Von Muellerhoff", category: "Script", weights: [400] },
  { family: "Petit Formal Script", category: "Script", weights: [400] },
  { family: "Arizonia", category: "Script", weights: [400] },
  { family: "Lavishly Yours", category: "Script", weights: [400] },
  { family: "Imperial Script", category: "Script", weights: [400] },
  { family: "Ballet", category: "Script", weights: [400] },
  { family: "WindSong", category: "Script", weights: [400, 500] },
  { family: "Corinthia", category: "Script", weights: [400, 700] },
  { family: "Carattere", category: "Script", weights: [400] },
  { family: "Luxurious Script", category: "Script", weights: [400] },
  { family: "Clicker Script", category: "Script", weights: [400] },
  { family: "Yellowtail", category: "Script", weights: [400] },
  { family: "Cookie", category: "Script", weights: [400] },
  { family: "Niconne", category: "Script", weights: [400] },
  { family: "Courgette", category: "Script", weights: [400] },
  { family: "Marck Script", category: "Script", weights: [400] },
  { family: "Style Script", category: "Script", weights: [400] },
  { family: "Ephesis", category: "Script", weights: [400] },
  { family: "Playball", category: "Script", weights: [400] },
  { family: "Meddon", category: "Script", weights: [400] },
  { family: "Rochester", category: "Script", weights: [400] },
  { family: "Bilbo Swash Caps", category: "Script", weights: [400] },
  { family: "Playfair Display", category: "Serif", weights: [400, 700] },
  { family: "Cormorant Garamond", category: "Serif", weights: [400, 700] },
  { family: "Cormorant Upright", category: "Serif", weights: [400, 700] },
  { family: "EB Garamond", category: "Serif", weights: [400, 700] },
  { family: "Libre Baskerville", category: "Serif", weights: [400, 700] },
  { family: "Lora", category: "Serif", weights: [400, 700] },
  { family: "Cinzel", category: "Serif", weights: [400, 700] },
  { family: "Cormorant SC", category: "Serif", weights: [400, 700] },
  { family: "Marcellus", category: "Serif", weights: [400] },
  { family: "Cormorant", category: "Serif", weights: [400, 700] },
  { family: "Cinzel Decorative", category: "Serif", weights: [400, 700] },
  { family: "Prata", category: "Serif", weights: [400] },
  { family: "Gilda Display", category: "Serif", weights: [400] },
  { family: "Bodoni Moda", category: "Serif", weights: [400, 700] },
  { family: "DM Serif Display", category: "Serif", weights: [400] },
  { family: "Playfair Display SC", category: "Serif", weights: [400, 700] },
  { family: "Old Standard TT", category: "Serif", weights: [400, 700] },
  { family: "Crimson Text", category: "Serif", weights: [400, 700] },
  { family: "Spectral", category: "Serif", weights: [400, 700] },
  { family: "Italiana", category: "Serif", weights: [400] },
  { family: "Forum", category: "Serif", weights: [400] },
  { family: "Yeseva One", category: "Serif", weights: [400] },
  { family: "Cardo", category: "Serif", weights: [400, 700] },
  { family: "Bellefair", category: "Serif", weights: [400] },
  { family: "Noto Serif Display", category: "Serif", weights: [400, 700] },
  { family: "Rufina", category: "Serif", weights: [400, 700] },
  { family: "Oswald", category: "Sans", weights: [400, 700] },
  { family: "Montserrat", category: "Sans", weights: [400, 700] },
  { family: "Josefin Sans", category: "Sans", weights: [400, 700] },
  { family: "Poppins", category: "Sans", weights: [400, 700] },
  { family: "Philosopher", category: "Sans", weights: [400, 700] },
  { family: "Raleway", category: "Sans", weights: [400, 700] },
  { family: "Lato", category: "Sans", weights: [400, 700] },
  { family: "Quicksand", category: "Sans", weights: [400, 700] },
  { family: "Nunito", category: "Sans", weights: [400, 700] },
  { family: "Tenor Sans", category: "Sans", weights: [400] },
  { family: "Jost", category: "Sans", weights: [400, 700] },
  { family: "Julius Sans One", category: "Sans", weights: [400] },
  { family: "Questrial", category: "Sans", weights: [400] },
  { family: "Mulish", category: "Sans", weights: [400, 700] },
  { family: "Work Sans", category: "Sans", weights: [400, 700] },
  { family: "Comfortaa", category: "Sans", weights: [400, 700] },
  { family: "Abril Fatface", category: "Display", weights: [400] },
  { family: "Bebas Neue", category: "Display", weights: [400] },
  { family: "Limelight", category: "Display", weights: [400] },
  { family: "Poiret One", category: "Display", weights: [400] },
  { family: "Federo", category: "Display", weights: [400] },
  { family: "Fredericka the Great", category: "Display", weights: [400] },
  { family: "Berkshire Swash", category: "Display", weights: [400] },
  { family: "Aboreto", category: "Display", weights: [400] },
  { family: "Lobster", category: "Display", weights: [400] },
  { family: "Rye", category: "Display", weights: [400] },
  { family: "Monoton", category: "Display", weights: [400] },
  { family: "Tiro Devanagari Hindi", category: "Hindi / Marathi", weights: [400] },
  { family: "Yatra One", category: "Hindi / Marathi", weights: [400] },
  { family: "Martel", category: "Hindi / Marathi", weights: [400, 700] },
  { family: "Rozha One", category: "Hindi / Marathi", weights: [400] },
  { family: "Kalam", category: "Hindi / Marathi", weights: [400, 700] },
  { family: "Amita", category: "Hindi / Marathi", weights: [400, 700] },
  { family: "Eczar", category: "Hindi / Marathi", weights: [400, 700] },
  { family: "Hind", category: "Hindi / Marathi", weights: [400, 700] },
  { family: "Mukta", category: "Hindi / Marathi", weights: [400, 700] },
  { family: "Baloo 2", category: "Hindi / Marathi", weights: [400, 700] },
  { family: "Khand", category: "Hindi / Marathi", weights: [400, 700] },
  { family: "Laila", category: "Hindi / Marathi", weights: [400, 700] },
  { family: "Sahitya", category: "Hindi / Marathi", weights: [400, 700] },
  { family: "Kurale", category: "Hindi / Marathi", weights: [400] },
  { family: "Karma", category: "Hindi / Marathi", weights: [400, 700] },
  { family: "Noto Serif Devanagari", category: "Hindi / Marathi", weights: [400, 700] },
  { family: "Gotu", category: "Hindi / Marathi", weights: [400] },
  { family: "Modak", category: "Hindi / Marathi", weights: [400] },
  { family: "Sura", category: "Hindi / Marathi", weights: [400, 700] },
  { family: "Arya", category: "Hindi / Marathi", weights: [400, 700] },
  { family: "Teko", category: "Hindi / Marathi", weights: [400, 700] },
  { family: "Palanquin Dark", category: "Hindi / Marathi", weights: [400, 700] },
  { family: "Hind Vadodara", category: "Gujarati", weights: [400, 700] },
  { family: "Mukta Vaani", category: "Gujarati", weights: [400, 700] },
  { family: "Baloo Bhai 2", category: "Gujarati", weights: [400, 700] },
  { family: "Rasa", category: "Gujarati", weights: [400, 700] },
  { family: "Farsan", category: "Gujarati", weights: [400] },
  { family: "Kumar One", category: "Gujarati", weights: [400] },
  { family: "Noto Serif Gujarati", category: "Gujarati", weights: [400, 700] },
  { family: "Baloo Paaji 2", category: "Punjabi", weights: [400, 700] },
  { family: "Mukta Mahee", category: "Punjabi", weights: [400, 700] },
  { family: "Noto Sans Gurmukhi", category: "Punjabi", weights: [400, 700] },
  { family: "Noto Serif Gurmukhi", category: "Punjabi", weights: [400, 700] },
  { family: "Hind Siliguri", category: "Bengali", weights: [400, 700] },
  { family: "Baloo Da 2", category: "Bengali", weights: [400, 700] },
  { family: "Galada", category: "Bengali", weights: [400] },
  { family: "Tiro Bangla", category: "Bengali", weights: [400] },
  { family: "Atma", category: "Bengali", weights: [400, 700] },
  { family: "Noto Serif Bengali", category: "Bengali", weights: [400, 700] },
  { family: "Catamaran", category: "Tamil", weights: [400, 700] },
  { family: "Baloo Thambi 2", category: "Tamil", weights: [400, 700] },
  { family: "Mukta Malar", category: "Tamil", weights: [400, 700] },
  { family: "Pavanam", category: "Tamil", weights: [400] },
  { family: "Tiro Tamil", category: "Tamil", weights: [400] },
  { family: "Noto Serif Tamil", category: "Tamil", weights: [400, 700] },
  { family: "Ramabhadra", category: "Telugu", weights: [400] },
  { family: "Mallanna", category: "Telugu", weights: [400] },
  { family: "Baloo Tammudu 2", category: "Telugu", weights: [400, 700] },
  { family: "Mandali", category: "Telugu", weights: [400] },
  { family: "Tiro Telugu", category: "Telugu", weights: [400] },
  { family: "NTR", category: "Telugu", weights: [400] },
  { family: "Suranna", category: "Telugu", weights: [400] },
  { family: "Baloo Tamma 2", category: "Kannada", weights: [400, 700] },
  { family: "Tiro Kannada", category: "Kannada", weights: [400] },
  { family: "Noto Serif Kannada", category: "Kannada", weights: [400, 700] },
  { family: "Hind Mysuru", category: "Kannada", weights: [400, 700] },
  { family: "Baloo Chettan 2", category: "Malayalam", weights: [400, 700] },
  { family: "Manjari", category: "Malayalam", weights: [400, 700] },
  { family: "Gayathri", category: "Malayalam", weights: [400, 700] },
  { family: "Noto Serif Malayalam", category: "Malayalam", weights: [400, 700] },
  { family: "Noto Nastaliq Urdu", category: "Urdu", weights: [400, 700] },
  { family: "Gulzar", category: "Urdu", weights: [400] },
];

export const FONT_CATEGORIES = [...new Set(FONT_LIBRARY.map((font) => font.category))];

const SYSTEM_FONTS = new Set(
  [
    "arial",
    "helvetica",
    "times new roman",
    "georgia",
    "verdana",
    "courier new",
    "brush script mt",
    "serif",
    "sans-serif",
    "cursive",
    "monospace",
  ]
);

export const fontStack = (family) =>
  `"${String(family || "Playfair Display").replace(/"/g, "")}", Georgia, serif`;

// ---------------------------------------------------------------------------
// Font loading
// ---------------------------------------------------------------------------

const fontLoads = new Map();

const googleFontHref = (family) => {
  const known = FONT_LIBRARY.find((font) => font.family === family);
  const name = encodeURIComponent(family).replace(/%20/g, "+");
  const weights = known ? known.weights.join(";") : null;
  return `https://fonts.googleapis.com/css2?family=${name}${weights ? `:wght@${weights}` : ""}&display=swap`;
};

// One stylesheet per family so a single unknown font can't break the others.
export const loadFont = (family) => {
  if (!family || typeof document === "undefined") return Promise.resolve();
  if (SYSTEM_FONTS.has(String(family).toLowerCase())) return Promise.resolve();
  if (fontLoads.has(family)) return fontLoads.get(family);

  const load = new Promise((resolve) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = googleFontHref(family);
    link.onload = () => {
      const known = FONT_LIBRARY.find((font) => font.family === family);
      const weights = known ? known.weights : [400];
      Promise.all(
        weights.map((weight) =>
          document.fonts ? document.fonts.load(`${weight} 32px "${family}"`) : null
        )
      )
        .catch(() => {})
        .finally(resolve);
    };
    link.onerror = () => resolve();
    document.head.appendChild(link);
  });

  fontLoads.set(family, load);
  return load;
};

export const loadFonts = (families) =>
  Promise.all([...new Set((families || []).filter(Boolean))].map(loadFont));

export const pageFonts = (page) => (page?.fields || []).map((field) => field.fontFamily);

export const cardFonts = (pages) => (pages || []).flatMap(pageFonts);

// ---------------------------------------------------------------------------
// Card normalisation (including cards saved before the multi-page format)
// ---------------------------------------------------------------------------

const clamp = (value, min, max, fallback) => {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
};

export const normalizeField = (field, index = 0) => ({
  id: field?.id || `field_${Date.now()}_${index}`,
  label: field?.label || `Text ${index + 1}`,
  defaultText: typeof field?.defaultText === "string" ? field.defaultText : "",
  x: clamp(field?.x, -0.5, 1.5, 0.1),
  y: clamp(field?.y, -0.5, 1.5, 0.1),
  width: field?.width === null || field?.width === undefined ? null : clamp(field.width, 0.02, 1.5, 0.8),
  align: ["left", "center", "right"].includes(field?.align) ? field.align : "center",
  fontFamily: field?.fontFamily || "Playfair Display",
  fontSize: clamp(field?.fontSize, 4, 400, 48),
  color: field?.color || "#000000",
  fontWeight: Number(field?.fontWeight) >= 600 ? 700 : 400,
  fontStyle: field?.fontStyle === "italic" ? "italic" : "normal",
  letterSpacing: clamp(field?.letterSpacing, -20, 100, 0),
  lineHeight: clamp(field?.lineHeight, 0.6, 3, 1.2),
  uppercase: field?.uppercase === true,
});

const isTextField = (field) =>
  field && !field.src && field.label !== "image" && field.defaultText !== "image";

const legacyWeight = (value) =>
  value === "bold" || Number(value) >= 600 ? 700 : 400;

// Admin editor v1: 350×500 canvas, text drawn left-aligned from its baseline.
const fromLegacyAdminField = (field, index) => {
  const size = Number(field.fontSize) || 24;
  return normalizeField(
    {
      ...field,
      x: (Number(field.x) || 0) / 350,
      y: ((Number(field.y) || 0) - size * 0.85) / 500,
      width: null,
      align: "left",
      fontSize: (size * CARD_WIDTH) / 350,
      lineHeight: 1.15,
    },
    index
  );
};

// Customer editor v1 (Fabric): 414×659 canvas, positions are the object's
// origin point (top-left unless the text was added centred).
const fromLegacyCustomerField = (field, index) => {
  const width = 414;
  const height = 659.288;
  const size = (Number(field.fontSize) || 30) * (Number(field.scaleX) || 1);
  const centred = field.originX === "center";
  let x = (Number(field.x) || width / 2) / width;
  let y = (Number(field.y) || 100) / height;
  if (field.originY === "center") y -= (size * 1.16) / 2 / height;
  if (centred) x -= 0.4;
  return normalizeField(
    {
      ...field,
      x,
      y,
      width: centred ? 0.8 : null,
      align: centred ? "center" : field.textAlign || "left",
      fontSize: (size * CARD_WIDTH) / width,
      fontWeight: legacyWeight(field.fontWeight),
      lineHeight: 1.16,
    },
    index
  );
};

const parseFields = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

export const getCardPages = (card) => {
  if (!card) return [];

  if (Array.isArray(card.pages) && card.pages.length > 0) {
    return card.pages.map((page, index) => ({
      id: page.id || `page_${index + 1}`,
      name: page.name || `Page ${index + 1}`,
      backgroundUrl: page.backgroundUrl || "",
      fields: parseFields(page.fields).filter(isTextField).map(normalizeField),
    }));
  }

  const fields = parseFields(card.editableFields).filter(isTextField);
  let convert = normalizeField;
  if (!(Number(card.designVersion) >= 2)) {
    convert = card.isTemplate === false ? fromLegacyCustomerField : fromLegacyAdminField;
  }

  return [
    {
      id: "page_1",
      name: "Page 1",
      backgroundUrl: card.backgroundUrl || card.background_url || "",
      fields: fields.map(convert),
    },
  ];
};

export const createField = (overrides = {}) =>
  normalizeField({
    id: `field_${Date.now()}_${Math.round(Math.random() * 1e6)}`,
    label: "New text",
    defaultText: "Your text",
    x: 0.1,
    y: 0.45,
    width: 0.8,
    align: "center",
    fontFamily: "Playfair Display",
    fontSize: 64,
    color: "#3b2a1a",
    lineHeight: 1.2,
    ...overrides,
  });

export const createPage = (index, overrides = {}) => ({
  id: `page_${Date.now()}_${Math.round(Math.random() * 1e6)}`,
  name: `Page ${index + 1}`,
  backgroundUrl: "",
  fields: [],
  ...overrides,
});

export const cardTypeLabel = (value) =>
  CARD_TYPES.find((type) => type.value === value)?.label || "E-Invites";

export const cardPath = (card) => `/einvites/card/${card.slug || card.id}`;
