import HomeNavBar from "@/components/HomePages/HomeNavBar";
import { useAuth } from "@/providers/auth-provider";
import { Outlet } from "react-router-dom";

function HomeLayout() {
  const { loggedInUser } = useAuth();

  return (
    <>
      <main className="  flex relative justify-center text-text_dark_blue">
        {/* side bar */}
        <HomeNavBar loggedInUser={loggedInUser} />
        {/* main content */}
        <div className=" min-w-72 flex-1 max-w-[825px] mt-10 mx-4">
          <Outlet />
        </div>
      </main>
    </>
  );
}

export default HomeLayout;
