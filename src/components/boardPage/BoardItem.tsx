import { useGetBoard } from "@/hooks/Query hooks/Board hooks/useGetBoard";
import { Outlet, useParams } from "react-router-dom";
import ListsRender from "./ListsRender";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IList } from "@/types/list.types";
import { useListUpdatePosition } from "@/hooks/Query hooks/List hooks/useUpdatePosition";
import { useMoveCardWithinList } from "@/hooks/Query hooks/Card hooks/useMoveCardWithinList";
import api from "@/lib/api";
import { ICard } from "@/types/card.types";
import { reOrderCardPositions } from "@/utils/utilFuncs";
import { useMoveCardToList } from "@/hooks/Query hooks/Card hooks/useMoveCardToList";

export function countDecimalPlaces(number: number) {
  const numStr = number.toString();
  if (numStr.includes(".")) {
    return numStr.split(".")[1].length;
  }
  return 0;
}

type BoardStyle = {
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
};

function BoardItem() {
  const { boardId } = useParams();
  const { data: board, isPending, isError, error } = useGetBoard(boardId!);
  const qClient = useQueryClient();
  const updateListPosition = useListUpdatePosition(boardId!);
  const moveCardWithinList = useMoveCardWithinList(boardId!);
  const moveCardToList = useMoveCardToList(boardId!);
  if (!board) return null;

  let boardStyle: BoardStyle;
  if (board.bg) {
    boardStyle = {
      ...(board!.bg.bgType === "color" && {
        backgroundColor: board!.bg.background,
      }),
      ...(board!.bg.bgType === "gradient" && {
        backgroundImage: board!.bg.background,
      }),
      ...(board!.bg.bgType === "image" && {
        backgroundImage: `url(${board!.bg.background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }),
    };
  }

  if (isPending) return <div>Loadinggg....</div>;
  if (isError) return <div>Error: {error.message}</div>;

  function handleListDrag(destination: any, source: any, draggableId: string) {
    if (destination.index === source.index) return; // there wasnt a change list in position

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
              className=" list-none flex gap-3 min-h-[80vh] w-full"
              style={boardStyle}
            >
              <ListsRender />
              {provided.placeholder}
            </ol>
          )}
        </Droppable>
      </DragDropContext>

      <Outlet />
    </>
  );
}

export default BoardItem;
