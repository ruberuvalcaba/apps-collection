export interface User {
  id: string | number;
  name: string;
  email?: string;
  age?: number;
  role: string;
  active: boolean;
}
