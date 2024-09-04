import { useMutation, useQueryClient } from "@tanstack/react-query";

import { moveCardWithinListApi } from "../Card hooks/useMoveCardWithinList";

interface MoveCardToSameListProps {
  cardId: string;
  newPos: number;
}

export default function useMoveCardToSameList(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cardId, newPos }: MoveCardToSameListProps) =>
      moveCardWithinListApi(cardId, newPos),
    onSuccess: (_, { cardId }) => {
      queryClient.invalidateQueries({ queryKey: ["lists", boardId] });
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
    },
  });
}
