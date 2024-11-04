import LabelPopoverLayout from "@/components/general/LabelPopoverLayout";
import CardModalLabels from "@/components/labels/CardModalLabelLayout";
import { CreateAndEditLabelLayout } from "@/components/labels/CreateAndEditLabelLayout.tsx";
import { useToggleCardLabel } from "@/hooks/Query hooks/Label hooks/useToggleCardLabel";
import { ILabel } from "@/types/board.types";
import { ICard } from "@/types/card.types";
import { Tag } from "lucide-react";
import { memo, useState } from "react";
import { useParams } from "react-router-dom";
import EditCardModalSideButton from "./EditCardModalSideButton";

interface LabelsLayoutProps {
  card: ICard;
}

const EditCardModalLabels = memo(function EditCardModalLabels(
  props: LabelsLayoutProps
) {
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
        <EditCardModalSideButton
          icon={<Tag size={15} strokeWidth={1.75} />}
          title="Edit Labels"
        />
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
  );
});

export default EditCardModalLabels;
