import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonList() {
  return (
    <ol className=" list-none flex gap-3 pr-20">
      <Skeleton className="h-[120px] pb-2 pr-1 shadow-sm rounded-xl overflow-hidden min-w-[272px] max-w-[272px] bg-gray-200 text-text_dark_blue" />
      <Skeleton className="h-[120px] pb-2 pr-1 shadow-sm rounded-xl overflow-hidden min-w-[272px] max-w-[272px] bg-gray-200 text-text_dark_blue" />
      <Skeleton className="h-[120px] pb-2 pr-1 shadow-sm rounded-xl overflow-hidden min-w-[272px] max-w-[272px] bg-gray-200 text-text_dark_blue" />
    </ol>
  );
}
