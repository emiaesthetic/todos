import { useFilter } from './model/use-filter';
import { useTasks } from './model/use-tasks';
import { TodosControl } from './ui/todos-control';
import { TodosForm } from './ui/todos-form';
import { TodosItem } from './ui/todos-item';
import { TodosLayout } from './ui/todos-layout';
import { TodosList } from './ui/todos-list';

export function Todos() {
  const todos = useTasks();
  const { filteredTasks, handleChangeFilter } = useFilter(todos.tasks);

  return (
    <TodosLayout>
      <TodosForm createTask={todos.createTask} />
      <TodosControl
        remainingCount={todos.remainingCount}
        onChangeFilter={handleChangeFilter}
        onClearCompleted={todos.deleteCompletedTasks}
      />
      <TodosList
        tasks={filteredTasks}
        renderTask={task => (
          <TodosItem
            task={task}
            onDelete={() => todos.deleteTask(task.id)}
            onToggleCompleted={() => todos.toggleCompleted(task.id)}
          />
        )}
      />
    </TodosLayout>
  );
}
