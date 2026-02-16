import { Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TodoStore } from './store/todos.store';
import { TodosListComponent } from './todos-list/todos-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TodosListComponent, MatProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'todo-ngrx-signal-store';

  store = inject(TodoStore);

  ngOnInit() {
    this.loadTodos().then(() => {});
  }

  async loadTodos() {
    await this.store.loadAllTodos();
  }
}
