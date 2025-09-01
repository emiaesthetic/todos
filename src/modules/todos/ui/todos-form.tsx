import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

import { TaskPayload } from '../model/types';
import { useForm } from '../model/use-form';

type TodosFormProps = {
  createTask: (payload: TaskPayload) => void;
};

export function TodosForm({ createTask }: TodosFormProps) {
  const { formData, handleChangeField, resetFormData } = useForm();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.name.trim()) return;

    createTask(formData);
    resetFormData();
  };

  return (
    <form className="mb-6 flex gap-x-4" onSubmit={handleSubmit}>
      <div className="basis-full">
        <Label className="sr-only" htmlFor="name">
          Task name
        </Label>
        <Input
          name="name"
          id="name"
          type="text"
          value={formData.name}
          onChange={event => handleChangeField('name', event.target.value)}
          placeholder="What do you need to do?"
        />
      </div>

      <Button type="submit" disabled={!formData.name.trim()}>
        Add
      </Button>
    </form>
  );
}
