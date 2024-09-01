import { ICard } from "@/types/card.types";
import CardDetailsHeader from "../general/CardDetailsHeader";
import { Button } from "../ui/button";
import MakeUserIcon from "@/utils/makeUserIcon";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import MembersPopoverLayout from "./MembersPopoverLayout";
import PopoverLayout from "../general/PopoverLayout";
import { IBoard } from "@/types/board.types";

interface CardDataMembersLayoutProps {
  card: ICard;
}

function CardDataMembersLayout(props: CardDataMembersLayoutProps) {
  const { card } = props;
  const { boardId } = useParams();
  if (!boardId) return null;
  const queryClient = useQueryClient();
  const board = queryClient.getQueryData<IBoard>(["board", boardId]);
  return (
    <div className=" mr-2 mb-2 max-w-full">
      <CardDetailsHeader title="Members" />
      <div className=" flex">
        {card.members.map((member, index) => (
          <div className=" mr-1 mb-1 h-8 w-8" key={index}>
            <MakeUserIcon user={member} />
          </div>
        ))}
        <PopoverLayout
          trigger={
            <Button
              variant={"secondary"}
              className=" rounded-full py-[6px] px-2 mr-2 mb-2 "
            >
              <Plus size={16} />
            </Button>
          }
          title="Members"
        >
          <MembersPopoverLayout board={board!} card={card} />
        </PopoverLayout>
      </div>
    </div>
  );
}

export default CardDataMembersLayout;
