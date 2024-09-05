import { useGetLists } from "@/hooks/Query hooks/List hooks/useGetList";
import { useParams } from "react-router-dom";
import ListItem from "./ListItem";
import { useState } from "react";

interface ListRenderProps {
  setHoveredItem: (index: number | null) => void;
}

function ListsRender({ setHoveredItem }: ListRenderProps) {
  const { boardId } = useParams();
  const { data: lists, isPending, isError, error } = useGetLists(boardId!);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  // console.log(isPending);

  if (isPending) return <div>Loading lists...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  const NewLists = [...lists!];

  return NewLists?.map((list, index) => (
    <ListItem
      setHoveredItem={setHoveredItem}
      key={list._id}
      list={list}
      index={index}
      activeCardId={activeCardId}
      setActiveCardId={setActiveCardId}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
    />
  ));
}

export default ListsRender;
