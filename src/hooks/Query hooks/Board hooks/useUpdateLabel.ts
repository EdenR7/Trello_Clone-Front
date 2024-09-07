import api from "@/lib/api";
import { IBoard, ILabel } from "@/types/board.types";
import { ICard } from "@/types/card.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function updateLabelApi(
  boardId: string,
  labelId: string,
  title: string,
  color: string
) {
  try {
    if (!labelId) throw new Error("Label id is required");
    const res = await api.patch(`/board/${boardId}/label/${labelId}`, {
      title: title,
      color: color,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export function useUpdateLabel(boardId: string, cardId?: string) {
  const qClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      labelId,
      titleInput,
      colorInput,
    }: {
      labelId: string;
      titleInput: string;
      colorInput: string;
    }) => updateLabelApi(boardId!, labelId!, titleInput, colorInput),
    onMutate: async ({ labelId, titleInput, colorInput }) => {
      qClient.cancelQueries({ queryKey: ["board", boardId] });
      const prevBoard: IBoard | undefined = qClient.getQueryData([
        "board",
        boardId,
      ]);
      if (prevBoard) {
        const newLabels = prevBoard.labels.map((label) => {
          if (label._id === labelId) {
            return {
              ...label,
              title: titleInput,
              color: colorInput,
            };
          }
          return label;
        });

        qClient.setQueryData(["board", boardId], {
          ...prevBoard,
          labels: newLabels,
        });
      }
      if (cardId) {
        const prevCard: ICard | undefined = qClient.getQueryData([
          "card",
          cardId,
        ]);
        if (prevCard) {
          const updatedCardLabels = prevCard.labels.map((label: ILabel) => {
            if (label._id === labelId) {
              return {
                ...label,
                title: titleInput,
                color: colorInput,
              };
            }
            return label;
          });

          qClient.setQueryData(["card", cardId], {
            ...prevCard,
            labels: updatedCardLabels,
          });
        }
      }

      return { prevBoard };
    },
    onError: (err, _, context) => {
      console.log(err);

      if (context?.prevBoard) {
        qClient.setQueryData(["board", boardId], context.prevBoard);
      }
    },
    onSettled: () => {
      qClient.invalidateQueries({ queryKey: ["card", cardId] });
      qClient.invalidateQueries({ queryKey: ["lists", boardId] });
    },
  });
}
