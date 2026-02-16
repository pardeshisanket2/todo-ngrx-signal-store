import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Todo } from '../model/todo.interface';
import { TodoService } from '../services/todos.service';

export type TodoFilter = 'ALL' | 'COMPLETED' | 'PENDING';

type TodosState = {
  todos: Todo[];
  loading: boolean;
  filter: TodoFilter;
};

// Automatically converted into a signal by the signalStore
const initialState: TodosState = {
  todos: [],
  loading: false,
  filter: 'ALL',
};

// T capitalized to indicate that it's a Angular Injectable Store & Singleton
export const TodoStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, todoService = inject(TodoService)) => ({
    async loadAllTodos() {
      patchState(store, { loading: true });

      const todosSignal = await todoService.getTodos();
      const todos = todosSignal(); // Extract the value from the signal

      patchState(store, { todos, loading: false });
    },

    async addTodo(message: string) {
      patchState(store, { loading: true });

      const newTodo: Todo = {
        id: Date.now(),
        message,
        completed: false,
        isDeleted: false,
      };

      const todos = store.todos(); // Access the current todos from the store

      patchState(store, { todos: [...todos, newTodo], loading: false });
    },

    async toggleTodo(id: number) {
      patchState(store, { loading: true });

      const todos = store.todos(); // Access the current todos from the store

      const updatedTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      );
      patchState(store, { todos: updatedTodos, loading: false });
    },

    async deleteTodo(id: number) {
      patchState(store, { loading: true });

      const todos = store.todos(); // Access the current todos from the store

      const updatedTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, isDeleted: true } : todo,
      );
      patchState(store, { todos: updatedTodos, loading: false });
    },
  })),
);
