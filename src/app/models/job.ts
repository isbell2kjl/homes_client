export interface Job {
  jobId: number;
  title: string;
  completed: boolean;
  created?: Date | null;
  updatedAt?: Date | null;

  userId_fk: number;
  user?: any;
}

