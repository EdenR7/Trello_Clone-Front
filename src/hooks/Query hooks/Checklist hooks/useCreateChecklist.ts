import api from "@/lib/api";
import { ICard } from "@/types/card.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function createChecklist(cardId: string, checklistName: string) {
  const res = await api.post(`/card/${cardId}/checklist/addChecklist`, {
    checklistName,
  });
  return res.data;
}

interface CreateChecklistProps {
  cardId: string;
  checklistName: string;
}

export default function useCreateChecklist(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cardId, checklistName }: CreateChecklistProps) =>
      createChecklist(cardId, checklistName),
    onMutate: async ({ cardId, checklistName }) => {
      await queryClient.cancelQueries({ queryKey: ["card", cardId] });
      const prevCard = queryClient.getQueryData<ICard>(["card", cardId]);
      if (prevCard) {
        const newChecklist = {
          name: checklistName,
          todos: [],
          _id: `_temp.${checklistName}`,
        };
        const updatedCard = {
          ...prevCard,
          checklist: [...prevCard.checklist, newChecklist],
        };
        queryClient.setQueryData(["card", cardId], updatedCard);
      }

      return {
        prevCard,
      };
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
    onSuccess: (data) => {
      return data._id; //change
    },
  });
}
