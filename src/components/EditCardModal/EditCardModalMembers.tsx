import { ICard } from "@/types/card.types";
import MembersPopoverLayout from "../cardDetailsPage/MembersPopoverLayout";
import PopoverLayout from "../general/PopoverLayout";
import { useParams } from "react-router-dom";
import { IBoard } from "@/types/board.types";
import { useQueryClient } from "@tanstack/react-query";
import EditCardModalSideButton from "./EditCardModalSideButton";
import { User } from "lucide-react";

function EditCardModalMembers({ card }: { card: ICard }) {
  const { boardId } = useParams();
  if (!boardId) return null;
  const queryClient = useQueryClient();
  const board = queryClient.getQueryData<IBoard>(["board", boardId]);
  return (
    <PopoverLayout
      trigger={
        <EditCardModalSideButton
          icon={<User size={16} strokeWidth={1.75} />}
          title="Change members"
        />
      }
      title="Members"
    >
      <MembersPopoverLayout board={board!} card={card} />
    </PopoverLayout>
  );
}

export default EditCardModalMembers;
