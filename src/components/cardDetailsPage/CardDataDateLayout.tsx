import { ICard } from "@/types/card.types";
import CardDetailsHeader from "../general/CardDetailsHeader";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";
import CardDatesPopup from "./CardDatesPopup";
import DatePopoverLayout from "../general/DatePopoverLayout";
import { useState } from "react";
import { format } from "date-fns";
import { useParams } from "react-router-dom";
import useToggleCardIsComplete from "@/hooks/Query hooks/Card hooks/useToggleCardIsComplete";
import { getDueDateLabel } from "@/utils/getCardLabelState";

interface CardDataDateLayoutProps {
  card: ICard;
}

function CardDataDateLayout(props: CardDataDateLayoutProps) {
  const { card } = props;
  const { boardId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: toggleCardIsComplete } = useToggleCardIsComplete(boardId!);

  let header = "";

  if (card.dueDate && !card.startDate) {
    header = "Due date";
  } else if (card.startDate && !card.dueDate) {
    header = "Start date";
  } else if (card.startDate && card.dueDate) {
    header = "Dates";
  }

  function formatDate(dateString: Date) {
    const date = new Date(dateString);
    return format(date, "MMM dd, yyyy");
  }

  let dateStringToDisplay = "";
  if (card.dueDate && !card.startDate) {
    dateStringToDisplay = formatDate(card.dueDate);
  } else if (card.startDate && !card.dueDate) {
    dateStringToDisplay = formatDate(card.startDate);
  } else if (card.startDate && card.dueDate) {
    dateStringToDisplay = `${formatDate(card.startDate)} - ${formatDate(
      card.dueDate
    )}`;
  }

  function handleToggleCardIsComplete(
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    ev.preventDefault();
    ev.stopPropagation();
    toggleCardIsComplete({ cardId: card._id! });
  }

  return (
    <>
      <CardDetailsHeader title={header} />
      <div className=" flex items-center mr-2 mb-2">
        {card.dueDate && (
          <Checkbox
            checked={card.isComplete}
            onClick={(ev) => handleToggleCardIsComplete(ev)}
            className=" my-2 mr-1"
          />
        )}
        <DatePopoverLayout
          internalOpen={isOpen}
          setInternalOpen={setIsOpen}
          title="Dates"
          trigger={
            <Button className=" py-[6px] px-3" variant={"secondary"}>
              <span>{dateStringToDisplay}</span>
              {card.dueDate && (
                <span
                  className={`my-auto ml-2 px-1 rounded-sm text-xs leading-4 ${
                    getDueDateLabel(card) === "" && "hidden"
                  } ${
                    getDueDateLabel(card) === "Due soon" && "bg-yellow-500"
                  } ${
                    getDueDateLabel(card) === "Overdue" &&
                    "bg-[#ca3521] text-white"
                  } ${
                    getDueDateLabel(card) === "Complete" &&
                    "bg-[#1f845a] text-white"
                  }`}
                >
                  {getDueDateLabel(card)}
                </span>
              )}

              <ChevronDown className=" h-4 w-5 pl-1" />
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
