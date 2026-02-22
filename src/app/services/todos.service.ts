import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.production';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private http = inject(HttpClient);

  async getAllTodos({ todoFilter = 'ALL' }) {
    const params = new HttpParams().append('todoFilter', todoFilter);

    return firstValueFrom(
      this.http.get<any>(`${environment.hostAPI}/todo`, {
        params,
      }),
    );
  }
}
