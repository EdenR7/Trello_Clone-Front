import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useRef, useState } from "react";
import { IAddACardFormOpen } from "./ListItem";
import useClickOutside from "@/hooks/CustomHooks/useClickOutside";

interface AddCardFormProps {
  setAddACardFormOpen: React.Dispatch<React.SetStateAction<IAddACardFormOpen>>;
}

function AddCardForm({ setAddACardFormOpen }: AddCardFormProps) {
  const [newCardTitle, setNewCardTitle] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const formComponentRef = useRef<HTMLFormElement | null>(null);
  useClickOutside(formComponentRef, () => {
    setAddACardFormOpen((prev) => ({ ...prev, open: false }));
  });

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  return (
    <form ref={formComponentRef} className=" ">
      <Textarea
        ref={textareaRef}
        onInput={handleInput}
        rows={1}
        style={{ resize: "none", overflow: "hidden" }}
        placeholder="Enter a name for this card..."
        className="shadow-sm focus-visible:ring-0 rounded-[8px] w-full py-2 pb-7 px-3 min-h-14 overflow-y-hidden text-text_dark_blue "
      />
      <div className=" mt-2 flex gap-1 items-center">
        <Button className=" px-4 py-[6px]">Add card</Button>
        <Button variant={"secondary"} className=" bg-inherit p-[6px]">
          <X size={20} />
        </Button>
      </div>
    </form>
  );
}

export default AddCardForm;
