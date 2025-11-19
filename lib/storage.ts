import { TodoItem } from './types';

const STORAGE_KEY = 'voice_todolist_items';

/**
 * 从localStorage获取所有Todo项
 */
export function getTodos(): TodoItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load todos from localStorage:', error);
    return [];
  }
}

/**
 * 保存所有Todo项到localStorage
 */
export function saveTodos(todos: TodoItem[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Failed to save todos to localStorage:', error);
  }
}

/**
 * 添加新的Todo项
 */
export function addTodo(todo: Omit<TodoItem, 'id' | 'createdAt' | 'completed'>): TodoItem {
  const newTodo: TodoItem = {
    ...todo,
    id: generateId(),
    completed: false,
    createdAt: new Date().toISOString(),
  };

  const todos = getTodos();
  todos.push(newTodo);
  saveTodos(todos);

  return newTodo;
}

/**
 * 添加多个Todo项
 */
export function addTodos(todos: Omit<TodoItem, 'id' | 'createdAt' | 'completed'>[]): TodoItem[] {
  const newTodos = todos.map(todo => ({
    ...todo,
    id: generateId(),
    completed: false,
    createdAt: new Date().toISOString(),
  }));

  const existingTodos = getTodos();
  const allTodos = [...existingTodos, ...newTodos];
  saveTodos(allTodos);

  return newTodos;
}

/**
 * 更新Todo项
 */
export function updateTodo(id: string, updates: Partial<TodoItem>): void {
  const todos = getTodos();
  const index = todos.findIndex(todo => todo.id === id);

  if (index !== -1) {
    todos[index] = { ...todos[index], ...updates };
    saveTodos(todos);
  }
}

/**
 * 删除Todo项
 */
export function deleteTodo(id: string): void {
  const todos = getTodos();
  const filtered = todos.filter(todo => todo.id !== id);
  saveTodos(filtered);
}

/**
 * 切换Todo完成状态
 */
export function toggleTodo(id: string): void {
  const todos = getTodos();
  const todo = todos.find(t => t.id === id);

  if (todo) {
    todo.completed = !todo.completed;
    saveTodos(todos);
  }
}

/**
 * 清除所有Todo项
 */
export function clearTodos(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * 生成唯一ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
