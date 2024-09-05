import useToggleCardIsComplete from "@/hooks/Query hooks/Card hooks/useToggleCardIsComplete";
import { ICard } from "@/types/card.types";
import { getDueDateLabel } from "@/utils/getCardLabelState";
import { format } from "date-fns";
import { Clock, Square, SquareCheckBig } from "lucide-react";
import { useParams } from "react-router-dom";

interface CardItemDatesProps {
  card: ICard;
}

function CardItemDates(props: CardItemDatesProps) {
  const { card } = props;
  const { boardId } = useParams();
  const { mutate: toggleCardIsComplete } = useToggleCardIsComplete(boardId!);

  function formatDate(dateString: Date) {
    const date = new Date(dateString);
    return format(date, "MMM dd");
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

  return (
    <span
      onClick={(ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        toggleCardIsComplete({ cardId: card._id! });
      }}
      className={` group/date flex relative items-center justify-center w-fit max-w-full h-6 mb-1 p-[2px] rounded-sm text-xs pr-1  ${
        getDueDateLabel(card) === "Due soon" && "bg-[#e2b203]"
      } ${
        getDueDateLabel(card) === "Overdue" && "bg-[#ffd2cc] text-[#ae2a19]"
      } ${getDueDateLabel(card) === "Complete" && "bg-[#1f845a] text-white"}`}
    >
      <span className=" group-hover/date:hidden flex items-center justify-center w-5 h-5 leading-5">
        <Clock strokeWidth={1.75} size={14} className=" inline-block" />
      </span>
      <span
        className={` hidden ${
          card.isComplete &&
          "group-hover/date:flex items-center justify-center w-5 h-5 leading-5"
        }`}
      >
        <SquareCheckBig size={16} strokeWidth={1.75} />
      </span>
      <span
        className={` hidden ${
          card.isComplete === false &&
          "group-hover/date:flex items-center justify-center w-5 h-5 leading-5"
        }`}
      >
        <Square size={14} strokeWidth={1.25} />
      </span>
      <span>{dateStringToDisplay}</span>
    </span>
  );
}

export default CardItemDates;
