export function extractColorFromGradient(gradient: string): string {
  const match = gradient.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    return `rgb(${match[1]},${match[2]},${match[3]})`;
  }
  return "rgb(255,255,255)"; // Default to white if no match found
}
