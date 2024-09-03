import PopoverLayout from "@/components/general/PopoverLayout";
import { ICard } from "@/types/card.types";
import { UserRound } from "lucide-react";
import MembersPopoverLayout from "../MembersPopoverLayout";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { IBoard } from "@/types/board.types";
import { Button } from "@/components/ui/button";

interface MembersLayoutProps {
  card: ICard;
}

function MembersLayout(props: MembersLayoutProps) {
  const { card } = props;

  const { boardId } = useParams();
  const qClient = useQueryClient();
  const board = qClient.getQueryData<IBoard>(["board", boardId]);
  return (
    <PopoverLayout
      trigger={
        <Button
          variant={"secondary"}
          className={`h-8 mb-2 overflow-hidden relative text-ellipsis whitespace-nowrap max-w-[300px] flex justify-start items-center py-[6px] px-3 mr-2 w-[calc(50%-8px)] break-card_modal:w-[168px]`}
        >
          <span className="mr-[6px] -ml-[6px]">
            <UserRound size={15} />
          </span>
          <span>Members</span>
        </Button>
      }
      title="Members"
    >
      <MembersPopoverLayout board={board!} card={card} />
    </PopoverLayout>
  );
}

export default MembersLayout;
