import React from "react";
import { type ClassValue } from "clsx";
import { cn } from "@/lib/utils";

interface SpinnerLoaderProps {
  className?: ClassValue;
  // positionClassname?: ClassValue;
}

const SpinnerLoader: React.FC<SpinnerLoaderProps> = ({
  // positionClassname,
  className,
}) => {
  return (
    <div
      className={cn("w-12 h-12 p-2 rounded-full bg-teal-600", className)}
      style={{
        mask: "conic-gradient(#0000 10%, #000), linear-gradient(#000 0 0) content-box",
        WebkitMask:
          "conic-gradient(#0000 10%, #000), linear-gradient(#000 0 0) content-box",
        WebkitMaskComposite: "source-out",
        maskComposite: "subtract",
        animation: "spin 1.5s linear infinite",
      }}
    ></div>
  );
};

export default SpinnerLoader;
