import api from "@/lib/api";
import { ICard } from "@/types/card.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function deleteChecklist(cardId: string, checklistId: string) {
  const res = await api.delete(`/card/${cardId}/checklist/${checklistId}`);
  return res.data;
}

interface deleteChecklistParams {
  cardId: string;
  checklistId: string;
}

export function useDeleteChecklist(boardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cardId, checklistId }: deleteChecklistParams) =>
      deleteChecklist(cardId, checklistId),
    onMutate: async ({ cardId, checklistId }) => {
      await queryClient.cancelQueries({ queryKey: ["card", cardId] });
      const prevCard = queryClient.getQueryData<ICard>(["card", cardId]);
      if (prevCard) {
        const updatedCard = {
          ...prevCard,
          checklist: prevCard.checklist.filter(
            (checklist) => checklist._id !== checklistId
          ),
        };

        queryClient.setQueryData(["card", cardId], updatedCard);
      }
      return { prevCard };
    },
    onError: (_, { cardId }, context) => {
      if (context?.prevCard) {
        queryClient.setQueryData<ICard>(["card", cardId], context.prevCard);
      }
    },
    onSettled: (_, __, { cardId }) => {
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
      queryClient.invalidateQueries({ queryKey: ["lists", boardId] });
    },
  });
}
