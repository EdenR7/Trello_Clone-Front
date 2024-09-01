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
    return user.firstName ? user.firstName[0] : "?";
  }
  return (
    <Avatar className={cn("bg-cyan-800 h-8 w-8", className)}>
      <AvatarFallback>{getUserFirstLetter()}</AvatarFallback>
    </Avatar>
  );
}

export default MakeUserIcon;
