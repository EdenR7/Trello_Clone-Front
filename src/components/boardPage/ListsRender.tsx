import { useGetLists } from "@/hooks/Query hooks/List hooks/useGetList";
import { useParams } from "react-router-dom";
import ListItem from "./ListItem";

interface ListRenderProps {
  setHoveredItem: (index: number | null) => void;
}

function ListsRender({ setHoveredItem }: ListRenderProps) {
  const { boardId } = useParams();
  const { data: lists, isPending, isError, error } = useGetLists(boardId!);

  if (isPending) return <div>Loading lists...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return lists?.map((list, index) => (
    <ListItem
      setHoveredItem={setHoveredItem}
      key={list._id}
      list={list}
      index={index}
    />
  ));
}

export default ListsRender;
