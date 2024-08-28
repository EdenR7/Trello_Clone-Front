import { IList } from "@/types/list.types";
import { Link } from "react-router-dom";
import CardItem from "./CardItem";
import { Draggable, Droppable } from "@hello-pangea/dnd";

interface ListItemProps {
  list: IList;
  index: number;
}
function ListItem({ list, index }: ListItemProps) {
  return (
    <Draggable draggableId={list._id} index={index}>
      {(provided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="  h-full shadow-sm border-black border rounded-xl p-2 overflow-hidden min-w-[272px]"
          key={list._id}
        >
          <div {...provided.dragHandleProps} className=" w-[272px]">
            <div>{list.name}</div>
            <div>id: {list._id}</div>
            <Droppable droppableId={list._id} type="card">
              {(provided) => (
                <ol
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className=" flex flex-col gap-3"
                >
                  cards:
                  {list.cards.map((card, index) => (
                    <CardItem key={card._id} card={card} index={index} />
                  ))}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>
          </div>
        </li>
      )}
    </Draggable>
  );
}

export default ListItem;
