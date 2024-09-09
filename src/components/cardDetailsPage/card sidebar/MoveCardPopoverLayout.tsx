import CardPopoverTitle from "@/components/general/CardPopoverTitle";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetLists } from "@/hooks/Query hooks/List hooks/useGetList";
import useMoveCardToDifferentList from "@/hooks/Query hooks/Move card popover hooks/useMoveCardToDifferentList";
import useMoveCardToSameList from "@/hooks/Query hooks/Move card popover hooks/useMoveCardToSameList";
import { ICard } from "@/types/card.types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function MoveCardPopoverLayout({
  card,
  setIsPopoverOpen,
  onClose,
}: {
  card: ICard;
  setIsPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClose?: () => void;
}) {
  const { boardId } = useParams();
  const { data: lists } = useGetLists(boardId!);
  const [selectedListId, setSelectedListId] = useState(card.list._id);
  const [selectedPosition, setSelectedPosition] = useState(card.position);
  const [positionOptions, setPositionOptions] = useState<number[]>([]);
  const { mutate: moveCardToSameList } = useMoveCardToSameList(boardId!);
  const { mutate: moveCardToDifferentList } = useMoveCardToDifferentList(
    boardId!
  );

  useEffect(() => {
    const selectedList = lists?.find((list) => list._id === selectedListId);
    if (selectedList) {
      const isMovingWithinSameList = selectedListId === card.list._id;

      const newPositionOptions = Array.from(
        {
          length: selectedList.cards.length + (isMovingWithinSameList ? 0 : 1),
        },
        (_, i) => i + 1
      );
      setPositionOptions(newPositionOptions);

      // Set the default position if a new list is selected
      if (!isMovingWithinSameList) {
        setSelectedPosition(newPositionOptions.length); // Default to last position
      } else {
        const list = lists?.find((list) => list._id === card.list._id);
        if (list) {
          const cardPosition =
            list.cards.findIndex((crd) => crd._id === card._id) + 1;

          setSelectedPosition(cardPosition);
        }
      }
    }
  }, [selectedListId, lists, card.list._id, card.position, card._id]);

  function handleMoveCard() {
    if (selectedListId === card.list._id) {
      const currentPos = selectedPosition - 1;
      const list = lists?.find((lst) => lst._id === card.list._id);
      if (list && list.cards[currentPos]._id !== card._id) {
        const maxPosition = list.cards.length;

        if (selectedPosition === 1) {
          const existingCard = list.cards[currentPos];
          if (existingCard) {
            const newPos = existingCard.position / 2;
            moveCardToSameList({ cardId: card._id!, newPos });
          }
        } else if (selectedPosition === maxPosition) {
          const newPos = list.cards[selectedPosition - 1].position + 1;

          moveCardToSameList({ cardId: card._id!, newPos });
        } else {
          const newPos =
            (list.cards[currentPos].position +
              list.cards[currentPos + 1].position) /
            2;

          moveCardToSameList({ cardId: card._id!, newPos });
        }
      } else {
        setIsPopoverOpen(false);
        return;
      }
    } else {
      const newList = lists?.find((list) => list._id === selectedListId);
      if (newList?.cards) {
        const maxPosition = newList.cards.length + 1;
        const currentPos = selectedPosition - 1;
        if (selectedPosition === 1) {
          const existingCard = newList.cards[currentPos];
          if (existingCard) {
            const newPos = existingCard.position / 2;
            moveCardToDifferentList({
              cardId: card._id!,
              listId: newList._id!,
              newPos,
            });
          } else {
            const newPos = 1;

            moveCardToDifferentList({
              cardId: card._id!,
              listId: newList._id!,
              newPos,
            });
          }
        } else if (selectedPosition === maxPosition) {
          const lastCard = newList.cards[selectedPosition - 2];

          const newPos = lastCard.position + 1;
          moveCardToDifferentList({
            cardId: card._id!,
            listId: newList._id!,
            newPos,
          });
        } else {
          const newPos =
            (newList.cards[currentPos - 1].position +
              newList.cards[currentPos].position) /
            2;

          moveCardToDifferentList({
            cardId: card._id!,
            listId: newList._id!,
            newPos,
          });
        }
      }
    }
    if (onClose) onClose();
    setIsPopoverOpen(false);
  }

  return (
    <>
      <CardPopoverTitle title="Select destination" />
      <div className="flex flex-wrap w-full">
        <div className="max-w-full mr-2 mb-2 flex-grow-[2.5]">
          <h4 className="mt-1 font-bold leading-5 mb-[2px]">List</h4>
          <Select
            value={selectedListId}
            onValueChange={(value) => setSelectedListId(value)}
          >
            <SelectTrigger className="border border-gray-600 focus:border-primary focus:border-2 focus:ring-0 ">
              <SelectValue>
                {lists?.find((list) => list._id === selectedListId)?.name}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="py-2 bg-white w-[216px]">
              {lists?.map((list) => (
                <SelectItem
                  className={`pl-4 focus:border-l-2 focus:border-primary focus:bg-gray-600/10 ${
                    list._id === selectedListId
                      ? "bg-blue-100 border-l-2 border-primary focus:bg-blue-200"
                      : ""
                  }`}
                  value={list._id}
                  key={list._id}
                >
                  <span
                    className={`${
                      list._id === selectedListId && "text-primary"
                    }`}
                  >
                    {list.name}
                  </span>
                  {list._id === card.list._id && (
                    <span
                      className={`text-xs block ${
                        list._id === selectedListId && "text-primary"
                      }`}
                    >
                      (Current)
                    </span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="max-w-full w-[77px] mb-2">
          <h4 className="mt-1 font-bold leading-5 mb-[2px]">Position</h4>
          <Select
            value={selectedPosition.toString()}
            onValueChange={(value) => setSelectedPosition(Number(value))}
          >
            <SelectTrigger className="border border-gray-600 focus:border-primary focus:border-2 focus:ring-0 ">
              <SelectValue>{selectedPosition}</SelectValue>
            </SelectTrigger>
            <SelectContent className="py-2 bg-white w-[216px]">
              {positionOptions.map((pos) => (
                <SelectItem
                  key={pos}
                  value={pos.toString()}
                  className={`pl-4 focus:border-l-2 focus:border-primary focus:bg-gray-600/10 ${
                    pos === selectedPosition
                      ? "bg-blue-100 border-l-2 border-primary focus:bg-blue-200"
                      : ""
                  }`}
                >
                  <span
                    className={`${pos === selectedPosition && "text-primary"}`}
                  >
                    {pos}
                  </span>
                  {pos ===
                    lists
                      ?.find((list) => list._id === selectedListId)
                      ?.cards.findIndex((crd) => crd._id === card._id)! +
                      1 &&
                    selectedListId === card.list._id && (
                      <span
                        className={`text-xs block ${
                          pos === selectedPosition && "text-primary"
                        }`}
                      >
                        (Current)
                      </span>
                    )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={handleMoveCard} className="mt-4">
        Move
      </Button>
    </>
  );
}

export default MoveCardPopoverLayout;
