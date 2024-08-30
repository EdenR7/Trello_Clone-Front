import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function CreateLabelApi(
  labelTitle: string,
  labelColor: string,
  boardId: string
) {
  try {
    const res = await api.post(`/board/${boardId}/label`, {
      title: labelTitle,
      color: labelColor,
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export function useCreateLabel(boardId: string) {
  const qClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      labelTitle,
      labelColor,
      boardId,
    }: {
      labelTitle: string;
      labelColor: string;
      boardId: string;
    }) => CreateLabelApi(labelTitle, labelColor, boardId),
    onSuccess: () => {
      if (boardId) {
        qClient.invalidateQueries(["board", boardId] as any);
      }
    },
  });
}
