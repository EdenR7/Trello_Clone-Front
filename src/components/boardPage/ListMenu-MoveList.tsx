import { useAuth } from "@/providers/auth-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";
import { ListMenuModesProps } from "./ListMenu";
import { useQueryClient } from "@tanstack/react-query";
import { IList } from "@/types/list.types";

function ListMenuMoveList({ list }: ListMenuModesProps) {
  const { loggedInUser } = useAuth();
  const qClient = useQueryClient();
  //   const lists: IList[] | undefined = qClient.getQueryData(["lists", boardId]);
  //   const curListPosition = lists?.findIndex((list) => list._id === listId);
  //   const [newPosition, setNewPosition] = useState<number>(curListPosition || 1);

  return (
    <div className=" px-3 pb-3">
      ListMenuMoveList
      <div></div>
      <div>
        <Select>
          <SelectTrigger className="w-[180px]">
            {/* <SelectValue placeholder={newPosition} /> */}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default ListMenuMoveList;
