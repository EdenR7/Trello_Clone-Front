import { ICard } from "@/types/card.types";
import CardDetailsHeader from "../general/CardDetailsHeader";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";
import CardDatesPopup from "./CardDatesPopup";
import DatePopoverLayout from "../general/DatePopoverLayout";
import { useState } from "react";
import { addHours, format, isBefore } from "date-fns";
import { useParams } from "react-router-dom";
import useToggleCardIsComplete from "@/hooks/Query hooks/Card hooks/useToggleCardIsComplete";

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

  function getDueDateLabel(dueDate: Date | undefined) {
    if (!dueDate) return "";

    if (card.isComplete) {
      return "Complete";
    }

    const now = new Date();
    const due = new Date(dueDate);
    const oneDayAhead = addHours(now, 24);

    if (isBefore(due, now)) {
      return "Overdue";
    } else if (isBefore(now, due) && isBefore(due, oneDayAhead)) {
      return "Due soon";
    }

    return "";
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
                    getDueDateLabel(card.dueDate) === "" && "hidden"
                  } ${
                    getDueDateLabel(card.dueDate) === "Due soon" &&
                    "bg-yellow-500"
                  } ${
                    getDueDateLabel(card.dueDate) === "Overdue" &&
                    "bg-[#ca3521] text-white"
                  } ${
                    getDueDateLabel(card.dueDate) === "Complete" &&
                    "bg-[#1f845a] text-white"
                  }`}
                >
                  {getDueDateLabel(card.dueDate)}
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
