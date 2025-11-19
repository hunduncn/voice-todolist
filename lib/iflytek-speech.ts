/**
 * 讯飞语音识别客户端
 */

export interface IFlyTekConfig {
  onResult?: (text: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export class IFlyTekRecognition {
  private ws: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private config: IFlyTekConfig;
  private isRecording = false;
  private resultText = '';
  private hasEnded = false;
  private finalResult = ''; // 保存最终结果
  private accumulatedText = ''; // 累积所有识别结果
  private pendingCloseTimer: NodeJS.Timeout | null = null; // 延迟关闭定时器

  constructor(config: IFlyTekConfig) {
    this.config = config;
  }

  async start() {
    try {
      // 重置状态
      this.hasEnded = false;
      this.resultText = '';
      this.finalResult = '';
      this.accumulatedText = '';

      // 清理之前的定时器
      if (this.pendingCloseTimer) {
        clearTimeout(this.pendingCloseTimer);
        this.pendingCloseTimer = null;
      }

      // 获取鉴权URL
      const authResponse = await fetch('/api/iflytek-auth');
      const authData = await authResponse.json();

      if (!authData.success) {
        throw new Error(authData.error || '获取鉴权失败');
      }

      // 创建WebSocket连接
      this.ws = new WebSocket(authData.wsUrl);

      this.ws.onopen = () => {
        this.sendStartParams(authData.appId);
        this.startRecording();
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(event.data);
      };

      this.ws.onerror = () => {
        this.config.onError?.('语音识别连接失败');
        this.stop();
      };

      this.ws.onclose = () => {
        // 如果还没有调用过onEnd，则在这里调用
        if (!this.hasEnded) {
          this.hasEnded = true;

          // 使用累积的最完整结果
          if (this.accumulatedText || this.finalResult) {
            const finalText = this.accumulatedText || this.finalResult;
            this.config.onResult?.(finalText, true);
          }

          // 延迟调用onEnd，确保结果已传递
          setTimeout(() => {
            this.config.onEnd?.();
          }, 100);
        }
      };

    } catch (error) {
      this.config.onError?.(error instanceof Error ? error.message : '启动失败');
    }
  }

  private sendStartParams(appId: string) {
    if (!this.ws) return;

    const params = {
      common: {
        app_id: appId,
      },
      business: {
        language: 'zh_cn',
        domain: 'iat',
        accent: 'mandarin',
        vad_eos: 10000, // 增加到10秒，给更多时间检测语音结束
        dwa: 'wpgs',
      },
      data: {
        status: 0,
        format: 'audio/L16;rate=16000',
        encoding: 'raw',
      },
    };

    this.ws.send(JSON.stringify(params));
  }

  private async startRecording() {
    try {
      // 获取麦克风权限
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
        },
      });

      // 创建音频上下文
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000,
      });

      const source = this.audioContext.createMediaStreamSource(this.mediaStream);

      // 创建音频处理器
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);

      this.processor.onaudioprocess = (e) => {
        if (!this.isRecording || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
          return;
        }

        const inputData = e.inputBuffer.getChannelData(0);
        const pcmData = this.convertFloat32ToInt16(inputData);

        // 发送音频数据
        this.sendAudioData(pcmData);
      };

      source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);

      this.isRecording = true;
      this.config.onStart?.();

    } catch (error) {
      this.config.onError?.('无法访问麦克风');
    }
  }

  private convertFloat32ToInt16(float32Array: Float32Array): Int16Array {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return int16Array;
  }

  private sendAudioData(audioData: Int16Array) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const params = {
      data: {
        status: 1,
        format: 'audio/L16;rate=16000',
        encoding: 'raw',
        audio: this.arrayBufferToBase64(audioData.buffer),
      },
    };

    this.ws.send(JSON.stringify(params));
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private handleMessage(message: string) {
    try {
      const data = JSON.parse(message);

      if (data.code !== 0) {
        this.config.onError?.(data.message || '识别失败');
        return;
      }

      if (data.data && data.data.result) {
        const { ws } = data.data.result;
        if (ws) {
          // 提取当前这次返回的文本片段
          let currentText = '';
          ws.forEach((item: any) => {
            item.cw.forEach((word: any) => {
              currentText += word.w;
            });
          });

          const isFinal = data.data.status === 2;

          if (!isFinal) {
            // 非最终结果：累积文本
            // 只累积有意义的内容（不是纯标点符号）
            if (currentText && currentText.trim().length > 0) {
              // 讯飞返回的是完整的已识别文本，不是增量，所以直接使用
              this.accumulatedText = currentText;
              this.resultText = currentText;

              // 保存有效内容（非纯标点）
              if (currentText.trim().length > 1) {
                this.finalResult = currentText;
              }
            }
            this.config.onResult?.(this.accumulatedText, false);
          } else {
            // 最终结果：使用累积的最完整的文本
            if (currentText && currentText.trim().length > 1) {
              // 最终消息有有效内容，使用它
              this.accumulatedText = currentText;
              this.resultText = currentText;
            } else if (this.finalResult) {
              // 最终消息只有标点或为空，使用之前保存的最佳结果
              this.resultText = this.finalResult;
              this.accumulatedText = this.finalResult;
            }

            this.config.onResult?.(this.accumulatedText, true);

            // 收到最终结果后，延迟一点时间再调用onEnd，确保所有数据都已处理
            if (!this.hasEnded) {
              this.hasEnded = true;

              // 延迟200ms调用onEnd，确保结果稳定
              this.pendingCloseTimer = setTimeout(() => {
                this.config.onEnd?.();
                this.cleanup();
              }, 200);
            }
          }
        }
      }
    } catch (error) {
      // 静默处理错误
    }
  }

  stop() {
    // 保存当前的累积识别结果
    this.finalResult = this.accumulatedText || this.resultText;

    // 停止录音
    this.isRecording = false;

    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }

    if (this.audioContext) {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    // 发送结束标识，等待讯飞返回最终结果
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const endParams = {
        data: {
          status: 2,
          format: 'audio/L16;rate=16000',
          encoding: 'raw',
          audio: '',
        },
      };
      this.ws.send(JSON.stringify(endParams));
      // 不立即关闭WebSocket，等待最终结果
    }
  }

  private cleanup() {
    // 清理定时器
    if (this.pendingCloseTimer) {
      clearTimeout(this.pendingCloseTimer);
      this.pendingCloseTimer = null;
    }

    // 关闭WebSocket
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    // 不清空 accumulatedText 和 finalResult，保留到下次 start
    this.resultText = '';
  }
}
