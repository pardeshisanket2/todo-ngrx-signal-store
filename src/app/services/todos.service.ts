import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment.production';
import {
  CreateTodoDto,
  GetAllTodosResponse,
} from '../interfaces/todo.interface';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private http = inject(HttpClient);

  async getAllTodos({ todoFilter = 'ALL' }): Promise<GetAllTodosResponse> {
    const params = new HttpParams().append('todoFilter', todoFilter);

    return firstValueFrom(
      this.http.get<Promise<GetAllTodosResponse>>(
        `${environment.hostAPI}/todo`,
        {
          params,
        },
      ),
    );
  }

  async addTodo({ todo }: { todo: CreateTodoDto }) {
    return firstValueFrom(
      this.http.post<any>(`${environment.hostAPI}/todo`, todo),
    );
  }

  async toggleTodo({ id }: { id: string }) {
    return firstValueFrom(
      this.http.patch<any>(`${environment.hostAPI}/todo/${id}`, {}),
    );
  }

  async deleteTodo({ id }: { id: string }) {
    return firstValueFrom(
      this.http.delete<any>(`${environment.hostAPI}/todo/${id}`),
    );
  }
}
