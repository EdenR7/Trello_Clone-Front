import { format } from "date-fns";

import { useState } from "react";
import { DateRange, SelectRangeEventHandler } from "react-day-picker";
import { Checkbox } from "../ui/checkbox";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";

function CardDatesPopup() {
  const [isStartDate, setIsStartDate] = useState(false);
  const [isEndDate, setIsEndDate] = useState(false);
  const [datePickerValue, setDatePickerValue] = useState<DateRange>({
    to: undefined,
    from: undefined,
  });

  const mode: "single" | "range" =
    isStartDate && isEndDate ? "range" : "single";
  function handleSingleSelectDates(newSelected: Date | undefined) {
    if (mode === "single") {
      if (isStartDate) {
        if (newSelected) {
          setDatePickerValue(() => ({
            from: newSelected,
            to: undefined,
          }));
        }
      } else if (isEndDate) {
        if (newSelected) {
          setDatePickerValue(() => ({ from: undefined, to: newSelected }));
        }
      } else if (!isStartDate && !isEndDate) {
        if (newSelected) {
          setIsEndDate(true);
          setDatePickerValue(() => ({ from: undefined, to: newSelected }));
        }
      }
    }
  }
  const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

  function getDateAndTime(date: Date) {
    return `${format(
      date,
      "MM/dd/yyyy"
    )} ${date.getHours()}:${date.getMinutes()}`;
  }

  function toggleDueDate() {
    if (!isStartDate && isEndDate) {
      setDatePickerValue({ from: undefined, to: undefined });
    }
    if (!isStartDate && !isEndDate) {
      setDatePickerValue({ from: undefined, to: tomorrow });
    }
    if (isStartDate && isEndDate) {
      setDatePickerValue({ from: datePickerValue.from, to: undefined });
    }
    if (isStartDate && !isEndDate) {
      const nextDayAfterStartDate =
        datePickerValue.from &&
        new Date(datePickerValue.from.getTime() + 24 * 60 * 60 * 1000);
      setDatePickerValue({
        to: nextDayAfterStartDate,
        from: datePickerValue.from,
      });
    }
    setIsEndDate((prev) => !prev);
  }

  function toggleStartDate() {
    if (isStartDate && !isEndDate) {
      setDatePickerValue({ from: undefined, to: undefined });
    }
    if (!isStartDate && !isEndDate) {
      setDatePickerValue({ from: new Date(), to: undefined });
    }
    if (isStartDate && isEndDate) {
      setDatePickerValue({ from: undefined, to: datePickerValue.to });
    }
    if (!isStartDate && isEndDate) {
      setDatePickerValue({ to: datePickerValue.to, from: new Date() });
    }
    setIsStartDate((prev) => !prev);
  }

  const DatepickerSelectFunction =
    mode === "range"
      ? (handleRangeSelectDates as SelectRangeEventHandler | undefined)
      : handleSingleSelectDates;

  function handleRangeSelectDates(newSelected: DateRange | undefined) {
    if (mode === "range") {
      if (newSelected) {
        setDatePickerValue(newSelected);
      }
    }
  }

  // Determine the mode based on user selections

  return (
    <>
      <Calendar
        mode={mode as "range"}
        selected={datePickerValue}
        onSelect={
          DatepickerSelectFunction as SelectRangeEventHandler | undefined
        }
        className="rounded-md"
      />
      <div className=" flex flex-col justify-between mt-2">
        <div className=" mb-3">
          <h4 className=" font-bold text-gray-600 text-ellipsis text-xs block leadig-4 mb-1">
            Start date
          </h4>
          <div className=" flex items-center gap-2 flex-wrap max-w-full">
            <Checkbox
              className=" border-gray-700 rounded-sm "
              checked={isStartDate}
              onClick={toggleStartDate}
            />
            <div className=" mr-2">
              <Input
                placeholder="M/D/YYYY"
                disabled={!isStartDate}
                className=" w-[92px] p-[6px] h-[34px] disabled:bg-[#F7F8F9] "
              />
            </div>
          </div>
        </div>
        <div className=" mb-3">
          <h4 className=" font-bold text-gray-600 text-ellipsis text-xs block leadig-4 mb-1">
            Due date
          </h4>
          <div className=" flex items-center gap-2 flex-wrap max-w-full">
            <Checkbox
              className=" border-gray-700 rounded-sm "
              checked={isEndDate}
              onClick={toggleDueDate}
            />
            <div className=" mr-2">
              <Input
                placeholder="M/D/YYYY"
                disabled={!isEndDate}
                className=" w-[92px] p-[6px] h-[34px] disabled:bg-[#F7F8F9] "
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CardDatesPopup;
