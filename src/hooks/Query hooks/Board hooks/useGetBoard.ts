import api from "@/lib/api";
import { IBoard } from "@/types/board.types";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

async function getBoard(boardId: string): Promise<IBoard> {
  const res = await api.get(`/board/${boardId}`);
  return res.data;
}

export function useGetBoard(
  boardId: string | null
): UseQueryResult<IBoard | undefined, Error> {
  return useQuery({
    queryKey: ["board", boardId],
    queryFn: () => (boardId ? getBoard(boardId) : undefined),
    enabled: !!boardId,
  });
}
