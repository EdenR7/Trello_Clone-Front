import { IBoard } from "@/types/board.types";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";

interface LabelLayoutProps {
  boardId: string;
}

function LabelLayout({ boardId }: LabelLayoutProps) {
  const qClient = useQueryClient();
  const board: IBoard | undefined = qClient.getQueryData(["board", boardId]);

  if (!board) return;

  const labels = [...board.labels];
  labels.sort((a, b) => {
    if (a.title === "Default") return 1;
    if (b.title === "Default") return -1;
    return a.title.localeCompare(b.title);
  });

  return (
    <div className=" flex flex-col gap-2">
      <Input
        className="border h-9  border-gray-400 py-0 focus-visible:ring-0 focus:border-blue-500 focus:border-2 focus:outline-none"
        placeholder=" Search labels..."
      />
      <h3 className=" text-xs font-semibold">Labels</h3>
      <ul>
        {labels.map((label) => {
          return (
            <li key={label._id}>
              <div className=" flex justify-between items-center">
                <span
                  className="w-full h-8 rounded-sm flex font-medium items-center pl-3"
                  style={{ backgroundColor: label.color }}
                >
                  {label.title !== "Default" && label.title}
                </span>
                <Button
                  className=" flex justify-center items-center"
                  size={"icon"}
                  variant={"naked"}
                >
                  <Pencil size={12} />
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default LabelLayout;
