import DatePopoverLayout from "@/components/general/DatePopoverLayout";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { useState } from "react";
import CardDatesPopup from "../CardDatesPopup";
import { ICard } from "@/types/card.types";

interface DatesLayoutProps {
  card: ICard;
}

function DatesLayout(props: DatesLayoutProps) {
  const { card } = props;

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  return (
    <DatePopoverLayout
      internalOpen={isPopoverOpen}
      setInternalOpen={setIsPopoverOpen}
      title="Dates"
      trigger={
        <Button
          variant={"secondary"}
          className={` break-card_modal:w-auto mt-2 h-8 overflow-hidden relative text-ellipsis whitespace-nowrap max-w-[300px] flex justify-start items-center py-[6px] px-3 mr-2 w-[calc(50%-8px)] $`}
        >
          <span className="mr-[6px] -ml-[6px]">
            <Clock size={15} />
          </span>
          <span>Dates</span>
        </Button>
      }
    >
      <CardDatesPopup card={card} setInternalOpen={setIsPopoverOpen} />
    </DatePopoverLayout>
  );
}

export default DatesLayout;
