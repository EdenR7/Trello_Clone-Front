import CardPopoverTitle from "@/components/general/CardPopoverTitle";
import DatePopoverLayout from "@/components/general/DatePopoverLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useCreateChecklist from "@/hooks/Query hooks/Checklist hooks/useCreateChecklist";
import { ICard } from "@/types/card.types";
import { SquareCheckBig } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

interface ChecklistLayoutProps {
  card: ICard;
}

function ChecklistLayout(props: ChecklistLayoutProps) {
  const { card } = props;
  const { boardId } = useParams();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { mutate: createChecklist } = useCreateChecklist(boardId!);

  useEffect(() => {
    if (isPopoverOpen) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 0);
    }
  }, [isPopoverOpen]);

  function handleCreateChecklist(checklistName: string) {
    setIsPopoverOpen(false);
    createChecklist({ cardId: card._id!, checklistName });
  }

  return (
    <DatePopoverLayout
      internalOpen={isPopoverOpen}
      setInternalOpen={setIsPopoverOpen}
      title="Checklist"
      trigger={
        <Button
          variant={"secondary"}
          className={` break-card_modal:w-auto mt-2 w-full h-8 overflow-hidden relative text-ellipsis whitespace-nowrap flex justify-start items-center py-[6px] px-3 mr-2 $`}
        >
          <span className="mr-[6px] -ml-[6px]">
            <SquareCheckBig size={15} />
          </span>
          <span>Checklist</span>
        </Button>
      }
    >
      <CardPopoverTitle title="Title" />
      <Input
        className=" 
        rounded-sm
     ring-1 ring-gray-500"
        ref={inputRef}
        defaultValue={"Checklist"}
      />
      <Button
        onClick={() => {
          if (inputRef.current) handleCreateChecklist(inputRef.current?.value);
        }}
        className=" mt-[14px] px-6 "
      >
        Add
      </Button>
    </DatePopoverLayout>
  );
}

export default ChecklistLayout;
