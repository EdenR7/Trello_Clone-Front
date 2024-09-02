import { getBoardBgStyle } from "@/components/boardPage/BoardLayout/BoardLayout";
import { useAuth } from "@/providers/auth-provider";
import { Clock, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

function BoardPage() {
  const navigate = useNavigate();
  const { loggedInUser } = useAuth();
  if (!loggedInUser) return null;
  const sttaredBoards = [...loggedInUser?.sttaredBoards];
  const recentBoards = loggedInUser.recentBoards.filter((board) => {
    return !sttaredBoards.includes(board);
  });
  function handleNavigation(boardId: string) {
    navigate(`/b/${boardId}`, { replace: true });
  }

  return (
    <div>
      {sttaredBoards.length > 0 && (
        <div className=" pb-8">
          {/* Title */}
          <div className=" flex gap-3 mb-2">
            <Star color="rgb(68, 84, 111)" />
            <h3 className=" text-base font-bold">Starred boards</h3>
          </div>
          <ul className=" flex flex-wrap gap-2">
            {sttaredBoards.map((board) => {
              const boardStyle = getBoardBgStyle(board.bg);

              return (
                <li className=" h-[112px] w-[calc(50%-4px)] md:w-[32%] break-950px:w-[23%]">
                  <div
                    onClick={() => handleNavigation(board._id)}
                    style={boardStyle}
                    className=" cursor-pointer rounded-md block h-24 w-full"
                  >
                    <span>{board.name}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {recentBoards.length > 0 && (
        <div className=" pb-8">
          {/* Title */}
          <div className=" flex gap-3 mb-2">
            <Clock color="rgb(68, 84, 111)" />
            <h3 className=" text-base font-bold">Recently viewed</h3>
          </div>
          <ul className=" flex flex-wrap gap-2">
            {recentBoards.map((board) => {
              const boardStyle = getBoardBgStyle(board.bg);

              return (
                <li className=" overflow-hidden h-[112px] w-[calc(50%-4px)] md:w-[32%] break-950px:w-[23%]">
                  <div
                    onClick={() => handleNavigation(board._id)}
                    style={boardStyle}
                    className=" cursor-pointer rounded-md block h-24 w-full"
                  >
                    <span>{board.name}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default BoardPage;
