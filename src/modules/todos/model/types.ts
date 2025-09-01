export type TaskId = string;

export type Task = {
  id: TaskId;
  name: string;
  completed: boolean;
};

export type TaskPayload = {
  name: string;
};
