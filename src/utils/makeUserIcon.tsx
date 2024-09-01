import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { IMember } from "@/types/board.types";
import { AvatarFallback } from "@radix-ui/react-avatar";

function MakeUserIcon({
  user,
  className,
}: {
  user: IMember;
  className?: string;
}) {
  function getUserFirstLetter() {
    return user.firstName && user.lastName
      ? (user.firstName[0] + user.lastName[0]).toUpperCase()
      : "?";
  }
  return (
    <Avatar
      className={cn(
        "bg-[#00A3BF] h-8 w-8 flex items-center justify-center font-bold hover:cursor-pointer ",
        className
      )}
    >
      <AvatarFallback>{getUserFirstLetter()}</AvatarFallback>
    </Avatar>
  );
}

export default MakeUserIcon;
