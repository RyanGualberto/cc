declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      password: string | undefined;
      createdAt: Date;
      updatedAt: Date;
    };
  }

  export interface Response {
    send: (data: object) => Response;
    setHeader: (key: string, value: string) => Response;
    sendFile: (path: string) => Response;
  }
}
