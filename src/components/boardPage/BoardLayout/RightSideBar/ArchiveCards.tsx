import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDeleteCard } from "@/hooks/Query hooks/Card hooks/useDeleteCard";
import { useUnArchiveCard } from "@/hooks/Query hooks/Card hooks/useUnArchiveCard";
import { IBoard } from "@/types/board.types";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CardItemDates from "@/components/CardItem/CardItemDates";
import { AlignLeft } from "lucide-react";
import CardItemChecklist from "@/components/CardItem/CardItemChecklist";
import CardItemUserIcon from "@/components/CardItem/CardItemUserIcon";
import { useLocalStorage } from "@uidotdev/usehooks";
import CardItemLabels from "@/components/CardItem/CardItemLabels";

interface ArchiveCardsrops {
  board: IBoard;
  setOnArchiveLists: React.Dispatch<React.SetStateAction<boolean>>;
}

function ArchiveCards({ board, setOnArchiveLists }: ArchiveCardsrops) {
  const [inputFilter, setInputFilter] = useState<string>("");
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const cardDeleter = useDeleteCard(board._id);
  const cardUnArchiver = useUnArchiveCard(board._id);
  const [isLabelsOpen, setIsLabelsOpen] = useLocalStorage(
    "trella-labels-open-state",
    false
  );

  const filteredArchivedCards = board.archivedCards.filter((card) => {
    return card.title.toLowerCase().includes(inputFilter.toLowerCase());
  });

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  function handleUnarchiveCard(cardId: string) {
    cardUnArchiver.mutate({ cardId });
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
          value={inputFilter}
          onChange={(e) => setInputFilter(e.target.value)}
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
      <div className="mt-4 mb-4 ">
        {filteredArchivedCards.length > 0 ? (
          filteredArchivedCards.map((card, index) => {
            let hasTodos = false;
            if (card.checklist && card.checklist.length > 0) {
              hasTodos = card.checklist.some(
                (checklist) => checklist.todos.length > 0
              );
            }

            if (!card) return <div key={index}></div>;
            return (
              <div key={card._id}>
                {card?.bgCover.isCover ? (
                  <div className="  h-14 cursor-pointer shadow rounded-lg relative w-[260px] mx-auto">
                    <Link className="" to={`/b/${board._id}/c/${card._id}`}>
                      <div
                        className=" hover:outline hover:outline-2 hover:outline-primary flex rounded-lg max-w-[260px] min-h-full py-2 pr-2 pl-3 relative group "
                        style={{ backgroundColor: card.bgCover.bg }}
                      >
                        <p className=" z-10 self-end w-full text-[16px] font-semibold leading-5 relative">
                          {card.title}
                        </p>
                      </div>
                    </Link>
                  </div>
                ) : (
                  <React.Fragment key={card._id}>
                    {/* Card item as in board */}
                    <Link to={`/b/${board._id}/c/${card._id}`}>
                      <div className=" mx-auto relative min-h-9 rounded-lg bg-white shadow scroll-m-2 max-w-[260px] hover:outline hover:outline-2 hover:outline-primary group ">
                        {card.bgCover.bg !== "" && (
                          <div
                            className=" h-9 overflow-hidden rounded-t-lg relative"
                            style={{ backgroundColor: card.bgCover.bg }}
                          ></div>
                        )}
                        <div className=" flow-root relative z-10 min-h-6 px-3 pt-2 pb-1 ">
                          <div className=" flex flex-wrap gap-1 mb-1">
                            {card.labels.map((label, index) => (
                              <CardItemLabels
                                key={index}
                                isLabelsOpen={isLabelsOpen}
                                label={label}
                                setIsLabelsOpen={setIsLabelsOpen}
                              />
                            ))}
                          </div>
                          <p className=" mb-1 block overflow-hidden break-words whitespace-normal">
                            {card.title}
                          </p>
                          <div className=" flex flex-wrap max-w-full gap-1">
                            {(card.dueDate || card.startDate) && (
                              <CardItemDates card={card} />
                            )}
                            {card.description && (
                              <span className=" flex relative items-center justify-center w-fit max-w-full h-6 mb-1 p-[2px] rounded-sm text-sm">
                                <AlignLeft size={16} strokeWidth={1.75} />
                              </span>
                            )}
                            {hasTodos && <CardItemChecklist card={card} />}
                          </div>
                          {card.members.length > 0 && (
                            <CardItemUserIcon card={card} />
                          )}
                        </div>
                      </div>
                    </Link>
                  </React.Fragment>
                )}
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
                    onClick={() => handleDeleteCard(card._id, card.list!)}
                    variant={"asLink"}
                    size={"sm"}
                    className=" p-0"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            );
          })
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
