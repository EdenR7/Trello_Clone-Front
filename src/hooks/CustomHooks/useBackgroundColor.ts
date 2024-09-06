import { IBoardBackground } from "@/types/board.types";
import { extractColorFromGradient } from "@/utils/getAverageColorFromGradient";
import { getAverageColor } from "@/utils/getAverageImgColor";
import { useEffect, useState } from "react";

export function useBackgroundColor(background: IBoardBackground): string {
  const [bgColor, setBgColor] = useState<string>("rgb(255,255,255)");

  useEffect(() => {
    async function extractColor() {
      let color: string;

      if (background.bgType === "image") {
        try {
          color = await getAverageColor(background.background);
        } catch (error) {
          console.error("Error extracting color from image:", error);
          color = "rgb(255,255,255)"; // Default to white on error
        }
      } else if (background.bgType === "gradient") {
        color = extractColorFromGradient(background.background);
      } else if (background.bgType === "color") {
        color = background.background;
      } else {
        color = "rgb(255,255,255)"; // Default to white for unknown bgType
      }

      setBgColor(color);
    }

    extractColor();
  }, [background]);

  return bgColor;
}
