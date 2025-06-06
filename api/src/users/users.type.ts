export interface IUser {
  id: string;
  role: 'admin' | 'user';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string | undefined;
  createdAt: Date;
  updatedAt: Date;
}
