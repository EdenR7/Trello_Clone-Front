import { Archive } from "lucide-react";
import { Button } from "../ui/button";
import useArchiveCard from "@/hooks/Query hooks/Card hooks/useArchiveCard";
import { ICard } from "@/types/card.types";
import { useParams } from "react-router-dom";

function EditCardModalArchive({
  card,
  onClose,
}: {
  card: ICard;
  onClose: () => void;
}) {
  const { boardId } = useParams();
  const { mutate: archiveCard } = useArchiveCard();
  function handleArchiveCard() {
    onClose();
    archiveCard({ boardId: boardId!, cardId: card._id! });
  }
  return (
    <Button
      onClick={handleArchiveCard}
      variant={"secondary"}
      className={`h-8 overflow-hidden relative text-ellipsis whitespace-nowrap w-auto flex justify-start items-center py-[6px] pr-3 pl-3 mb-1 bg-gray-200`}
    >
      <span className="mr-[6px] -ml-[6px]">
        <Archive size={15} />
      </span>
      <span>Archive</span>
    </Button>
  );
}

export default EditCardModalArchive;
