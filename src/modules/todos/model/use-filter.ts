import { useMemo, useState } from 'react';

import { Task } from './types';

export type FilterState = 'ALL' | 'PROCESS' | 'DONE';

const filterTasks = (tasks: Task[], filter: FilterState) => {
  switch (filter) {
    case 'PROCESS':
      return tasks.filter(task => !task.completed);

    case 'DONE':
      return tasks.filter(task => task.completed);

    default:
      return tasks;
  }
};

export function useFilter(tasks: Task[]) {
  const [currentFilter, setCurrentFilter] = useState<FilterState>('ALL');

  const filteredTasks = useMemo(() => {
    return filterTasks(tasks, currentFilter);
  }, [tasks, currentFilter]);

  const handleChangeFilter = (value: FilterState) => {
    setCurrentFilter(value);
  };

  return { filteredTasks, handleChangeFilter };
}
