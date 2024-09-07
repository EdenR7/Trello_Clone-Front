import api from "@/lib/api";
import { IBoard } from "@/types/board.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function changeBackgroundApi(
  boardId: string,
  background: string,
  bgType: string
) {
  try {
    const res = await api.patch(`/board/${boardId}/bg`, {
      background,
      bgType,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export function useUpdateBg(boardId: string) {
  const qClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      background,
      bgType,
    }: {
      background: string;
      bgType: string;
    }) => changeBackgroundApi(boardId!, background, bgType),
    onMutate: async ({ background, bgType }) => {
      qClient.cancelQueries({ queryKey: ["board", boardId] });
      const previousData: IBoard | undefined = qClient.getQueryData([
        "board",
        boardId,
      ]);
      if (bgType !== "color" && bgType !== "gradient" && bgType !== "image")
        return;
      if (previousData) {
        const newBoard: IBoard = {
          ...previousData,
          bg: { background, bgType },
        };
        qClient.setQueryData(["board", boardId], newBoard);
      }
      return { previousData };
    },
    onError(_, __, context) {
      if (context?.previousData) {
        qClient.setQueryData(["board", boardId], context.previousData);
      }
    },
  });
}
