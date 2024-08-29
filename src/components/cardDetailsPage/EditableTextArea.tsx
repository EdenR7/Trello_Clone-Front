import React, { useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { Textarea } from "../ui/textarea";

interface EditableTextAreaProps {
  initialValue: string;
  onSave: (newValue: string) => void;
  onCancel: () => void;
  placeholder?: string;
  className?: string;
}

function EditableTextArea({
  initialValue,
  onSave,
  onCancel,
  placeholder = "Add an item...",
  className = "",
}: EditableTextAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.value.length;
      textareaRef.current.selectionEnd = textareaRef.current.value.length;
    }
  }, []);

  const handleSave = (ev: React.MouseEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    if (textareaRef.current) {
      onSave(textareaRef.current.value);
    }
  };

  const handleCancel = (ev: React.MouseEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    onCancel();
  };

  return (
    <div className={`-ml-2 p-2 ${className}`}>
      <Textarea
        ref={textareaRef}
        defaultValue={initialValue}
        className="rounded-sm ring-2 ring-primary border-none focus-visible:ring-offset-0 resize-none min-h-8 h-[56px] overflow-y-hidden px-3 py-2 w-full"
        placeholder={placeholder}
      />
      <div className="flex items-center gap-2 mt-2">
        <Button onClick={handleSave}>Save</Button>
        <X size={30} onClick={handleCancel} />
      </div>
    </div>
  );
}

export default EditableTextArea;
