import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox"; // Adjust path if needed
import { format } from "date-fns"; // For date manipulation
import { Calendar } from "@/components/ui/calendar";
import { DateRange, SelectRangeEventHandler } from "react-day-picker";
import { Input } from "@/components/ui/input";

function VisionPage() {
  // Update the selected date or date range

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

  return (
    <div className="p-4">
      <div className="mb-4"></div>

      {/* Conditionally render the calendar with correct props */}

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
