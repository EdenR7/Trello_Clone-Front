import { cloneElement, ReactElement, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PopoverLayoutProps {
  title: string;
  children: React.ReactNode;
  triggerText?: string;
  triggerVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "naked";
  trigger?: React.ReactNode;
  popoverClassName?: string;
  side?: "top" | "right" | "bottom" | "left" | "";
}

function PopoverLayout({
  title,
  children,
  triggerText,
  triggerVariant = "default",
  trigger,
  popoverClassName,
  side,
}: PopoverLayoutProps) {
  const [open, setOpen] = useState(false);
  function toggleOpen() {
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger ? (
          cloneElement(trigger as ReactElement, {
            onClick: () => setOpen(true),
          })
        ) : (
          <Button onClick={() => setOpen(true)} variant={triggerVariant}>
            {triggerText}
          </Button>
        )}
      </PopoverTrigger>
      {/* <PopoverTrigger asChild>
        <Button onClick={() => setOpen(true)} variant={triggerVariant}>
          {triggerText}
        </Button>
      </PopoverTrigger> */}
      <PopoverContent
        side={side}
        // sideOffset={100}
        // align="start"
        // alignOffset={100}

        className={cn("w-[304px] rounded-lg", popoverClassName)}
      >
        {" "}
        <div className="">
          <div className=" py-1 px-2 text-center relative grid-cols-popover_layout grid items-center">
            <h4 className="  px-8 py-2 font-semibold col-start-2 text-ellipsis overflow-hidden block text-gray-600 whitespace-nowrap ">
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
