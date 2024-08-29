
import { Separator } from "@/components/ui/separator";

export function BoardSideBar() {
  return (
    <div className="h-[calc(100vh-48px)] right-0 top-0 w-[300px] md:w-[340px] px-3 absolute z-50 bg-slate-100">
      <h3 className=" text-base font-medium my-[18px]">Menu</h3>
      <Separator />
    </div>
  );
}
export default BoardSideBar;
