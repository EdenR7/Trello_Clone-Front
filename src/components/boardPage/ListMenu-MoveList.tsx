import { useAuth } from "@/providers/auth-provider";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ListMenuModesProps } from "./ListMenu";
import { useGetUserWorkspaces } from "@/hooks/Query hooks/Workspace hooks/useGetUserWorksapces";
import { useEffect, useState } from "react";
import { IWorksapceBoard } from "@/types/workspace.types";
import ListMenuSelectItem from "./ListMenu-SelectItem";
import { Button } from "../ui/button";
import { useMoveList } from "@/hooks/Query hooks/List hooks/useMoveList";

function ListMenuMoveList({
  list,
  indexInBoard,
  setOpenListMenu,
}: ListMenuModesProps) {
  const { loggedInUser } = useAuth();
  const { data: workspaces } = useGetUserWorkspaces(loggedInUser?._id!);
  const [selectedBoard, setSelectedBoard] = useState<IWorksapceBoard | null>(
    null
  );
  const [newPosition, setNewPosition] = useState<number>(indexInBoard + 1);

  const listMover = useMoveList(list.board);

  useEffect(() => {
    if (workspaces) {
      for (const workspace of workspaces) {
        for (const board of workspace.boards) {
          if (board._id === list.board) {
            return setSelectedBoard(board);
          }
        }
      }
    }
  }, [workspaces]);

  function handleSelectedBoardChange(value: string) {
    if (!value || !workspaces) return;
    if (value === selectedBoard?._id) return;

    for (const workspace of workspaces) {
      for (const board of workspace.boards) {
        if (board._id === value) {
          setNewPosition(board._id === list.board ? indexInBoard + 1 : 1);
          return setSelectedBoard(board);
        }
      }
    }
  }

  function handleMoveList() {
    if (
      !selectedBoard ||
      !list ||
      !newPosition ||
      (list.board === selectedBoard._id && indexInBoard + 1 === newPosition)
    )
      return;

    listMover.mutate({
      listId: list._id,
      sourceId: list.board,
      destinationId: selectedBoard._id,
      newPosition,
    });
    setOpenListMenu(false);
  }

  return (
    <div className=" px-3 pb-3 w-full">
      <div className=" w-full">
        <p>Board</p>
        <Select
          value={selectedBoard?._id || ""}
          onValueChange={(value) => handleSelectedBoardChange(value)}
        >
          <SelectTrigger className=" my-2">
            <SelectValue>{selectedBoard?.name}</SelectValue>
          </SelectTrigger>
          <SelectContent className=" w-full text-slate-600 py-3 mx-0">
            {workspaces?.map((workspace) => {
              return (
                <div key={workspace._id}>
                  <h3 className=" px-2 text-[11px] text-slate-500">
                    {workspace.name.toUpperCase()}
                  </h3>
                  <ul>
                    {workspace.boards.map((board) => {
                      return (
                        <ListMenuSelectItem
                          key={board._id}
                          isSelected={board._id === selectedBoard?._id}
                          text={board.name}
                          value={board._id}
                          isCurrent={board._id === list.board}
                        />
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      <div>
        <p>Position</p>
        <Select
          value={newPosition.toString()}
          onValueChange={(value) => setNewPosition(Number(value))}
        >
          <SelectTrigger className=" my-2">
            <SelectValue>{newPosition}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Array.from(
              {
                length:
                  selectedBoard?._id !== list.board
                    ? selectedBoard?.listsNumber
                      ? selectedBoard.listsNumber + 1
                      : 1
                    : selectedBoard?.listsNumber || 1,
              },
              (_, i) => (
                <ListMenuSelectItem
                  key={i}
                  text={i + 1}
                  value={(i + 1).toString()}
                  isCurrent={
                    i === indexInBoard && selectedBoard?._id === list.board
                  }
                  isSelected={newPosition === i + 1}
                />
              )
            )}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleMoveList} className=" px-6">
        Move
      </Button>
    </div>
  );
}

export default ListMenuMoveList;
