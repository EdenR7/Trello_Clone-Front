import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/providers/auth-provider";
import { Separator } from "../ui/separator";
import { Link } from "react-router-dom";
import { AlignJustify, Home, User } from "lucide-react";
import { UserButton } from "./user-button";
import { AuthButton } from "./auth-button";

export function MainSideBar() {
  const { loggedInUser } = useAuth();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className=" sm:hidden" variant="naked">
          <AlignJustify />
        </Button>
      </SheetTrigger>
      <SheetContent className=" min-w-48 w-1/2 md:w-96">
        <SheetHeader>
          <div className=" flex flex-col gap-2 items-center ">
            <div className=" border rounded-full border-primary">
              {loggedInUser ? <UserButton /> : <AuthButton />}
            </div>

            <SheetTitle>
              Hello{" "}
              <span className=" underline decoration-primary">
                {loggedInUser ? loggedInUser.username : "Guest"}
              </span>{" "}
              !
            </SheetTitle>
          </div>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className=" flex flex-col mt-8">
          <Link
            to="/"
            className=" flex gap-4 py-4 hover:bg-primary/10 text-muted-foreground hover:text-foreground"
          >
            <Home />
            <span>Home Page</span>
          </Link>
          <Separator />
          <div>
            <Link
              to="/auth/login"
              className=" flex gap-4 py-4 hover:bg-primary/10 text-muted-foreground hover:text-foreground"
            >
              <User />
              <span>{loggedInUser ? "Profile" : "Login"}</span>
            </Link>
          </div>
          <Separator />
          <div>
            <Link
              to="/"
              className=" flex gap-4 py-4 hover:bg-primary/10 text-muted-foreground hover:text-foreground"
            >
              <Home />
              <span>Home Page</span>
            </Link>
          </div>
          <Separator />
          <div>
            <Link
              to="/"
              className=" flex gap-4 py-4 hover:bg-primary/10 text-muted-foreground hover:text-foreground"
            >
              <Home />
              <span>Home Page</span>
            </Link>
          </div>
          <Separator />
          <div>
            <Link
              to="/"
              className=" flex gap-4 py-4 hover:bg-primary/10 text-muted-foreground hover:text-foreground"
            >
              <Home />
              <span>Home Page</span>
            </Link>
          </div>
          <Separator />
          <div>
            <Link
              to="/"
              className=" flex gap-4 py-4 hover:bg-primary/10 text-muted-foreground hover:text-foreground"
            >
              <Home />
              <span>Home Page</span>
            </Link>
          </div>
          <Separator />
        </div>
        <SheetFooter></SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
export default MainSideBar;
