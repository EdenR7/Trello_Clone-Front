import CreateBoardPopover from "@/components/navbar popovers/CreateBoardPopover";
import { useGetUserWorkspaces } from "@/hooks/Query hooks/Workspace hooks/useGetUserWorksapces";
import api from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import { getBoardBgStyle } from "@/utils/utilFuncs";
import { Clock, Star } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function BoardPage() {
  const navigate = useNavigate();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { loggedInUser, setLoggedInUser } = useAuth();
  if (!loggedInUser) return null;

  const sttaredBoards = loggedInUser.sttaredBoards;
  const recentBoards = loggedInUser.recentBoards.filter(
    (board) => !sttaredBoards.some((b) => b._id === board._id)
  );
  const { data: workspaces } = useGetUserWorkspaces(loggedInUser._id);

  function handleNavigation(boardId: string) {
    navigate(`/b/${boardId}`, { replace: true });
  }

  async function handleChangeStarredStatus(boardId: string) {
    try {
      if (!boardId) throw new Error("Board id is required");
      const res = await api.patch(`/user/starred/${boardId}`);
      setLoggedInUser(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  function isStarred(boardId: string) {
    return sttaredBoards.some((board) => board._id === boardId);
  }

  return (
    <div>
      {sttaredBoards.length > 0 && (
        <div className="pb-8">
          <div className="flex gap-3 mb-2">
            <Star color="rgb(68, 84, 111)" />
            <h3 className="text-base font-bold">Starred boards</h3>
          </div>
          <ul className="flex flex-wrap gap-2">
            {sttaredBoards.map((board) => {
              const boardStyle = getBoardBgStyle(board.bg);

              return (
                <li
                  key={board._id}
                  className="h-[112px] w-[calc(50%-4px)] md:w-[32%] break-950px:w-[23%]"
                >
                  <div
                    onClick={() => handleNavigation(board._id)}
                    style={boardStyle}
                    className="group cursor-pointer rounded-md block h-24 w-full relative"
                  >
                    <div className="absolute inset-0 bg-black opacity-20 hover:opacity-30 rounded-md"></div>
                    <span className="relative top-1 left-2 z-10 text-white font-bold text-[16px] overflow-hidden text-ellipsis whitespace-nowrap w-11/12 inline-block">
                      {board.name}
                    </span>
                    <div
                      onClick={(ev) => {
                        ev.stopPropagation();
                        ev.preventDefault();
                        handleChangeStarredStatus(board._id);
                      }}
                      className="h-4 w-4 mr-1.5 absolute right-1 bottom-2 text-[#e2b203] hover:scale-110 hover:text-white transition"
                    >
                      <Star size={16} />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {recentBoards.length > 0 && (
        <div className="pb-8">
          <div className="flex gap-3 mb-2">
            <Clock color="rgb(68, 84, 111)" />
            <h3 className="text-base font-bold">Recently viewed</h3>
          </div>
          <ul className="flex flex-wrap gap-2">
            {recentBoards.map((board) => {
              const boardStyle = getBoardBgStyle(board.bg);

              return (
                <li
                  key={board._id}
                  className="overflow-hidden h-[112px] w-[calc(50%-4px)] md:w-[32%] break-950px:w-[23%]"
                >
                  <div
                    onClick={() => handleNavigation(board._id)}
                    style={boardStyle}
                    className="group cursor-pointer rounded-md block h-24 w-full relative"
                  >
                    <div className="absolute inset-0 bg-black opacity-20 rounded-md hover:opacity-30 w-full"></div>
                    <span className="relative top-1 left-2 z-10 text-white font-bold text-[16px] overflow-hidden text-ellipsis whitespace-nowrap w-11/12 inline-block">
                      {board.name}
                    </span>
                    <div
                      onClick={(ev) => {
                        ev.stopPropagation();
                        ev.preventDefault();
                        handleChangeStarredStatus(board._id);
                      }}
                      className={`h-4 w-4 mr-1.5 absolute right-[-20px] bottom-2 transition-all duration-200 text-white opacity-0 group-hover:opacity-100 group-hover:translate-x-[-24px]`}
                    >
                      <Star size={16} />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <div>
        <h3 className="text-[#44546f] flex text-base my-5 font-bold uppercase leading-6 ml-0">
          Your workspaces
        </h3>
        {workspaces?.map((workspace, index) => (
          <div key={index} className="pb-5 max-w-[1266px]">
            <div className="flex ml-10 pb-[11px] relative">
              <div className="absolute top-0 -left-10">
                <div className="rounded-sm h-8 mb-4 overflow-hidden w-8">
                  <div
                    className="flex items-center justify-center w-full h-full text-white text-xl font-bold"
                    style={{
                      backgroundImage:
                        "linear-gradient(to bottom right, #6E5DC6 2%, #E774BB 100%)",
                    }}
                  >
                    {workspace.name[0]}
                  </div>
                </div>
              </div>
              <h3 className="inline-block flex-1 text-base font-bold leading-6 mt-[3px] overflow-hidden text-ellipsis flex-nowrap">
                {workspace.name}
              </h3>
            </div>
            <div>
              <ul className="flex flex-wrap justify-start mt-3">
                {workspace.boards.map((board) => {
                  const boardStyle = getBoardBgStyle(board.bg);

                  return (
                    <li
                      key={board._id}
                      className="mr-[2%] mb-[2%] overflow-hidden h-[112px] w-[calc(50%-4px)] md:w-[32%] break-950px:w-[23%]"
                    >
                      <div
                        onClick={() => handleNavigation(board._id)}
                        style={boardStyle}
                        className="group cursor-pointer rounded-md block h-24 w-full relative"
                      >
                        <div className="absolute inset-0 bg-black opacity-20 rounded-md hover:opacity-30 w-full"></div>
                        <span className="relative top-1 left-2 z-10 text-white font-bold text-[16px] overflow-hidden text-ellipsis whitespace-nowrap w-11/12 inline-block">
                          {board.name}
                        </span>
                        <div
                          onClick={(ev) => {
                            ev.stopPropagation();
                            ev.preventDefault();
                            handleChangeStarredStatus(board._id);
                          }}
                          className={`
                            h-4 w-4 mr-1.5 absolute bottom-2 transition
                            ${
                              isStarred(board._id)
                                ? "right-1 text-[#e2b203] hover:scale-110 hover:text-white"
                                : "right-[-20px] text-white opacity-0 group-hover:opacity-100 group-hover:translate-x-[-24px] duration-200"
                            }
                          `}
                        >
                          <Star size={16} />
                        </div>
                      </div>
                    </li>
                  );
                })}

                <CreateBoardPopover
                  trigger={
                    <div className=" mr-[2%] mb-[2%] overflow-hidden h-24  w-[calc(50%-4px)] md:w-[32%] break-950px:w-[23%] bg-btn_bg_primary items-center justify-center flex align-middle transition-colors duration-75 rounded-sm p-2 relative hover:bg-gray-200 cursor-pointer">
                      <p className=" text-[#172b4d]">Create new board</p>
                    </div>
                  }
                  isCreateOpen={isCreateOpen}
                  setIsCreateOpen={setIsCreateOpen}
                />
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BoardPage;
