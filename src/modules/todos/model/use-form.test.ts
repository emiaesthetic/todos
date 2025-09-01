import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useForm } from './use-form';

describe('useForm', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useForm());
    expect(result.current.formData).toEqual({ name: '' });
  });

  it('should update form data on handleChangeField', () => {
    const { result } = renderHook(() => useForm());
    act(() => {
      result.current.handleChangeField('name', 'New Task');
    });
    expect(result.current.formData).toEqual({ name: 'New Task' });
  });

  it('should reset form data to default values', () => {
    const { result } = renderHook(() => useForm());
    act(() => {
      result.current.handleChangeField('name', 'Task to be reset');
    });
    expect(result.current.formData).toEqual({ name: 'Task to be reset' });
    act(() => {
      result.current.resetFormData();
    });
    expect(result.current.formData).toEqual({ name: '' });
  });
});
