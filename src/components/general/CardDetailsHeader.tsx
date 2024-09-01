import { cn } from "@/lib/utils";

function CardDetailsHeader({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        " text-gray-600 overflow-hidden whitespace-nowrap text-ellipsis mb-1 text-sm font-semibold leading-5",
        className
      )}
    >
      {title}
    </h3>
  );
}

export default CardDetailsHeader;
