import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function MenuMoveListApi(
  listId: string,
  sourceId: string,
  destinationId: string,
  newPosition: number
) {
  try {
    const res = await api.patch(
      `/list/${listId}/move/${sourceId}/${destinationId}`,
      {
        newIndex: newPosition,
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export function useMoveList(boardId: string) {
  const qClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      newPosition,
      destinationId,
      sourceId,
      listId,
    }: {
      listId: string;
      sourceId: string;
      destinationId: string;
      newPosition: number;
    }) => MenuMoveListApi(listId, sourceId, destinationId, newPosition),
    onSuccess: () => {
      qClient.invalidateQueries({ queryKey: ["lists", boardId] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
}
