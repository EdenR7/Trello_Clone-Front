import { RefObject, useEffect } from "react";
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault(); // Prevents a new line from being added
        handleSubmit();
      }
    };

    if (textareaRef.current) {
      textareaRef.current.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (textareaRef.current) {
        textareaRef.current.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [textareaRef]);

  return (
    <>
      <Textarea
        ref={textareaRef}
        className="rounded-none mt-1 ring-2 ring-primary border-none focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-primary resize-y min-h-8 h-[56px] overflow-y-hidden"
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
