import { Input } from "@/components/ui/input";
import { IBoard } from "@/types/board.types";
import { LoggedInUser } from "@/providers/auth-provider";
import { useSearchParams } from "react-router-dom";
import MembersFilter from "./MembersFilter";

interface BoardsFiltersProps {
  board: IBoard;
  loggedInUser: LoggedInUser;
}

function BoardsFilters({ board, loggedInUser }: BoardsFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateUrlParams = (key: string, values: string[]) => {
    if (values.length > 0) {
      searchParams.set(key, values.join(","));
    } else {
      searchParams.delete(key);
    }
    setSearchParams(searchParams);
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
    </div>
  );
}

export default BoardsFilters;
