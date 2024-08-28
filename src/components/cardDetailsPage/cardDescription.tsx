import { ICard } from "@/types/card.types";
import { List } from "lucide-react";
import { useState } from "react";

interface cardDescriptionProps {
  card: ICard;
}

function CardDescriptionComponent(props: cardDescriptionProps) {
  const { card } = props;
  const [isEditing, setIsEditing] = useState(false);
  return (
    <div className=" relative py-2 px-4">
      <div className=" mb-1 py-3 ml-10 relative flex items-center">
        <List className=" absolute top-3 -left-9" />
        <h2>Description</h2>
      </div>
      <div className=" ml-10">
        {card?.description && card?.description.length > 0 ? (
          <div> {card?.description}</div>
        ) : (
          <div>Add a more detailed description...</div>
        )}
      </div>
    </div>
  );
}

export default CardDescriptionComponent;
