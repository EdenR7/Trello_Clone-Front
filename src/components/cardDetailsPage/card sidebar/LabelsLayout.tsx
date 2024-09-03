import LabelPopoverLayout from "@/components/general/LabelPopoverLayout";
import CardModalLabels from "@/components/labels/CardModalLabelLayout";
import { CreateAndEditLabelLayout } from "@/components/labels/CreateAndEditLabelLayout.tsx";
import { Button } from "@/components/ui/button";
import { useToggleCardLabel } from "@/hooks/Query hooks/Label hooks/useToggleCardLabel";
import { ILabel } from "@/types/board.types";
import { ICard } from "@/types/card.types";
import { Tag } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

interface LabelsLayoutProps {
  card: ICard;
}

function LabelsLayout(props: LabelsLayoutProps) {
  const { card } = props;
  const { boardId } = useParams();
  const [isEditLabel, setIsEditLabel] = useState(false);
  const [labelToEdit, setLabelToEdit] = useState<ILabel | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLabelPopoverOpen, setIsLabelPopoverOpen] = useState(false);
  const { mutate: toggleCardLabels } = useToggleCardLabel(boardId!);
  function handleToggleLabels(cardId: string, labelId: string) {
    toggleCardLabels({ cardId, labelId });
  }
  return (
    <LabelPopoverLayout
      title="Labels"
      setIsEditLabel={setIsEditLabel}
      setIsEditMode={setIsEditMode}
      setLabelToEdit={setLabelToEdit}
      internalOpen={isLabelPopoverOpen}
      setInternalOpen={setIsLabelPopoverOpen}
      trigger={
        <Button
          variant={"secondary"}
          className={`h-8 overflow-hidden relative text-ellipsis whitespace-nowrap max-w-[300px] flex justify-start items-center py-[6px] px-3 mr-2 w-[calc(50%-8px)] break-card_modal:w-auto`}
        >
          <span className="mr-[6px] -ml-[6px]">
            <Tag size={15} />
          </span>
          <span>Labels</span>
        </Button>
      }
    >
      {isEditLabel ? (
        <CreateAndEditLabelLayout
          setIsLabelPopoverOpen={setIsLabelPopoverOpen}
          isEditMode={isEditMode}
          color={labelToEdit?.color}
          labelId={labelToEdit?._id}
          title={labelToEdit?.title}
          cardId={card._id}
        />
      ) : (
        <CardModalLabels
          boardId={boardId!}
          cardLabels={card.labels}
          onToggleLabel={(labelId) => handleToggleLabels(card._id!, labelId)}
          setIsEditLabel={setIsEditLabel}
          setIsEditMode={setIsEditMode}
          setLabelToEdit={setLabelToEdit}
        />
      )}
    </LabelPopoverLayout>
    // <CardSidebarButton icon={<Tag size={20} />} text="Labels" />
  );
}

export default LabelsLayout;
