import { useState } from "react";

import { Button } from "@/components/ui/button";

import { ICard } from "@/types/card.types";

import { ArrowRight } from "lucide-react";

import DatePopoverLayout from "@/components/general/DatePopoverLayout";
import MoveCardPopoverLayout from "./MoveCardPopoverLayout";

interface MoveCardLayoutProps {
  card: ICard;
}

function MoveCardLayout({ card }: MoveCardLayoutProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <DatePopoverLayout
      internalOpen={isPopoverOpen}
      setInternalOpen={setIsPopoverOpen}
      trigger={
        <Button
          variant={"secondary"}
          className="break-card_modal:w-[176px] mt-2 h-8 overflow-hidden relative text-ellipsis whitespace-nowrap max-w-[300px] flex justify-start items-center py-[6px] px-3 mr-2 w-[calc(50%-8px)]"
        >
          <span className="mr-[6px] -ml-[6px]">
            <ArrowRight size={15} />
          </span>
          <span>Move</span>
        </Button>
      }
      title="Move card"
    >
      <MoveCardPopoverLayout setIsPopoverOpen={setIsPopoverOpen} card={card} />
    </DatePopoverLayout>
  );
}

export default MoveCardLayout;
