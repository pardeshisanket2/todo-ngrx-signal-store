// 🔹 Filter Type
export type TodoFilter = 'ALL' | 'ACTIVE' | 'COMPLETED';

// 🔹 Base API Wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

// 🔹 Todo Model
export interface Todo {
  _id: string;
  message: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// 🔹 Response
export type GetAllTodosResponse = ApiResponse<{
  todos: Todo[];
  totalCount: number;
}>;

// 🔹 DTOs
export interface CreateTodoDto {
  message: string;
}

export interface UpdateTodoDto {
  message?: string;
  completed?: boolean;
}
