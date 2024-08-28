import { ICard } from "@/types/card.types";
import { List } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface cardDescriptionProps {
  card: ICard;
}

function CardDescriptionComponent(props: cardDescriptionProps) {
  const { card } = props;
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  function handleSaveDesc() {}

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
        <List className=" absolute top-3 -left-9" />
        <h2 className=" font-semibold text-[16px]">Description</h2>
      </div>
      <div className=" ml-10">
        {isEditing ? (
          <div>
            <Textarea
              ref={textareaRef}
              className={cn(
                "text-md  w-11/12 resize-none overflow-hidden transition-colors duration-200 border-2 border-btn_bg_primary",
                " min-h-[220px] p-5 rounded-none border-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-500"
              )}
              placeholder="Add a more detailed description..."
            />
            <div className=" mt-2 flex ">
              <Button onClick={handleSaveDesc} className=" mr-2">
                Save
              </Button>
              <Button onClick={handlecancelDesc} variant={"ghost"}>
                Cancel
              </Button>
            </div>
          </div>
        ) : card.description && card.description.length > 0 ? (
          <div> {card.description}</div>
        ) : (
          <div
            className=" bg-btn_bg_primary py-2 px-3 rounded-sm font-semibold min-h-14 hover:bg-btn_bg_primary_hover hover:cursor-pointer"
            onClick={handleEditDesc}
          >
            Add a more detailed description...
          </div>
        )}
        {/* {card.description && card.description.length > 0 ? (
          <div> {card.description}</div>
        ) : (
          <div
            className=" bg-btn_bg_primary py-2 px-3 rounded-sm font-semibold min-h-14 hover:bg-btn_bg_primary_hover hover:cursor-pointer"
            onClick={() => setIsEditing((prev) => !prev)}
          >
            Add a more detailed description...
          </div>
        )} */}
      </div>
    </div>
  );
}

export default CardDescriptionComponent;
