import { useGetLists } from "@/hooks/Query hooks/List hooks/useGetList";
import { useParams } from "react-router-dom";
import ListItem from "./ListItem";
import { useQueryClient } from "@tanstack/react-query";


function ListsRender() {
  const { boardId } = useParams();
  const { data: lists, isPending, isError, error } = useGetLists(boardId!);
  const qClient = useQueryClient();

  if (isPending) return <div>Loading lists...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return lists?.map((list, index) => (
    <ListItem key={list._id} list={list} index={index} />
  ));
  // return (
  //   // <React.Fragment key={list._id}>
  //     <Droppable droppableId="list" type="list" direction="horizontal">
  //       {(provided) => (
  //         <li
  //           className="  h-full shadow-sm border-black border rounded-xl p-2 overflow-hidden"
  //           key={list._id}
  //         >
  //           <div className=" w-[272px]">
  //             <div>{list.name}</div>
  //             <div>id: {list._id}</div>
  //             <div className=" flex flex-col gap-3">
  //               {" "}
  //               cards:
  //               {list.cards.map((card) => (
  //                 <Link key={card._id} to={`/b/${boardId}/c/${card._id}`}>
  //                   <CardItem card={card} />
  //                 </Link>
  //               ))}
  //             </div>
  //           </div>
  //         </li>
  //       )}
  //     </Droppable>

  //   // </React.Fragment>
  // );
  // });
}

export default ListsRender;
