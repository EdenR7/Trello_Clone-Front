import { useUpdateCardTitle } from "@/hooks/Query hooks/Card hooks/useUpdateCardTitle";
import { ICard } from "@/types/card.types";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { DialogTitle } from "@/components/ui/dialog";

interface CardTitleProps {
  card: ICard;
}

function CardTitleComponent({ card }: CardTitleProps) {
  const { mutate: updateCardTitle } = useUpdateCardTitle();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(card.title);
  const editTitleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingTitle) {
      editTitleRef.current?.focus();
    }
  }, [isEditingTitle]);

  function handleTitleClick() {
    setIsEditingTitle(true);
  }

  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNewTitle(event.target.value);
  }

  function handleTitleBlur() {
    if (newTitle !== card.title) {
      updateCardTitle({ cardId: card._id, newTitle: newTitle });
    }
    setIsEditingTitle(false);
  }

  function handleTitleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      editTitleRef.current?.blur();
    }
  }

  return (
    <>
      {isEditingTitle ? (
        <Input
          ref={editTitleRef}
          value={newTitle}
          onChange={handleTitleChange}
          onBlur={handleTitleBlur}
          onKeyDown={handleTitleKeyDown}
          className="border-b border-gray-300 focus:outline-none focus:border-blue-500"
        />
      ) : (
        <DialogTitle onClick={handleTitleClick} className="cursor-pointer">
          {card.title}
        </DialogTitle>
      )}
    </>
  );
}

export default CardTitleComponent;
