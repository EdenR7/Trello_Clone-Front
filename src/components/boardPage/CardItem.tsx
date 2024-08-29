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
          className=" flex flex-col break-words gap-2 bg-gray-400 "
        >
          <Link key={card._id} to={`/b/${boardId}/c/${card._id}`}>
            <p>title: {card.title}</p>
            {/* <p>admin: {card.admin}</p> */}
            <p>position: {card.position}</p>
            <p>id: {card._id}</p>
          </Link>
        </div>
      )}
    </Draggable>
  );
}

export default CardItem;
