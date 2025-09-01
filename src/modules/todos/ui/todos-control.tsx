import { Button } from '@/shared/ui/button';
import { Select } from '@/shared/ui/select';

import { FilterState } from '../model/use-filter';

type TodosControlProps = {
  remainingCount: number;
  onChangeFilter: (value: FilterState) => void;
  onClearCompleted: () => void;
};

export function TodosControl({
  remainingCount,
  onChangeFilter,
  onClearCompleted,
}: TodosControlProps) {
  return (
    <div className="flex items-center gap-x-4">
      <span className="text-lg">
        {remainingCount} item{remainingCount !== 1 && 's'} left
      </span>

      <div className="ml-auto inline-flex gap-x-4">
        <Select
          defaultValue="ALL"
          onValueChange={(value: FilterState) => onChangeFilter(value)}
        >
          <Select.Trigger aria-label="Filter tasks">
            <Select.Value placeholder="All" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="ALL">All</Select.Item>
            <Select.Item value="PROCESS">Process</Select.Item>
            <Select.Item value="DONE">Done</Select.Item>
          </Select.Content>
        </Select>

        <Button type="button" onClick={onClearCompleted}>
          Clear completed
        </Button>
      </div>
    </div>
  );
}
