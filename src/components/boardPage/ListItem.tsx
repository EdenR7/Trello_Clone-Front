import { IList } from "@/types/list.types";
import CardItem from "./CardItem";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { ICard } from "@/types/card.types";
import { Button } from "../ui/button";
import { Ellipsis, List, Plus } from "lucide-react";
import AddCardForm from "./AddCardForm";
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu";
import ListMenu from "./ListMenu";
import { Textarea } from "../ui/textarea";
import ListItemTitle from "./ListItemTitle";

interface ListItemProps {
  list: IList;
  index: number;
  setHoveredItem: (index: number | null) => void;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeCardId: string | null;
  setActiveCardId: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface IAddACardFormOpen {
  open: boolean;
  position: "top" | "bottom";
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
  const [openListMenu, setOpenListMenu] = useState(false);
  const [addACardFormOpen, setAddACardFormOpen] = useState<IAddACardFormOpen>({
    open: false,
    position: "top",
  });

  const filterDefinition = searchParams.get("filtersDefinition") || "Any";
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
          className="h-full pb-2 pr-1 shadow-sm rounded-xl overflow-hidden min-w-[272px] max-w-[272px] bg-gray-200 text-text_dark_blue"
          key={list._id}
        >
          <div {...provided.dragHandleProps}>
            <header className=" flex justify-between px-2 pt-2 mb-2">
              <ListItemTitle list={list} />
              <DropdownMenu open={openListMenu} onOpenChange={setOpenListMenu}>
                <DropdownMenuTrigger asChild>
                  <Button
                    onClick={() => setOpenListMenu(true)}
                    variant={"secondary"}
                    className=" p-2 bg-inherit rounded-lg"
                  >
                    <Ellipsis
                      strokeWidth={1.8}
                      size={16}
                      className=" text-slate-600"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <ListMenu
                  indexInBoard={index}
                  list={list}
                  setAddACardFormOpen={setAddACardFormOpen}
                  setOpenListMenu={setOpenListMenu}
                />
              </DropdownMenu>
            </header>
            {/* <p>position : {list.position}</p> */}
            {addACardFormOpen.open && addACardFormOpen.position === "top" && (
              <div className=" mx-1 px-1 py-[2px] mb-1">
                <AddCardForm
                  listId={list._id}
                  setAddACardFormOpen={setAddACardFormOpen}
                />
              </div>
            )}
            <div
              className={` ${
                addACardFormOpen.open
                  ? "max-h-[calc(100vh-192px-40px-104px)]"
                  : "max-h-[calc(100vh-192px-40px)]"
              } overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200`}
            >
              <Droppable droppableId={list._id} type="card">
                {(provided) => (
                  <ol
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className=" flex flex-col gap-1 min-h-1"
                  >
                    {filteredCards.map((card, index) => (
                      <li key={card._id} className=" mx-1 px-1 py-[2px]">
                        <CardItem
                          isModalOpen={isModalOpen}
                          setIsModalOpen={setIsModalOpen}
                          card={card}
                          index={index}
                          activeCardId={activeCardId}
                          setActiveCardId={setActiveCardId}
                        />
                      </li>
                    ))}

                    {provided.placeholder}
                  </ol>
                )}
              </Droppable>
            </div>
            <div className=" px-2 pt-2">
              {!addACardFormOpen.open && (
                <Button
                  onClick={() =>
                    setAddACardFormOpen({
                      open: true,
                      position: "bottom",
                    })
                  }
                  variant={"secondary"}
                  className="flex gap-2 justify-start items-center h-8 py-[6px] pl-2 pr-3 w-[220px] rounded-[8px] bg-inherit text-slate-600 text-start"
                >
                  <Plus size={18} />
                  <span className=" flex-1">Add a card</span>
                </Button>
              )}
              {addACardFormOpen.open &&
                addACardFormOpen.position === "bottom" && (
                  <AddCardForm
                    listId={list._id}
                    setAddACardFormOpen={setAddACardFormOpen}
                  />
                )}
            </div>
          </div>
        </li>
      )}
    </Draggable>
  );
}

export default ListItem;
