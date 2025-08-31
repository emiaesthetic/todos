export type TaskId = string;

export type TaskStatus = 'PROCESS' | 'DONE';

export type Task = {
  id: TaskId;
  title: string;
  status: TaskStatus;
};
