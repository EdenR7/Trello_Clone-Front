import { ICard } from "@/types/card.types";
import CardDetailsHeader from "../general/CardDetailsHeader";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";
import PopoverLayout from "../general/PopoverLayout";
import CardDatesPopup from "./CardDatesPopup";

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
  return (
    <>
      <CardDetailsHeader title={header} />
      <div className=" flex items-center mr-2 mb-2">
        <Checkbox className=" my-2 mr-1" />
        <PopoverLayout
          title="Dates"
          trigger={
            <Button variant={"secondary"}>
              Dates <ChevronDown />
            </Button>
          }
        >
          <CardDatesPopup card={card} />
        </PopoverLayout>
      </div>
    </>
  );
}

export default CardDataDateLayout;
