export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'done';

export type Task = {
  id: number;
  title: string;
  description: string;
  assignees: Assignee[];
  status: TaskStatus;
};

export type Assignee = {
  id: number;
  name: string;
};
