import React from "react";
import { type ClassValue } from "clsx";
import { cn } from "@/lib/utils";

interface TextLoaderProps {
  className?: ClassValue;
  text?: string;
}

const TextLoader: React.FC<TextLoaderProps> = ({ className, text }) => {
  return (
    <div
      className={cn("loader font-bold font-mono text-xl translate-x-2 ", className)}
      style={{
        width: "fit-content",
        clipPath: "inset(0 3ch 0 0)",
        animation: "textLoading 2s steps(4) infinite",
      }}
    >
      {text ? text + "..." : "Loading..."}
    </div>
  );
};

export default TextLoader;
