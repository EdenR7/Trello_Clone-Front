import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/providers/auth-provider";

export function UserButton() {
  const navigate = useNavigate();
  const { loggedInUser, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-[var(--hover-color)]"
        >
          <div className="w-6 h-6">
            <Avatar className="w-full h-full">
              <AvatarImage alt={loggedInUser?.username} />
              <AvatarFallback className="bg-[#00A3BF] text-white ">
                {/* Same color as words */}
                <span> {loggedInUser?.username[0].toUpperCase()}</span>
              </AvatarFallback>
            </Avatar>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Profile Menu</DropdownMenuLabel>
        {/* <DropdownMenuSeparator /> */}
        {/* <DropdownMenuItem asChild>
          <Link to="#">Profile</Link>
        </DropdownMenuItem> */}
        {/* <DropdownMenuItem asChild>
          <Link to="#">Setting</Link>
        </DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-1"
        >
          <LogOut className="h-4 w-4" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
