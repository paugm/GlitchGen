export const DEFAULT_FONT = "VT323";

export const CANVAS_FONTS = [
  {
    value: "VT323",
    label: "VT323",
    stack: "VT323, monospace",
  },
  {
    value: "Press Start 2P",
    label: "Press Start 2P",
    stack: '"Press Start 2P", cursive',
  },
  {
    value: "Comic Neue",
    label: "Comic Neue",
    stack: '"Comic Neue", "Comic Sans MS", cursive',
  },
  {
    value: "Comic Sans MS",
    label: "Comic Sans MS",
    stack: '"Comic Sans MS", "Comic Neue", cursive',
  },
  {
    value: "Silkscreen",
    label: "Silkscreen",
    stack: "Silkscreen, sans-serif",
  },
  {
    value: "Special Elite",
    label: "Special Elite",
    stack: '"Special Elite", serif',
  },
  {
    value: "Impact",
    label: "Impact",
    stack: 'Impact, Haettenschweiler, "Arial Black", sans-serif',
  },
];

export const GOOGLE_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=VT323&family=Press+Start+2P&family=Comic+Neue&family=Silkscreen&family=Special+Elite&display=swap";

/**
 * CSS font-family stack for a picker value, including legacy saved names.
 * @param {string} name
 * @returns {string}
 */
export function cssFontFamily(name) {
  const found = CANVAS_FONTS.find((font) => font.value === name);
  if (found) return found.stack;
  if (!name) return CANVAS_FONTS[0].stack;
  if (/\s/.test(name)) return `"${name}", sans-serif`;
  return `${name}, sans-serif`;
}
