import { useGetBoard } from "@/hooks/Query hooks/Board hooks/useGetBoard";
import { useParams } from "react-router-dom";
import ListsRender from "./ListsRender";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useQueryClient } from "@tanstack/react-query";
import { IList } from "@/types/list.types";
import { useListUpdatePosition } from "@/hooks/Query hooks/List hooks/useUpdatePosition";
import { useMoveCardWithinList } from "@/hooks/Query hooks/Card hooks/useMoveCardWithinList";
import { useMoveCardToList } from "@/hooks/Query hooks/Card hooks/useMoveCardToList";
import { useState } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

function BoardItems() {
  const { boardId } = useParams();
  const { data: board, isPending } = useGetBoard(boardId!);

  const qClient = useQueryClient();
  const updateListPosition = useListUpdatePosition(boardId!);
  const moveCardWithinList = useMoveCardWithinList(boardId!);
  const moveCardToList = useMoveCardToList(boardId!);
  const [hoveredItem, setHoveredItem] = useState<null | number>(null);

  if (isPending) return <div>Loading...</div>;
  if (!board) return null;

  function handleListDrag(destination: any, source: any, draggableId: string) {
    if (destination.index === source.index) return;

    const data: IList[] | undefined = qClient.getQueryData(["lists", boardId]);
    if (!data) return;
    const initialData = [...data];

    let newPos = 0;
    if (destination.index === 0) {
      newPos = initialData[0].position / 2;
    } else if (destination.index === initialData.length - 1) {
      newPos = Math.floor(initialData[initialData.length - 1].position + 1);
    } else {
      const secPositionToCalc = destination.index > source.index ? 1 : -1;
      newPos =
        (initialData[destination.index].position +
          initialData[destination.index + secPositionToCalc].position) /
        2;
    }

    const draggedList = initialData.find((list) => list._id === draggableId);
    if (draggedList) {
      updateListPosition.mutate({
        listId: draggableId,
        newPos,
        draggedList,
        newLoc: destination.index,
      });
    }
  }

  function handleCardDrag(destination: any, source: any, draggableId: string) {
    const data: IList[] | undefined = qClient.getQueryData(["lists", boardId]);
    if (!data) return;
    const initialData = [...data]; // list of lists of cards within

    const cardInitialList = initialData.find(
      (list) => list._id === source.droppableId
    );
    const cardFinalList = initialData.find(
      (list) => list._id === destination.droppableId
    );
    const card = cardInitialList?.cards.find(
      (card) => card._id === draggableId
    );

    if (!card || !cardInitialList || !cardFinalList) return;

    const isSameList = cardInitialList._id === cardFinalList._id;

    let cardNewPos = 0;
    if (isSameList) {
      if (source.index === destination.index) return;
      if (destination.index === 0) {
        cardNewPos =
          cardFinalList.cards.length === 0
            ? 1
            : cardFinalList.cards[0].position / 2;
      } else if (destination.index === cardFinalList?.cards.length - 1) {
        cardNewPos = Math.floor(
          cardFinalList.cards[cardFinalList.cards.length - 1].position + 1
        );
      } else {
        let secPositionToCalc = -1;
        destination.index > source.index && (secPositionToCalc = 1);
        cardNewPos =
          (cardFinalList.cards[destination.index].position +
            cardFinalList.cards[destination.index + secPositionToCalc]
              .position) /
          2;
      }
      moveCardWithinList.mutate({
        cardId: draggableId,
        listId: destination.droppableId,
        newPos: cardNewPos,
        lastIndex: source.index,
        destinationIndex: destination.index,
        cardsInitialList: cardInitialList.cards,
        targetCard: card,
      });
    } else {
      // Calc the new position of the card
      if (destination.index === 0) {
        cardNewPos =
          cardFinalList.cards.length === 0
            ? 1
            : cardFinalList.cards[0].position / 2;
      } else if (destination.index === cardFinalList?.cards.length) {
        cardNewPos = Math.floor(
          cardFinalList.cards[cardFinalList.cards.length - 1].position + 1
        );
      } else {
        let secPositionToCalc = -1;
        destination.index > source.index && (secPositionToCalc = 1);
        cardNewPos =
          (cardFinalList.cards[destination.index].position +
            cardFinalList.cards[destination.index - 1].position) /
          2;
      }

      moveCardToList.mutate({
        cardId: draggableId,
        listId: destination.droppableId,
        newPos: cardNewPos,
        sourceIndex: source.index,
        targetCard: card,
        cardInitialList,
        destinationIndex: destination.index,
        cardFinalList,
        previousLists: initialData,
      });
    }
  }

  function onDragEnd(result: any) {
    const { destination, source, draggableId, type } = result;
    if (!destination) return;

    if (type === "list") {
      handleListDrag(destination, source, draggableId);
    } else {
      handleCardDrag(destination, source, draggableId);
    }
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="list" type="list" direction="horizontal">
          {(provided) => (
            <ol
              {...provided.droppableProps}
              ref={provided.innerRef}
              className=" list-none flex gap-3"
            >
              <ListsRender setHoveredItem={setHoveredItem} />
              
              <div
                style={{
                  backgroundColor:
                    hoveredItem !== null ? "black" : "transparent",
                  // minHeight: "100px", // Adjust height based on your needs
                  // minWidth: "100px", // Adjust width based on your needs
                  transition: "background-color 0.2s ease",
                }}
              >
                {provided.placeholder}
              </div>
              <Button
                variant={"naked"}
                className="text-left justify-start flex gap-2 p-3 bg-white/30 rounded-xl min-w-[272px] h-11 font-medium text-white hover:bg-white/20 transition-colors"
              >
                <Plus size={20} />
                Add another list
              </Button>
            </ol>
          )}
        </Droppable>
      </DragDropContext>

      {/* <Outlet /> */}
    </>
  );
}

export default BoardItems;
