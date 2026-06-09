export interface Task {
  id: number;
  title: string;
  description?: string;

  status: 'todo' | 'inProgress' | 'done';

  order: number;

  disabled: boolean;

  createdAt: Date;
  updatedAt: Date;
}
