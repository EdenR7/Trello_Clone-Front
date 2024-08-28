import { useGetLists } from "@/hooks/Query hooks/List hooks/useGetList";
import { useParams } from "react-router-dom";
import ListItem from "./ListItem";



function ListsRender() {
  const { boardId } = useParams();
  const { data: lists, isPending, isError, error } = useGetLists(boardId!);
  // const updateListPosition = useMutation({
  //   mutationFn:()=> updateListPos(list._id, ),
  // })

  if (isPending) return <div>Loading lists...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return lists?.map((list, index) => (
    <ListItem key={list._id} list={list} index={index} />
  ));
}

export default ListsRender;
