import api from "@/lib/api";
import { ICard } from "@/types/card.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface updateTitleParams {
  cardId: string;
  checklistId: string;
  newChecklistTitle: string;
}

async function updateChecklistTitle(
  cardId: string,
  checklistId: string,
  newChecklistTitle: string
) {
  const res = await api.patch(
    `/card/${cardId}/checklist/updateChecklistTitle`,
    { checklistId, newChecklistTitle }
  );
  return res.data;
}

export function useUpdateChecklistTitle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      cardId,
      checklistId,
      newChecklistTitle,
    }: updateTitleParams) =>
      updateChecklistTitle(cardId, checklistId, newChecklistTitle),
    onMutate: async ({ cardId, checklistId, newChecklistTitle }) => {
      await queryClient.cancelQueries({ queryKey: ["card", cardId] });
      const prevCard = queryClient.getQueryData<ICard>(["card", cardId]);
      if (prevCard) {
        const updatedCard = {
          ...prevCard,
          checklist: prevCard.checklist.map((checklist) =>
            checklist._id === checklistId
              ? { ...checklist, name: newChecklistTitle }
              : checklist
          ),
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
    },
  });
}
