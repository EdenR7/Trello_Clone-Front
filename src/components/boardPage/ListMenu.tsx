import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { X } from "lucide-react";
// import { useState } from "react";
import { IAddACardFormOpen } from "./ListItem";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IBoard } from "@/types/board.types";
import { IList } from "@/types/list.types";
import { useArchiveList } from "@/hooks/Query hooks/List hooks/useArchiveList";

interface ListMenuProps {
  setOpenListMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setAddACardFormOpen: React.Dispatch<React.SetStateAction<IAddACardFormOpen>>;
  listId: string;
  boardId: string;
}

function ListMenu({
  setOpenListMenu,
  setAddACardFormOpen,
  listId,
  boardId,
}: ListMenuProps) {
  //   const qClient = useQueryClient();
  const listArchiver = useArchiveList(boardId);

  function handleArchiveList() {
    listArchiver.mutate({ listId });
  }

  return (
    <DropdownMenuContent className="w-64 text-slate-600 p-0 rounded-lg pb-3">
      <Button
        variant={"naked"}
        size={"icon"}
        className=" ml-auto text-slate-500 h-8 w-8 rounded-lg absolute right-2 top-[9px]"
        onClick={() => {
          setOpenListMenu(false);
        }}
      >
        <X size={16} />
      </Button>
      <DropdownMenuLabel className=" h-12 flex justify-center items-center font-semibold text-center py-1 px-2">
        List actions
      </DropdownMenuLabel>
      <DropdownMenuItem
        onClick={() => {
          setOpenListMenu(false);
          setAddACardFormOpen({ open: true, position: "top" });
        }}
        className=" px-3 py-[6px] cursor-pointer hover:bg-slate-100"
      >
        Add card
      </DropdownMenuItem>
      <DropdownMenuItem className=" px-3 py-[6px] cursor-pointer hover:bg-slate-100">
        copy list
      </DropdownMenuItem>
      <DropdownMenuItem className=" px-3 py-[6px] cursor-pointer hover:bg-slate-100">
        Move list
      </DropdownMenuItem>
      <DropdownMenuSeparator className=" mx-[10px] my-2" />

      <DropdownMenuItem
        onClick={handleArchiveList}
        className=" px-3 py-[6px] cursor-pointer hover:bg-slate-100"
      >
        Archive this list
      </DropdownMenuItem>
      <DropdownMenuItem className=" px-3 py-[6px] cursor-pointer hover:bg-slate-100">
        Archive all cards in this list
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}

export default ListMenu;
