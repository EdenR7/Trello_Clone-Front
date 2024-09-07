import { IArchiveCard } from "@/types/board.types";
import { ICard } from "@/types/card.types";
import { SquareCheckBig } from "lucide-react";

interface CardItemChecklistProps {
  card: ICard | IArchiveCard;
}

function CardItemChecklist(props: CardItemChecklistProps) {
  const { card } = props;
  let totalTodos: number = 0;
  let completeTodos: number = 0;
  card.checklist.forEach((checklist) => {
    totalTodos += checklist.todos.length;
    checklist.todos.forEach((todo) => {
      if (todo.isComplete) {
        completeTodos += 1;
      }
    });
  });

  return (
    <span
      className={`flex relative items-center justify-center w-fit max-w-full h-6 mb-1 p-[2px] rounded-sm text-sm ${
        completeTodos === totalTodos && " bg-[#1f845a] text-white"
      }`}
    >
      <span className=" flex items-center justify-center w-5 h-5 leading-5 mr-[2px]">
        <SquareCheckBig size={12} strokeWidth={1.75} />
      </span>
      <span className=" text-xs">
        {completeTodos}/{totalTodos}
      </span>
    </span>
  );
}

export default CardItemChecklist;
