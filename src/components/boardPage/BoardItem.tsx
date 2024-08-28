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

  function handleListDrag(
    destination: any,
    source: any,
    draggableId: string,
    type: string
  ) {
    qClient.setQueryData(["lists", boardId], (oldData: IList[]) => {
      if (!oldData) return;

      const draggedList = oldData.find((list) => list._id === draggableId);

      const lists = oldData.filter((list) => list._id !== draggableId);
      lists.splice(destination.index, 0, draggedList!);

      return lists;
    });
  }

  function handleCardDrag(
    destination: any,
    source: any,
    draggableId: string,
    type: string
  ) {
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
      console.log("cardInitialList", cardInitialList);
      console.log("cardFinalList", cardFinalList);
      console.log("card", card);
    });
  }

  function onDragEnd(result: any) {
    const { destination, source, draggableId, type } = result;
    // console.log(destination, source, draggableId);
    console.log("destination", destination);
    console.log("source", source);
    console.log("draggableId", draggableId);
    console.log("type", type);

    if (!destination) return;

    if (type === "list") {
      handleListDrag(destination, source, draggableId, type);
    } else {
      handleCardDrag(destination, source, draggableId, type);
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
