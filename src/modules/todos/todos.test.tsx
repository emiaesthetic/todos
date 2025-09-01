import * as cuid2 from '@paralleldrive/cuid2';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import { Task } from './model/types';
import { Todos } from './todos';

const STORAGE_KEY = 'todos';

vi.mock('@paralleldrive/cuid2', () => ({
  createId: vi.fn((counter: number) => `test-id-${counter}`),
}));

const getTasks = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
};

const addTask = (taskName: string) => {
  const input = screen.getByPlaceholderText('What do you need to do?');
  const addButton = screen.getByRole('button', { name: 'Add' });

  fireEvent.change(input, { target: { value: taskName } });
  expect(input).toHaveValue(taskName);

  fireEvent.click(addButton);
  expect(input).toHaveValue('');
};

describe('Todos Component (Full Integration Test)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    let counter = 0;
    (cuid2.createId as unknown as Mock).mockImplementation(
      () => `task-id-${++counter}`,
    );
  });

  it('should render the application with an empty state initially', () => {
    render(<Todos />);

    expect(
      screen.getByPlaceholderText('What do you need to do?'),
    ).toBeVisible();
    expect(screen.getByRole('button', { name: 'Add' })).toBeVisible();
    expect(screen.getByText('0 items left')).toBeVisible();
    expect(screen.getByAltText('Todos is empty')).toBeVisible();
  });

  it('should enable the Add button when input is not empty and disable it when empty', () => {
    render(<Todos />);

    const input = screen.getByPlaceholderText('What do you need to do?');
    const addButton = screen.getByRole('button', { name: 'Add' });

    expect(input).toHaveValue('');
    expect(addButton).toBeDisabled();

    fireEvent.change(input, { target: { value: 'New task name' } });
    expect(addButton).not.toBeDisabled();

    fireEvent.change(input, { target: { value: '' } });
    expect(addButton).toBeDisabled();

    fireEvent.change(input, { target: { value: '   ' } });
    expect(addButton).toBeDisabled();
  });

  it('should add a new task and display it in the list', () => {
    render(<Todos />);

    addTask('First task');
    expect(screen.getByText('First task')).toBeVisible();
    expect(screen.getByText('1 item left')).toBeVisible();
    expect(screen.queryByAltText('Todos is empty')).not.toBeInTheDocument();
    expect(getTasks()[0]).toEqual({
      id: 'task-id-1',
      name: 'First task',
      completed: false,
    });
  });

  it('should toggle task completion status and update remaining count', () => {
    render(<Todos />);

    addTask('Task to complete');
    const taskNameElement = screen.getByText('Task to complete');
    const checkbox = screen.getByLabelText('Toggle task completion');

    expect(checkbox).not.toBeChecked();
    expect(taskNameElement).not.toHaveClass('line-through');
    expect(screen.getByText('1 item left')).toBeVisible();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(taskNameElement).toHaveClass('line-through');
    expect(taskNameElement).toHaveClass('opacity-50');
    expect(screen.getByText('0 items left')).toBeVisible();
    expect(getTasks()[0].completed).toBe(true);

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(taskNameElement).not.toHaveClass('line-through');
    expect(taskNameElement).not.toHaveClass('opacity-50');
    expect(screen.getByText('1 item left')).toBeVisible();
    expect(getTasks()[0].completed).toBe(false);
  });

  it('should delete a task', () => {
    render(<Todos />);

    addTask('Task to delete');
    expect(screen.getByText('Task to delete')).toBeVisible();
    expect(screen.getByText('1 item left')).toBeVisible();

    const deleteButton = screen.getByRole('button', { name: 'Delete' });

    fireEvent.click(deleteButton);
    expect(screen.queryByText('Task to delete')).not.toBeInTheDocument();
    expect(screen.getByText('0 items left')).toBeVisible();
    expect(screen.getByAltText('Todos is empty')).toBeVisible();
    expect(getTasks()).toEqual([]);
  });

  it('should filter tasks by "PROCESS" status', () => {
    render(<Todos />);

    addTask('Task 1 (process)');
    addTask('Task 2 (done)');
    addTask('Task 3 (process)');

    const taskNameElement = screen.getByText('Task 2 (done)');
    const checkbox = within(taskNameElement.closest('div')!).getByRole(
      'checkbox',
    );

    fireEvent.click(checkbox);
    expect(screen.getByText('2 items left')).toBeVisible();

    expect(screen.getByText('Task 1 (process)')).toBeVisible();
    expect(screen.getByText('Task 2 (done)')).toBeVisible();
    expect(screen.getByText('Task 3 (process)')).toBeVisible();

    const trigger = screen.getByLabelText('Filter tasks');
    fireEvent.click(trigger);

    const processOption = screen.getByText('Process');
    fireEvent.click(processOption);

    expect(screen.getByText('Task 1 (process)')).toBeVisible();
    expect(screen.queryByText('Task 2 (done)')).not.toBeInTheDocument();
    expect(screen.getByText('Task 3 (process)')).toBeVisible();
  });

  it('should filter tasks by "DONE" status', () => {
    render(<Todos />);

    addTask('Task 1 (process)');
    addTask('Task 2 (done)');

    const taskNameElement = screen.getByText('Task 2 (done)');
    const checkbox = within(taskNameElement.closest('div')!).getByRole(
      'checkbox',
    );

    fireEvent.click(checkbox);
    expect(screen.getByText('1 item left')).toBeVisible();

    expect(screen.getByText('Task 1 (process)')).toBeVisible();
    expect(screen.getByText('Task 2 (done)')).toBeVisible();

    const trigger = screen.getByLabelText('Filter tasks');
    fireEvent.click(trigger);

    const processOption = screen.getByText('Done');
    fireEvent.click(processOption);

    expect(screen.queryByText('Task 1 (process)')).not.toBeInTheDocument();
    expect(screen.getByText('Task 2 (done)')).toBeVisible();
  });

  it('should clear all completed tasks', () => {
    render(<Todos />);

    addTask('Task 1 (done)');
    addTask('Task 2 (done)');
    addTask('Task 3 (process)');

    const firstTaskElement = screen.getByText('Task 1 (done)');
    const firstCheckbox = within(firstTaskElement.closest('div')!).getByRole(
      'checkbox',
    );
    fireEvent.click(firstCheckbox);

    const secondTaskElement = screen.getByText('Task 2 (done)');
    const secondCheckbox = within(secondTaskElement.closest('div')!).getByRole(
      'checkbox',
    );
    fireEvent.click(secondCheckbox);

    expect(screen.getByText('Task 1 (done)')).toBeVisible();
    expect(screen.getByText('Task 2 (done)')).toBeVisible();
    expect(screen.getByText('Task 3 (process)')).toBeVisible();
    expect(screen.getByText('1 item left')).toBeVisible();
    expect(getTasks().length).toBe(3);

    const clearCompletedButton = screen.getByRole('button', {
      name: 'Clear completed',
    });
    fireEvent.click(clearCompletedButton);

    expect(screen.queryByText('Task 1 (done)')).not.toBeInTheDocument();
    expect(screen.queryByText('Task 2 (done)')).not.toBeInTheDocument();
    expect(screen.getByText('Task 3 (process)')).toBeVisible();
    expect(screen.getByText('1 item left')).toBeVisible();
    expect(getTasks().length).toBe(1);
  });

  it('should load tasks from localStorage on initial render', () => {
    const initialTasks: Task[] = [
      { id: 'stored-task-1', name: 'Stored process task', completed: false },
      { id: 'stored-task-2', name: 'Stored done task', completed: true },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTasks));

    render(<Todos />);

    expect(screen.getByText('Stored process task')).toBeVisible();
    expect(screen.getByText('Stored done task')).toBeVisible();
    expect(screen.getByText('1 item left')).toBeVisible();
    expect(screen.queryByAltText('Todos is empty')).not.toBeInTheDocument();
  });
});
