import { format, isValid, parse } from "date-fns";

import { useState } from "react";
import { DateRange, SelectRangeEventHandler } from "react-day-picker";
import { Checkbox } from "../ui/checkbox";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";
import { ICard } from "@/types/card.types";
import { Button } from "../ui/button";
import useAddCardDates from "@/hooks/Query hooks/Card dates hooks/useAddCardDates";
import { useParams } from "react-router-dom";

interface CardDatesPopupProps {
  card: ICard;

  setInternalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function CardDatesPopup(props: CardDatesPopupProps) {
  const { card, setInternalOpen } = props;
  const { boardId } = useParams();
  const [isStartDate, setIsStartDate] = useState(!!card.startDate);

  const [isEndDate, setIsEndDate] = useState(!!card.dueDate);

  const [datePickerValue, setDatePickerValue] = useState<DateRange>({
    to: card.dueDate ? card.dueDate : undefined,
    from: card.startDate ? card.startDate : undefined,
  });

  const { mutate: addCardDates } = useAddCardDates(boardId!);

  const [tempFromDate, setTempFromDate] = useState(
    formatFromDateRange({ to: card.dueDate, from: card.startDate })
  );
  const [tempToDate, setTempToDate] = useState(
    formatToDateRange({ to: card.dueDate, from: card.startDate })
  );

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
          setTempFromDate(format(newSelected, "MM/dd/yyyy")); // Update temp state
        }
      } else if (isEndDate) {
        if (newSelected) {
          setDatePickerValue(() => ({ from: undefined, to: newSelected }));
          setTempToDate(format(newSelected, "MM/dd/yyyy")); // Update temp state
        }
      } else if (!isStartDate && !isEndDate) {
        if (newSelected) {
          setIsEndDate(true);
          setDatePickerValue(() => ({ from: undefined, to: newSelected }));
          setTempToDate(format(newSelected, "MM/dd/yyyy")); // Update temp state
        }
      }
    }
  }
  const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

  function toggleDueDate() {
    const fromDate =
      datePickerValue.from instanceof Date
        ? datePickerValue.from
        : new Date(datePickerValue.from!);

    if (!isStartDate && isEndDate) {
      setDatePickerValue({ from: undefined, to: undefined });
      setTempToDate(""); // Clear temp state when unchecked
    } else if (!isStartDate && !isEndDate) {
      setDatePickerValue({ from: undefined, to: tomorrow });
      setTempToDate(format(tomorrow, "MM/dd/yyyy")); // Update temp state when checked
    } else if (isStartDate && isEndDate) {
      setDatePickerValue({ from: datePickerValue.from, to: undefined });
      setTempToDate(""); // Clear temp state when unchecked
    } else if (isStartDate && !isEndDate) {
      const nextDayAfterStartDate = fromDate
        ? new Date(fromDate.getTime() + 24 * 60 * 60 * 1000)
        : undefined;
      setDatePickerValue({
        to: nextDayAfterStartDate,
        from: datePickerValue.from,
      });
      setTempToDate(format(nextDayAfterStartDate!, "MM/dd/yyyy")); // Update temp state when checked
    }
    setIsEndDate((prev) => !prev);
  }

  function toggleStartDate() {
    if (isStartDate && !isEndDate) {
      setDatePickerValue({ from: undefined, to: undefined });
      setTempFromDate(""); // Clear temp state when unchecked
    }
    if (!isStartDate && !isEndDate) {
      setDatePickerValue({ from: new Date(), to: undefined });
      setTempFromDate(format(new Date(), "MM/dd/yyyy")); // Update temp state when checked
    }
    if (isStartDate && isEndDate) {
      setDatePickerValue({ from: undefined, to: datePickerValue.to });
      setTempFromDate(""); // Clear temp state when unchecked
    }
    if (!isStartDate && isEndDate) {
      setDatePickerValue({ to: datePickerValue.to, from: new Date() });
      setTempFromDate(format(new Date(), "MM/dd/yyyy")); // Update temp state when checked
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
        setTempFromDate(formatFromDateRange(newSelected)); // Update temp state
        setTempToDate(formatToDateRange(newSelected)); // Update temp state
      }
    }
  }

  function updateDateFromInput(dateString: string, type: "from" | "to") {
    const parsedDate = parse(dateString, "MM/dd/yyyy", new Date());

    if (isValid(parsedDate)) {
      // Check if the new start date is after the end date or vice versa
      if (
        (type === "from" &&
          datePickerValue.to &&
          parsedDate > datePickerValue.to) ||
        (type === "to" &&
          datePickerValue.from &&
          parsedDate < datePickerValue.from)
      ) {
        // If invalid, revert to the previous value
        type === "from"
          ? setTempFromDate(formatFromDateRange(datePickerValue))
          : setTempToDate(formatToDateRange(datePickerValue));
        return;
      }

      // If valid, update the date picker value
      setDatePickerValue((prev) => ({
        ...prev,
        [type]: parsedDate,
      }));
      // Update the temp value to match
      type === "from" ? setTempFromDate(dateString) : setTempToDate(dateString);
    } else {
      // If the date is invalid, revert to the previous value
      type === "from"
        ? setTempFromDate(formatFromDateRange(datePickerValue))
        : setTempToDate(formatToDateRange(datePickerValue));
    }
  }

  function handleBlur(type: "from" | "to") {
    // Trigger date update on blur
    updateDateFromInput(type === "from" ? tempFromDate : tempToDate, type);
  }

  function formatFromDateRange(dateRange: DateRange) {
    if (!dateRange?.from) return "";
    return `${format(dateRange.from, "MM/dd/yyyy")}`;
  }

  function formatToDateRange(dateRange: DateRange) {
    if (!dateRange?.to) return "";
    return `${format(dateRange.to, "MM/dd/yyyy")}`;
  }

  // Determine the mode based on user selections

  function handleRemoveDates() {
    addCardDates({ cardId: card._id!, formattedDate: {} });
    setInternalOpen(false);
  }

  function handleSubmitDates() {
    const formattedDates: Partial<{ startDate: string; dueDate: string }> = {};

    if (datePickerValue.from) {
      const startDate = new Date(datePickerValue.from);
      startDate.setHours(0, 0, 0, 0);
      formattedDates.startDate = startDate.toISOString();
    }

    if (datePickerValue.to) {
      const dueDate = new Date(datePickerValue.to);
      dueDate.setHours(0, 0, 0, 0);
      formattedDates.dueDate = dueDate.toISOString();
    }

    console.log("formattedDates: ", formattedDates);
    addCardDates({ cardId: card._id!, formattedDate: formattedDates });
    setInternalOpen(false);
  }

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
                value={tempFromDate}
                disabled={!isStartDate}
                className=" w-[92px] p-[6px] h-[34px] disabled:bg-[#F7F8F9] "
                onChange={(e) => setTempFromDate(e.target.value)}
                onBlur={() => handleBlur("from")}
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
                value={tempToDate}
                disabled={!isEndDate}
                className=" w-[92px] p-[6px] h-[34px] disabled:bg-[#F7F8F9] "
                onChange={(e) => setTempToDate(e.target.value)}
                onBlur={() => handleBlur("to")}
              />
            </div>
          </div>
        </div>
        <div className=" flex flex-col gap-2 justify-between">
          <Button onClick={handleSubmitDates} variant={"default"} className="">
            Save
          </Button>
          <Button onClick={handleRemoveDates} variant={"secondary"}>
            Remove
          </Button>
        </div>
      </div>
    </>
  );
}

export default CardDatesPopup;
