import React, { useRef, useEffect, useState } from "react";
import { SquareCheckBig } from "lucide-react";
import { Button } from "../ui/button";
import TodoItem from "./TodoItem";
import AddTodoForm from "./AddTodoForm";
import { IChecklist } from "@/types/checklist.types";
import ChecklistProgress from "./ChecklistProgress";

interface ChecklistItemProps {
  checklist: IChecklist;
  cardId: string;
  addTodo: (params: {
    cardId: string;
    checklistId: string;
    todoTitle: string;
  }) => void;
  activeChecklistId: string | null;
  setActiveChecklistId: React.Dispatch<React.SetStateAction<string | null>>;
  hideCheckedItems: boolean;
  setHideCheckedItems: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ChecklistItem({
  checklist,
  cardId,
  addTodo,
  hideCheckedItems,
  setHideCheckedItems,
  activeChecklistId,
  setActiveChecklistId,
}: ChecklistItemProps) {
  const addItemTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [activeTodoTitleId, setActiveTodoTitleId] = useState<String | null>(
    null
  );

  useEffect(() => {
    if (addItemTextareaRef.current && activeChecklistId === checklist._id) {
      addItemTextareaRef.current.focus();
    }
  }, [activeChecklistId]);

  function handleAddItem(todoTitle: string) {
    if (addItemTextareaRef.current) {
      addItemTextareaRef.current.value = "";
      addItemTextareaRef.current.focus();
    }
    addTodo({ cardId, checklistId: checklist._id, todoTitle });
  }

  return (
    <div className="mb-6">
      <div className="py-2 mb-1 ml-11 relative">
        <SquareCheckBig className="absolute -left-10 top-2" />
        <div className="flex justify-between">
          <h3 className="font-semibold text-[16px]">{checklist.name}</h3>
          <div>
            <Button
              variant="secondary"
              className="mr-2"
              onClick={() => setHideCheckedItems(!hideCheckedItems)}
            >
              {hideCheckedItems ? "Show" : "Hide"} checked items
            </Button>
            <Button variant="secondary">Delete</Button>
          </div>
        </div>
      </div>
      <ChecklistProgress todos={checklist.todos} />
      <div className="min-h-2">
        {checklist.todos.map((todo) => (
          <TodoItem
            activeTodoTitleId={activeTodoTitleId}
            setActiveTodoTitleId={setActiveTodoTitleId}
            key={todo._id}
            todo={todo}
          />
        ))}
      </div>
      <div className="ml-10">
        {activeChecklistId === checklist._id ? (
          <AddTodoForm
            onAdd={handleAddItem}
            onCancel={() => setActiveChecklistId(null)}
            textareaRef={addItemTextareaRef}
          />
        ) : (
          <Button
            className=" mt-2"
            onClick={() => setActiveChecklistId(checklist._id)}
            variant="secondary"
          >
            Add an item
          </Button>
        )}
      </div>
    </div>
  );
}
