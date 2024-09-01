import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useUnArchiveList } from "@/hooks/Query hooks/List hooks/useUnArchiveList";
import { IBoard } from "@/types/board.types";
import { RotateCcw } from "lucide-react";
import { useEffect, useRef } from "react";

interface ArchiveListsrops {
  board: IBoard;
  setOnArchiveLists: React.Dispatch<React.SetStateAction<boolean>>;
}

function ArchiveLists({ board, setOnArchiveLists }: ArchiveListsrops) {
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const listsUnArchiver = useUnArchiveList(board._id);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  function handleUnArchiveList(listId: string) {
    listsUnArchiver.mutate({ boardId: board._id, listId });
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
          onClick={() => setOnArchiveLists(false)}
        >
          Cards
        </Button>
      </div>
      <div className=" mt-4">
        {board?.archivedLists.length > 0 ? (
          board.archivedLists.map((list) => (
            <>
              <div
                key={list.listId}
                className=" py-[2px] flex justify-between items-center"
              >
                <span className=" p-2">{list.name}</span>
                <Button
                  variant={"secondary"}
                  className=" flex gap-3 items-center"
                  onClick={() => handleUnArchiveList(list.listId)}
                >
                  <RotateCcw size={14} />
                  <span>Send to board</span>
                </Button>
              </div>
              <Separator className=" my-1" />
            </>
          ))
        ) : (
          <div className="bg-btn_bg_primary text-text_dark_blue py-6 px-3 rounded-md text-center">
            No archived lists
          </div>
        )}
      </div>
    </>
  );
}

export default ArchiveLists;