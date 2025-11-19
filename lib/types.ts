// Todo项的类型
export type TodoType = '作业' | '复习' | '预习' | '其他';

// 科目类型
export type Subject = '语文' | '数学' | '英语' | '科学' | '其他';

// Todo项数据结构
export interface TodoItem {
  id: string;
  subject: Subject;
  content: string;
  type: TodoType;
  completed: boolean;
  createdAt: string;
}

// 语音识别结果
export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

// AI解析请求
export interface ParseTodoRequest {
  text: string;
}

// AI解析响应
export interface ParseTodoResponse {
  todos: Omit<TodoItem, 'id' | 'createdAt' | 'completed'>[];
  success: boolean;
  error?: string;
}

// Web Speech API类型扩展
export interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

export interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

export interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: Event) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}
