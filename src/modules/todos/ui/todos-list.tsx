import emptyTodosListImg from '/img/empty.svg';

import { Task } from '../model/types';

type TodosListProps = {
  tasks: Task[];
  renderTask: (task: Task) => React.ReactNode;
};

export function TodosList({ tasks, renderTask }: TodosListProps) {
  return (
    <>
      {tasks.length === 0 ? (
        <div className="flex w-full items-center justify-center">
          <img
            className="w-[80%] max-w-[576px]"
            src={emptyTodosListImg}
            alt="Todos is empty"
          />
        </div>
      ) : (
        <ul>
          {tasks.map(task => (
            <li className="border-b-1 py-4" key={task.id}>
              {renderTask(task)}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
