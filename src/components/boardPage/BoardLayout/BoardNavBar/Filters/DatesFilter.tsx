import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarDays, ChevronDown, Clock } from "lucide-react";
import { useState } from "react";

interface DatesFilterProps {
  searchParams: URLSearchParams;
  updateUrlParams: (key: string, values: string[]) => void;
}

function DatesFilter({
  searchParams,
  updateUrlParams,
}: DatesFilterProps) {
  const [showMoreDateFilters, setShowMoreDateFilters] = useState(false);
  const selectedDueDateFilters = searchParams.get("dueDate")?.split(",") || [];

  const toggleDueDateSelection = (value: string) => {
    let updatedDueDates = [...selectedDueDateFilters];
    if (updatedDueDates.includes(value)) {
      updatedDueDates = updatedDueDates.filter((m) => m !== value);
    } else {
      updatedDueDates.push(value);
    }
    updateUrlParams("dueDate", updatedDueDates);
  };

  function isFilterSelected(filterValue: string) {
    const isSelected = selectedDueDateFilters.some((d) => d === filterValue);
    return isSelected ? true : false;
  }

  return (
    <div className=" mt-4 text-text_dark_blue">
      <h4 className=" my-4 mb-2 text-xs font-semibold">Due date</h4>
      <div className=" space-y-3">
        <div
          className=" px-2 pt-2 flex items-center gap-4 cursor-pointer"
          onClick={() => toggleDueDateSelection("empty")}
        >
          <Checkbox
            checked={isFilterSelected("empty")}
            color=""
            className=" border-text_dark_blue/50"
          />
          <div className=" flex gap-2">
            <div className=" bg-slate-100 h-6 w-6 rounded-full flex items-center justify-center">
              <CalendarDays className=" text-slate-500" size={14} />
            </div>
            <p className=" text-slate-600">No dates</p>
          </div>
        </div>
        <div
          className=" px-2 pt-2 flex items-center gap-4 cursor-pointer"
          onClick={() => toggleDueDateSelection("overdue")}
        >
          <Checkbox
            checked={isFilterSelected("overdue")}
            color=""
            className=" border-text_dark_blue/50"
          />
          <div className=" flex gap-2">
            <div className=" bg-red-700 h-6 w-6 rounded-full flex items-center justify-center">
              <Clock className=" text-white" size={14} />
            </div>
            <p>Overdue</p>
          </div>
        </div>
        <div
          className=" px-2 pt-2 flex items-center gap-4 cursor-pointer"
          onClick={() => toggleDueDateSelection("nextDay")}
        >
          <Checkbox
            checked={isFilterSelected("nextDay")}
            color=""
            className=" border-text_dark_blue/50"
          />
          <div className=" flex gap-2">
            <div className=" bg-yellow-500 h-6 w-6 rounded-full flex items-center justify-center">
              <Clock className=" text-white" size={14} />
            </div>
            <p>Due in the next day</p>
          </div>
        </div>
        {showMoreDateFilters ? (
          <>
            <div
              className=" px-2 pt-2 flex items-center gap-4 cursor-pointer"
              onClick={() => toggleDueDateSelection("nextWeek")}
            >
              <Checkbox
                checked={isFilterSelected("nextWeek")}
                color=""
                className=" border-text_dark_blue/50"
              />
              <div className=" flex gap-2">
                <div className=" bg-slate-100 h-6 w-6 rounded-full flex items-center justify-center">
                  <Clock className=" text-slate-600" size={14} />
                </div>
                <p>Due in the next week</p>
              </div>
            </div>
            <div
              className=" px-2 pt-2 flex items-center gap-4 cursor-pointer"
              onClick={() => toggleDueDateSelection("nextMonth")}
            >
              <Checkbox
                checked={isFilterSelected("nextMonth")}
                color=""
                className=" border-text_dark_blue/50"
              />
              <div className=" flex gap-2">
                <div className=" bg-slate-100 h-6 w-6 rounded-full flex items-center justify-center">
                  <Clock className=" text-slate-600" size={14} />
                </div>
                <p>Due in the next month</p>
              </div>
            </div>
            <div
              className=" px-2 pt-2 flex items-center gap-4 cursor-pointer"
              onClick={() => toggleDueDateSelection("completed")}
            >
              <Checkbox
                checked={isFilterSelected("completed")}
                color=""
                className=" border-text_dark_blue/50"
              />
              <p className=" ml-1">Marked as completed</p>
            </div>
            <div
              className=" px-2 pt-2 flex items-center gap-4 cursor-pointer"
              onClick={() => toggleDueDateSelection("notCompleted")}
            >
              <Checkbox
                checked={isFilterSelected("notCompleted")}
                color=""
                className=" border-text_dark_blue/50"
              />
              <p className=" ml-1">Not marked as completed</p>
            </div>
          </>
        ) : (
          <Button
            variant={"link"}
            className=" flex gap-2 items-center m-0 p-0 mt-2 ml-10 underline-offset-1"
            onClick={() => setShowMoreDateFilters(true)}
          >
            Show more options{" "}
            <ChevronDown
              size={18}
              strokeWidth={2.4}
              className=" text-blue-500"
            />
          </Button>
        )}
      </div>
    </div>
  );
}

export default DatesFilter;
