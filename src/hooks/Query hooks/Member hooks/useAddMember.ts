import api from "@/lib/api";
import { IBoard } from "@/types/board.types";
import { ICard } from "@/types/card.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function addMember(cardId: string, memberId: string) {
  const res = await api.post(`/card/${cardId}/member/add`, { memberId });
  return res.data;
}

export default function useAddMember(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cardId, memberId }: { cardId: string; memberId: string }) =>
      addMember(cardId, memberId),
    onMutate: async ({ cardId, memberId }) => {
      await queryClient.cancelQueries({ queryKey: ["card", cardId] });
      const prevCard = queryClient.getQueryData<ICard>(["card", cardId]);

      if (prevCard) {
        const board = queryClient.getQueryData<IBoard>(["board", boardId]);
        const newMember = board?.members.find(
          (member) => member._id === memberId
        );

        const updatedCard = {
          ...prevCard,
          members: [...prevCard.members, newMember],
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
  });
}
