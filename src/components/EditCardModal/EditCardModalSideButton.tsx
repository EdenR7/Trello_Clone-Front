import { Button } from "../ui/button";
import React from "react";

interface EditCardModalSideButtonProps {
  title: string;
  icon: React.ReactElement;
  onClick?: (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

// Use forwardRef to pass ref to the Button
const EditCardModalSideButton = React.forwardRef<
  HTMLButtonElement,
  EditCardModalSideButtonProps
>(({ title, icon, onClick }, ref) => {
  return (
    <Button
      ref={ref} // forward the ref to the Button
      onClick={(ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        if (onClick) {
          onClick(ev);
        }
      }}
      variant={"secondary"}
      className={`h-8 overflow-hidden relative text-ellipsis whitespace-nowrap w-auto flex justify-start items-center py-[6px] pr-3 pl-3 mb-1 bg-gray-200`}
    >
      <span className="mr-[6px] -ml-[6px]">{icon}</span>
      <span>{title}</span>
    </Button>
  );
});

// Provide a display name for the component when using forwardRef (optional but useful)
EditCardModalSideButton.displayName = "EditCardModalSideButton";

export default EditCardModalSideButton;
