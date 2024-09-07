import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { ChevronLeft, X } from "lucide-react";
import { IAddACardFormOpen } from "./ListItem";
import ListMenuActions from "./ListMenu-Actions";
import { useState } from "react";
import ListMenuMoveList from "./ListMenu-MoveList";
import { IList } from "@/types/list.types";

export type ListMenuModes = "List actions" | "Copy list" | "Move list";
const LIST_MENU_MODE_OPTIONS = {
  "List actions": ListMenuActions,
  "Copy list": ListMenuMoveList,
  "Move list": ListMenuMoveList,
};
export interface ListMenuModesProps {
  setOpenListMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setAddACardFormOpen: React.Dispatch<React.SetStateAction<IAddACardFormOpen>>;
  setSideBarMode: React.Dispatch<React.SetStateAction<ListMenuModes>>;
  list: IList;
  indexInBoard: number;
}

interface ListMenuProps {
  setOpenListMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setAddACardFormOpen: React.Dispatch<React.SetStateAction<IAddACardFormOpen>>;
  list: IList;
  indexInBoard: number;
}

function ListMenu({
  setOpenListMenu,
  setAddACardFormOpen,
  list,
  indexInBoard,
}: ListMenuProps) {
  const [sideBarMode, setSideBarMode] = useState<ListMenuModes>("List actions");

  const CurrentSidebarMode = LIST_MENU_MODE_OPTIONS[sideBarMode];

  return (
    <DropdownMenuContent className="w-[304px] text-slate-600 p-0 rounded-lg pb-3">
      {sideBarMode !== "List actions" && (
        <Button
          onClick={() => setSideBarMode("List actions")}
          variant={"naked"}
          size={"icon"}
          className=" mr-auto text-slate-500 h-8 w-8 rounded-lg absolute left-2 top-[9px]"
        >
          <ChevronLeft size={18} />
        </Button>
      )}
      <DropdownMenuLabel className=" h-12 flex justify-center items-center font-semibold text-center py-1 px-2">
        {sideBarMode}
      </DropdownMenuLabel>
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
      <CurrentSidebarMode
        indexInBoard={indexInBoard}
        setSideBarMode={setSideBarMode}
        // boardId={boardId}
        list={list}
        setAddACardFormOpen={setAddACardFormOpen}
        setOpenListMenu={setOpenListMenu}
      />
    </DropdownMenuContent>
  );
}

export default ListMenu;
