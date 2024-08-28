import { useUpdateCardTitle } from "@/hooks/Query hooks/Card hooks/useUpdateCardTitle";
import { ICard } from "@/types/card.types";
import { useRef, useState } from "react";
import { CreditCard } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface CardTitleProps {
  card: ICard;
  boardId: string;
}

function CardTitleComponent({ card, boardId }: CardTitleProps) {
  const { mutate: updateCardTitle } = useUpdateCardTitle(boardId);
  const [title, setTitle] = useState(card.title);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleTitleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setTitle(event.target.value);
    // adjustTextareaHeight(event.target);
  }

  //   function adjustTextareaHeight(element: HTMLTextAreaElement) {
  //     element.style.height = "auto";
  //     element.style.height = `${element.scrollHeight}px`;
  //   }    //I tried to handle the case where the textArea grows

  function handleTitleBlur() {
    setIsFocused(false);
    if (title !== card.title) {
      updateCardTitle({ cardId: card._id, newTitle: title });
    }
  }

  function handleTitleFocus() {
    setIsFocused(true);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      textareaRef.current?.blur();
    }
  }

  return (
    <>
      <CreditCard className="absolute top-4 left-4" />
      <div className=" py-2 px-12">
        <input type="text" className=" sr-only" />
        <Textarea
          ref={textareaRef}
          value={title}
          onChange={handleTitleChange}
          onBlur={handleTitleBlur}
          onFocus={handleTitleFocus}
          onKeyDown={handleKeyDown}
          className={cn(
            "text-lg items-center font-semibold py-[6px] px-[10px] w-11/12 resize-none overflow-hidden transition-colors duration-200",
            isFocused ? "bg-white shadow-sm border " : "bg-transparent",
            "min-h-[28px] p-1 rounded-sm border-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-500"
          )}
        />
        <p className=" text-gray-500">
          in list{" "}
          <span className=" border border-b-gray-500 cursor-pointer">
            {card.list.name}
          </span>
        </p>
      </div>
    </>
  );
}

export default CardTitleComponent;
