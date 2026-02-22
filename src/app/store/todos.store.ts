import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Todo } from '../model/todo.interface';
import { TodoService } from '../services/todos.service';

export type TodoFilter = 'ALL' | 'COMPLETED' | 'ACTIVE';

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

      try {
        const response = await todoService.getAllTodos({
          todoFilter: store.filter(),
        });
        const todos = response.data.todos;
        console.log('Store updateFilter:', store.filter());

        patchState(store, { todos, filter: store.filter(), loading: false });
      } catch (error) {
        patchState(store, { loading: false });
      }
    },

    updateFilter(filter: TodoFilter) {
      patchState(store, { filter });
      console.log('Store updateFilter:', filter);
      this.loadAllTodos(); // Reload todos based on the new filter
    },

    // TODO: Add Backend API calls for these methods and handle loading state accordingly with error handling as well
    async addTodo(message: string) {
      patchState(store, { loading: true });

      const newTodo: Todo = {
        id: Date.now(),
        message,
        completed: false,
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
