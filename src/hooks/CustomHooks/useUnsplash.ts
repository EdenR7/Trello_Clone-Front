import { useEffect, useState } from "react";
import unsplashApi from "@/lib/unsplashApi";

export function useUnsplash() {
  const [images, setImages] = useState<Array<Record<string, any>>>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Correct URL formatting for query parameters
        const result = await unsplashApi.get("/photos/random", {
          params: {
            collections: 317099,
            count: 10,
          },
        });
        if (result) {
          const newImages = result.data as Array<Record<string, any>>;
          setImages(newImages);
        } else {
          console.error("No response from Unsplash API");
        }
      } catch (error) {
        console.error("Error fetching images from Unsplash:", error);
      }
    };

    fetchImages();
  }, []);

  return { images };
}
