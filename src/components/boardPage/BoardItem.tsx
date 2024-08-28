import { useGetBoard } from "@/hooks/Query hooks/Board hooks/useGetBoard";
import { Outlet, useParams } from "react-router-dom";
import ListsRender from "./ListsRender";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IList } from "@/types/list.types";
import api from "@/lib/api";
import { useListUpdatePosition } from "@/hooks/Query hooks/List hooks/useUpdatePosition";
import { ICard } from "@/types/card.types";

export function countDecimalPlaces(number: number) {
  const numStr = number.toString();
  if (numStr.includes(".")) {
    return numStr.split(".")[1].length;
  }
  return 0;
}

export async function moveCardWithinListApi(cardId: string, newPos: number) {
  try {
    console.log(1);

    const res = await api.patch(`/card/${cardId}/position`, {
      newPosition: newPos,
    });
    return res.data;
  } catch (error) {
    console.log("moveCardWithinListApi", error);
  }
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
  const moveCardWithinList = useMutation({
    mutationFn: ({
      cardId,
      newPos,
    }: {
      cardId: string;
      newPos: number;
      lastIndex: number;
      destinationIndex: number;
      cardsInitialList: IList["cards"];
      targetCard: ICard;
    }) => moveCardWithinListApi(cardId, newPos),
    onMutate: async ({
      // cardId,
      newPos,
      lastIndex,
      destinationIndex,
      cardsInitialList,
      targetCard,
    }) => {
      const previousLists = qClient.getQueryData(["lists", boardId]);
      targetCard.position = newPos;
      if (previousLists) {
        // update the position of the card in the list
        const cards = cardsInitialList;
        cards.splice(lastIndex, 1);
        cards.splice(destinationIndex, 0, targetCard!);
        qClient.setQueryData(["lists", boardId], previousLists);
      }

      return { previousLists };
    },
    onError: (err, variables, context) => {
      if (context?.previousLists) {
        qClient.setQueryData(["lists", boardId], context.previousLists);
      }
      console.error("Error updating list position:", err);
    },
  });

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

    const initialData: IList[] | undefined = qClient.getQueryData([
      "lists",
      boardId,
    ]);
    if (!initialData) return;

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
    const initialData: IList[] | undefined = qClient.getQueryData([
      "lists",
      boardId,
    ]);
    if (!initialData) return;

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

    const isSameList = cardInitialList?._id === cardFinalList?._id;

    if (isSameList && source.index === destination.index) return;

    let newPos = 0;
    if (destination.index === 0) {
      // console.log("top");
      if (cardFinalList.cards.length === 0) {
        newPos = 1;
      } else {
        newPos = cardFinalList.cards[0].position / 2;
      }
    } else if (
      (isSameList && destination.index === cardFinalList?.cards.length - 1) ||
      (!isSameList && destination.index === cardFinalList?.cards.length)
    ) {
      // console.log("Bottom");
      newPos = Math.floor(
        cardFinalList.cards[cardFinalList.cards.length - 1].position + 1
      );
    } else {
      // console.log("middle");
      newPos =
        (cardFinalList.cards[destination.index].position +
          cardFinalList.cards[destination.index - 1].position) /
        2;
      console.log("newPos", newPos);
    }

    // bug from bottom to top

    if (isSameList) {
      moveCardWithinList.mutate({
        cardId: draggableId,
        newPos,
        lastIndex: source.index,
        destinationIndex: destination.index,
        cardsInitialList: cardInitialList.cards,
        targetCard: card,
      });
    } else {
    }

    qClient.setQueryData(["lists", boardId], (oldData: IList[]) => {
      if (!oldData) return;

      card.position = newPos;

      if (cardInitialList?._id === cardFinalList?._id) {
        // movement within the same list
        // const cards = cardInitialList?.cards;
        // cards?.splice(source.index, 1);
        // cards?.splice(destination.index, 0, card!);
      } else {
        cardInitialList?.cards.splice(source.index, 1);
        const cardFinalListCards = cardFinalList?.cards;
        cardFinalListCards?.splice(destination.index, 0, card!);
      }
    });
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
