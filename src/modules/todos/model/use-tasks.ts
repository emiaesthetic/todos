import { createId } from '@paralleldrive/cuid2';
import { useState } from 'react';

import { Task, TaskId, TaskPayload } from './types';

const STORAGE_KEY = 'todos';

const tasksStorage = {
  fetchTasks: (): Task[] => {
    try {
      const tasks = localStorage.getItem(STORAGE_KEY);
      return tasks ? JSON.parse(tasks) : [];
    } catch {
      return [];
    }
  },

  setTasks: (tasks: Task[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  },
};

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => tasksStorage.fetchTasks());

  const remainingCount = tasks.filter(task => !task.completed).length;

  const sync = (tasks: Task[]) => {
    setTasks(tasks);
    tasksStorage.setTasks(tasks);
  };

  const createTask = (payload: TaskPayload) => {
    const newTask: Task = {
      id: createId(),
      ...payload,
      completed: false,
    };

    sync([...tasks, newTask]);
  };

  const deleteTask = (taskId: TaskId) => {
    sync(tasks.filter(task => task.id !== taskId));
  };

  const toggleCompleted = (taskId: TaskId) => {
    const processedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task,
    );
    sync(processedTasks);
  };

  const deleteCompletedTasks = () => {
    sync(tasks.filter(task => !task.completed));
  };

  return {
    tasks,
    remainingCount,
    createTask,
    deleteTask,
    toggleCompleted,
    deleteCompletedTasks,
  };
}
