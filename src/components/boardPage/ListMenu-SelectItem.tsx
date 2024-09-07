import { SelectItem } from "../ui/select";

export interface IListMenuSelectItem {
  isCurrent: boolean;
  value: any;
  text: string | number;
  isSelected: boolean;
}

function ListMenuSelectItem({
  isCurrent,
  value,
  text,
  isSelected,
}: IListMenuSelectItem) {
  return (
    <SelectItem
      className={` cursor-pointer p-0 m-0 border-l-2 px-2 py-2  ${
        isSelected
          ? "border-blue-600 text-blue-600 focus:text-blue-600 bg-blue-100 focus:bg-blue-200"
          : "hover:border-blue-600 hover:bg-slate-300 border-white"
      }`}
      value={value}
    >
      <span>{text} </span>
      {isCurrent && <p className=" text-xs">(current)</p>}
    </SelectItem>
  );
}

export default ListMenuSelectItem;
