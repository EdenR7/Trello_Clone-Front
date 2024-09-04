import { IList } from "@/types/list.types";
import CardItem from "./CardItem";
import { Draggable, Droppable } from "@hello-pangea/dnd";

interface ListItemProps {
  list: IList;
  index: number;
  setHoveredItem: (index: number | null) => void;
}
function ListItem({ list, index, setHoveredItem }: ListItemProps) {
  const handleDragOver = (index: number) => {
    console.log(1);

    setHoveredItem(index);
  };

  const handleDragLeave = () => {
    console.log(2);

    setHoveredItem(null);
  };
  return (
    <Draggable draggableId={list._id} index={index}>
      {(provided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          onDragOver={() => handleDragOver(index)}
          onDragLeave={handleDragLeave}
          className="h-full shadow-sm border-black border rounded-xl p-2 overflow-hidden w-[272px] bg-white "
          key={list._id}
        >
          <div {...provided.dragHandleProps}>
            <div>{list.name}</div>
            <div>id: {list._id}</div>
            <p>position : {list.position}</p>
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
