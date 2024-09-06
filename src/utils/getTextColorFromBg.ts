// Helper function to convert hex color to RGB
export function hexToRgb(
  hex: string
): { r: number; g: number; b: number } | null {
  hex = hex.replace(/^#/, "");

  if (hex.length === 3) {
    const r = parseInt(hex.charAt(0) + hex.charAt(0), 16);
    const g = parseInt(hex.charAt(1) + hex.charAt(1), 16);
    const b = parseInt(hex.charAt(2) + hex.charAt(2), 16);
    return { r, g, b };
  } else if (hex.length === 6) {
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return { r, g, b };
  } else {
    return null;
  }
}

// Helper function to calculate the luminance of an RGB color
function luminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Helper function to determine if a text color should be light or dark based on background color
export function getTextColorForBackground(bgColor: string): string {
  const rgb = hexToRgb(bgColor);

  if (!rgb) {
    console.log("no rgb");

    return "#000"; // Default to black if color parsing fails
  }

  const lum = luminance(rgb.r, rgb.g, rgb.b);
  return lum > 0.3 ? "#000" : "#FFF"; // Return black or white based on luminance
}
