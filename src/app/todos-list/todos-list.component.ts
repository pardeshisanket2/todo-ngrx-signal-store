import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Todo } from '../model/todo.interface';
import { TodoStore } from '../store/todos.store';

@Component({
  selector: 'todos-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './todos-list.component.html',
  styleUrl: './todos-list.component.scss',
})
export class TodosListComponent {
  store = inject(TodoStore);

  todoForm!: FormGroup;

  allTodos: Todo[] = this.store.todos(); // Access the todos signal from the store;

  totalTodos = computed(() => this.store.todos().length);

  activeTodos = computed(
    () => this.store.todos().filter((todo) => !todo.completed).length,
  );

  completedTodos = computed(
    () => this.store.todos().filter((todo) => todo.completed).length,
  );

  filteredTodos = computed(() => {
    const filter = this.store.filter();
    const allTodos = this.store.todos();

    switch (filter) {
      case 'ACTIVE':
        return allTodos.filter((todo) => !todo.completed);
      case 'COMPLETED':
        return allTodos.filter((todo) => todo.completed);
      default:
        return allTodos;
    }
  });

  constructor() {}

  ngOnInit() {
    this.todoForm = new FormGroup({
      todoMessageInput: new FormControl(),
    });
  }

  get todoMessageInput(): FormControl | null {
    return this.todoForm.get('todoMessageInput') as FormControl;
  }

  updateTodoList(filter?: 'ALL' | 'ACTIVE' | 'COMPLETED') {
    // If no filter is provided, use the current filter from the store
    if (!filter) {
      filter = this.store.filter();
    }

    switch (filter) {
      case 'ACTIVE':
        this.store.updateFilter('ACTIVE');
        break;
      case 'COMPLETED':
        this.store.updateFilter('COMPLETED');
        break;

      default:
        this.store.updateFilter('ALL');
        break;
    }
  }

  addTodo() {
    const text = this.todoMessageInput?.value;

    if (text) {
      this.store.addTodo(text);

      this.todoMessageInput.reset();

      this.updateTodoList();
    }
  }

  toggleTodo(id: number) {
    this.store.toggleTodo(id);
    this.updateTodoList();
  }

  deleteTodo(id: number) {
    this.store.deleteTodo(id);
    this.updateTodoList();
  }

  getEmptyMessage(): string {
    const filter = this.store.filter();
    if (this.totalTodos() === 0) {
      return 'No todos yet. Add one to get started!';
    }
    if (filter === 'ACTIVE') {
      return 'No active todos. Great job!';
    }
    if (filter === 'COMPLETED') {
      return 'No completed todos yet.';
    }
    return 'No todos to display.';
  }
}
