import { IList } from "@/types/list.types";
import { Textarea } from "../ui/textarea";
import { useEffect, useRef, useState } from "react";
import useClickOutside from "@/hooks/CustomHooks/useClickOutside";
import { useUpdateListTitle } from "@/hooks/Query hooks/List hooks/updateListTitle";

interface ListItemTitleProps {
  list: IList;
}

function ListItemTitle({ list }: ListItemTitleProps) {
  const [editTitleMode, setEditTitleMode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [newListTitle, setNewListTitle] = useState(list.name);

  const listNameUpdater = useUpdateListTitle(list.board);

  useClickOutside(textareaRef, () => {
    if (validateCardTitle()) {
      listNameUpdater.mutate({ listId: list._id, newName: newListTitle });
    }
    setEditTitleMode(false);
  });

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [editTitleMode]);

  function handleInput(value: string) {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
    if (value.length < 40 && value[0] !== " ") {
      setNewListTitle(value);
    }
  }
  function validateCardTitle() {
    return (
      newListTitle.trim() !== "" &&
      newListTitle !== list.name &&
      newListTitle.length < 40 &&
      newListTitle[0] !== " "
    );
  }

  return (
    <>
      {editTitleMode ? (
        <Textarea
          ref={textareaRef}
          value={newListTitle}
          onChange={(e) => handleInput(e.target.value)}
          rows={1}
          style={{ resize: "none", overflow: "hidden" }}
          className="shadow-sm focus-visible:ring-2 font-semibold rounded-[8px] h-8 w-full px-3 py-1 overflow-y-hidden text-text_dark_blue "
        />
      ) : (
        <h3
          onClick={() => setEditTitleMode(true)}
          className=" py-[6px] pl-3 pr-2 font-semibold cursor-pointer w-full"
        >
          {list.name}, {list.position}
        </h3>
      )}
    </>
  );
}

export default ListItemTitle;
