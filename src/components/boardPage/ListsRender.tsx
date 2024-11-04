import { useGetLists } from "@/hooks/Query hooks/List hooks/useGetList";
import { useParams } from "react-router-dom";
import ListItem from "./ListItem";
import React, { useState } from "react";
import { SkeletonList } from "../ui/SkeletonList";

const ListsRender = React.memo(
  (
    {
      /* setHoveredItem */
    }
  ) => {

    const { boardId } = useParams();
    const { data: lists, isPending, isError, error } = useGetLists(boardId!);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeCardId, setActiveCardId] = useState<string | null>(null);

    if (isPending) return <SkeletonList />;
    if (isError) return <div>Error: {error.message}</div>;

    return lists?.map((list, index) => {
      return (
        <ListItem
          key={list._id}
          list={list}
          index={index}
          activeCardId={activeCardId}
          setActiveCardId={setActiveCardId}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      );
    });
  }
);
export default ListsRender;
