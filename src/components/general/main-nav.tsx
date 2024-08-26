import { Link } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import { AuthButton } from "./auth-button";
import { UserButton } from "./user-button";
import { useAuth } from "@/providers/auth-provider";
import MainSideBar from "./main-sidebar";

export function MainNav() {
  const { loggedInUser } = useAuth();

  return (
    <header className="sticky top-0 py-2 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md dark:border-b dark: border-b-primary">
      <div className=" flex justify-between h-14 max-w-screen-2xl items-center px-6">
        <div className="flex gap-4">
          <Link
            to="/"
            className="uppercase mr-4 flex items-center space-x-2 lg:mr-6 text-lg"
          >
            Logo
          </Link>
          <nav className="hidden sm:flex items-center gap-4 text-sm lg:gap-6">
            <Link className=" hover:underline decoration-primary" to="/about">
              About
            </Link>
            <Link className=" hover:underline decoration-primary" to="/contact">
              Contact
            </Link>
            <Link
              className=" hover:underline decoration-primary"
              to="/services"
            >
              Services
            </Link>
            <Link
              className=" hover:underline decoration-primary"
              to="/protected"
            >
              Protected
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-2 md:justify-end">
          <div className=" hidden break-500px:block">
            {loggedInUser ? <UserButton /> : <AuthButton />}
          </div>
          <ModeToggle />
          <MainSideBar />
        </div>
      </div>
    </header>
  );
}
