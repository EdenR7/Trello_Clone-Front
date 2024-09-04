import { IList } from "@/types/list.types";
import CardItem from "./CardItem";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";

interface ListItemProps {
  list: IList;
  index: number;
  setHoveredItem: (index: number | null) => void;
}
function ListItem({ list, index, setHoveredItem }: ListItemProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const filterDefinition = localStorage.getItem("filterDefinition");
  const membersFilter = searchParams.get("members")?.split(",") || "";
  const labelsFilter = searchParams.get("labels")?.split(",") || "";
  const dueDateFilter = searchParams.get("dueDate")?.split(",") || "";

  // console.log("filterDefinition", filterDefinition);
  // console.log("labelsFilter", labelsFilter);
  // console.log("dueDateFilter", dueDateFilter);

  const filteredCards = list.cards.filter((card) => {
    const matchesMembers = membersFilter
      ? card.members.some((member) => membersFilter.includes(member.username))
      : true;

    // const matchesLabels =
    //   !labelsFilter || card.labels.some((label) => label === labelsFilter);
    // const matchesDueDate = !dueDateFilter || card.dueDate === dueDateFilter;
    console.log("members", card.members);

    console.log("matchesMembers", matchesMembers);
    return matchesMembers;
    // return matchesMembers && matchesLabels && matchesDueDate;
  });
  // const filteredCards = useMemo(() => {
  //   return list.cards.filter((card) => {
  //     const matchesMembers = membersFilter
  //       ? card.members.some((member) => membersFilter.includes(member.username))
  //       : true;

  //     // const matchesLabels =
  //     //   !labelsFilter || card.labels.some((label) => label === labelsFilter);
  //     // const matchesDueDate = !dueDateFilter || card.dueDate === dueDateFilter;
  //     console.log("members",card.members);

  //     console.log("matchesMembers", matchesMembers);
  //     return matchesMembers;
  //     // return matchesMembers && matchesLabels && matchesDueDate;
  //   });
  // }, [list.cards, membersFilter, labelsFilter, dueDateFilter]);

  const handleDragOver = (index: number) => {
    setHoveredItem(index);
  };

  const handleDragLeave = () => {
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
                  {filteredCards.map((card, index) => (
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
