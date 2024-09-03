import { Button } from "../ui/button";

interface IconButtonProps {
  text: string;
  icon: React.ReactNode; // ReactNode allows any renderable React content
  className?: string;
}

function CardSidebarButton({ text, icon, className = "" }: IconButtonProps) {
  return (
    <Button
      variant={"secondary"}
      className={` h-8 overflow-hidden relative text-ellipsis whitespace-nowrap max-w-[300px] flex justify-start items-center py-[6px] px-3 mr-2 w-[calc(50%-8px)] ${className}`}
    >
      <span className=" mr-[6px] -ml-[6px]">{icon}</span>
      <span>{text}</span>
    </Button>
  );
}

export default CardSidebarButton;
