import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { labelColorsOptions } from "@/constants/board.constants";
import { Button } from "../ui/button";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { X } from "lucide-react";
import { useParams } from "react-router-dom";
import { useCreateLabel } from "@/hooks/Query hooks/Board hooks/useCreateLabel";
import { useUpdateLabel } from "@/hooks/Query hooks/Board hooks/useUpdateLabel";
import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IBoard } from "@/types/board.types";

interface CreateAndEditLabelLayoutProps {
  isEditMode: boolean;
  color?: string;
  title?: string;
  labelId?: string;
}

export async function deleteLbelApi(boardId: string, labelId: string) {
  try {
    if (!labelId) throw new Error("Label id is required");
    const res = await api.delete(`/board/${boardId}/label/${labelId}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export function CreateAndEditLabelLayout({
  isEditMode,
  color,
  title,
  labelId,
}: CreateAndEditLabelLayoutProps) {
  const { boardId } = useParams();

  const qClient = useQueryClient();
  const [titleInput, setTitleInput] = useState(title || "");
  const [colorInput, setColorInput] = useState(color || "#94c748");
  const inputRef = useRef<null | HTMLInputElement>(null);
  const createLabel = useCreateLabel(boardId!);
  const editLabel = useUpdateLabel(boardId!);
  const deleteLabel = useMutation({
    mutationFn: ({ labelId }: { labelId: string }) =>
      deleteLbelApi(boardId!, labelId),
    onMutate: async ({ labelId }) => {
      const prevBoard: IBoard | undefined = qClient.getQueryData([
        "board",
        boardId,
      ]);
      if (prevBoard) {
        const newLabels = prevBoard.labels.filter(
          (label) => label._id !== labelId
        );
        qClient.setQueryData(["board", boardId], {
          ...prevBoard,
          labels: newLabels,
        });
      }
      return { prevBoard };
    },
    onError: (err, variables, context) => {
      console.log(err);
      if (context?.prevBoard) {
        qClient.setQueryData(["board", boardId], context.prevBoard);
      }
    },
  });

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  function handleCreateLabel() {
    if (!boardId) return null;
    createLabel.mutate({
      labelTitle: titleInput,
      labelColor: colorInput,
      boardId,
    });
  }
  function handleUpdateLabel() {
    if (!boardId || !labelId) return null;
    editLabel.mutate({
      labelId,
      titleInput,
      colorInput,
    });
  }
  function handleDeleteLabel() {
    if (!boardId || !labelId) return null;
    deleteLabel.mutate({ labelId });
  }

  return (
    <div className=" text-gray-600">
      {/* Title */}
      <section className=" h-[100px] bg-slate-50 flex items-center justify-center">
        <div
          style={{ backgroundColor: colorInput }}
          className=" h-8 w-60 rounded-md"
        ></div>
      </section>

      {/* Main */}
      <section className=" mb-4">
        <h3 className=" text-xs font-medium mt-3 mb-2">Title</h3>
        <Input
          ref={inputRef}
          className=" h-9 border-slate-400"
          value={titleInput}
          onChange={(ev) => {
            setTitleInput(ev.currentTarget.value);
          }}
        />
        <h3 className=" text-xs font-medium mt-3 mb-2">Select a color</h3>
        <div className="grid grid-cols-5 gap-2 auto-rows-[32px] mb-2">
          {labelColorsOptions.map((color, index) => {
            return (
              <div
                key={index}
                onClick={() => setColorInput(color)}
                className={`rounded-sm cursor-pointer ${
                  colorInput === color &&
                  "outline outline-2 outline-blue-700 outline-offset-2"
                }`}
                style={{ backgroundColor: color }}
              ></div>
            );
          })}
        </div>
        <Button
          onClick={() => {
            if (colorInput) setColorInput("");
          }}
          variant={colorInput ? "secondary" : "notAllowed"}
          className={`w-full flex justify-center gap-2 ${
            colorInput && "text-gray-600"
          }`}
        >
          <X
            size={16}
            className={`${
              colorInput ? "text-gray-600" : "text-btn_bg_primary/40"
            }`}
          />
          <span>Remove color</span>
        </Button>
      </section>
      <Separator />

      {/* Buttons */}
      <section className=" mt-4">
        <div className=" flex justify-between">
          {isEditMode ? (
            <>
              <Button
                variant={colorInput ? "primaryBtn" : "notAllowed"}
                onClick={handleUpdateLabel}
              >
                Save
              </Button>
              <Button variant={"destructive"} onClick={handleDeleteLabel}>
                Delete
              </Button>
            </>
          ) : (
            <Button
              variant={colorInput ? "primaryBtn" : "notAllowed"}
              onClick={handleCreateLabel}
            >
              Create
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
