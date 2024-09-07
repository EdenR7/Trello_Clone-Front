import { IArchiveCard } from "@/types/board.types";
import { ICard } from "@/types/card.types";
import { addHours, isBefore } from "date-fns";

export function getDueDateLabel(card: ICard | IArchiveCard) {
  if (!card.dueDate) return "";

  if (card.isComplete) {
    return "Complete";
  }

  const now = new Date();
  const due = new Date(card.dueDate);
  const oneDayAhead = addHours(now, 24);

  if (isBefore(due, now)) {
    return "Overdue";
  } else if (isBefore(now, due) && isBefore(due, oneDayAhead)) {
    return "Due soon";
  }

  return "";
}
