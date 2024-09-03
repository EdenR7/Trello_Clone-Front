import React, { useRef, useEffect, useState } from "react";
import { SquareCheckBig } from "lucide-react";
import { Button } from "../ui/button";
import TodoItem from "./TodoItem";
import AddTodoForm from "./AddTodoForm";
import { IChecklist } from "@/types/checklist.types";
import ChecklistProgress from "./ChecklistProgress";
import EditableTextArea from "./EditableTextArea";
import { useUpdateChecklistTitle } from "@/hooks/Query hooks/Checklist hooks/useUpdateChecklistTitle";
import PopoverLayout from "../general/PopoverLayout";
import { useParams } from "react-router-dom";
import { useDeleteChecklist } from "@/hooks/Query hooks/Checklist hooks/useDeleteChecklist";

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

  hideCheckedItems: { [key: string]: boolean };

  handleHideCheckedItemsToggle: (checklistId: string) => void;
  progressChecklists: IChecklist[];
}

export default function ChecklistItem({
  checklist,
  cardId,
  addTodo,
  hideCheckedItems,

  handleHideCheckedItemsToggle,
  activeChecklistId,
  setActiveChecklistId,
  progressChecklists,
}: ChecklistItemProps) {
  const { boardId } = useParams();
  const addItemTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [activeTodoTitleId, setActiveTodoTitleId] = useState<String | null>(
    null
  );
  const [activeChecklistTitleId, setActiveChecklistTitleId] = useState<
    string | null
  >(null);
  const { mutate: updateChecklistTitle } = useUpdateChecklistTitle();
  const { mutate: deleteChecklist } = useDeleteChecklist(boardId!);
  const [isNew, setIsNew] = useState(true);

  useEffect(() => {
    if (addItemTextareaRef.current && activeChecklistId === checklist._id) {
      addItemTextareaRef.current.focus();
    }
  }, [activeChecklistId]);

  useEffect(() => {
    if (!hideCheckedItems[checklist._id] && checklist.todos.length > 0) {
      setIsNew(false);
    }
  }, [activeChecklistId, hideCheckedItems]);

  function handleAddItem(todoTitle: string) {
    if (addItemTextareaRef.current) {
      addItemTextareaRef.current.value = "";
      addItemTextareaRef.current.focus();
    }
    addTodo({ cardId, checklistId: checklist._id, todoTitle });
  }

  function handleUpdateChecklistTitle(
    cardId: string,
    checklistId: string,
    newChecklistTitle: string
  ) {
    setActiveChecklistTitleId(null);
    updateChecklistTitle({ cardId, checklistId, newChecklistTitle });
  }

  function handleDeleteChecklist(cardId: string, checklistId: string) {
    deleteChecklist({ cardId, checklistId });
  }

  const progressChecklist = progressChecklists.find(
    (cl) => cl._id === checklist._id
  );

  return (
    <div className="mb-6">
      <div className="py-2 mb-1 ml-11 relative">
        <SquareCheckBig className="absolute -left-10 top-2" />
        {activeChecklistTitleId === checklist._id ? (
          <div>
            <EditableTextArea
              initialValue={checklist.name}
              placeholder=""
              onCancel={() => setActiveChecklistTitleId(null)}
              onSave={(newTitle) =>
                handleUpdateChecklistTitle(cardId!, checklist._id, newTitle)
              }
            />
          </div>
        ) : (
          <div className="flex justify-between">
            <h3
              onClick={() => {
                setActiveTodoTitleId(null);
                setActiveChecklistId(null);
                setActiveChecklistTitleId(checklist._id);
              }}
              className=" cursor-pointer font-semibold text-[16px]"
            >
              {checklist.name}
            </h3>

            <div>
              <Button
                variant="secondary"
                className="mr-2"
                onClick={() => {
                  setActiveTodoTitleId(null);

                  handleHideCheckedItemsToggle(checklist._id);
                }}
              >
                {hideCheckedItems[checklist._id]
                  ? `Show checked items (${
                      progressChecklist!.todos.filter((todo) => todo.isComplete)
                        .length
                    })`
                  : "Hide checked items"}
              </Button>

              <PopoverLayout
                title={`Delete ${checklist.name}?`}
                triggerText="Delete"
                triggerVariant="secondary"
              >
                <div className=" flex flex-col gap-3">
                  <p>
                    Deleting a checklist is permanent and there is no way to get
                    it back.
                  </p>
                  <Button
                    onClick={() => handleDeleteChecklist(cardId, checklist._id)}
                    variant={"destructive"}
                  >
                    Delete checklist
                  </Button>
                </div>
              </PopoverLayout>
            </div>
          </div>
        )}
      </div>
      <div className="relative mb-[6px]">
        <ChecklistProgress checklist={progressChecklist} />
        {!isNew && checklist.todos.length === 0 && (
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
            setActiveChecklistTitleId={setActiveChecklistTitleId}
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
