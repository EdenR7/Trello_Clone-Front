import CardItemChecklist from "@/components/CardItem/CardItemChecklist";
import CardItemDates from "@/components/CardItem/CardItemDates";
import CardItemLabels from "@/components/CardItem/CardItemLabels";
import CardItemUserIcon from "@/components/CardItem/CardItemUserIcon";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateCardTitle } from "@/hooks/Query hooks/Card hooks/useUpdateCardTitle";
import { useLocalStorage } from "@uidotdev/usehooks";
import { AlignLeft, CreditCard } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditCardModalLabels from "./EditCardModalLabels";
import EditCardModalSideButton from "./EditCardModalSideButton";
import EditCardModalMembers from "./EditCardModalMembers";
import EditCardModalCover from "./EditCardModalCover";
import { usegetCard } from "@/hooks/Query hooks/Card hooks/useGetCard";
import EditCardModalDates from "./EditCardModalDates";
import EditCardModalMove from "./EditCardModalMove";
import EditCardModalArchive from "./EditCardModalArchive";

interface ModalProps {
  position: { top: number; left: number; menuPosition: string };
  onClose: () => void;
  cardId: string;
}

function Modal({ cardId, position, onClose }: ModalProps) {
  const { data: card } = usegetCard(cardId);
  const { top, left, menuPosition } = position;
  const [isLabelsOpen, setIsLabelsOpen] = useLocalStorage(
    "trella-labels-open-state",
    false
  );
  const { boardId } = useParams();
  const { mutate: updateCardTitle } = useUpdateCardTitle(boardId!);
  const titleRef = useRef<HTMLTextAreaElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      if (titleRef.current) {
        titleRef.current.focus();
        titleRef.current.select();
      }
    }, 0);
  }, [cardId]);

  if (!card) return;

  const hasTodos = card.checklist.some(
    (checklist) => checklist.todos.length > 0
  );

  function handleUpdateCardTitle() {
    if (titleRef.current) {
      if (titleRef.current.value.trim() === "") return;
      updateCardTitle({ cardId: card!._id!, newTitle: titleRef.current.value });
      onClose();
    }
  }

  return (
    // Modal backdrop to darken the background
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/75"
    >
      {/* Modal content */}
      <div
        onClick={(ev) => {
          ev.preventDefault();
          ev.stopPropagation();
        }}
      >
        <div
          style={{
            position: "absolute",
            top: `${top}px`,
            left: `${left}px`,

            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            zIndex: 1000,
          }}
          className="rounded-lg w-64 bg-white text-[#172b4d]"
          onClick={(ev) => {
            ev.stopPropagation();
            ev.preventDefault();
          }}
        >
          {card.bgCover.bg !== "" && (
            <div
              className=" h-9 overflow-hidden rounded-t-lg relative"
              style={{ backgroundColor: card.bgCover.bg }}
            ></div>
          )}

          <div className=" flow-root relative z-10 min-h-6 px-3 pt-2 pb-1 ">
            <div className=" flex flex-wrap gap-1 mb-1">
              {card.labels.length > 0 &&
                card.labels.map((label, index) => (
                  <CardItemLabels
                    key={index}
                    isLabelsOpen={isLabelsOpen}
                    label={label}
                    setIsLabelsOpen={setIsLabelsOpen}
                  />
                ))}
            </div>
            <Textarea
              ref={titleRef}
              defaultValue={card.title}
              className=" h-14 p-0 mb-1 overflow-hidden break-words resize-none border-none border-0 outline-none w-full focus:outline-none focus:border-none active:outline-none focus-visible:ring-0 rounded-none "
            />
            <div className=" flex flex-wrap max-w-full gap-1">
              {(card.dueDate || card.startDate) && (
                <CardItemDates card={card} />
              )}
              {card.description && (
                <span className=" flex relative items-center justify-center w-fit max-w-full h-6 mb-1 p-[2px] rounded-sm text-sm">
                  <AlignLeft size={16} strokeWidth={1.75} />
                </span>
              )}
              {hasTodos && <CardItemChecklist card={card} />}
            </div>
            {card.members.length > 0 && <CardItemUserIcon card={card} />}
          </div>
          <Button
            onClick={handleUpdateCardTitle}
            className=" mt-2 mb-0 absolute"
          >
            Save
          </Button>
        </div>

        {/* Menu div positioned relative to the modal */}
        <div
          style={{
            position: "absolute",
            top: `${top}px`,
            left:
              menuPosition === "right" ? `${left + 260}px` : `${left - 160}px`, // Position based on menuPosition
            zIndex: 1001, // Above the modal for layering
          }}
          className=" flex flex-col items-start"
        >
          {!card.bgCover.isCover && (
            <EditCardModalSideButton
              onClick={(
                ev: React.MouseEvent<HTMLButtonElement, MouseEvent>
              ) => {
                ev.stopPropagation();
                ev.preventDefault();
                onClose();
                navigate(`/b/${boardId}/c/${card._id}`);
              }}
              icon={<CreditCard size={16} strokeWidth={1.75} />}
              title="Open card"
            />
          )}
          {!card.bgCover.isCover && <EditCardModalLabels card={card} />}
          {!card.bgCover.isCover && <EditCardModalMembers card={card} />}
          <EditCardModalCover card={card} />
          {!card.bgCover.isCover && <EditCardModalDates card={card} />}
          <EditCardModalMove onClose={onClose} card={card} />
          <EditCardModalArchive onClose={onClose} card={card} />
        </div>
      </div>
    </div>
  );
}

export default Modal;
