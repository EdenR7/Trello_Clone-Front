import { IList } from "@/types/list.types";
import CardItem from "./CardItem";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";

interface ListItemProps {
  list: IList;
  index: number;
  setHoveredItem: (index: number | null) => void;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeCardId: string | null;
  setActiveCardId: React.Dispatch<React.SetStateAction<string | null>>;
}
function ListItem({
  list,
  index,
  setHoveredItem,
  isModalOpen,
  setIsModalOpen,
  activeCardId,
  setActiveCardId,
}: ListItemProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  // console.log("here");
  // for (let i = 0; i < list.cards.length; i++) {
  //   console.log("list", list.name);

  //   console.log(list.cards[i].title);
  // }

  const filterDefinition = localStorage.getItem("filterDefinition");
  const membersFilter = searchParams.get("members")?.split(",") || [];
  const labelsFilter = searchParams.get("labels")?.split(",") || [];
  const dueDateFilter = searchParams.get("dueDate")?.split(",") || [];

  // console.log("filterDefinition", filterDefinition);
  // console.log("labelsFilter", labelsFilter);
  // console.log("dueDateFilter", dueDateFilter);

  // const filteredCards = list.cards.filter((card) => {
  //   if (filterDefinition === "Exact") {
  //     const isMembersFilterActive = membersFilter && membersFilter.length > 0;
  //     const isLabelsFilterActive = labelsFilter && labelsFilter.length > 0;

  //     const matchesMembers = isMembersFilterActive
  //       ? membersFilter.every((selectedMember) =>
  //           card.members.some((member) => member.username === selectedMember)
  //         )
  //       : true;

  //     const matchesLabels = isLabelsFilterActive
  //       ? labelsFilter.every((selectedLabelId) =>
  //           card.labels.some((label) => label._id === selectedLabelId)
  //         )
  //       : true;

  //     console.log(card.title);

  //     console.log(matchesLabels, matchesMembers);

  //     return matchesMembers && matchesLabels;
  //   } else {
  //     console.log(1);

  //     const isMembersFilterActive = membersFilter && membersFilter.length > 0;
  //     const isLabelsFilterActive = labelsFilter && labelsFilter.length > 0;

  //     const matchesMembers = isMembersFilterActive
  //       ? card.members.some((member) => membersFilter.includes(member.username))
  //       : false;

  //     const matchesLabels = isLabelsFilterActive
  //       ? card.labels.some((label) => labelsFilter.includes(label._id))
  //       : false;

  //     if (!isMembersFilterActive && !isLabelsFilterActive) {
  //       return true;
  //     }

  //     return matchesMembers || matchesLabels;
  //   }
  // });
  // console.log("filteredCards", filteredCards);

  const filteredCards = useMemo(() => {
    console.log(1);

    return list.cards.filter((card) => {
      if (filterDefinition === "Exact") {
        const isMembersFilterActive = membersFilter && membersFilter.length > 0;
        const isLabelsFilterActive = labelsFilter && labelsFilter.length > 0;

        const matchesMembers = isMembersFilterActive
          ? membersFilter.every((selectedMember) =>
              card.members.some((member) => member.username === selectedMember)
            )
          : true;

        const matchesLabels = isLabelsFilterActive
          ? labelsFilter.every((selectedLabelId) =>
              card.labels.some((label) => label._id === selectedLabelId)
            )
          : true;

        return matchesMembers && matchesLabels;
      } else {
        const isMembersFilterActive = membersFilter && membersFilter.length > 0;
        const isLabelsFilterActive = labelsFilter && labelsFilter.length > 0;

        const matchesMembers = isMembersFilterActive
          ? card.members.some((member) =>
              membersFilter.includes(member.username)
            )
          : false;

        const matchesLabels = isLabelsFilterActive
          ? card.labels.some((label) => labelsFilter.includes(label._id))
          : false;

        if (!isMembersFilterActive && !isLabelsFilterActive) {
          return true;
        }

        return matchesMembers || matchesLabels;
      }
    });
  }, [list, searchParams, filterDefinition]);

  return (
    <Draggable
      draggableId={list._id}
      index={index}
      isDragDisabled={isModalOpen}
    >
      {(provided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          // onDragOver={() => handleDragOver(index)}
          // onDragLeave={handleDragLeave}
          className="h-full shadow-sm border-black border rounded-xl p-2 overflow-hidden min-w-[272px] bg-gray-200 "
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
                    <CardItem
                      isModalOpen={isModalOpen}
                      setIsModalOpen={setIsModalOpen}
                      key={card._id}
                      card={card}
                      index={index}
                      activeCardId={activeCardId}
                      setActiveCardId={setActiveCardId}
                    />
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
