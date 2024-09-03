import { cn } from "@/lib/utils";

function CardPopoverTitle({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        " text-gray-600 overflow-hidden whitespace-nowrap text-ellipsis mb-1 text-xs font-bold leading-5",
        className
      )}
    >
      {title}
    </h3>
  );
}

export default CardPopoverTitle;
