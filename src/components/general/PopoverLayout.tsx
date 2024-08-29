import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface PopoverLayoutProps {
  title: string;
  children: React.ReactNode;
  triggerText: string;
  triggerVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

function PopoverLayout({
  title,
  children,
  triggerText,
  triggerVariant = "default",
}: PopoverLayoutProps) {
  const [open, setOpen] = useState(false);
  function toggleOpen() {
    setOpen(false);
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button onClick={() => setOpen(true)} variant={triggerVariant}>
          {triggerText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[304px] p-0 rounded-lg">
        <div className="">
          <div className=" py-1 px-2 text-center relative grid-cols-popover_layout grid items-center">
            <h4 className="  px-8 font-semibold col-start-2 text-ellipsis overflow-hidden block text-gray-600 whitespace-nowrap ">
              {title}
            </h4>
            <Button
              onClick={toggleOpen}
              className=" rounded-lg col-start-3  p-[6px]"
              variant={"ghost"}
            >
              <X size={18} color="gray" />
            </Button>
          </div>
          <div className=" max-h-835px px-3 pb-3">{children}</div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default PopoverLayout;
