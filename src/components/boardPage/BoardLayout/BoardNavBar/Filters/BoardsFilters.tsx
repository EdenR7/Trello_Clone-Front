import { Input } from "@/components/ui/input";
import { IBoard } from "@/types/board.types";
import { LoggedInUser } from "@/providers/auth-provider";
import { SetURLSearchParams, useSearchParams } from "react-router-dom";
import MembersFilter from "./MembersFilter";
import DatesFilter from "./DatesFilter";
import LabelsFilter from "./LabelsFilter";
import { Separator } from "@/components/ui/separator";
import FilterDefinition from "./FilterDefinition";

interface BoardsFiltersProps {
  board: IBoard;
  loggedInUser: LoggedInUser;
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
}

function BoardsFilters({
  board,
  loggedInUser,
  searchParams,
  setSearchParams,
}: BoardsFiltersProps) {
  const updateUrlParams = (key: string, values: string[]) => {
    setSearchParams((params) => {
      if (values.length > 0) {
        params.set(key, values.join(","));
      } else {
        params.delete(key);
      }
      return params;
    });
  };

  return (
    <div className="" style={{ color: "rgb(68, 84, 111)" }}>
      <div>
        <h4 className=" my-4 mb-2 text-xs font-semibold">Keyword</h4>
        <Input
          className=" h-9 py-2 px-3 border border-text_dark_blue/50"
          placeholder="Enter a keyword..."
        />
        <p className=" text-[11px] mt-2 mb-1">
          Search cards, members, labels, and more
        </p>
      </div>
      <MembersFilter
        searchParams={searchParams}
        board={board}
        loggedInUser={loggedInUser}
        updateUrlParams={updateUrlParams}
      />
      <DatesFilter
        searchParams={searchParams}
        updateUrlParams={updateUrlParams}
      />
      <LabelsFilter
        board={board}
        searchParams={searchParams}
        updateUrlParams={updateUrlParams}
      />
      <Separator className=" my-4" />
      <FilterDefinition />
    </div>
  );
}

export default BoardsFilters;
