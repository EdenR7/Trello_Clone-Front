import { ICard } from "@/types/card.types";
import CardDetailsHeader from "../general/CardDetailsHeader";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";
import CardDatesPopup from "./CardDatesPopup";
import DatePopoverLayout from "../general/DatePopoverLayout";
import { useState } from "react";

interface CardDataDateLayoutProps {
  card: ICard;
}

function CardDataDateLayout(props: CardDataDateLayoutProps) {
  const { card } = props;

  let header = "";

  if (card.dueDate && !card.startDate) {
    header = "Due date";
  } else if (card.startDate && !card.dueDate) {
    header = "Start date";
  } else if (card.startDate && card.dueDate) {
    header = "Dates";
  }
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <CardDetailsHeader title={header} />
      <div className=" flex items-center mr-2 mb-2">
        <Checkbox className=" my-2 mr-1" />
        <DatePopoverLayout
          internalOpen={isOpen}
          setInternalOpen={setIsOpen}
          title="Dates"
          trigger={
            <Button variant={"secondary"}>
              Dates <ChevronDown />
            </Button>
          }
        >
          <CardDatesPopup setInternalOpen={setIsOpen} card={card} />
        </DatePopoverLayout>
      </div>
    </>
  );
}

export default CardDataDateLayout;
