import api from "@/lib/api";
import { IBoard } from "@/types/board.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function updateLabelApi(
  boardId: string,
  labelId: string,
  title: string,
  color: string
) {
  try {
    if (!labelId) throw new Error("Label id is required");
    const res = await api.patch(`/board/${boardId}/label/${labelId}`, {
      title: title,
      color: color,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export function useUpdateLabel(boardId: string) {
  const qClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      labelId,
      titleInput,
      colorInput,
    }: {
      labelId: string;
      titleInput: string;
      colorInput: string;
    }) => updateLabelApi(boardId!, labelId!, titleInput, colorInput),
    onMutate: async ({ labelId, titleInput, colorInput }) => {
      const prevBoard: IBoard | undefined = qClient.getQueryData([
        "board",
        boardId,
      ]);
      if (prevBoard) {
        const newLabels = prevBoard.labels.map((label) => {
          if (label._id === labelId) {
            return {
              ...label,
              title: titleInput,
              color: colorInput,
            };
          }
          return label;
        });
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
}
