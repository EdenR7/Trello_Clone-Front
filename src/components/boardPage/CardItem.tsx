import { ICard } from "@/types/card.types";
import { Draggable } from "@hello-pangea/dnd";
import { Link, useParams } from "react-router-dom";

interface CardItemProps {
  card: ICard;
  index: number;
}

function CardItem(props: CardItemProps) {
  const { card, index } = props;
  const { boardId } = useParams();

  return (
    <Draggable draggableId={card._id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className=" flex flex-col gap-2 bg-gray-400 overflow-hidden "
        >
          <Link key={card._id} to={`/b/${boardId}/c/${card._id}`}>
            <span>title: {card.title}</span>
            {/* <span>admin: {card.admin}</span> */}
            <span>position: {card.position}</span>
            <span>id: {card._id}</span>
          </Link>
        </div>
      )}
    </Draggable>
  );
}

export default CardItem;
