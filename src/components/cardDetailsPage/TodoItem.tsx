import { Checkbox } from "../ui/checkbox";
import { ITodo } from "@/types/checklist.types";
import { Textarea } from "../ui/textarea";
import { useEffect, useRef } from "react";

interface TodoItemProps {
  todo: ITodo;
  activeTodoTitleId: String | null;
  setActiveTodoTitleId: React.Dispatch<React.SetStateAction<String | null>>;
}

export default function TodoItem({
  todo,
  activeTodoTitleId,
  setActiveTodoTitleId,
}: TodoItemProps) {
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

  function handleToggleTodo() {}

  return (
    <div className="relative pl-10 rounded-lg transition-colors">
      <div className="cursor-pointer left-[2px] m-[6px] absolute text-center top-1">
        <Checkbox
          checked={todo.isComplete}
          onClick={handleToggleTodo}
          className="h-4 w-4 m-0 border-black rounded-none border"
          id={todo._id}
        />
      </div>
      <div
        className={`group rounded-xl -ml-2 py-[6px] px-2 break-words break-all hover:cursor-pointer hover:bg-btn_bg_primary ${
          activeTodoTitleId === todo._id ? "bg-btn_bg_primary" : ""
        }`}
        onClick={() => setActiveTodoTitleId(todo._id)}
      >
        {activeTodoTitleId === todo._id ? (
          <div className=" -ml-2 p-2">
            <Textarea
              ref={changeItemTitleRef}
              defaultValue={todo.title}
              className="rounded-sm ring-2 ring-primary border-none focus-visible:ring-offset-0 resize-y min-h-8 h-[56px] overflow-y-hidden px-3 py-2  w-full"
              placeholder="Add an item..."
            />
          </div>
        ) : (
          <div className=" flex w-full justify-between">
            <span className={todo.isComplete ? "line-through" : ""}>
              {todo.title}
            </span>
            <span className=" rounded-full cursor-pointer p-[2px] h-6 w-6 ml-1 bg-btn_bg_primary invisible group-hover:visible">
              Hi
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
