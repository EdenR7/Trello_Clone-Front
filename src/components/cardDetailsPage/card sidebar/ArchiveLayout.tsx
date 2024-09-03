import PopoverLayout from "@/components/general/PopoverLayout";
import { Button } from "@/components/ui/button";
import useArchiveCard from "@/hooks/Query hooks/Card hooks/useArchiveCard";
import { useDeleteCard } from "@/hooks/Query hooks/Card hooks/useDeleteCard";
import { useUnArchiveCard } from "@/hooks/Query hooks/Card hooks/useUnArchiveCard";
import { ICard } from "@/types/card.types";
import { Archive, Minus, RotateCcw } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface ArchiveLayoutProps {
  card: ICard;
}

function ArchiveLayout(props: ArchiveLayoutProps) {
  const { card } = props;
  const { boardId } = useParams();
  const { mutate: archiveCard } = useArchiveCard();
  const { mutate: unArchiveCard } = useUnArchiveCard(boardId!);
  const { mutate: deleteCard } = useDeleteCard(boardId!);
  const navigate = useNavigate();

  function handleArchiveCard() {
    archiveCard({ boardId: boardId!, cardId: card._id! });
  }

  function handleUnArchiveCard() {
    unArchiveCard({ cardId: card._id! });
  }

  function handleDeleteCard() {
    navigate(-1);
    deleteCard({ cardId: card._id!, listId: card.list._id });
  }

  return (
    <>
      {card.isArchived ? (
        <>
          <Button
            onClick={handleUnArchiveCard}
            variant={"secondary"}
            className={` break-card_modal:w-[176px] mt-2 h-8 overflow-hidden relative text-ellipsis whitespace-nowrap max-w-[300px] flex justify-start items-center py-[6px] px-3 mr-2 w-[calc(50%-8px)] $`}
          >
            <span className="mr-[6px] -ml-[6px]">
              <RotateCcw size={15} />
            </span>
            <span>Send to board</span>
          </Button>
          <PopoverLayout
            title="Delete Card?"
            trigger={
              <Button
                variant={"destructive"}
                className={` break-card_modal:w-[176px] mt-2 h-8 overflow-hidden relative text-ellipsis whitespace-nowrap max-w-[300px] flex justify-start items-center py-[6px] px-3 mr-2 w-[calc(50%-8px)] $`}
              >
                <span className="mr-[6px] -ml-[6px]">
                  <Minus size={15} />
                </span>
                <span>Delete</span>
              </Button>
            }
          >
            <p className=" mb-2">
              All actions will be removed from the activity feed and you won’t
              be able to re-open the card. There is no undo.
            </p>
            <Button
              onClick={handleDeleteCard}
              variant={"destructive"}
              className=" w-full mt-2 mr-1"
            >
              Delete
            </Button>
          </PopoverLayout>
        </>
      ) : (
        <Button
          onClick={handleArchiveCard}
          variant={"secondary"}
          className={` break-card_modal:w-[176px] mt-2 h-8 overflow-hidden relative text-ellipsis whitespace-nowrap max-w-[300px] flex justify-start items-center py-[6px] px-3 mr-2 w-[calc(50%-8px)] $`}
        >
          <span className="mr-[6px] -ml-[6px]">
            <Archive size={15} />
          </span>
          <span>Archive</span>
        </Button>
      )}
    </>
  );
}

export default ArchiveLayout;
