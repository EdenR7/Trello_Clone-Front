import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useEffect, useRef, useState } from "react";
import { IAddACardFormOpen } from "./ListItem";
import useClickOutside from "@/hooks/CustomHooks/useClickOutside";
import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function createCardApi(listId: string, title: string) {
  try {
    const res = await api.post(`list/${listId}/card/add`, { title });
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

interface AddCardFormProps {
  setAddACardFormOpen: React.Dispatch<React.SetStateAction<IAddACardFormOpen>>;
  listId: string;
}

function AddCardForm({ setAddACardFormOpen, listId }: AddCardFormProps) {
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newFormsCounter, sewFormsCounter] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const formComponentRef = useRef<HTMLFormElement | null>(null);
  useClickOutside(formComponentRef, () => {
    handleSubmit();
    setAddACardFormOpen((prev) => ({ ...prev, open: false }));
  });

  const qClient = useQueryClient();
  const cardCreator = useMutation({
    mutationFn: ({ listId, title }: { listId: string; title: string }) =>
      createCardApi(listId, title),
    onMutate: () => {
      qClient.cancelQueries(["lists", listId] as any);
    },
    onSuccess: () => {
      qClient.invalidateQueries(["lists", listId] as any);
    },
    onError: (error) => {
      console.log(error);
    },
  });

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
