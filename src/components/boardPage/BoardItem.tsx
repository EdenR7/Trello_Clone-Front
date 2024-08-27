import { useGetBoard } from "@/hooks/Query hooks/Board hooks/useGetBoard";
import { useParams } from "react-router-dom";

function BoardItem() {
  const { boardId } = useParams();
  const { data, isPending, isError, error } = useGetBoard(boardId!);
  console.log(data);

  if (isPending) return <div>Loading....</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return data && <div>data is here!</div>;
}

export default BoardItem;
