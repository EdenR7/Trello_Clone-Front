import { Progress } from "../ui/progress";
import { ITodo } from "@/types/checklist.types";

interface ChecklistProgressProps {
  todos: ITodo[];
}

export default function ChecklistProgress({ todos }: ChecklistProgressProps) {
  const calculateProgress = (todos: ITodo[]) => {
    if (todos.length === 0) return 0;
    const completedTodos = todos.filter((todo) => todo.isComplete).length;
    return (completedTodos / todos.length) * 100;
  };

  const progress = calculateProgress(todos);

  return (
    <div className="relative mb-[6px]">
      <span className="text-gray-600 text-[11px] absolute text-center -top-[5px] left-0 w-8">
        {progress.toFixed(0)}%
      </span>
      <Progress
        value={progress}
        className="ml-10 relative overflow-hidden h-2 rounded-md bg-btn_bg_primary"
      />
    </div>
  );
}
