import * as React from "react";

import { cn } from "@/lib/utils";
import { LucideProps } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export interface IconInputProps extends InputProps {
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}

const IconInput = React.forwardRef<HTMLInputElement, IconInputProps>(
  ({ className, type, Icon, ...props }, ref) => {
    return (
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Icon size={14} className="text-gray-500 text-sm" />
        </span>
        <input
          type={type}
          className="pl-10 p-2 text-sm border outline-primary rounded-lg w-full bg-background placeholder:text-gray-500"
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
IconInput.displayName = "IconInput";

export { Input, IconInput };
