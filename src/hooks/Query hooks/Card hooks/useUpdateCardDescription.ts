import api from "@/lib/api";
import { ICard } from "@/types/card.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function updateCardDescription(cardId: string, newDesc: string) {
  const res = await api.patch(`/card/${cardId}/description`, {
    descContent: newDesc,
  });
  return res.data;
}

export function useUpdateCardDescription(boardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cardId, newDesc }: { cardId: string; newDesc: string }) =>
      updateCardDescription(cardId, newDesc),
    // onSuccess: (_, { cardId }) => {
    //   queryClient.invalidateQueries({ queryKey: ["card", cardId] });
    // },
    onMutate: async ({ cardId, newDesc }) => {
      await queryClient.cancelQueries({ queryKey: ["card", cardId] });

      const previousCard = queryClient.getQueryData<ICard>(["card", cardId]);

      if (previousCard) {
        queryClient.setQueryData<ICard>(["card", cardId], {
          ...previousCard,
          description: newDesc,
        });
      }

      return { previousCard };
    },
    onError: (_, { cardId }, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousCard) {
        queryClient.setQueryData<ICard>(["card", cardId], context.previousCard);
      }
    },
    onSettled: (_, __, { cardId }) => {
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
      queryClient.invalidateQueries({ queryKey: ["lists", boardId] });
    },
  });
}
