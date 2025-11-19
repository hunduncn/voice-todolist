import { NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * 生成讯飞语音识别的WebSocket鉴权URL
 */
export async function GET() {
  try {
    const APPID = process.env.IFLYTEK_APPID;
    const APISecret = process.env.IFLYTEK_API_SECRET;
    const APIKey = process.env.IFLYTEK_API_KEY;

    if (!APPID || !APISecret || !APIKey) {
      return NextResponse.json(
        { error: '讯飞API配置缺失' },
        { status: 500 }
      );
    }

    // WebSocket URL
    const host = 'iat-api.xfyun.cn';
    const path = '/v2/iat';

    // 生成RFC1123格式的时间戳
    const date = new Date().toUTCString();

    // 构建签名原始字符串
    const signatureOrigin = `host: ${host}\ndate: ${date}\nGET ${path} HTTP/1.1`;

    // 使用 APISecret 进行 HMAC-SHA256 加密
    const signature = crypto
      .createHmac('sha256', APISecret)
      .update(signatureOrigin)
      .digest('base64');

    // 构建authorization
    const authorizationOrigin = `api_key="${APIKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`;
    const authorization = Buffer.from(authorizationOrigin).toString('base64');

    // 构建完整的WebSocket URL
    const wsUrl = `wss://${host}${path}?authorization=${encodeURIComponent(authorization)}&date=${encodeURIComponent(date)}&host=${encodeURIComponent(host)}`;

    return NextResponse.json({
      success: true,
      wsUrl,
      appId: APPID,
    });

  } catch (error) {
    console.error('生成讯飞鉴权URL失败:', error);
    return NextResponse.json(
      { error: '生成鉴权URL失败' },
      { status: 500 }
    );
  }
}
