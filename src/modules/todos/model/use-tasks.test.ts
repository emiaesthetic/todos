import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Task } from './types';
import { useTasks } from './use-tasks';

const STORAGE_KEY = 'todos';

vi.mock('@paralleldrive/cuid2', () => ({
  createId: () => 'mocked-id',
}));

const mockTasks: Task[] = [
  { id: '1', name: 'Task 1', completed: false },
  { id: '2', name: 'Task 2', completed: true },
  { id: '3', name: 'Task 3', completed: false },
  { id: '3', name: 'Task 3', completed: true },
];

describe('useTasks', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with tasks from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTasks));
    const { result } = renderHook(() => useTasks());
    expect(result.current.tasks).toEqual(mockTasks);
  });

  it('should correctly calculate remainingCount', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTasks));
    const { result } = renderHook(() => useTasks());
    expect(result.current.remainingCount).toBe(2);

    act(() => {
      result.current.toggleCompleted('1');
    });
    expect(result.current.remainingCount).toBe(1);
  });

  it('should initialize with empty array if localStorage is empty or invalid', () => {
    localStorage.setItem(STORAGE_KEY, 'invalid json');
    const { result } = renderHook(() => useTasks());
    expect(result.current.tasks).toEqual([]);

    localStorage.clear();
    const { result: emptyResult } = renderHook(() => useTasks());
    expect(emptyResult.current.tasks).toEqual([]);
  });

  it('should create a new task', () => {
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.createTask({ name: 'New Task' });
    });
    expect(result.current.tasks).toEqual([
      { id: 'mocked-id', name: 'New Task', completed: false },
    ]);
  });

  it('should delete a task', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTasks));
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.deleteTask('1');
    });
    expect(result.current.tasks).toEqual([
      { id: '2', name: 'Task 2', completed: true },
      { id: '3', name: 'Task 3', completed: false },
      { id: '3', name: 'Task 3', completed: true },
    ]);
  });

  it('should toggle task completion status', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTasks));
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.toggleCompleted('1');
    });
    expect(result.current.tasks).toEqual([
      { id: '1', name: 'Task 1', completed: true },
      { id: '2', name: 'Task 2', completed: true },
      { id: '3', name: 'Task 3', completed: false },
      { id: '3', name: 'Task 3', completed: true },
    ]);

    act(() => {
      result.current.toggleCompleted('1');
    });
    expect(result.current.tasks).toEqual(mockTasks);
  });

  it('should delete all completed tasks', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTasks));
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.deleteCompletedTasks();
    });
    expect(result.current.tasks).toEqual([
      { id: '1', name: 'Task 1', completed: false },
      { id: '3', name: 'Task 3', completed: false },
    ]);
  });
});
