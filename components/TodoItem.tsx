'use client';

import { TodoItem as TodoItemType } from '@/lib/types';
import { Check, Trash2 } from 'lucide-react';
import SubjectIcon from './SubjectIcon';

interface TodoItemProps {
  todo: TodoItemType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const getBgColor = () => {
    switch (todo.subject) {
      case '语文':
        return 'bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200';
      case '数学':
        return 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200';
      case '英语':
        return 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200';
      case '科学':
        return 'bg-gradient-to-br from-green-50 to-green-100 border-green-200';
      default:
        return 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200';
    }
  };

  const getTypeColor = () => {
    switch (todo.type) {
      case '作业':
        return 'bg-orange-200 text-orange-800';
      case '复习':
        return 'bg-blue-200 text-blue-800';
      case '预习':
        return 'bg-green-200 text-green-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div
      className={`
        p-3 md:p-4 rounded-lg md:rounded-xl border-2 shadow-sm transition-all duration-200
        ${getBgColor()}
        ${todo.completed ? 'opacity-60' : 'hover:shadow-md'}
      `}
    >
      <div className="flex items-start gap-2 md:gap-3">
        {/* 完成按钮 - 响应式 */}
        <button
          onClick={() => onToggle(todo.id)}
          className={`
            flex-shrink-0 w-6 h-6 md:w-7 md:h-7 rounded-full border-2 flex items-center justify-center
            transition-all duration-200
            ${todo.completed
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 hover:border-green-400'
            }
          `}
        >
          {todo.completed && <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />}
        </button>

        {/* 内容区域 - 响应式 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 md:mb-2">
            <span className={`px-1.5 md:px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor()}`}>
              {todo.type}
            </span>
          </div>

          <p
            className={`
              text-sm md:text-base text-gray-700 leading-relaxed
              ${todo.completed ? 'line-through' : ''}
            `}
          >
            {todo.content}
          </p>
        </div>

        {/* 删除按钮 - 响应式 */}
        <button
          onClick={() => onDelete(todo.id)}
          className="flex-shrink-0 p-1.5 md:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </button>
      </div>
    </div>
  );
}
