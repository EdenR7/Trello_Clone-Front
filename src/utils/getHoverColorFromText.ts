import { hexToRgb } from "./getTextColorFromBg";

function adjustColorBrightness(hex: string, amount: number): string {
  let { r, g, b } = hexToRgb(hex) || { r: 0, g: 0, b: 0 };

  r = Math.min(255, Math.max(0, r + amount));
  g = Math.min(255, Math.max(0, g + amount));
  b = Math.min(255, Math.max(0, b + amount));

  return `rgb(${r}, ${g}, ${b})`;
}

// Determine hover background color based on original background color
export function getHoverColorForBackground(
  bgColor: string,
  isTextWhite: boolean
): string {
  const amount = isTextWhite ? -20 : 20; // Darken if text is white, lighten if text is black
  return adjustColorBrightness(bgColor, amount);
}
