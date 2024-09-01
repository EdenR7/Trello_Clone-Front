import { Progress } from "../ui/progress";
import { IChecklist, ITodo } from "@/types/checklist.types";

interface ChecklistProgressProps {
  checklist: IChecklist | undefined;
}

export default function ChecklistProgress({
  checklist,
}: ChecklistProgressProps) {
  let todos;
  if (checklist?.todos) {
    todos = checklist.todos;
  }

  const calculateProgress = (todos: ITodo[]) => {
    if (todos.length === 0) return 0;
    const completedTodos = todos.filter((todo) => todo.isComplete).length;
    return (completedTodos / todos.length) * 100;
  };

  const progress = calculateProgress(todos!);

  return (
    <>
      <span className="text-gray-600 text-[11px] absolute text-center -top-[5px] left-0 w-8">
        {progress.toFixed(0)}%
      </span>
      <Progress
        value={progress}
        indicatorColor={`${progress === 100 ? "[#15803d]" : "primary"}`}
        className="ml-10 relative overflow-hidden h-2 rounded-md bg-btn_bg_primary  "
      />
    </>
  );
}
