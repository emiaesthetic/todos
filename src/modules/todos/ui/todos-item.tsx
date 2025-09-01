import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';

import { Task } from '../model/types';

type TodosItemProps = {
  task: Task;
  onDelete: () => void;
  onToggleCompleted: () => void;
};

export function TodosItem({
  task,
  onDelete,
  onToggleCompleted,
}: TodosItemProps) {
  return (
    <div className="flex items-center gap-x-6">
      <Checkbox
        onClick={onToggleCompleted}
        aria-label="Toggle task completion"
        checked={task.completed}
      />
      <p
        className={cn(
          'overflow-hidden text-xl text-ellipsis transition-opacity',
          task.completed && 'line-through opacity-50',
        )}
      >
        {task.name}
      </p>
      <Button className="ml-auto" type="button" onClick={onDelete}>
        Delete
      </Button>
    </div>
  );
}
