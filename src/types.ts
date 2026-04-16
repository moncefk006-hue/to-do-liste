export interface Task {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string;
  createdAt: number;
}

export type FilterType = 'all' | 'active' | 'completed';
