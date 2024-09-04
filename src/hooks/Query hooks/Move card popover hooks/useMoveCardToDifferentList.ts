import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moveCardToListApi } from "../Card hooks/useMoveCardToList";

interface MoveCardToDifferentListProps {
  cardId: string;
  listId: string;
  newPos: number;
}
export default function useMoveCardToDifferentList(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cardId, listId, newPos }: MoveCardToDifferentListProps) =>
      moveCardToListApi(cardId, listId, newPos),
    onSuccess: (_, { cardId }) => {
      queryClient.invalidateQueries({ queryKey: ["lists", boardId] });
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
    },
  });
}
