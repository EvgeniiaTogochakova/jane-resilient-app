import { createCrudHooks } from '@/api/createCrudHooks';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  city: string;
}
const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const userHooks = createCrudHooks<User>(baseUrl, 'users');
