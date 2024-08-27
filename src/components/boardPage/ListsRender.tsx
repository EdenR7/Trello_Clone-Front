import { useGetLists } from "@/hooks/Query hooks/List hooks/useGetList";
import React from "react";
import { Link, useParams } from "react-router-dom";
import CardItem from "./CardItem";

function ListsRender() {
  const { boardId } = useParams();
  const { data: lists, isPending, isError, error } = useGetLists(boardId!);
  if (isPending) return <div>Loading lists...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  return lists?.map((list) => {
    return (
      <React.Fragment key={list._id}>
        <li className="  h-full">
          <div className=" w-[272px]">
            <div>{list.name}</div>
            <div>id: {list._id}</div>
            <div className=" flex flex-col gap-3">
              {" "}
              cards:
              {list.cards.map((card) => (
                <Link key={card._id} to={`/b/${boardId}/c/${card._id}`}>
                  <CardItem card={card} />
                </Link>
              ))}
            </div>
          </div>
        </li>
      </React.Fragment>
    );
  });
}

export default ListsRender;
