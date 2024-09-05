import { IList } from "@/types/list.types";
import CardItem from "./CardItem";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { ICard } from "@/types/card.types";

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
  isModalOpen,
  setIsModalOpen,
  activeCardId,
  setActiveCardId,
}: ListItemProps) {
  const [searchParams] = useSearchParams();

  // console.log("here");
  // for (let i = 0; i < list.cards.length; i++) {
  //   console.log("list", list.name);

  //   console.log(list.cards[i].title);
  // }

  const filterDefinition = localStorage.getItem("filterDefinition");
  const membersFilter = searchParams.get("members")?.split(",") || [];
  const labelsFilter = searchParams.get("labels")?.split(",") || [];
  const dueDateFilter = searchParams.get("dueDate")?.split(",") || [];

  const filteredCards = useMemo(() => {
    return list.cards.filter((card) => filterCard(card));
  }, [list, searchParams]);

  function dueDateFilterFunction(card: ICard) {
    if (dueDateFilter.length === 0) return true;
    const dueDate = card.dueDate ? new Date(card.dueDate) : null;
    const now = new Date();
    if (filterDefinition === "Exact") {
      for (const filter of dueDateFilter) {
        switch (filter) {
          case "empty":
            if (dueDate) return false;
            break;
          case "overdue":
            if (!(dueDate && dueDate < now && !card.isComplete)) return false;
            break;
          case "nextDay":
            const nextDay = new Date(now);
            nextDay.setDate(now.getDate() + 1);
            if (!(dueDate && dueDate.toDateString() === nextDay.toDateString()))
              return false;
            break;
          case "nextWeek":
            const nextWeek = new Date(now);
            nextWeek.setDate(now.getDate() + 7);
            if (!(dueDate && dueDate <= nextWeek && dueDate > now))
              return false;
            break;
          case "nextMonth":
            const nextMonth = new Date(now);
            nextMonth.setMonth(now.getMonth() + 1);
            if (!(dueDate && dueDate <= nextMonth && dueDate > now))
              return false;
            break;
          case "completed":
            if (!card.isComplete) return false;
            break;
          case "notCompleted":
            if (card.isComplete) return false;
            break;
          default:
            throw new Error("Invalid due date filter");
        }
      }
      return true;
    } else {
      for (const filter of dueDateFilter) {
        switch (filter) {
          case "empty":
            if (!dueDate) return true;
            break;
          case "overdue":
            if (dueDate && dueDate < now && !card.isComplete) return true;
            break;
          case "nextDay":
            const nextDay = new Date(now);
            nextDay.setDate(now.getDate() + 1);
            if (dueDate && dueDate.toDateString() === nextDay.toDateString())
              return true;
            break;
          case "nextWeek":
            const nextWeek = new Date(now);
            nextWeek.setDate(now.getDate() + 7);
            if (dueDate && dueDate <= nextWeek && dueDate > now) return true;
            break;
          case "nextMonth":
            const nextMonth = new Date(now);
            nextMonth.setMonth(now.getMonth() + 1);
            if (dueDate && dueDate <= nextMonth && dueDate > now) return true;
            break;
          case "completed":
            if (card.isComplete) return true;
            break;
          case "notCompleted":
            if (!card.isComplete) return true;
            break;
          default:
            throw new Error("Invalid due date filter");
        }
      }
      return false;
    }
  }

  function filterCard(card: ICard) {
    const isMembersFilterActive = membersFilter && membersFilter.length > 0;
    const isLabelsFilterActive = labelsFilter && labelsFilter.length > 0;
    const isDueDateFilterActive = dueDateFilter && dueDateFilter.length > 0;
    if (filterDefinition === "Exact") {
      const matchesMembers = isMembersFilterActive
        ? membersFilter.every((selectedMember) => {
            if (selectedMember === "empty") return card.members.length === 0;
            return card.members.some(
              (member) => member.username === selectedMember
            );
          })
        : true;

      const matchesLabels = isLabelsFilterActive
        ? labelsFilter.every((selectedLabelId) => {
            if (selectedLabelId === "empty") return card.labels.length === 0;
            return card.labels.some((label) => label._id === selectedLabelId);
          })
        : true;

      const matchesDueDate = dueDateFilterFunction(card);

      return matchesMembers && matchesLabels && matchesDueDate;
    } else {
      const matchesMembers = isMembersFilterActive
        ? card.members.some((member) =>
            membersFilter.includes(member.username)
          ) ||
          (membersFilter.includes("empty") && card.members.length === 0)
        : false;

      const matchesLabels = isLabelsFilterActive
        ? card.labels.some((label) => labelsFilter.includes(label._id)) ||
          (labelsFilter.includes("empty") && card.labels.length === 0)
        : false;

      const matchesDueDate = dueDateFilterFunction(card);

      if (
        !isMembersFilterActive &&
        !isLabelsFilterActive &&
        !isDueDateFilterActive
      ) {
        return true;
      }

      return (
        matchesMembers ||
        matchesLabels ||
        (matchesDueDate && isDueDateFilterActive)
      );
    }
  }

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
          className="h-full shadow-sm border-black border rounded-xl p-2 overflow-hidden min-w-[272px] max-w-[272px] bg-gray-200 "
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
