import { useArchiveList } from "@/hooks/Query hooks/List hooks/useArchiveList";
import { DropdownMenuItem, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { ListMenuModesProps } from "./ListMenu";
import { useArchiveAllListsCards } from "@/hooks/Query hooks/List hooks/useArchiveAllListsCards";

function ListMenuActions({
  setOpenListMenu,
  setAddACardFormOpen,
  list,
  setSideBarMode,
}: ListMenuModesProps) {
  const listArchiver = useArchiveList(list.board);

  const listCardsArchiver = useArchiveAllListsCards(list.board);

  function handleArchiveList() {
    listArchiver.mutate({ listId: list._id });
  }
  function handleArchiveAllCardsInList() {
    listCardsArchiver.mutate({ listId: list._id });
  }
  return (
    <div>
      <DropdownMenuItem
        onClick={() => {
          setOpenListMenu(false);
          setAddACardFormOpen({ open: true, position: "top" });
        }}
        className=" px-3 py-[6px] cursor-pointer hover:bg-slate-100"
      >
        Add card
      </DropdownMenuItem>
      {/* <DropdownMenuItem className=" px-3 py-[6px] cursor-pointer hover:bg-slate-100">
        Copy list
      </DropdownMenuItem> */}
      <DropdownMenuItem
        onClick={(e) => {
          e.preventDefault();
          setSideBarMode("Move list");
        }}
        className=" px-3 py-[6px] cursor-pointer hover:bg-slate-100"
      >
        Move list
      </DropdownMenuItem>
      <DropdownMenuSeparator className=" mx-[10px] my-2" />

      <DropdownMenuItem
        onClick={handleArchiveList}
        className=" px-3 py-[6px] cursor-pointer hover:bg-slate-100"
      >
        Archive this list
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={handleArchiveAllCardsInList}
        className=" px-3 py-[6px] cursor-pointer hover:bg-slate-100"
      >
        Archive all cards in this list
      </DropdownMenuItem>
    </div>
  );
}

export default ListMenuActions;
