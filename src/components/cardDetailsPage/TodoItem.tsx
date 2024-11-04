import { Checkbox } from "../ui/checkbox";
import { ITodo } from "@/types/checklist.types";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useToggleTodoComplete } from "@/hooks/Query hooks/Todo hooks/useToggleTodoComplete";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { useUpdateTodoTitle } from "@/hooks/Query hooks/Todo hooks/useUpdateTodoTitle";
import { useDeleteTodo } from "@/hooks/Query hooks/Todo hooks/useDeleteTodo";
import EditableTextArea from "./EditableTextArea";

interface TodoItemProps {
  todo: ITodo;
  activeTodoTitleId: String | null;
  setActiveTodoTitleId: React.Dispatch<React.SetStateAction<String | null>>;
  checklistId: string;
  setActiveChecklistId: React.Dispatch<React.SetStateAction<string | null>>;
  setActiveChecklistTitleId: React.Dispatch<
    React.SetStateAction<string | null>
  >;
}

export default function TodoItem({
  todo,
  activeTodoTitleId,
  setActiveTodoTitleId,
  checklistId,
  setActiveChecklistId,
  setActiveChecklistTitleId,
}: TodoItemProps) {
  const { cardId, boardId } = useParams();

  const { mutate: toggleTodo } = useToggleTodoComplete(boardId!);
  const { mutate: updateTodoTitle } = useUpdateTodoTitle();
  const { mutate: deleteTodo } = useDeleteTodo(boardId!);
  const changeItemTitleRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (changeItemTitleRef.current && activeTodoTitleId === todo._id) {
      changeItemTitleRef.current.focus();
      changeItemTitleRef.current.selectionStart =
        changeItemTitleRef.current.value.length;
      changeItemTitleRef.current.selectionEnd =
        changeItemTitleRef.current.value.length;
    }
  }, [activeTodoTitleId]);

  function handleToggleTodo(
    cardId: string,
    checklistId: string,
    todoId: string
  ) {
    toggleTodo({ cardId, checklistId, todoId });
  }

  function handleUpdateTodoTitle(
    cardId: string,
    checklistId: string,
    todoId: string,
    newTodoTitle: string
  ) {
    setActiveTodoTitleId(null);
    updateTodoTitle({ cardId, checklistId, todoId, newTodoTitle });
  }

  function handleDeleteTodo(
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    cardId: string,
    checklistId: string,
    todoId: string
  ) {
    ev.preventDefault();
    ev.stopPropagation();
    deleteTodo({ cardId, checklistId, todoId });
  }

  return (
    <div className="relative pl-10 rounded-lg transition-colors">
      <div className="cursor-pointer left-[2px] m-[6px] absolute text-center top-1">
        <Checkbox
          checked={todo.isComplete}
          onClick={() => handleToggleTodo(cardId!, checklistId, todo._id)}
          className="  h-4 w-4 m-0 border-gray-400 rounded-none border"
          id={todo._id}
        />
      </div>
      <div
        className={`group rounded-xl -ml-2 py-[6px] px-2 break-words break-all hover:cursor-pointer hover:bg-btn_bg_primary ${
          activeTodoTitleId === todo._id ? "bg-btn_bg_primary" : ""
        }`}
        onClick={() => {
          setActiveChecklistId(null);
          setActiveChecklistTitleId(null);
          setActiveTodoTitleId(todo._id);
        }}
      >
        {activeTodoTitleId === todo._id ? (
          <EditableTextArea
            initialValue={todo.title}
            onSave={(newTitle) =>
              handleUpdateTodoTitle(cardId!, checklistId, todo._id, newTitle)
            }
            onCancel={() => setActiveTodoTitleId(null)}
            placeholder="Todo title..."
          />
        ) : (
          <div className=" flex w-full justify-between">
            <span className={todo.isComplete ? "line-through" : ""}>
              {todo.title}
            </span>
            <Button
              onClick={(ev) =>
                handleDeleteTodo(ev, cardId!, checklistId, todo._id)
              }
              variant={"secondary"}
              className=" rounded-full cursor-pointer p-[2px] h-6 w-6 ml-1 bg-btn_bg_primary invisible group-hover:visible"
            >
              <Trash2 size={18} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
