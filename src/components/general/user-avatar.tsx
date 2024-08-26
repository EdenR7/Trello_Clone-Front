import { useAuth } from "@/providers/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { User } from "lucide-react";

function UserAvatar() {
  const { loggedInUser } = useAuth();

  return loggedInUser ? (
    <Avatar>
      <AvatarImage
        src={loggedInUser?.imageUrl || ""}
        alt={loggedInUser?.username}
      />
      <AvatarFallback>{loggedInUser?.username[0].toUpperCase()}</AvatarFallback>
    </Avatar>
  ) : (
    <div className=" border border-primary rounded-full p-2">
      <User className="h-[1.2rem] w-[1.2rem]" />
    </div>
  );
}

export default UserAvatar;
