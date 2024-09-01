import api from "@/lib/api";
import { IBoard, ILabel } from "@/types/board.types";
import { ICard } from "@/types/card.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function CreateLabelApi(
  labelTitle: string,
  labelColor: string,
  boardId: string,
  cardId?: string
) {
  try {
    console.log("cardId in labelApi: ", cardId);

    const res = await api.post(`/board/${boardId}/label`, {
      title: labelTitle,
      color: labelColor,
      cardId: cardId,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export function useCreateLabel(boardId: string, cardId?: string) {
  const qClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      labelTitle,
      labelColor,
      boardId,
    }: {
      labelTitle: string;
      labelColor: string;
      boardId: string;
    }) => CreateLabelApi(labelTitle, labelColor, boardId, cardId),
    onMutate: async ({ labelColor, labelTitle }) => {
      await qClient.cancelQueries({ queryKey: ["board", boardId] });
      if (cardId) await qClient.cancelQueries({ queryKey: ["card", cardId] });

      const prevBoard = qClient.getQueryData<IBoard>(["board", boardId]);
      const prevCard = cardId
        ? qClient.getQueryData<ICard>(["card", cardId])
        : undefined;
      const newLabel: ILabel = {
        _id: `temp_${Date.now()}`, // Temporary ID
        title: labelTitle,
        color: labelColor,
      };
      if (prevBoard) {
        const updatedBoard = {
          ...prevBoard,
          labels: [...prevBoard.labels, newLabel],
        };
        qClient.setQueryData(["board", boardId], updatedBoard);
      }
      if (cardId && prevCard) {
        if (prevCard) {
          qClient.setQueryData(["card", cardId], {
            ...prevCard,
            labels: [...prevCard.labels, newLabel],
          });
          console.log("finished updating card: ", prevCard.labels);
        }
      }
      return { prevBoard, prevCard };
    },
    onError: (_, __, context) => {
      if (context?.prevBoard) {
        qClient.setQueryData(["board", boardId], context.prevBoard);
      }
      if (context?.prevCard) {
        console.log("error with card, reverting");

        qClient.setQueryData(["card", cardId], context.prevCard);
      }
    },
    onSettled: () => {
      qClient.invalidateQueries({ queryKey: ["board", boardId] });
      if (cardId) {
        qClient.invalidateQueries({ queryKey: ["card", cardId] });
      }
    },
  });
}
