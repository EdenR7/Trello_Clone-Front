import { rgbToHex } from "./ColorConversionUtils";

export const getAverageColor = (imageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Ensure cross-origin images can be loaded
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve("#FFFFFF"); // Default to white if context is null
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      ).data;
      let r = 0,
        g = 0,
        b = 0;

      for (let i = 0; i < imageData.length; i += 4) {
        r += imageData[i];
        g += imageData[i + 1];
        b += imageData[i + 2];
      }

      const pixelCount = imageData.length / 4;
      const avgR = Math.floor(r / pixelCount);
      const avgG = Math.floor(g / pixelCount);
      const avgB = Math.floor(b / pixelCount);

      // Resolve the color in hex format after calculation
      resolve(rgbToHex(avgR, avgG, avgB));
    };

    img.onerror = (error) => {
      console.error("Image failed to load:", error);
      reject(error); // Ensure error is handled
    };
  });
};
