import { useGetLists } from "@/hooks/Query hooks/List hooks/useGetList";
import { useParams } from "react-router-dom";
import ListItem from "./ListItem";
import React, { useState } from "react";
import { SkeletonList } from "../ui/SkeletonList";

// interface ListRenderProps {
// setHoveredItem: (index: number | null) => void;
// }

// function ListsRender({}: ListRenderProps) {
//   console.log("ListsRender");

//   const { boardId } = useParams();
//   const { data: lists, isPending, isError, error } = useGetLists(boardId!);
//   // const { data: lists } = useGetLists(boardId!);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [activeCardId, setActiveCardId] = useState<string | null>(null);

//   if (isPending) return <div>Loading lists...</div>;
//   if (isError) return <div>Error: {error.message}</div>;
//   // const NewLists = [...lists!];

//   return lists?.map((list, index) => {
//     console.log("ListsRender");
//     console.log(list);

//     return (
//       <ListItem
//         // setHoveredItem={setHoveredItem}
//         key={list._id}
//         list={list}
//         index={index}
//         activeCardId={activeCardId}
//         setActiveCardId={setActiveCardId}
//         isModalOpen={isModalOpen}
//         setIsModalOpen={setIsModalOpen}
//       />
//     );
//   });
// }
const ListsRender = React.memo(
  (
    {
      /* setHoveredItem */
    }
  ) => {
    // console.log("ListsRender");

    const { boardId } = useParams();
    const { data: lists, isPending, isError, error } = useGetLists(boardId!);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeCardId, setActiveCardId] = useState<string | null>(null);

    if (isPending) return <SkeletonList />;
    if (isError) return <div>Error: {error.message}</div>;

    return lists?.map((list, index) => {
      console.log(list);
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
