import { useState } from 'react';

type TodosFormData = {
  name: string;
};

const defaultValue = {
  name: '',
};

export function useForm() {
  const [formData, setFormData] = useState<TodosFormData>(defaultValue);

  const handleChangeField = <T extends keyof TodosFormData>(
    key: T,
    value: TodosFormData[T],
  ) => {
    setFormData(lastState => ({
      ...lastState,
      [key]: value,
    }));
  };

  const resetFormData = () => {
    setFormData(defaultValue);
  };

  return { formData, handleChangeField, resetFormData };
}
