import { cloneElement, ReactElement } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ILabel } from "@/types/board.types";

interface LabelPopoverLayoutProps {
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
  internalOpen: boolean;
  setInternalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditLabel: React.Dispatch<React.SetStateAction<boolean>>;
  setLabelToEdit: React.Dispatch<React.SetStateAction<ILabel | null>>;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

function LabelPopoverLayout({
  title,
  children,
  triggerText,
  triggerVariant = "default",
  trigger,
  popoverClassName,

  internalOpen,
  setInternalOpen,
  setIsEditLabel,
  setIsEditMode,
  setLabelToEdit,
}: LabelPopoverLayoutProps) {
  function handleOpenChange(newOpen: boolean) {
    setIsEditLabel(false);
    setIsEditMode(false);
    setLabelToEdit(null);
    setInternalOpen(newOpen);
  }

  function toggleOpen() {
    handleOpenChange(!internalOpen);
  }
  return (
    <Popover open={internalOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        {trigger ? (
          cloneElement(trigger as ReactElement, {
            onClick: toggleOpen,
          })
        ) : (
          <Button onClick={toggleOpen} variant={triggerVariant}>
            {triggerText}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent
        side={undefined as unknown as "top" | "right" | "bottom" | "left"}
        className={cn("w-[304px] rounded-lg", popoverClassName)}
      >
        <div className="">
          <div className="py-1 px-2 text-center relative grid-cols-popover_layout grid items-center">
            <h4 className="px-8  font-semibold col-start-2 text-ellipsis overflow-hidden block text-gray-600 whitespace-nowrap">
              {title}
            </h4>
            <Button
              onClick={(ev) => {
                ev.stopPropagation();
                handleOpenChange(false);
              }}
              className="rounded-lg col-start-3 p-[6px]"
              variant={"ghost"}
            >
              <X size={18} color="gray" />
            </Button>
          </div>
          <div className="max-h-835px px-3 pb-3">{children}</div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default LabelPopoverLayout;
