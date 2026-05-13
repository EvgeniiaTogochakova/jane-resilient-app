import { createCrudHooks, type CrudMessages } from '@/api/createCrudHooks';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  city: string;
}

const baseUrl = import.meta.env.VITE_API_BASE_URL;

// Текстовые нотификации для сущности User
const userMessages: CrudMessages = {
  createSuccess: 'User created successfully',
  createError: 'Failed to create user!',
  updateSuccess: 'User updated successfully',
  updateError: 'Failed to update user!',
  deleteSuccess: 'User deleted successfully',
  deleteError: 'Failed to delete user!',
};

export const userHooks = createCrudHooks<User>(baseUrl, 'users', userMessages);
