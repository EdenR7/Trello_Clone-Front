import { Check } from "lucide-react";

import { ReactElement, useEffect, useRef, useState } from "react";
import { getBoardBgStyle } from "@/utils/utilFuncs";
import { boardBgImageOptions } from "@/constants/board.constants";
import { IBoardBackground } from "@/types/board.types";
import { gradientStrings } from "@/constants/gradient.constant";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { useAuth } from "@/providers/auth-provider";
import { Button } from "../ui/button";
import useCreateBoard from "@/hooks/Query hooks/Board hooks/useCreateBoard";
import { useNavigate } from "react-router-dom";
import DatePopoverLayout from "../general/DatePopoverLayout";

interface CreateBoardPopoverProps {
  isCreateOpen: boolean;
  setIsCreateOpen: React.Dispatch<React.SetStateAction<boolean>>;
  trigger: ReactElement<HTMLButtonElement>;
}

function CreateBoardPopover({
  isCreateOpen,
  setIsCreateOpen,
  trigger,
}: CreateBoardPopoverProps) {
  const [tempBg, setTempBg] = useState<IBoardBackground>({
    background:
      "https://images.unsplash.com/photo-1723451150503-a82e2ccf121e?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bgType: "image",
  });
  const [boardTitle, setBoardTitle] = useState("");
  const { loggedInUser, setLoggedInUser } = useAuth();

  const [selectedWorkspace, setSelectedWorkspace] = useState("");
  const { mutate: createBoard } = useCreateBoard();
  const navigate = useNavigate();
  const titleRef = useRef<HTMLInputElement>(null);

  function handleCreateBoard() {
    if (!selectedWorkspace) {
      console.log("no workspace id");
      return;
    }
    createBoard(
      {
        boardBg: tempBg,
        boardName: boardTitle,
        workspaceId: selectedWorkspace!,
      },
      {
        onSuccess: (data) => {
          navigate(`/b/${data._id}`);
          setIsCreateOpen(false);
          setTempBg({
            background:
              "https://images.unsplash.com/photo-1723451150503-a82e2ccf121e?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            bgType: "image",
          });
          setBoardTitle("");
          if (loggedInUser)
            setSelectedWorkspace(loggedInUser?.workspaces[0]._id);

          setLoggedInUser((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              recentBoards: [
                { _id: data._id, name: data.name, bg: data.bg },
                ...prev.recentBoards,
              ], // Keep only the 4 most recent boards
            };
          });
        },
      }
    );
  }

  useEffect(() => {
    if (!loggedInUser) {
      return;
    }
    setSelectedWorkspace(loggedInUser.workspaces[0]._id);
  }, [loggedInUser]);

  useEffect(() => {
    if (isCreateOpen) {
      // Use a shorter timeout to log the ref status
      setTimeout(() => {
        titleRef.current?.focus();
      }, 0);
    }
  }, [isCreateOpen]);

  return (
    <DatePopoverLayout
      internalOpen={isCreateOpen}
      setInternalOpen={setIsCreateOpen}
      title="Create board"
      trigger={trigger}
    >
      <div className=" flex justify-center pb-2">
        <div
          style={getBoardBgStyle(tempBg)}
          className=" w-[200px] h-[120px] rounded-sm shadow-sm bg-cover bg-center flex items-center justify-center"
        >
          <img
            src="https://trello.com/assets/14cda5dc635d1f13bc48.svg"
            alt="presentation"
          />
        </div>
      </div>
      <div className=" pb-1">
        <div className=" font-semibold leading-5 ">
          <h5 className=" block text-[#44546f] font-xs font-bold leading-4 mb-1 mt-3">
            Background
          </h5>
        </div>
        <div>
          <ul className=" flex pb-2 justify-between">
            {boardBgImageOptions.map((bgImage, index) => {
              if (index < 4) {
                return (
                  <li key={index} className=" w-16 h-10 ">
                    <button
                      onClick={() =>
                        setTempBg({ background: bgImage, bgType: "image" })
                      }
                      className=" flex relative items-center justify-center w-full h-full min-h-0 m-0 p-0 rounded-sm outline-none bg-btn_bg_primary bg-center bg-cover cursor-pointer hover:bg-black"
                      style={{ backgroundImage: `url(${bgImage})` }}
                    >
                      {tempBg?.background === bgImage && (
                        <Check color="white" size={16} />
                      )}
                    </button>
                  </li>
                );
              }
            })}
          </ul>
          <ul className=" flex pb-2 justify-between">
            {gradientStrings.map((gradient, index) => {
              if (index < 6) {
                return (
                  <li key={index} className=" w-10 h-8">
                    <button
                      onClick={() =>
                        setTempBg({
                          background: gradient.linear,
                          bgType: "gradient",
                        })
                      }
                      className=" flex relative items-center justify-center w-full h-full min-h-0 m-0 p-0 rounded-sm outline-none bg-btn_bg_primary bg-center bg-cover cursor-pointer "
                      style={{ backgroundImage: gradient.linear }}
                    >
                      {tempBg?.background === gradient.linear && (
                        <Check color="white" size={16} />
                      )}
                    </button>
                  </li>
                );
              }
            })}
          </ul>
          <form>
            <div>
              <div className=" text-xs text-[#44546f] font-bold leading-4 flex flex-col">
                <label htmlFor="boardTitle">
                  Board title<span className=" text-red-600 ml-0.5">*</span>{" "}
                </label>
                <Input
                  ref={titleRef}
                  className={`font-normal h-9 mt-0.5 border-gray-600 rounded-sm ${
                    boardTitle.length === 0 && "border-red-600"
                  }`}
                  id="boardTitle"
                  value={boardTitle}
                  onChange={(ev) => setBoardTitle(ev.currentTarget.value)}
                />
                {boardTitle.length === 0 && (
                  <span className=" mb-2 mt-1 font-normal text-sm">
                    👋 Board title is required
                  </span>
                )}
              </div>
              <div className=" text-xs text-[#44546f] font-bold leading-4 flex flex-col">
                <label className=" mt-3 mb-1" htmlFor="workspaceSelect">
                  Workspace
                </label>
                <Select
                  value={selectedWorkspace}
                  onValueChange={(val) => setSelectedWorkspace(val)}
                >
                  <SelectTrigger
                    id="workspaceSelect"
                    className="border font-normal border-gray-600 focus:border-primary focus:border-2 focus:ring-0 "
                  >
                    <SelectValue
                      placeholder={loggedInUser?.workspaces[0].name}
                    />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {loggedInUser?.workspaces.map((workspace) => (
                      <SelectItem
                        className={` cursor-pointer pl-4 focus:border-l-2 focus:border-primary focus:bg-gray-600/10 ${
                          workspace._id === selectedWorkspace
                            ? "bg-blue-200 border-l-2 border-primary focus:bg-blue-200"
                            : ""
                        }`}
                        key={workspace._id}
                        value={workspace._id}
                      >
                        {workspace.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              onClick={(ev) => {
                ev.stopPropagation();
                ev.preventDefault();
                handleCreateBoard();
              }}
              disabled={boardTitle.length === 0}
              className=" w-full mt-4 disabled:bg-gray-200 disabled:text-black disabled:cursor-not-allowed "
              type="submit"
            >
              Create
            </Button>
          </form>
        </div>
      </div>
    </DatePopoverLayout>
  );
}

export default CreateBoardPopover;
