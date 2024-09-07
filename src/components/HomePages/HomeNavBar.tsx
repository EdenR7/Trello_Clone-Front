import { LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Separator } from "../ui/separator";
import { LoggedInUser } from "@/providers/auth-provider";

function HomeNavBar({
  loggedInUser,
}: {
  loggedInUser: LoggedInUser | null | undefined;
}) {
  const location = useLocation();
  const slicedUrl = location.pathname.split("/");
  const endUrl = slicedUrl[slicedUrl.length - 1];
  const onHome = endUrl === "";

  return (
    <div className=" relative min-w-48 max-w-64 max-h-[526px] hidden break-600px:block">
      <nav className="  sticky top-24 px-4 mt-10">
        <div>
          <ul>
            <li
              className={`mb-1 w-full font-medium ${
                !onHome && "text-blue-500 bg-blue-50 rounded-lg"
              } `}
            >
              <Link
                className=" flex px-2 py-[6px] gap-2 rounded-md"
                to={`${
                  loggedInUser
                    ? `/u/${loggedInUser.username}/boards`
                    : "/auth/login"
                }`}
              >
                <LayoutDashboard size={18} />
                <span>Boards</span>
              </Link>
            </li>
          </ul>
        </div>
        <Separator />
        <div></div>
      </nav>
    </div>
  );
}

export default HomeNavBar;
