import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getWorkspace(workspaceId: string) {
  const res = await api.get(`/workspace/${workspaceId}`);
  return res.data;
}

export function useGetWorkspace(workspaceId: string) {
  return useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: () => getWorkspace(workspaceId),
  });
}
