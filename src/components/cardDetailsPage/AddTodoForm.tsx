// import { Button } from "../ui/button";
// import { Textarea } from "../ui/textarea";
// import { useRef } from "react";

// interface AddTodoFormProps {
//   checklistId: string;
//   onAddItem: (checklistId: string, todoTitle: string) => void;
//   onCancel: () => void;
// }

// function AddTodoForm({ checklistId, onAddItem, onCancel }: AddTodoFormProps) {
//   const addItemTextareaRef = useRef<HTMLTextAreaElement>(null);

//   const handleAdd = () => {
//     if (addItemTextareaRef.current) {
//       const todoTitle = addItemTextareaRef.current.value;
//       onAddItem(checklistId, todoTitle);
//       addItemTextareaRef.current.value = ""; // Clear input after adding
//     }
//   };

//   return (
//     <>
//       <Textarea
//         ref={addItemTextareaRef}
//         className="rounded-sm ring-2 ring-primary border-none focus-visible:ring-offset-0 resize-y min-h-8 h-[56px] overflow-y-hidden"
//         placeholder="Add an item..."
//       />
//       <div className="flex justify-between mt-2">
//         <Button onClick={handleAdd} className="mr-1">
//           Add
//         </Button>
//         <Button onClick={onCancel} className="bg-gray-200" variant="secondary">
//           Cancel
//         </Button>
//       </div>
//     </>
//   );
// }

// export default AddTodoForm;

import { RefObject } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface AddTodoFormProps {
  onAdd: (todoTitle: string) => void;
  onCancel: () => void;
  textareaRef: RefObject<HTMLTextAreaElement>;
}

export default function AddTodoForm({
  onAdd,
  onCancel,
  textareaRef,
}: AddTodoFormProps) {
  const handleSubmit = () => {
    if (textareaRef.current && textareaRef.current.value.trim()) {
      onAdd(textareaRef.current.value);
    }
  };

  return (
    <>
      <Textarea
        ref={textareaRef}
        className="rounded-sm ring-2 ring-primary border-none focus-visible:ring-offset-0 resize-y min-h-8 h-[56px] overflow-y-hidden"
        placeholder="Add an item..."
      />
      <div className="flex justify-between">
        <div className="mt-2">
          <Button onClick={handleSubmit} className="mr-1">
            Add
          </Button>
          <Button
            onClick={onCancel}
            className="bg-gray-200"
            variant="secondary"
          >
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
}
