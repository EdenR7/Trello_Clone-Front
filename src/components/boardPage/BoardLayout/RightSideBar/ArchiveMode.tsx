import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IBoard } from "@/types/board.types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

interface ArchiveModeProps {
  boardId: string;
}

function ArchiveMode({ boardId }: ArchiveModeProps) {
  const qClient = useQueryClient();
  const board: IBoard | undefined = qClient.getQueryData(["board", boardId]);
  const [onArchiveLists, setOnArchiveLists] = useState(true);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  return (
    <>
      <div className=" flex gap-2 items-center">
        <Input ref={searchInputRef} />
        <Button variant={"secondary"} className=" ">
          {onArchiveLists ? "Cards" : "Lists"}
        </Button>
      </div>
    </>
  );
}

export default ArchiveMode;
