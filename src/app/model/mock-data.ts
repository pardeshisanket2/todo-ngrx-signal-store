import { Todo } from './todo.interface';
import { signal } from '@angular/core';

export const TODOS = signal<Todo[]>([
  { id: 1, message: 'Testing 1', completed: false, isDeleted: false },
  { id: 2, message: 'Testing 2', completed: false, isDeleted: false },
  { id: 3, message: 'Testing 3', completed: false, isDeleted: false },
]);
