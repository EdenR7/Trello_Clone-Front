// import { Link } from "react-router-dom";

// import { LogOut } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// import { useAuth } from "@/providers/auth-provider";

// export function UserButton() {
//   const { loggedInUser, logout } = useAuth();

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" size="icon" className="rounded-full">
//           <Avatar>
//             <AvatarImage
//               src={loggedInUser?.imageUrl || ""}
//               alt={loggedInUser?.username}
//             />
//             <AvatarFallback>
//               {loggedInUser?.username[0].toUpperCase()}
//             </AvatarFallback>
//           </Avatar>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         <DropdownMenuLabel>Profile Menu</DropdownMenuLabel>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem asChild>
//           <Link to="#">Profile</Link>
//         </DropdownMenuItem>
//         <DropdownMenuItem asChild>
//           <Link to="#">Setting</Link>
//         </DropdownMenuItem>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem onClick={logout} className="flex items-center gap-1">
//           <LogOut className="h-4 w-4" /> Logout
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

import { Link } from "react-router-dom";
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
  const { loggedInUser, logout } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <div className="w-6 h-6">
            <Avatar className="w-full h-full">
              <AvatarImage
                // src={loggedInUser?.imageUrl || ""}
                alt={loggedInUser?.username}
              />
              <AvatarFallback className="bg-[#44546F] text-white rounded-full">
                {" "}
                {/* Same color as words */}
                {loggedInUser?.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Profile Menu</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="#">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="#">Setting</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="flex items-center gap-1">
          <LogOut className="h-4 w-4" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
