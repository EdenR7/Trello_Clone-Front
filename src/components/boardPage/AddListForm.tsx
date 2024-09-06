import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useEffect, useRef, useState } from "react";
import useClickOutside from "@/hooks/CustomHooks/useClickOutside";
import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCreateList } from "@/hooks/Query hooks/List hooks/useCreateList";

interface AddListFormProps {
  setOnCreateNewList: React.Dispatch<React.SetStateAction<boolean>>;
  boardId: string | undefined;
}

function AddListForm({ setOnCreateNewList, boardId }: AddListFormProps) {
  if (!boardId) return null;

  const [newListName, setNewListName] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const listFormComponentRef = useRef<HTMLDivElement | null>(null);
  useClickOutside(listFormComponentRef, () => {
    handleSubmit();
  });

  const listCreator = useCreateList(boardId);

  function handleInput() {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }
  function handleSubmit(ev?: React.FormEvent) {
    ev?.preventDefault();
    if (!validateListName()) return setOnCreateNewList(false);
    if (!boardId) return;
    listCreator.mutate({ boardId, name: newListName });
    setNewListName("");
    setOnCreateNewList(false);
  }
  function validateListName() {
    return newListName.trim() !== "";
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <div
      ref={listFormComponentRef}
      className="min-w-[272px] bg-gray-200 text-text_dark_blue min-h-[88px] h-fit p-2 shadow-sm rounded-xl"
    >
      <form className=" ">
        <Textarea
          ref={textareaRef}
          onInput={handleInput}
          value={newListName}
          rows={1}
          onChange={(e) => setNewListName(e.target.value)}
          style={{ resize: "none", overflow: "hidden" }}
          placeholder="Enter a name for this card..."
          className="shadow-sm focus:border-0 focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md h-8 w-full px-3 py-[6px] text-text_dark_blue border-text_dark_blue/60 font-semibold"
        />
        <div className=" mt-2 flex gap-1 items-center">
          <Button onClick={(ev) => handleSubmit(ev)} className=" px-4 py-[6px]">
            Add list
          </Button>
          <Button
            onClick={() => {
              setNewListName("");
              setOnCreateNewList(false);
            }}
            variant={"secondary"}
            className=" bg-inherit p-[6px]"
          >
            <X size={20} />
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AddListForm;
