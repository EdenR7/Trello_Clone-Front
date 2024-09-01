import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDeleteCard } from "@/hooks/Query hooks/Card hooks/useDeleteCard";
import { useUnArchiveCard } from "@/hooks/Query hooks/Card hooks/useUnArchiveCard";
import { IBoard } from "@/types/board.types";
import React, { useEffect, useRef } from "react";

interface ArchiveCardsrops {
  board: IBoard;
  setOnArchiveLists: React.Dispatch<React.SetStateAction<boolean>>;
}

function ArchiveCards({ board, setOnArchiveLists }: ArchiveCardsrops) {
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const cardDeleter = useDeleteCard(board._id);
  const cardUnArchiver = useUnArchiveCard(board._id);
  // delete card

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  function handleUnarchiveCard(cardId: string) {
    cardUnArchiver.mutate({ boardId: board._id, cardId });
  }

  function handleDeleteCard(cardId: string, listId: string) {
    cardDeleter.mutate({
      listId,
      cardId,
    });
  }

  return (
    <>
      <div className=" flex gap-2 items-center">
        <Input
          ref={searchInputRef}
          className=" h-9"
          placeholder="Search archived lists..."
        />
        <Button
          variant={"secondary"}
          className=" "
          onClick={() => setOnArchiveLists(true)}
        >
          Lists
        </Button>
      </div>
      <div className=" mt-4">
        {board?.archivedCards.length > 0 ? (
          board.archivedCards.map((card) => (
            <React.Fragment key={card._id}>
              {/* Card item as in board */}
              <div
                key={card._id}
                className=" w-[260px] cursor-pointer px-3 pt-2 pb-1 mx-auto rounded-md shadow-shadow-archive-card-shadow "
              >
                <span className=" p-2">{card.title}</span>
              </div>
              <div className=" ml-2 mb-2 px-3 flex gap-1 items-center">
                <Button
                  variant={"asLink"}
                  size={"sm"}
                  className=" p-0"
                  onClick={() => handleUnarchiveCard(card._id)}
                >
                  Send to board
                </Button>
                <span className=" translate-y-[1px]">•</span>
                <Button
                  onClick={() => handleDeleteCard(card._id, card.list)}
                  variant={"asLink"}
                  size={"sm"}
                  className=" p-0"
                >
                  Delete
                </Button>
              </div>
            </React.Fragment>
          ))
        ) : (
          <div className="bg-btn_bg_primary text-text_dark_blue py-6 px-3 rounded-md text-center">
            No archived Cards
          </div>
        )}
      </div>
    </>
  );
}

export default ArchiveCards;
