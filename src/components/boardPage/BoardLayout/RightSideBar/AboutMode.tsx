import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateDescription } from "@/hooks/Query hooks/Board hooks/useUpdateDescription";
import { IBoard } from "@/types/board.types";
import { useQueryClient } from "@tanstack/react-query";
import { List, User, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SideBarModeProps } from "./BoardSideBar";

function AboutMode({ boardId }: SideBarModeProps) {
  const qClient = useQueryClient();
  const board: IBoard | undefined = qClient.getQueryData(["board", boardId]);
  const [editDescription, setEditDescription] = useState(false);
  const [descriptionValue, setDescriptionValue] = useState<string | undefined>(
    board?.description
  );
  const boardAdmin = board?.members.find(
    (member) => member._id === board?.admin
  );
  const textareaRef = useRef<null | HTMLTextAreaElement>(null);
  const descriptionUpdater = useUpdateDescription({ boardId });

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current?.focus();
    }
  }, [editDescription]);

  return (
    <div className=" ">
      <div className=" flex items-center gap-3 py-2 mb-2 ml-2 ">
        <UserRound size={18} strokeWidth={2.5} />
        <h3 className=" text-base font-semibold">Board Admins</h3>
      </div>
      <div className=" flex gap-4">
        <div className=" h-[50px] w-[50px] rounded-full bg-cyan-600 flex items-center justify-center ml-1 ny-2">
          <User size={32} strokeWidth={2.5} className=" text-slate-900" />
        </div>
        <div>
          <h4 className=" -translate-y-1 text-base font-semibold">
            {boardAdmin?.firstName} {boardAdmin?.lastName}
          </h4>
          <p className=" -translate-y-2 text-slate-600 ">
            @{boardAdmin?.username}
          </p>
          <Button
            className="p-0 font-normal text-slate-600 hover:bg-white hover:underline hover:text-blue-600"
            size={"sm"}
            variant={"naked"}
          >
            Edit profile info
          </Button>
        </div>
      </div>
      <div className=" flex justify-between items-center">
        <div className=" mt-3 flex items-center text-base font-semibold gap-4 ml-1 mb-4 ">
          <List size={20} />
          <h3>Description</h3>
        </div>
        {board?.description && !editDescription && (
          <Button
            size={"sm"}
            variant={"secondary"}
            className=" h-8"
            onClick={() => setEditDescription(true)}
          >
            Edit
          </Button>
        )}
      </div>
      <div className=" mb-12">
        {editDescription ? (
          <>
            <Textarea
              value={descriptionValue}
              onChange={(ev) => {
                setDescriptionValue(ev.currentTarget.value);
              }}
              ref={textareaRef}
              className=" w-[calc(100%-12px)] min-h-40 mr-2 ml-1"
            />
            <div className=" flex gap-1 ml-1 mt-2">
              <Button
                onClick={() => {
                  descriptionUpdater.mutate({
                    boardId,
                    description: descriptionValue!,
                  });
                  setEditDescription(false);
                }}
                className=" py-[6px] px-3"
              >
                Save
              </Button>
              <Button
                onClick={() => {
                  setDescriptionValue(board?.description);
                  setEditDescription(false);
                }}
                variant={"secondary"}
                className=" bg-white py-[6px] px-3"
              >
                Cancel
              </Button>
            </div>
          </>
        ) : !board?.description ? (
          <Button
            className=" text-text_dark_blue break-words whitespace-normal w-full px-3 h-fit text-start rounded-md "
            variant={"secondary"}
            onClick={() => setEditDescription(true)}
          >
            Add a description to let your teammates know what this board is used
            for. You'll get bonus points if you add instructions for how to
            collaborate!
          </Button>
        ) : (
          <p
            className=" font-normal cursor-pointer px-1"
            onClick={() => setEditDescription(true)}
          >
            {board.description}
          </p>
        )}
      </div>
      <Separator />
    </div>
  );
}
export default AboutMode;
