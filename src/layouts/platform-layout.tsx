import { Outlet } from "react-router-dom";

import { MainNav } from "@/components/general/main-nav";

export default function PlatformLayout() {
  return (
    <>
      <MainNav />
      <div className=" px-6 py-8 max-w-screen-2xl">
        <Outlet />
      </div>
    </>
  );
}
