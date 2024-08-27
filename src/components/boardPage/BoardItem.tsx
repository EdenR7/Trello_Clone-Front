import { useGetBoard } from "@/hooks/Query hooks/Board hooks/useGetBoard";
import { Outlet, useParams } from "react-router-dom";
import ListsRender from "./ListsRender";

function BoardItem() {
  const { boardId } = useParams();
  const { data: board, isPending, isError, error } = useGetBoard(boardId!);
  if (isPending) return <div>Loadinggg....</div>;
  if (isError) return <div>Error: {error.message}</div>;
  console.log(board);

  return (
    <>
      <ol className=" list-none flex gap-3">
        <ListsRender />
      </ol>
      <Outlet />
    </>
  );
}

export default BoardItem;
