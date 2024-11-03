import { Dialog, DialogOverlay } from "@/components/ui/dialog";

interface ClearModalProps {
  display: boolean;
}

export function ClearModal({ display }: ClearModalProps) {
  return (
    <Dialog open={display}>
      <DialogOverlay className=" bg-white opacity-70"/>
    </Dialog>
  );
}
