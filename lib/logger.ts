import fs from 'fs';
import path from 'path';

/**
 * 日志记录工具
 */

const FALLBACK_DIR = '/tmp/logs';

function resolveLogDir() {
  const preferredDir = process.env.LOG_DIR
    || (process.env.VERCEL ? FALLBACK_DIR : path.join(process.cwd(), 'logs'));

  const tryEnsureDir = (dir: string) => {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      return dir;
    } catch (error) {
      console.warn(`日志目录创建失败 (${dir}):`, error);
      return null;
    }
  };

  return tryEnsureDir(preferredDir) ?? (preferredDir === FALLBACK_DIR ? null : tryEnsureDir(FALLBACK_DIR));
}

const LOG_DIR = resolveLogDir();
const LOG_FILE = LOG_DIR ? path.join(LOG_DIR, 'voice-recognition.log') : null;

export function logVoiceRecognition(data: {
  timestamp: string;
  transcript: string;
  aiPrompt?: {
    systemPrompt: string;
    userInput: string;
  };
  aiResponse?: {
    raw: string;
    parsed?: any;
  };
  todos?: any[];
  success: boolean;
  error?: string;
}) {
  try {
    const logEntry = {
      ...data,
      timestamp: new Date().toISOString(),
    };

    // 格式化输出，便于阅读
    const logLine = JSON.stringify(logEntry, null, 2) + '\n' + '='.repeat(80) + '\n';

    if (LOG_FILE) {
      fs.appendFileSync(LOG_FILE, logLine, 'utf-8');
    }

    // 同时输出到控制台
    console.log('📝 语音识别记录:', {
      timestamp: logEntry.timestamp,
      transcript: logEntry.transcript,
      todosCount: logEntry.todos?.length || 0,
      success: logEntry.success,
    });

  } catch (error) {
    console.error('写入日志失败:', error);
  }
}

export function getLogFilePath() {
  return LOG_FILE;
}
