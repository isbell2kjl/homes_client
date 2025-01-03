export interface Request {
    requestId: number;
    userId: number;
    projectId: number;
    status: string;
    requestedAt: Date;
    user: {
      email: string;
      username: string;
    };
  }