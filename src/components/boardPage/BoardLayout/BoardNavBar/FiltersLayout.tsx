import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { cloneElement, ReactElement, useState } from "react";

interface FiltersLayoutProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
  popoverClassName?: string;
}

function FiltersLayout({
  children,
  trigger,
  popoverClassName,
}: FiltersLayoutProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  function handleOpenChange(newOpen: boolean) {
    setInternalOpen(newOpen);
  }

  function toggleOpen() {
    handleOpenChange(!internalOpen);
  }

  return (
    <Popover open={internalOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        {cloneElement(trigger as ReactElement, {
          onClick: toggleOpen,
        })}
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "h-[calc(100vh-105px)] break-words whitespace-normal w-80 sm:w-[368px]",
          popoverClassName
        )}
      >
        <div className=" text-[rgb(68, 84, 111)]">
          <header className="py-1 px-2 text-center relative grid-cols-popover_layout grid items-center">
            <h4 className="px-8 font-semibold col-start-2 text-ellipsis overflow-hidden block text-gray-600 whitespace-nowrap">
              Filter
            </h4>
            <Button
              onClick={(ev) => {
                ev.stopPropagation();
                ev.preventDefault();
                handleOpenChange(false);
              }}
              className="rounded-lg col-start-3 p-[6px]"
              variant={"ghost"}
            >
              <X size={18} color="gray" />
            </Button>
          </header>
          <ScrollArea className=" h-[calc(100vh-145px)] rounded-md px-3 pb-3">
            {children}
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default FiltersLayout;
