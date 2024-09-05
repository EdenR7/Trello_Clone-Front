import api from "@/lib/api";
import { ICard } from "@/types/card.types";
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
    onMutate: async ({ cardId, newTitle }) => {
      await queryClient.cancelQueries({ queryKey: ["card", cardId] });
      const prevCard = queryClient.getQueryData<ICard>(["card", cardId]);
      if (prevCard) {
        const updatedCard = { ...prevCard, title: newTitle };
        queryClient.setQueryData(["card", cardId], updatedCard);
      }

      return { prevCard };
    },
    onError: (_, { cardId }, context) => {
      if (context?.prevCard) {
        queryClient.setQueryData(["card", cardId], context.prevCard);
      }
    },
    onSettled: (_, __, { cardId }) => {
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
      queryClient.invalidateQueries({ queryKey: ["lists", boardId] });
    },
  });
}
