import { useGetBoard } from "@/hooks/Query hooks/Board hooks/useGetBoard";
import { Outlet, useParams } from "react-router-dom";
import ListsRender from "./ListsRender";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useQueryClient } from "@tanstack/react-query";
import { IList } from "@/types/list.types";

function BoardItem() {
  const { boardId } = useParams();
  const { data: board, isPending, isError, error } = useGetBoard(boardId!);
  const qClient = useQueryClient();
  if (isPending) return <div>Loadinggg....</div>;
  if (isError) return <div>Error: {error.message}</div>;

  // function calcNewPosition<T>(data: T[]) {

  // }

  function handleListDrag(destination: any, source: any, draggableId: string) {
    if (destination.index === source.index) return; // there wasnt a change list in position
    // console.log("destination", destination);
    // console.log("source", source);
    // console.log("draggableId", draggableId);

    const initialData: IList[] | undefined = qClient.getQueryData([
      "lists",
      boardId,
    ]);
    if (!initialData) return;
    // console.log("initialData", initialData);

    let newPos = 0;
    if (destination.index === 0) {
      newPos = initialData[0].position / 2;
    } else if (destination.index === initialData.length - 1) {
      newPos = Math.floor(initialData[initialData.length - 1].position + 1);
    } else {
      console.log(destination.index);

      newPos =
        (initialData[destination.index].position + destination.index <
        source.index
          ? initialData[destination.index + 1].position
          : initialData[destination.index - 1].position) / 2;
    }
    const draggedList = initialData.find((list) => list._id === draggableId);
    const newList = { ...draggedList!, position: newPos };

    qClient.setQueryData(["lists", boardId], (oldData: IList[]) => {
      if (!oldData) return;
      const lists = oldData.filter((list) => list._id !== draggableId);
      lists.splice(destination.index, 0, newList!);
      return lists;
    });
  }

  function handleCardDrag(destination: any, source: any, draggableId: string) {
    qClient.setQueryData(["lists", boardId], (oldData: IList[]) => {
      if (!oldData) return;
      const cardInitialList = oldData.find(
        (list) => list._id === source.droppableId
      );
      const card = cardInitialList?.cards.find(
        (card) => card._id === draggableId
      );
      const cardFinalList = oldData.find(
        (list) => list._id === destination.droppableId
      );

      if (
        destination.index === 0 ||
        destination.index === cardFinalList?.cards.length
      ) {
      } else {
      }

      if (cardInitialList?._id === cardFinalList?._id) {
        const cards = cardInitialList?.cards;
        cards?.splice(source.index, 1);
        cards?.splice(destination.index, 0, card!);
        return oldData;
      } else {
        cardInitialList?.cards.splice(source.index, 1);
        const cardFinalListCards = cardFinalList?.cards;
        cardFinalListCards?.splice(destination.index, 0, card!);
        return oldData;
      }
    });
  }

  function onDragEnd(result: any) {
    const { destination, source, draggableId, type } = result;
    // console.log("destination", destination);
    // console.log("source", source);
    // console.log("draggableId", draggableId);
    // console.log("type", type);

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
