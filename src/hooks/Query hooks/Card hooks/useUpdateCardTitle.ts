import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function updateCardTitle(cardId: string, newTitle: string) {
  const res = await api.patch(`/card/${cardId}/title/edit`, {
    newTitle,
  });
  return res.data;
}

export function useUpdateCardTitle(boardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cardId, newTitle }: { cardId: string; newTitle: string }) =>
      updateCardTitle(cardId, newTitle),
    onSuccess: (_, { cardId }) => {
      queryClient.invalidateQueries({ queryKey: ["lists", boardId] });
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
    },
  });
}
