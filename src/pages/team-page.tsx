import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox"; // Adjust path if needed
import { format, addDays } from "date-fns"; // For date manipulation
import { Calendar } from "@/components/ui/calendar";

type IMode = "range" | "single";

function VisionPage() {
  const [isStartDate, setIsStartDate] = useState(false);
  const [isEndDate, setIsEndDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [mode, setMode] = useState<IMode>("single");

  useEffect(() => {
    if (isStartDate && isEndDate) {
      setMode("range");
    } else if (isStartDate || isEndDate) {
      setMode("single");
    } else {
      setMode("single");
    }
  }, [isStartDate, isEndDate]);

  // Automatically set dueDate to the next day
  useEffect(() => {
    if (!isStartDate && !isEndDate) {
      setSelectedDate(addDays(new Date(), 1));
    }
  }, [isStartDate, isEndDate]);

  const handleDateSelect = (date: Date | undefined) => {
    if (isStartDate && isEndDate) {
      // Handle range selection
    } else if (isStartDate) {
      // Handle start date selection
    } else if (isEndDate) {
      // Handle end date selection
    } else {
      // Handle due date
    }
    setSelectedDate(date);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <Checkbox
          checked={isStartDate}
          onClick={() => setIsStartDate((prev) => !prev)}
        >
          Start Date
        </Checkbox>
        <Checkbox
          checked={isEndDate}
          onClick={() => setIsEndDate((prev) => !prev)}
        >
          End Date
        </Checkbox>
      </div>

      <Calendar
        mode={mode}
        selected={selectedDate}
        onSelect={handleDateSelect}
        className="rounded-md border"
      />

      {selectedDate && (
        <div className="mt-4">
          Selected Date: {format(selectedDate, "yyyy-MM-dd")}
        </div>
      )}
    </div>
  );
}

export default VisionPage;
