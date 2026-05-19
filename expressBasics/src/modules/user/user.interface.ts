export interface IUser {
  name: string;
  email: string;
  password: string;
  age: number;
  role?: "user" | "admin" | "agent";
  is_active?: boolean;
}
