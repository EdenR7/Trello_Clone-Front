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
  //   hideCheckedItems: boolean;
  hideCheckedItems: { [key: string]: boolean };
  //   setHideCheckedItems: React.Dispatch<React.SetStateAction<boolean>>;
  handleHideCheckedItemsToggle: (checklistId: string) => void;
  progressChecklists: IChecklist[];
}

export default function ChecklistItem({
  checklist,
  cardId,
  addTodo,
  hideCheckedItems,
  //   setHideCheckedItems,
  handleHideCheckedItemsToggle,
  activeChecklistId,
  setActiveChecklistId,
  progressChecklists,
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

  const progressChecklist = progressChecklists.find(
    (cl) => cl._id === checklist._id
  );

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
              onClick={() => {
                setActiveTodoTitleId(null);
                // setHideCheckedItems(!hideCheckedItems);
                handleHideCheckedItemsToggle(checklist._id);
              }}
            >
              {/* {hideCheckedItems ? "Show" : "Hide"} checked items */}
              {hideCheckedItems[checklist._id]
                ? `Show checked items (${
                    progressChecklist!.todos.filter((todo) => todo.isComplete)
                      .length
                  })`
                : "Hide checked items"}
            </Button>
            <Button variant="secondary">Delete</Button>
          </div>
        </div>
      </div>
      <div className="relative mb-[6px]">
        <ChecklistProgress checklist={progressChecklist} />
        {checklist.todos.length === 0 && (
          <span className=" block mt-2 ml-10">
            Everything in this checklist is complete!
          </span>
        )}
      </div>
      <div className="min-h-2">
        {checklist.todos.map((todo) => (
          <TodoItem
            checklistId={checklist._id}
            activeTodoTitleId={activeTodoTitleId}
            setActiveTodoTitleId={setActiveTodoTitleId}
            setActiveChecklistId={setActiveChecklistId}
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
            onClick={() => {
              setActiveTodoTitleId(null);
              setActiveChecklistId(checklist._id);
            }}
            variant="secondary"
          >
            Add an item
          </Button>
        )}
      </div>
    </div>
  );
}
