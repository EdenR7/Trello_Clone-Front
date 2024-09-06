export const hexToRgb = (hex: string): [number, number, number] => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [0, 0, 0];
};

export const rgbToHex = (r: number, g: number, b: number): string =>
  "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

export const hslToHex = (h: number, s: number, l: number): string => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

export const rgbToHsl = (
  r: number,
  g: number,
  b: number
): [number, number, number] => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s! * 100), Math.round(l * 100)];
};

export const hslToRgb = (
  h: number,
  s: number,
  l: number
): [number, number, number] => {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [
    Math.round(255 * f(0)),
    Math.round(255 * f(8)),
    Math.round(255 * f(4)),
  ];
};

const getHoverColor = (backgroundColor: string): string => {
  // Convert the background color to RGB
  const rgb = hexToRgb(backgroundColor);

  // Calculate the perceived brightness of the background color
  // Using the formula: (R * 299 + G * 587 + B * 114) / 1000
  const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;

  // Define the hover colors
  const lightHover = "rgba(255, 255, 255, 0.2)"; // Subtle white
  const darkHover = "rgba(0, 0, 0, 0.1)"; // Subtle gray

  // Choose the hover color based on the brightness
  // If the background is dark (brightness < 128), use light hover color
  // Otherwise, use dark hover color
  return brightness < 128 ? lightHover : darkHover;
};

export default getHoverColor;

export const getHoverColorForButton = (backgroundColor: string): string => {
  // Function to extract the RGB values from an rgba() string

  // Convert the background color to RGB
  const rgb = hexToRgb(backgroundColor);

  // Calculate the perceived brightness of the background color
  const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;

  // Define the hover colors
  const lightHover = "rgba(255, 255, 255, 0.3)"; // Subtle white
  const darkHover = "rgba(0, 0, 0, 0.2)"; // Subtle gray

  // Choose the hover color based on brightness
  return brightness < 128 ? lightHover : darkHover;
};
