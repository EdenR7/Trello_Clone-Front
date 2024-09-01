import api from "@/lib/api";
import { ICard } from "@/types/card.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function changeBgState(cardId: string, isCover: boolean) {
  const res = await api.patch(`/card/${cardId}/bg/state`, { isCover });
  return res.data;
}

export default function useChangeBgState(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cardId, isCover }: { cardId: string; isCover: boolean }) =>
      changeBgState(cardId, isCover),
    onMutate: async ({ cardId, isCover }) => {
      await queryClient.cancelQueries({ queryKey: ["card", cardId] });
      await queryClient.cancelQueries({ queryKey: ["lists", boardId] });

      const prevCard = queryClient.getQueryData<ICard>(["card", cardId]);
      if (prevCard) {
        const updatedCard = {
          ...prevCard,
          bgCover: { ...prevCard.bgCover, isCover: isCover },
        };
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
