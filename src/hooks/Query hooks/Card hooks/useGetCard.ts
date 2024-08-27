import api from "@/lib/api";
import { ICard } from "@/types/card.types";
import { useQuery } from "@tanstack/react-query";

async function getCard(cardId: string): Promise<ICard> {
  const res = await api.get(`/card/${cardId}`);
  return res.data;
}

export function usegetCard(cardId: string) {
  return useQuery({
    queryKey: ["card", cardId],
    queryFn: () => getCard(cardId),
  });
}
