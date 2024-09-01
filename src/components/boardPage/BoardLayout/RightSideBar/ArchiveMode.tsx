import { IBoard } from "@/types/board.types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import ArchiveLists from "./ArchiveLists";
import ArchiveCards from "./ArchiveCards";

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

  if (!board) {
    return null;
  }
  return (
    <>
      {onArchiveLists ? (
        <ArchiveLists board={board} setOnArchiveLists={setOnArchiveLists} />
      ) : (
        <ArchiveCards board={board} setOnArchiveLists={setOnArchiveLists} />
      )}
    </>
  );
}

export default ArchiveMode;
