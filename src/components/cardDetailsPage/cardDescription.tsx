import { ICard } from "@/types/card.types";
import { List } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useUpdateCardDescription } from "@/hooks/Query hooks/Card hooks/useUpdateCardDescription";

interface cardDescriptionProps {
  card: ICard;
}

function CardDescriptionComponent(props: cardDescriptionProps) {
  const { card } = props;
  const [isEditing, setIsEditing] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { mutate: updateCardDescription } = useUpdateCardDescription();

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.value.length;
      textareaRef.current.selectionEnd = textareaRef.current.value.length;
    }
  }, [isEditing]);

  function handleSaveDesc() {
    setIsEditing(false);
    if (textareaRef.current) {
      const newDesc = textareaRef.current.value;
      console.log(newDesc);

      if (newDesc !== card.description) {
        updateCardDescription({ cardId: card._id, newDesc });
      }
    }
  }

  function handlecancelDesc() {
    setIsEditing(false);
  }

  function handleEditDesc() {
    setIsEditing(true);

    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }

  return (
    <div className="  relative py-2 px-4">
      <div className=" mb-1 py-3 ml-10 relative flex items-center">
        <List
          className={`absolute top-3 -left-9 ${
            card.description && card.description.length > 0 && "top-4"
          }`}
        />
        {card.description && card.description.length > 0 ? (
          <div className=" flex justify-between w-full items-center">
            <h2 className=" font-semibold text-[16px]">Description</h2>
            <Button variant={"ghost"} onClick={handleEditDesc}>
              Edit
            </Button>
          </div>
        ) : (
          <h2 className=" font-semibold text-[16px]">Description</h2>
        )}
      </div>
      <div className=" ml-10">
        {isEditing ? (
          <div>
            <Textarea
              defaultValue={card.description}
              ref={textareaRef}
              className={cn(
                "text-md w-11/12 resize-none overflow-hidden transition-colors duration-200 ring-1 ring-gray-500",
                "min-h-[220px] p-5 rounded-sm ring-offset-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              )}
              placeholder="Add a more detailed description..."
            />
            <div className=" mt-2 flex ">
              <Button
                variant={"primaryBtn"}
                onClick={() => handleSaveDesc()}
                className=" mr-2 hover:bg-btn_primary_hover"
              >
                Save
              </Button>
              <Button onClick={handlecancelDesc} variant={"ghost"}>
                Cancel
              </Button>
            </div>
          </div>
        ) : card.description && card.description.length > 0 ? (
          <div className=" cursor-pointer" onClick={handleEditDesc}>
            {" "}
            {card.description}
          </div>
        ) : (
          <div
            className=" bg-btn_bg_primary py-2 px-3 rounded-sm font-semibold min-h-14 hover:bg-btn_bg_primary_hover hover:cursor-pointer"
            onClick={handleEditDesc}
          >
            Add a more detailed description...
          </div>
        )}
      </div>
    </div>
  );
}

export default CardDescriptionComponent;
