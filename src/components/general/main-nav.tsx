// import { Link } from "react-router-dom";
// import { ModeToggle } from "./mode-toggle";
// import { AuthButton } from "./auth-button";
// import { UserButton } from "./user-button";
// import { useAuth } from "@/providers/auth-provider";
// import MainSideBar from "./main-sidebar";

// export function MainNav() {
//   const { loggedInUser } = useAuth();

//   return (
//     <header className=" sticky top-0 py-2 z-50 w-full border-border/40 bg-foreground/95 backdrop-blur supports-[backdrop-filter]:bg-foreground/60 shadow-md dark:border-b dark: border-b-primary">
//       <div className=" max-h-8 flex justify-between items-center px-6">
//         <div className="flex gap-4">
//           <Link
//             to="/"
//             className="uppercase mr-4 flex items-center space-x-2 lg:mr-6 text-lg"
//           >
//             Logo
//           </Link>
//           <nav className="  hidden w-full sm:flex items-center gap-4 text-sm lg:gap-6">
//             <Link className=" hover:underline decoration-primary" to="/about">
//               About
//             </Link>
//             <Link className=" hover:underline decoration-primary" to="/contact">
//               Contact
//             </Link>
//             <Link
//               className=" hover:underline decoration-primary"
//               to="/services"
//             >
//               Services
//             </Link>
//             <Link
//               className=" hover:underline decoration-primary"
//               to="/b/66d46ee382111fd9687428a5"
//             >
//               Board
//             </Link>
//           </nav>
//         </div>
//         <div className="flex items-center space-x-2 md:justify-end">
//           <div className=" hidden break-500px:block">
//             {loggedInUser ? <UserButton /> : <AuthButton />}
//           </div>
//           <ModeToggle />
//           <MainSideBar />
//         </div>
//       </div>
//     </header>
//   );
// }

import { Link } from "react-router-dom";
import { AuthButton } from "./auth-button";
import { UserButton } from "./user-button";
import { useAuth } from "@/providers/auth-provider";
import MainSideBar from "./main-sidebar";
import { Search, Bell, HelpCircle, Plus, ChevronDown } from "lucide-react"; // Import the down arrow icon

export function MainNav() {
  const { loggedInUser } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-white py-2 border-b border-gray-200 h-12">
      <div className="max-h-10 flex justify-between items-center px-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-[#44546F] font-bold text-2xl mr-4">
            Trello
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <button className="font-medium text-[#44546F] hover:bg-[#f0f0f0] px-3 py-1.5 rounded-sm text-sm">
              Workspaces <ChevronDown className="inline h-4 w-4" />
            </button>
            <button className="font-medium text-[#44546F] hover:bg-[#f0f0f0] px-3 py-1.5 rounded-sm text-sm">
              Recent <ChevronDown className="inline h-4 w-4" />
            </button>
            <button className="font-medium text-[#44546F] hover:bg-[#f0f0f0] px-3 py-1.5 rounded-sm text-sm">
              Starred <ChevronDown className="inline h-4 w-4" />
            </button>
            <button className="font-medium text-[#44546F] hover:bg-[#f0f0f0] px-3 py-1.5 rounded-sm text-sm">
              More <ChevronDown className="inline h-4 w-4" />
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-1 py-0 w-8 h-8 rounded-sm text-sm">
              <Plus size={22} />
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search"
              className="bg-white text-gray-400 placeholder-gray-400 px-8 py-1 rounded-md text-sm w-48 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
            <Search
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
          </div>
          <button className="text-[#44546F] hover:bg-[#f0f0f0] p-1.5 rounded-sm">
            <Bell size={18} style={{ transform: "rotate(45deg)" }} />
          </button>
          <button className="text-[#44546F] hover:bg-[#f0f0f0] p-1.5 rounded-sm">
            <HelpCircle size={18} />
          </button>
          <div className="hidden md:block">
            {loggedInUser ? <UserButton /> : <AuthButton />}
          </div>
          <MainSideBar />
        </div>
      </div>
    </header>
  );
}
