export interface Todo {
  id: number;
  message: string;
  completed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
