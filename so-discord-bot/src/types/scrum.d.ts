export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'done';

export type Task = {
  id: number;
  title: string;
  description: string;
  assignees: Assignee[];
  status: TaskStatus;
};

export type Sprint = {
  id: number;
  dates: {
    start: Date;
    end: Date;
  };
  tasks: Task[];
};

export type Assignee = {
  id: number;
  name: string;
};
