import { Outlet } from "react-router-dom";

import { MainNav } from "@/components/general/main-nav";

export default function PlatformLayout() {
  return (
    <>
      <MainNav />
      <div className=" ">
        <Outlet />
      </div>
    </>
  );
}
