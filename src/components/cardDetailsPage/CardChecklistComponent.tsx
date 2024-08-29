// import { ICard } from "@/types/card.types";
// import { SquareCheckBig } from "lucide-react";
// import { Button } from "../ui/button";
// import { Progress } from "../ui/progress";
// import { ITodo } from "@/types/checklist.types";
// import { useEffect, useRef, useState } from "react";
// import { Textarea } from "../ui/textarea";
// import { useParams } from "react-router-dom";
// import { useAddTodo } from "@/hooks/Query hooks/Card hooks/useAddTodo";
// import { Checkbox } from "../ui/checkbox";

// interface CardChecklistComponentProps {
//   card: ICard;
// }

// function CardChecklistComponent(props: CardChecklistComponentProps) {
//   const { card } = props;
//   const { boardId } = useParams();
//   const cardId = card._id;
//   const [hideCheckedItems, setHideCheckedItems] = useState(false);
//   const { mutate: addTodo } = useAddTodo(boardId!);
//   const [activeChecklistId, setActiveChecklistId] = useState<string | null>(
//     null
//   );
//   const addItemTextareaRef = useRef<HTMLTextAreaElement>(null);

//   useEffect(() => {
//     if (addItemTextareaRef.current) {
//       addItemTextareaRef.current.focus();
//     }
//   }, [activeChecklistId]);

//   const checklists = card.checklist.map((checklist) => ({
//     ...checklist,
//     todos: hideCheckedItems
//       ? checklist.todos.filter((todo) => !todo.isComplete)
//       : checklist.todos,
//   }));

//   if (!cardId || !boardId) return null;

//   const calculateProgress = (todos: ITodo[]) => {
//     if (todos.length === 0) return 0;
//     const completedTodos = todos.filter((todo) => todo.isComplete).length;
//     return (completedTodos / todos.length) * 100;
//   };

//   function handleAddItem(checklistId: string) {
//     setActiveChecklistId(null);
//     if (addItemTextareaRef.current) {
//       const todoTitle = addItemTextareaRef.current.value;
//       addTodo({ cardId, checklistId, todoTitle });
//     }
//   }

//   return (
//     <div>
//       {checklists &&
//         checklists.length > 0 &&
//         checklists.map((checklist) => (
//           <div key={checklist._id} className="mb-6">
//             <div className="py-2 mb-1 ml-11 relative">
//               <SquareCheckBig className="absolute -left-10 top-2" />
//               <div className="flex justify-between">
//                 <h3 className="font-semibold text-[16px]">{checklist.name}</h3>
//                 <div>
//                   <Button variant={"secondary"} className=" mr-2">
//                     Hide checked items
//                   </Button>
//                   <Button variant={"secondary"}>Delete</Button>
//                 </div>
//               </div>
//             </div>
//             <div className="relative mb-[6px]">
//               <span className="text-gray-600 text-[11px] absolute text-center -top-[5px] left-0 w-8">
//                 {calculateProgress(checklist.todos)}%
//               </span>
//               <Progress
//                 value={calculateProgress(checklist.todos)}
//                 className="ml-10 relative overflow-hidden h-2 rounded-md bg-btn_bg_primary"
//               />
//             </div>
//             <div className="min-h-2">
//               {checklist.todos.map((todo) => (
//                 <div
//                   className=" relative pl-10 rounded-lg transition-colors"
//                   key={todo._id}
//                 >
//                   <div className=" cursor-pointer left-[2px] m-[6px] absolute text-center top-1">
//                     <Checkbox
//                       className=" h-4 w-4 m-0 border-black rounded-none border"
//                       id={todo._id}
//                     />
//                   </div>
//                   <div className=" rounded-xl -ml-2 py-[6px] px-2 break-words break-all">
//                     <span className={`${todo.isComplete && "line-through"}`}>
//                       {todo.title}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="ml-10">
//               {activeChecklistId === checklist._id ? (
//                 <>
//                   <Textarea
//                     ref={addItemTextareaRef}
//                     className="rounded-sm ring-2 ring-primary border-none focus-visible:ring-offset-0 resize-y min-h-8 h-[56px] overflow-y-hidden"
//                     placeholder="Add an item..."
//                   />
//                   <div className="flex justify-between">
//                     <div className="mt-2">
//                       <Button
//                         onClick={() => handleAddItem(checklist._id)}
//                         className="mr-1"
//                       >
//                         Add
//                       </Button>
//                       <Button
//                         onClick={() => setActiveChecklistId(null)} // Close the add item section for the current checklist
//                         className="bg-gray-200"
//                         variant={"secondary"}
//                       >
//                         Cancel
//                       </Button>
//                     </div>
//                   </div>
//                 </>
//               ) : (
//                 <Button
//                   onClick={() => setActiveChecklistId(checklist._id)} // Open the add item section for the current checklist
//                   variant={"secondary"}
//                 >
//                   Add an item
//                 </Button>
//               )}
//             </div>
//           </div>
//         ))}
//     </div>
//   );
// }

// export default CardChecklistComponent;

import { useState } from "react";
import { useParams } from "react-router-dom";
import { ICard } from "@/types/card.types";
import { useAddTodo } from "@/hooks/Query hooks/Card hooks/useAddTodo";
import ChecklistItem from "./ChecklistItem";

interface CardChecklistComponentProps {
  card: ICard;
}

export default function CardChecklistComponent({
  card,
}: CardChecklistComponentProps) {
  const { boardId } = useParams();
  const [hideCheckedItems, setHideCheckedItems] = useState(false);
  const [activeChecklistId, setActiveChecklistId] = useState<string | null>(
    null
  );
  const { mutate: addTodo } = useAddTodo(boardId!);

  const checklists = card.checklist.map((checklist) => ({
    ...checklist,
    todos: hideCheckedItems
      ? checklist.todos.filter((todo) => !todo.isComplete)
      : checklist.todos,
  }));

  if (!card._id || !boardId) return null;

  return (
    <div>
      {checklists.map((checklist) => (
        <ChecklistItem
          key={checklist._id}
          checklist={checklist}
          cardId={card._id}
          addTodo={addTodo}
          hideCheckedItems={hideCheckedItems}
          setHideCheckedItems={setHideCheckedItems}
          activeChecklistId={activeChecklistId}
          setActiveChecklistId={setActiveChecklistId}
        />
      ))}
    </div>
  );
}
