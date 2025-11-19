'use client';

import { useState, useEffect } from 'react';
import { TodoItem } from '@/lib/types';
import { getTodos, addTodos, toggleTodo, deleteTodo } from '@/lib/storage';
import VoiceRecorder from '@/components/VoiceRecorder';
import TodoList from '@/components/TodoList';
import { Loader2, Trash2, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';

type ViewType = 'pending' | 'completed';

export default function Home() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('pending');

  // 加载todos
  useEffect(() => {
    setTodos(getTodos());
  }, []);

  // 处理语音识别完成
  const handleTranscriptComplete = async (transcript: string) => {
    if (!transcript.trim()) {
      return;
    }

    setIsProcessing(true);
    setError(null);
    setShowSuccess(false);

    try {
      // 调用API解析todos
      const response = await axios.post('/api/parse-todos', {
        text: transcript,
      });

      if (response.data.success && response.data.todos.length > 0) {
        // 添加新的todos
        addTodos(response.data.todos);
        setTodos(getTodos());

        // 显示成功提示
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setError('未能识别出有效的任务，请重试');
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('处理失败，请检查网络连接或稍后重试');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // 切换完成状态
  const handleToggle = (id: string) => {
    toggleTodo(id);
    setTodos(getTodos());
  };

  // 删除todo
  const handleDelete = (id: string) => {
    deleteTodo(id);
    setTodos(getTodos());
  };

  // 清空所有
  const handleClearAll = () => {
    if (todos.length === 0) return;

    if (confirm('确定要清空所有任务吗？')) {
      localStorage.removeItem('voice_todolist_items');
      setTodos([]);
    }
  };

  // 统计信息
  const totalTodos = todos.length;
  const completedTodos = todos.filter(t => t.completed).length;
  const pendingTodos = totalTodos - completedTodos;

  // 根据当前视图过滤任务
  const filteredTodos = todos.filter(todo =>
    currentView === 'pending' ? !todo.completed : todo.completed
  );

  return (
    <div className="min-h-screen py-4 md:py-8 px-3 md:px-4 pb-32 md:pb-48">
      <div className="max-w-2xl mx-auto">
        {/* 头部 - 响应式 */}
        <header className="text-center mb-4 md:mb-8">
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-2 md:mb-3">
            <Sparkles className="w-6 h-6 md:w-10 md:h-10 text-yellow-500" />
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              语音Todo
            </h1>
            <Sparkles className="w-6 h-6 md:w-10 md:h-10 text-yellow-500" />
          </div>
          <p className="text-sm md:text-base text-gray-600">说出你的作业，让AI帮你记录！</p>

          {/* 统计信息 - 响应式 */}
          {totalTodos > 0 && (
            <div className="flex items-center justify-center gap-2 md:gap-4 mt-3 md:mt-4 text-xs md:text-sm">
              <span className="px-2 md:px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                共 {totalTodos} 项
              </span>
              <span className="px-2 md:px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
                待完成 {pendingTodos}
              </span>
              <span className="px-2 md:px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                已完成 {completedTodos}
              </span>
            </div>
          )}
        </header>

        {/* Todo列表 - 响应式 */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-4 md:p-8 mb-4 md:mb-8">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">我的任务</h2>
            {totalTodos > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">清空全部</span>
                <span className="sm:hidden">清空</span>
              </button>
            )}
          </div>

          {/* 视图切换标签 - 响应式 */}
          <div className="flex gap-2 mb-4 md:mb-6">
            <button
              onClick={() => setCurrentView('pending')}
              className={`flex-1 py-2 md:py-3 px-3 md:px-4 rounded-lg md:rounded-xl text-sm md:text-base font-medium transition-all ${
                currentView === 'pending'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              待办任务
              {pendingTodos > 0 && (
                <span className={`ml-1 md:ml-2 px-1.5 md:px-2 py-0.5 rounded-full text-xs ${
                  currentView === 'pending' ? 'bg-white/20' : 'bg-gray-300'
                }`}>
                  {pendingTodos}
                </span>
              )}
            </button>
            <button
              onClick={() => setCurrentView('completed')}
              className={`flex-1 py-2 md:py-3 px-3 md:px-4 rounded-lg md:rounded-xl text-sm md:text-base font-medium transition-all ${
                currentView === 'completed'
                  ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              已完成
              {completedTodos > 0 && (
                <span className={`ml-1 md:ml-2 px-1.5 md:px-2 py-0.5 rounded-full text-xs ${
                  currentView === 'completed' ? 'bg-white/20' : 'bg-gray-300'
                }`}>
                  {completedTodos}
                </span>
              )}
            </button>
          </div>

          <TodoList
            todos={filteredTodos}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        </div>

        {/* 页脚提示 - 响应式 */}
        <footer className="text-center mt-4 md:mt-8 text-xs md:text-sm text-gray-500 px-2">
          <p className="hidden md:block">💡 提示：试着说"语文一张卷子、数学校本第二单元"</p>
          <p className="md:hidden">💡 试着说出你的作业</p>
          <p className="mt-1">📱 最佳体验请使用 Chrome 或 Safari 浏览器</p>
        </footer>
      </div>

      {/* 固定在底部的语音录音区域 - 响应式 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl">
        <div className="max-w-2xl mx-auto px-3 md:px-4 py-4 md:py-6">
          <VoiceRecorder
            onTranscriptComplete={handleTranscriptComplete}
            disabled={isProcessing}
          />
        </div>
      </div>

      {/* 处理中提示 - 居中弹窗 */}
      {isProcessing && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-800">AI正在解析中...</p>
            <p className="text-sm text-gray-500 mt-2">请稍候</p>
          </div>
        </div>
      )}

      {/* 成功提示 - 居中弹窗 */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowSuccess(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">添加成功</h3>
            <p className="text-green-600 font-medium mb-6">✨ 任务已成功添加到列表</p>
            <button
              onClick={() => setShowSuccess(false)}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              太好了
            </button>
          </div>
        </div>
      )}

      {/* 错误提示 - 居中弹窗 */}
      {error && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setError(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full animate-in fade-in zoom-in duration-200">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">出错了</h3>
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>

            <button
              onClick={() => setError(null)}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              我知道了
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
