import { Dialog, DialogOverlay } from "@/components/ui/dialog";
import { DialogContent } from "@radix-ui/react-dialog";
import SpinnerLoader from "./SpinnerLoader";
import TextLoader from "./TextLoader";

interface ClearModalProps {
  display: boolean;
}

export function LoaderModal({ display }: ClearModalProps) {
  return (
    <Dialog open={display}>
      <DialogOverlay className=" bg-white opacity-70" />
      <DialogContent>
        <div className=" gap-4 fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center flex-col">
          <SpinnerLoader
            className={
              "p-2 h-10 w-10 break-400px:h-16 break-400px:w-16 break-400px:p-3 lg:h-20 lg:w-20 lg:p-4 xl:h-28 xl:w-28 xl:p-5"
            }
          />
          <TextLoader className={"break-400px:text-2xl lg:text-3xl xl:text-4xl "} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
