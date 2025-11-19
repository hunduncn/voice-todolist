'use client';

import { useState, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { IFlyTekRecognition } from '@/lib/iflytek-speech';

interface VoiceRecorderProps {
  onTranscriptComplete: (transcript: string) => void;
  disabled?: boolean;
}

export default function VoiceRecorder({ onTranscriptComplete, disabled }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<IFlyTekRecognition | null>(null);
  const finalTranscriptRef = useRef<string>('');

  const handleMouseDown = () => {
    if (disabled) {
      return;
    }

    setError(null);
    setTranscript('');
    finalTranscriptRef.current = '';

    // 创建讯飞识别实例
    recognitionRef.current = new IFlyTekRecognition({
      onResult: (text, isFinal) => {
        setTranscript(text);
        finalTranscriptRef.current = text;
      },
      onError: (errorMsg) => {
        setError(errorMsg);
        setIsRecording(false);
      },
      onStart: () => {
        setIsRecording(true);
      },
      onEnd: () => {
        setIsRecording(false);
        // 在识别真正结束时调用回调，使用最终的transcript
        if (finalTranscriptRef.current.trim()) {
          onTranscriptComplete(finalTranscriptRef.current);
        }
      },
    });

    // 启动识别
    recognitionRef.current.start();
  };

  const handleMouseUp = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
  };

  const handleMouseLeave = () => {
    if (isRecording) {
      handleMouseUp();
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-3 md:gap-4">
        {/* 录音按钮 - 响应式尺寸 */}
        <button
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          disabled={disabled}
          className={`
            relative w-20 h-20 md:w-32 md:h-32 rounded-full shadow-xl transition-all duration-200
            flex items-center justify-center
            ${isRecording
              ? 'bg-red-500 scale-110 animate-pulse'
              : 'bg-gradient-to-br from-blue-400 to-blue-600 hover:scale-105'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
          `}
        >
          {/* 波纹效果 */}
          {isRecording && (
            <>
              <span className="absolute inset-0 rounded-full bg-red-400 opacity-75 animate-ping" />
              <span className="absolute inset-0 rounded-full bg-red-400 opacity-50 animate-pulse" />
            </>
          )}

          <Mic className="w-10 h-10 md:w-16 md:h-16 text-white z-10" />
        </button>

        {/* 提示文字 - 响应式字体 */}
        <div className="text-center">
          {isRecording ? (
            <p className="text-sm md:text-lg font-bold text-red-500 animate-pulse">
              正在录音...松开结束
            </p>
          ) : (
            <p className="text-sm md:text-base text-gray-600">
              按住按钮说话
            </p>
          )}
        </div>
      </div>

      {/* 错误提示 - 居中弹窗 */}
      {error && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          {/* 半透明背景 */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setError(null)}
          />

          {/* 错误弹窗 */}
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full animate-in fade-in zoom-in duration-200">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MicOff className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">无法访问麦克风</h3>
              <p className="text-red-600 text-sm font-medium mb-4">{error}</p>
            </div>

            {error.includes('麦克风') && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">解决方法：</p>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>• 请确保已授予浏览器麦克风权限</p>
                  <p>• iOS设备请使用Safari浏览器</p>
                  <p>• Android设备推荐使用Chrome浏览器</p>
                </div>
              </div>
            )}

            <button
              onClick={() => setError(null)}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              我知道了
            </button>
          </div>
        </div>
      )}
    </>
  );
}
