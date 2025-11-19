import { NextRequest, NextResponse } from 'next/server';
import { ParseTodoRequest, ParseTodoResponse } from '@/lib/types';
import { logVoiceRecognition } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const { text }: ParseTodoRequest = await request.json();

    if (!text || text.trim() === '') {
      return NextResponse.json(
        { success: false, error: '文本不能为空', todos: [] },
        { status: 400 }
      );
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    const apiUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'DeepSeek API密钥未配置', todos: [] },
        { status: 500 }
      );
    }

    // 系统提示词
    const systemPrompt = `你是一个专业的小学生作业助手。请从用户的语音输入中识别出待办事项（todo list）。

要求：
1. 识别出每个科目的任务（语文、数学、英语、科学等）
2. 识别任务类型：作业、复习、预习、其他
3. 提取任务的具体内容

请以JSON格式返回，格式如下：
{
  "todos": [
    {
      "subject": "语文",
      "content": "一张卷子",
      "type": "作业"
    },
    {
      "subject": "数学",
      "content": "校本第二单元",
      "type": "作业"
    }
  ]
}

注意：
- subject必须是：语文、数学、英语、科学、其他 之一
- type必须是：作业、复习、预习、其他 之一
- content是任务的具体描述
- 只返回JSON，不要其他说明文字`;

    // 调用DeepSeek API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API error:', errorText);
      return NextResponse.json(
        { success: false, error: `API调用失败: ${response.statusText}`, todos: [] },
        { status: response.status }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      return NextResponse.json(
        { success: false, error: 'AI未返回有效响应', todos: [] },
        { status: 500 }
      );
    }

    // 解析AI返回的JSON
    let parsedResult;
    try {
      // 尝试提取JSON（有时AI会返回额外的文字）
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[0]);
      } else {
        parsedResult = JSON.parse(aiResponse);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      return NextResponse.json(
        { success: false, error: 'AI返回格式错误', todos: [] },
        { status: 500 }
      );
    }

    const result: ParseTodoResponse = {
      success: true,
      todos: parsedResult.todos || [],
    };

    // 记录到日志文件
    logVoiceRecognition({
      timestamp: new Date().toISOString(),
      transcript: text,
      aiPrompt: {
        systemPrompt,
        userInput: text,
      },
      aiResponse: {
        raw: aiResponse,
        parsed: parsedResult,
      },
      todos: result.todos,
      success: true,
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('Parse todos error:', error);

    // 记录错误到日志文件
    logVoiceRecognition({
      timestamp: new Date().toISOString(),
      transcript: '',
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
    });

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
        todos: [],
      },
      { status: 500 }
    );
  }
}
