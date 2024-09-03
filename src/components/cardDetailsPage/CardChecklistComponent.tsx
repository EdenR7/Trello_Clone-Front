import { useState } from "react";
import { useParams } from "react-router-dom";
import { ICard } from "@/types/card.types";
import { useAddTodo } from "@/hooks/Query hooks/Todo hooks/useAddTodo";
import ChecklistItem from "./ChecklistItem";
import { useLocalStorage } from "@uidotdev/usehooks";

interface CardChecklistComponentProps {
  card: ICard;
}

export default function CardChecklistComponent({
  card,
}: CardChecklistComponentProps) {
  const { boardId } = useParams();

  const [hideCheckedItems, setHideCheckedItems] = useLocalStorage<{
    [key: string]: boolean;
  }>("hideCheckedItems", {});

  const [activeChecklistId, setActiveChecklistId] = useState<string | null>(
    null
  ); //change

  const { mutate: addTodo } = useAddTodo(boardId!);

  const handleHideCheckedItemsToggle = (checklistId: string) => {
    setHideCheckedItems((prev) => ({
      ...prev,
      [checklistId]: !prev[checklistId],
    }));
  };

  const checklists = card.checklist.map((checklist) => {
    return {
      ...checklist,
      todos: hideCheckedItems[checklist._id]
        ? checklist.todos.filter((todo) => !todo.isComplete)
        : checklist.todos,
    };
  });

  const progressChecklists = card.checklist;
  if (!card._id || !boardId) return null;

  return (
    <div>
      {checklists.map((checklist) => (
        <ChecklistItem
          key={checklist._id}
          checklist={checklist}
          cardId={card._id}
          addTodo={addTodo}
          hideCheckedItems={hideCheckedItems}
          handleHideCheckedItemsToggle={handleHideCheckedItemsToggle}
          activeChecklistId={activeChecklistId}
          setActiveChecklistId={setActiveChecklistId}
          progressChecklists={progressChecklists}
        />
      ))}
    </div>
  );
}
