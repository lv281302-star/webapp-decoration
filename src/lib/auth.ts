import { User } from './types';

const USERS_KEY = 'decoration_room_users';
const CURRENT_USER_KEY = 'decoration_room_current_user';

// Get all users from localStorage
export const getUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

// Save users to localStorage
const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Get current logged user
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Save current user
const saveCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

// Register new user
export const registerUser = (
  name: string,
  email: string,
  password: string,
  cpf: string,
  phone: string
): { success: boolean; message: string; user?: User } => {
  const users = getUsers();
  
  // Check if email already exists
  if (users.find(u => u.email === email)) {
    return { success: false, message: 'Email já cadastrado' };
  }
  
  // Check if CPF already exists
  if (users.find(u => u.cpf === cpf)) {
    return { success: false, message: 'CPF já cadastrado' };
  }
  
  const newUser: User = {
    id: `user-${Date.now()}`,
    name,
    email,
    cpf,
    phone,
    authProvider: 'email',
    createdAt: new Date().toISOString(),
  };
  
  users.push(newUser);
  saveUsers(users);
  saveCurrentUser(newUser);
  
  return { success: true, message: 'Cadastro realizado com sucesso!', user: newUser };
};

// Login user
export const loginUser = (
  email: string,
  password: string
): { success: boolean; message: string; user?: User } => {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  
  if (!user) {
    return { success: false, message: 'Email não encontrado' };
  }
  
  // In a real app, you would verify password here
  saveCurrentUser(user);
  return { success: true, message: 'Login realizado com sucesso!', user };
};

// Google login (simulated)
export const loginWithGoogle = (): { success: boolean; message: string; user?: User } => {
  // Simulate Google OAuth
  const mockGoogleUser: User = {
    id: `user-google-${Date.now()}`,
    name: 'Usuário Google',
    email: 'usuario@gmail.com',
    cpf: '000.000.000-00',
    phone: '(00) 00000-0000',
    authProvider: 'google',
    createdAt: new Date().toISOString(),
  };
  
  const users = getUsers();
  const existingUser = users.find(u => u.email === mockGoogleUser.email);
  
  if (existingUser) {
    saveCurrentUser(existingUser);
    return { success: true, message: 'Login com Google realizado!', user: existingUser };
  }
  
  users.push(mockGoogleUser);
  saveUsers(users);
  saveCurrentUser(mockGoogleUser);
  
  return { success: true, message: 'Cadastro com Google realizado!', user: mockGoogleUser };
};

// Logout
export const logoutUser = () => {
  saveCurrentUser(null);
};
