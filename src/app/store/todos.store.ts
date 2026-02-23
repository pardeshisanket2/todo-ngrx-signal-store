import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { CreateTodoDto, Todo } from '../interfaces/todo.interface';
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

        patchState(store, { todos, filter: store.filter(), loading: false });
      } catch (error) {
        patchState(store, { loading: false });
      }
    },

    updateFilter(filter: TodoFilter) {
      patchState(store, { filter });
      this.loadAllTodos(); // Reload todos based on the new filter
    },

    async addTodo(message: string) {
      patchState(store, { loading: true });

      try {
        const todo: CreateTodoDto = {
          message,
        };
        await todoService.addTodo({ todo });

        // Reload the todos after adding a new one
        await this.loadAllTodos();
      } catch (error) {
        patchState(store, { loading: false });
        throw error;
      }
    },

    async toggleTodo(id: string) {
      patchState(store, { loading: true });
      try {
        await todoService.toggleTodo({ id });

        // Reload the todos after toggling
        await this.loadAllTodos();
      } catch (error) {
        patchState(store, { loading: false });
        throw error;
      }
    },

    async deleteTodo(id: string) {
      patchState(store, { loading: true });

      try {
        await todoService.deleteTodo({ id });

        // Reload the todos after deletion
        await this.loadAllTodos();
      } catch (error) {
        patchState(store, { loading: false });
        throw error;
      }
    },
  })),
);
