import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
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

  currentFilter = signal<'all' | 'active' | 'completed'>('all');

  todoForm!: FormGroup;

  allTodos: Todo[] = this.store.todos(); // Access the todos signal from the store;

  totalTodos = computed(
    () => this.store.todos().filter((todo) => !todo.isDeleted).length,
  );

  activeTodos = computed(
    () =>
      this.store.todos().filter((todo) => !todo.isDeleted && !todo.completed)
        .length,
  );

  completedTodos = computed(
    () =>
      this.store.todos().filter((todo) => !todo.isDeleted && todo.completed)
        .length,
  );

  filteredTodos = computed(() => {
    const filter = this.currentFilter();
    const allTodos = this.store.todos().filter((todo) => !todo.isDeleted);

    switch (filter) {
      case 'active':
        return allTodos.filter((todo) => !todo.completed);
      case 'completed':
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
    this.updateTodoList();
  }

  get todoMessageInput(): FormControl | null {
    return this.todoForm.get('todoMessageInput') as FormControl;
  }

  updateTodoList() {
    switch (this.currentFilter()) {
      case 'active':
        this.allTodos = this.store
          .todos()
          .filter((todo) => !todo.isDeleted && !todo.completed);
        break;
      case 'completed':
        this.allTodos = this.store
          .todos()
          .filter((todo) => !todo.isDeleted && todo.completed);
        break;

      default:
        this.allTodos = this.store.todos();
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

  setFilter(filter: 'all' | 'active' | 'completed') {
    this.currentFilter.set(filter);
    this.updateTodoList();
  }

  getEmptyMessage(): string {
    const filter = this.currentFilter();
    if (this.totalTodos() === 0) {
      return 'No todos yet. Add one to get started!';
    }
    if (filter === 'active') {
      return 'No active todos. Great job!';
    }
    if (filter === 'completed') {
      return 'No completed todos yet.';
    }
    return 'No todos to display.';
  }
}
