import api from "@/lib/api";
import { ICard } from "@/types/card.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface updateTodoTitleParams {
  cardId: string;
  checklistId: string;
  todoId: string;
  newTodoTitle: string;
}

async function updateTodoTitle(
  cardId: string,
  checklistId: string,
  todoId: string,
  newTodoTitle: string
) {
  const res = await api.patch(`/card/${cardId}/checklist/updateTitle`, {
    checklistId,
    todoId,
    newTodoTitle,
  });
  return res.data;
}

export function useUpdateTodoTitle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      cardId,
      checklistId,
      todoId,
      newTodoTitle,
    }: updateTodoTitleParams) =>
      updateTodoTitle(cardId, checklistId, todoId, newTodoTitle),
    onMutate: async ({ cardId, checklistId, todoId, newTodoTitle }) => {
      await queryClient.cancelQueries({ queryKey: ["card", cardId] });

      const prevCard = queryClient.getQueryData<ICard>(["card", cardId]);

      if (prevCard) {
        const updatedCard = {
          ...prevCard,
          checklist: prevCard.checklist.map((checklist) =>
            checklist._id === checklistId
              ? {
                  ...checklist,
                  todos: checklist.todos.map((todo) =>
                    todo._id === todoId
                      ? { ...todo, title: newTodoTitle }
                      : todo
                  ),
                }
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
      queryClient.cancelQueries({ queryKey: ["card", cardId] });
    },
  });
}
