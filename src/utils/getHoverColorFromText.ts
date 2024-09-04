import { hexToRgb } from "./getTextColorFromBg";

// Convert RGB to hex
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (component: number) => component.toString(16).padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Adjust the color brightness and return hex
function adjustColorBrightness(hex: string, amount: number): string {
  let { r, g, b } = hexToRgb(hex) || { r: 0, g: 0, b: 0 };

  r = Math.min(255, Math.max(0, r + amount));
  g = Math.min(255, Math.max(0, g + amount));
  b = Math.min(255, Math.max(0, b + amount));

  return rgbToHex(r, g, b);
}

// Determine hover background color based on original background color
export function getHoverColorForBackground(
  bgColor: string,
  isTextWhite: boolean
): string {
  const amount = isTextWhite ? -20 : 20; // Darken if text is white, lighten if text is black
  return adjustColorBrightness(bgColor, amount);
}
