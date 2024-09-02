import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox"; // Adjust path if needed
import { format } from "date-fns"; // For date manipulation
import { Calendar } from "@/components/ui/calendar";
import { DateRange, SelectRangeEventHandler } from "react-day-picker";
import { Input } from "@/components/ui/input";

function VisionPage() {
  const [isStartDate, setIsStartDate] = useState(false);
  const [isEndDate, setIsEndDate] = useState(false);
  const [datePickerValue, setDatePickerValue] = useState<DateRange>({
    to: undefined,
    from: undefined,
  });

  // Determine the mode based on user selections
  const mode: "single" | "range" =
    isStartDate && isEndDate ? "range" : "single";

  // Update the selected date or date range
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

  function handleRangeSelectDates(newSelected: DateRange | undefined) {
    if (mode === "range") {
      if (newSelected) {
        setDatePickerValue(newSelected);
      }
    }
  }

  console.log(mode);
  console.log("isStartDate: ", isStartDate);
  console.log("isEndDate: ", isEndDate);

  // Helper function to format dates
  function formatFromDateRange(dateRange: DateRange) {
    if (!dateRange?.from) return "";
    return `${format(dateRange.from, "MM/dd/yyyy")}`;
  }

  function formatToDateRange(dateRange: DateRange) {
    if (!dateRange?.to) return "";
    return `${format(dateRange.to, "MM/dd/yyyy")}`;
  }

  function formatDate(date: Date | undefined) {
    if (!date) return "";
    return format(date, "MM/dd/yyyy");
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

  return (
    <div className="p-4">
      <div className="mb-4">
        <Checkbox checked={isStartDate} onClick={toggleStartDate}>
          Start Date
        </Checkbox>
        <Checkbox checked={isEndDate} onClick={toggleDueDate}>
          End Date
        </Checkbox>
      </div>

      {/* Conditionally render the calendar with correct props */}

      <Calendar
        mode={mode as "range"}
        selected={datePickerValue}
        onSelect={
          DatepickerSelectFunction as SelectRangeEventHandler | undefined
        }
        className="rounded-md border"
      />

      {/* Input fields for displaying selected date(s) */}
      {mode === "range" && datePickerValue && "from" in datePickerValue && (
        <>
          <Input value={formatFromDateRange(datePickerValue)} readOnly />
          <Input value={formatToDateRange(datePickerValue)} readOnly />
        </>
      )}

      <input className="w-full" value={getDateAndTime(tomorrow)} readOnly />
    </div>
  );
}

export default VisionPage;
