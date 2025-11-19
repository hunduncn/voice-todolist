import { SpeechRecognition, SpeechRecognitionEvent } from './types';

/**
 * 检查浏览器是否支持语音识别
 */
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}

/**
 * 创建语音识别实例
 */
export function createSpeechRecognition(): SpeechRecognition | null {
  if (!isSpeechRecognitionSupported()) {
    return null;
  }

  const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognitionAPI();

  // 配置识别参数
  recognition.continuous = false; // 不连续识别
  recognition.interimResults = true; // 返回中间结果
  recognition.lang = 'zh-CN'; // 中文识别
  recognition.maxAlternatives = 1;

  return recognition;
}

/**
 * 语音识别Hook配置
 */
export interface UseSpeechRecognitionConfig {
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

/**
 * 开始语音识别
 */
export function startRecognition(
  recognition: SpeechRecognition,
  config: UseSpeechRecognitionConfig
): void {
  let finalTranscript = '';

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let interimTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;

      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }

    const currentTranscript = finalTranscript + interimTranscript;
    const isFinal = event.results[event.results.length - 1].isFinal;

    config.onResult?.(currentTranscript, isFinal);
  };

  recognition.onerror = (event: any) => {
    let errorMessage = '语音识别出错';

    switch (event.error) {
      case 'no-speech':
        errorMessage = '未检测到语音';
        break;
      case 'audio-capture':
        errorMessage = '无法访问麦克风';
        break;
      case 'not-allowed':
        errorMessage = '麦克风权限被拒绝';
        break;
      case 'network':
        errorMessage = '网络错误';
        break;
      default:
        errorMessage = `识别错误: ${event.error}`;
    }

    config.onError?.(errorMessage);
  };

  recognition.onstart = () => {
    config.onStart?.();
  };

  recognition.onend = () => {
    config.onEnd?.();
  };

  try {
    recognition.start();
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : '无法启动语音识别';
    config.onError?.(`启动失败: ${errorMsg}。请确保已授予麦克风权限。`);
  }
}

/**
 * 停止语音识别
 */
export function stopRecognition(recognition: SpeechRecognition): void {
  try {
    recognition.stop();
  } catch (error) {
    console.error('Failed to stop recognition:', error);
  }
}
