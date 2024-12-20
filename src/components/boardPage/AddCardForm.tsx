import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useEffect, useRef, useState } from "react";
import { IAddACardFormOpen } from "./ListItem";
import useClickOutside from "@/hooks/CustomHooks/useClickOutside";
import { useParams } from "react-router-dom";
import { useCreateCard } from "@/hooks/Query hooks/Card hooks/useCreateCard";

interface AddCardFormProps {
  setAddACardFormOpen: React.Dispatch<React.SetStateAction<IAddACardFormOpen>>;
  listId: string;
  place: "top" | "bottom";
}

function AddCardForm({ setAddACardFormOpen, listId, place }: AddCardFormProps) {
  const { boardId } = useParams();
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newFormsCounter, sewFormsCounter] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const formComponentRef = useRef<HTMLFormElement | null>(null);
  useClickOutside(formComponentRef, () => {
    handleSubmit();
    setAddACardFormOpen((prev) => ({ ...prev, open: false }));
  });

  const cardCreator = useCreateCard(boardId!, place);

  function handleInput() {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }
  function handleSubmit(ev?: React.FormEvent) {
    ev?.preventDefault();
    if (!validateCardTitle())
      return setAddACardFormOpen((prev) => ({ ...prev, open: false }));
    cardCreator.mutate({ listId, title: newCardTitle });
    setNewCardTitle("");
    sewFormsCounter((prev) => prev + 1);
  }
  function validateCardTitle() {
    return newCardTitle.trim() !== "";
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [newFormsCounter]);

  return (
    <form ref={formComponentRef} className=" ">
      <Textarea
        ref={textareaRef}
        onInput={handleInput}
        value={newCardTitle}
        onChange={(e) => setNewCardTitle(e.target.value)}
        rows={1}
        style={{ resize: "none", overflow: "hidden" }}
        placeholder="Enter a name for this card..."
        className="shadow-sm focus-visible:ring-0 rounded-[8px] w-full py-2 pb-7 px-3 min-h-14 overflow-y-hidden text-text_dark_blue "
      />
      <div className=" mt-2 flex gap-1 items-center">
        <Button onClick={(ev) => handleSubmit(ev)} className=" px-4 py-[6px]">
          Add card
        </Button>
        <Button
          onClick={() => {
            setNewCardTitle("");
            setAddACardFormOpen((prev) => ({ ...prev, open: false }));
          }}
          variant={"secondary"}
          className=" bg-inherit p-[6px]"
        >
          <X size={20} />
        </Button>
      </div>
    </form>
  );
}

export default AddCardForm;
