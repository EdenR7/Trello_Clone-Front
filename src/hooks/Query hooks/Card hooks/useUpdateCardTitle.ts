import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function updateCardTitle(cardId: string, newTitle: string) {
  const res = await api.patch(`/card/${cardId}/title/edit`, {
    newTitle,
  });
  return res.data;
}

export function useUpdateCardTitle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cardId, newTitle }: { cardId: string; newTitle: string }) =>
      updateCardTitle(cardId, newTitle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["card"] });
    },
  });
}
