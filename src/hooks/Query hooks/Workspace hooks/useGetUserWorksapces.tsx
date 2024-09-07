import api from "@/lib/api";
import { IWorkspace } from "@/types/workspace.types";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export async function getUserWorkspaces() {
  try {
    const res = await api.get("/workspace");
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export function useGetUserWorkspaces(
  userId: string
): UseQueryResult<IWorkspace[] | undefined, Error> {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: getUserWorkspaces,
    enabled: !!userId,
  });
}
