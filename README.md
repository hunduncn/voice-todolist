# 语音Todo - 小学生作业助手

一个专为小学生设计的语音Todo应用，通过语音输入快速记录作业和学习任务，AI自动解析并分类。

## 功能特点

- 🎤 **语音输入**：按住按钮说话，轻松记录任务
- 🤖 **AI解析**：使用DeepSeek AI自动识别科目、任务类型和内容
- 📚 **智能分类**：自动按科目（语文、数学、英语、科学）分组显示
- 🎨 **卡通风格**：简洁可爱的界面设计，适合小学生使用
- 💾 **本地存储**：数据保存在浏览器本地，无需登录
- ✅ **任务管理**：支持完成标记、删除等操作

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **语音识别**: Web Speech API (浏览器原生)
- **AI模型**: DeepSeek
- **图标**: Lucide React

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.local.example` 文件为 `.env.local`：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 文件，填入你的DeepSeek API密钥：

```env
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
```

### 3. 获取DeepSeek API密钥

1. 访问 [DeepSeek开放平台](https://platform.deepseek.com/)
2. 注册/登录账号
3. 在控制台创建API密钥
4. 将密钥填入 `.env.local` 文件

### 4. 启动开发服务器

```bash
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 使用方法

1. **允许麦克风权限**：首次使用时浏览器会请求麦克风权限，请点击"允许"
2. **按住按钮说话**：按住蓝色的麦克风按钮，说出你的作业
3. **松开结束录音**：说完后松开按钮，AI会自动解析
4. **查看任务列表**：解析完成的任务会自动添加到列表中

### 语音输入示例

- "语文一张卷子、数学校本第二单元、英语默写10个单词"
- "今天要复习语文第三单元，还要预习第四单元"
- "数学作业第50页、科学实验报告"

## 浏览器兼容性

语音识别功能需要浏览器支持，推荐使用：

- ✅ Chrome (推荐)
- ✅ Edge
- ✅ Safari (iOS需要15+)
- ❌ Firefox (不支持)

## 项目结构

```
todolist/
├── app/
│   ├── api/
│   │   └── parse-todos/
│   │       └── route.ts          # DeepSeek API调用
│   ├── page.tsx                   # 主页面
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── VoiceRecorder.tsx         # 语音录音组件
│   ├── TodoList.tsx              # Todo列表
│   ├── TodoItem.tsx              # Todo单项
│   └── SubjectIcon.tsx           # 科目图标
├── lib/
│   ├── storage.ts                # localStorage封装
│   ├── speech.ts                 # 语音识别封装
│   └── types.ts                  # TypeScript类型定义
└── package.json
```

## 部署

### Vercel部署（推荐）

1. 将代码推送到GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 在项目设置中添加环境变量 `DEEPSEEK_API_KEY`
4. 部署完成

## 常见问题

### 1. 语音识别不工作？

- 检查浏览器是否支持（使用Chrome/Edge）
- 确保已授予麦克风权限
- 检查网络连接（语音识别需要网络）

### 2. AI解析失败？

- 检查 `.env.local` 文件中的API密钥是否正确
- 确保DeepSeek API有足够的额度
- 检查网络连接

### 3. 任务没有保存？

- 数据保存在浏览器localStorage中
- 清除浏览器数据会导致任务丢失
- 建议定期完成并清理任务

## License

MIT

## 作者

欢迎提出建议和改进意见！
