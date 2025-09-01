import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Task } from './types';
import { useFilter } from './use-filter';

const mockTasks: Task[] = [
  { id: '1', name: 'Task 1', completed: false },
  { id: '2', name: 'Task 2', completed: true },
  { id: '3', name: 'Task 3', completed: false },
];

describe('useFilter', () => {
  it('should return all tasks by default', () => {
    const { result } = renderHook(() => useFilter(mockTasks));
    expect(result.current.filteredTasks).toEqual(mockTasks);
  });

  it('should filter tasks by "PROCESS" status', () => {
    const { result } = renderHook(() => useFilter(mockTasks));
    act(() => {
      result.current.handleChangeFilter('PROCESS');
    });
    expect(result.current.filteredTasks).toEqual([
      { id: '1', name: 'Task 1', completed: false },
      { id: '3', name: 'Task 3', completed: false },
    ]);
  });

  it('should filter tasks by "DONE" status', () => {
    const { result } = renderHook(() => useFilter(mockTasks));
    act(() => {
      result.current.handleChangeFilter('DONE');
    });
    expect(result.current.filteredTasks).toEqual([
      { id: '2', name: 'Task 2', completed: true },
    ]);
  });

  it('should return all tasks when filter is "ALL"', () => {
    const { result } = renderHook(() => useFilter(mockTasks));
    act(() => {
      result.current.handleChangeFilter('PROCESS');
    });
    act(() => {
      result.current.handleChangeFilter('ALL');
    });
    expect(result.current.filteredTasks).toEqual(mockTasks);
  });

  it('should update filtered tasks when base tasks change', () => {
    let tasks: Task[] = [
      { id: '1', name: 'Task 1', completed: false },
      { id: '2', name: 'Task 2', completed: true },
    ];
    const { result, rerender } = renderHook(() => useFilter(tasks));

    act(() => {
      result.current.handleChangeFilter('PROCESS');
    });
    expect(result.current.filteredTasks).toEqual([
      { id: '1', name: 'Task 1', completed: false },
    ]);

    tasks = [
      { id: '1', name: 'Task 1', completed: false },
      { id: '2', name: 'Task 2', completed: true },
      { id: '4', name: 'Task 4', completed: false },
    ];
    rerender();
    expect(result.current.filteredTasks).toEqual([
      { id: '1', name: 'Task 1', completed: false },
      { id: '4', name: 'Task 4', completed: false },
    ]);
  });
});
