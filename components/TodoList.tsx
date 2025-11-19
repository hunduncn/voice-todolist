'use client';

import { TodoItem as TodoItemType, Subject } from '@/lib/types';
import TodoItem from './TodoItem';
import { BookOpen } from 'lucide-react';

interface TodoListProps {
  todos: TodoItemType[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-8 md:py-12">
        <BookOpen className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 text-gray-300" />
        <p className="text-gray-400 text-base md:text-lg">还没有待办事项</p>
        <p className="text-gray-400 text-xs md:text-sm mt-2">按住按钮说出你的任务吧！</p>
      </div>
    );
  }

  // 按科目分组
  const todosBySubject = todos.reduce((acc, todo) => {
    if (!acc[todo.subject]) {
      acc[todo.subject] = [];
    }
    acc[todo.subject].push(todo);
    return acc;
  }, {} as Record<Subject, TodoItemType[]>);

  // 科目顺序
  const subjectOrder: Subject[] = ['语文', '数学', '英语', '科学', '其他'];

  return (
    <div className="space-y-4 md:space-y-6">
      {subjectOrder.map((subject) => {
        const subjectTodos = todosBySubject[subject];
        if (!subjectTodos || subjectTodos.length === 0) return null;

        return (
          <div key={subject} className="space-y-2 md:space-y-3">
            <h3 className="text-base md:text-lg font-bold text-gray-700 flex items-center gap-2">
              <span className="w-1 h-5 md:h-6 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full" />
              {subject}
              <span className="text-xs md:text-sm text-gray-400 font-normal">
                ({subjectTodos.length})
              </span>
            </h3>

            <div className="space-y-2">
              {subjectTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={onToggle}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
