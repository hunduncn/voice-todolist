# 🎤 语音Todo - 小学生作业助手

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

一个专为小学生设计的语音Todo应用，通过语音输入快速记录作业和学习任务，AI自动解析并分类。

[在线演示](#) | [问题反馈](https://github.com/yourusername/voice-todolist/issues) | [功能建议](https://github.com/yourusername/voice-todolist/discussions)

</div>

---

## ✨ 功能特点

- 🎤 **讯飞语音识别**：集成讯飞实时语音转文字API，识别准确率高
- 🤖 **AI智能解析**：使用DeepSeek AI自动识别科目、任务类型和内容
- 📚 **智能分类**：自动按科目（语文、数学、英语、科学）分组显示
- 🎨 **现代UI设计**：简洁美观的界面，响应式设计支持移动端
- 💾 **本地存储**：数据保存在浏览器localStorage中，无需登录
- ✅ **任务管理**：支持完成标记、删除、清空等操作
- 📱 **移动端优化**：完美适配手机和平板设备
- 📝 **详细日志**：记录所有语音识别和AI解析过程，便于调试

## 🛠️ 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| **Next.js** | 14.2+ | React 框架，使用 App Router |
| **TypeScript** | 5.0+ | 类型安全的 JavaScript |
| **Tailwind CSS** | 3.4+ | 实用优先的 CSS 框架 |
| **讯飞语音** | V2 API | 实时语音转文字服务 |
| **DeepSeek** | Chat API | AI 文本解析服务 |
| **Lucide React** | 0.400+ | 现代图标库 |
| **Axios** | 1.7+ | HTTP 客户端 |

## 🚀 快速开始

### 前置要求

- Node.js 18.0 或更高版本
- npm 或 yarn 包管理器
- 讯飞语音识别账号（[注册地址](https://www.xfyun.cn/)）
- DeepSeek API 账号（[注册地址](https://platform.deepseek.com/)）

### 1. 克隆项目

```bash
git clone https://github.com/yourusername/voice-todolist.git
cd voice-todolist
```

### 2. 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 3. 配置环境变量

复制 `.env.local.example` 文件为 `.env.local`：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 文件，填入你的 API 密钥：

```env
# DeepSeek API 配置
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions

# 讯飞语音识别配置
IFLYTEK_APPID=your_iflytek_appid
IFLYTEK_API_KEY=your_iflytek_api_key
IFLYTEK_API_SECRET=your_iflytek_api_secret

# 日志目录（可选，默认为项目根目录的 logs 文件夹）
LOG_DIR=./logs
```

### 4. 获取 API 密钥

#### DeepSeek API

1. 访问 [DeepSeek 开放平台](https://platform.deepseek.com/)
2. 注册/登录账号
3. 在控制台创建 API 密钥
4. 将密钥填入 `.env.local` 文件的 `DEEPSEEK_API_KEY`

#### 讯飞语音识别

1. 访问 [讯飞开放平台](https://www.xfyun.cn/)
2. 注册/登录账号
3. 创建"实时语音转写"应用
4. 获取 APPID、APIKey 和 APISecret
5. 将这三个值填入 `.env.local` 文件

### 5. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 6. 生产构建

```bash
# 构建
npm run build

# 启动生产服务器
npm start
```

## 📖 使用方法

### 基本操作

1. **允许麦克风权限**
   - 首次使用时浏览器会请求麦克风权限
   - 请点击"允许"以启用语音识别功能

2. **录制语音**
   - 按住蓝色的麦克风按钮开始录音
   - 清晰地说出你的作业任务
   - 松开按钮结束录音

3. **AI 解析**
   - 录音结束后，系统会自动调用讯飞语音转文字
   - 然后使用 DeepSeek AI 解析任务内容
   - 解析完成后任务会自动添加到列表

4. **管理任务**
   - 点击圆圈标记任务完成/未完成
   - 点击垃圾桶图标删除单个任务
   - 点击"清空全部"按钮清空所有任务
   - 使用"待办任务"和"已完成"标签切换视图

### 💡 语音输入示例

#### 推荐格式（效果最好）
```
语文一张卷子、数学校本第二单元、英语默写10个单词
```

#### 其他示例
```
今天要复习语文第三单元，还要预习第四单元
数学作业第50页、科学实验报告
语文背诵课文第五课、数学练习册23页到25页
英语作业抄写单词表、科学观察日记
```

### 🎯 最佳实践

- ✅ 在安静的环境下录音，减少背景噪音
- ✅ 清晰、慢速地说出任务，不要过快
- ✅ 使用"、"或"，"来分隔不同的任务
- ✅ 明确说出科目名称（语文、数学、英语、科学）
- ❌ 避免含糊不清的表述
- ❌ 录音时间不要太长（建议10秒内）

## 🌐 浏览器兼容性

### 桌面端

| 浏览器 | 支持程度 | 说明 |
|--------|---------|------|
| Chrome | ✅ 完全支持 | 推荐使用（最佳体验） |
| Edge | ✅ 完全支持 | 基于 Chromium |
| Safari | ⚠️ 部分支持 | macOS 需要最新版本 |
| Firefox | ❌ 不支持 | 不支持 Web Speech API |

### 移动端

| 平台 | 浏览器 | 支持程度 | 说明 |
|------|--------|---------|------|
| iOS | Safari | ✅ 支持 | iOS 15+ |
| iOS | Chrome | ⚠️ 受限 | 实际使用 Safari 引擎 |
| Android | Chrome | ✅ 支持 | 推荐使用 |
| Android | Firefox | ❌ 不支持 | - |

> **注意**: 语音识别功能需要 HTTPS 连接（localhost 除外）

## 📁 项目结构

```
voice-todolist/
├── app/                          # Next.js App Router 目录
│   ├── api/                      # API 路由
│   │   ├── iflytek-auth/
│   │   │   └── route.ts         # 讯飞语音 WebSocket 鉴权
│   │   └── parse-todos/
│   │       └── route.ts         # DeepSeek AI 解析 API
│   ├── page.tsx                 # 主页面（客户端组件）
│   ├── layout.tsx               # 根布局
│   └── globals.css              # 全局样式
│
├── components/                   # React 组件
│   ├── VoiceRecorder.tsx        # 语音录音组件（讯飞）
│   ├── TodoList.tsx             # Todo 列表组件
│   ├── TodoItem.tsx             # Todo 单项组件
│   └── SubjectIcon.tsx          # 科目图标组件
│
├── lib/                         # 工具库
│   ├── iflytek-speech.ts        # 讯飞语音识别客户端
│   ├── speech.ts                # 语音识别抽象层（已废弃）
│   ├── storage.ts               # localStorage 操作封装
│   ├── logger.ts                # 日志记录工具
│   └── types.ts                 # TypeScript 类型定义
│
├── logs/                        # 日志文件（自动生成）
│   └── voice-recognition.log    # 语音识别日志
│
├── public/                      # 静态资源
├── .env.local                   # 环境变量（需自行创建）
├── .env.local.example           # 环境变量示例
├── next.config.js               # Next.js 配置
├── tailwind.config.ts           # Tailwind CSS 配置
├── tsconfig.json                # TypeScript 配置
└── package.json                 # 项目依赖
```

### 核心文件说明

| 文件 | 说明 |
|------|------|
| `app/page.tsx` | 主应用界面，处理状态管理和用户交互 |
| `lib/iflytek-speech.ts` | 讯飞语音识别 WebSocket 客户端实现 |
| `app/api/iflytek-auth/route.ts` | 生成讯飞 WebSocket 鉴权 URL |
| `app/api/parse-todos/route.ts` | 调用 DeepSeek AI 解析语音文本 |
| `lib/storage.ts` | 封装 localStorage CRUD 操作 |
| `lib/logger.ts` | 日志记录，保存识别过程到文件 |

## 🚢 部署

### Vercel 部署（推荐）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/voice-todolist)

#### 手动部署步骤

1. **推送代码到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **在 Vercel 导入项目**
   - 访问 [Vercel](https://vercel.com)
   - 点击 "New Project"
   - 导入你的 GitHub 仓库

3. **配置环境变量**
   在 Vercel 项目设置中添加以下环境变量：
   ```
   DEEPSEEK_API_KEY=your_key
   DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
   IFLYTEK_APPID=your_appid
   IFLYTEK_API_KEY=your_key
   IFLYTEK_API_SECRET=your_secret
   ```

4. **部署**
   - 点击 "Deploy"
   - 等待构建完成

5. **配置域名（可选）**
   - 在 Vercel 项目设置中配置自定义域名
   - 确保域名支持 HTTPS（语音识别必需）

### Docker 部署

```bash
# 构建镜像
docker build -t voice-todolist .

# 运行容器
docker run -p 3000:3000 \
  -e DEEPSEEK_API_KEY=your_key \
  -e IFLYTEK_APPID=your_appid \
  -e IFLYTEK_API_KEY=your_key \
  -e IFLYTEK_API_SECRET=your_secret \
  voice-todolist
```

### 自托管

```bash
# 安装依赖
npm install

# 构建
npm run build

# 使用 PM2 运行
npm install -g pm2
pm2 start npm --name "voice-todolist" -- start

# 或使用 systemd
# 创建服务文件 /etc/systemd/system/voice-todolist.service
```

## ❓ 常见问题

### 1. 语音识别不工作？

**可能原因**：
- ❌ 浏览器不支持（Firefox 不支持）
- ❌ 未授予麦克风权限
- ❌ 使用 HTTP 而非 HTTPS（生产环境）
- ❌ 讯飞 API 配置错误

**解决方案**：
```bash
# 检查浏览器控制台错误信息
# 确认环境变量配置正确
# 在 Chrome DevTools 检查麦克风权限
```

### 2. AI 解析失败？

**可能原因**：
- ❌ DeepSeek API 密钥无效
- ❌ API 额度不足
- ❌ 网络连接问题
- ❌ 语音识别结果为空

**解决方案**：
```bash
# 检查 logs/voice-recognition.log 日志文件
# 验证 API 密钥是否正确
# 查看 DeepSeek 控制台剩余额度
```

### 3. 任务数据丢失？

**原因**：
- 数据存储在浏览器 localStorage
- 清除浏览器数据会删除任务
- 不同浏览器数据不共享

**建议**：
- 定期完成并清理已完成任务
- 重要任务手动备份
- 考虑添加云端同步功能（未来计划）

### 4. 移动端体验问题？

**iOS 注意事项**：
- 必须使用 Safari 浏览器
- iOS 版本需要 15 或更高
- 某些情况下需要用户手动触发

**Android 注意事项**：
- 推荐使用 Chrome 浏览器
- 确保授予麦克风权限
- 某些国产浏览器可能不支持

### 5. Vercel 部署后日志不显示？

**原因**：
- Vercel 是 serverless 环境，文件系统是只读的
- 日志会自动使用 `/tmp/logs` 目录

**查看日志**：
```bash
# 在 Vercel 控制台查看 Function Logs
# 或使用 Vercel CLI
vercel logs your-project-url
```

## 🔧 开发指南

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 类型检查
npm run build

# Lint 检查
npm run lint
```

### 添加新功能

参考项目的模块化设计：

1. **添加新的 Todo 类型**
   - 修改 `lib/types.ts` 中的 `TodoType`
   - 更新 `components/TodoItem.tsx` 的样式映射

2. **添加新的科目**
   - 修改 `lib/types.ts` 中的 `Subject`
   - 更新 `components/SubjectIcon.tsx` 图标映射
   - 修改 DeepSeek prompt（`app/api/parse-todos/route.ts`）

3. **更换语音识别服务**
   - 实现新的识别客户端（参考 `lib/iflytek-speech.ts`）
   - 修改 `components/VoiceRecorder.tsx` 引用

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 贡献流程

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 License

本项目基于 [MIT License](LICENSE) 开源。

## 👨‍💻 作者

- 项目维护者：[Your Name](https://github.com/yourusername)
- 欢迎提出建议和改进意见！
- 如有问题请提交 [Issue](https://github.com/yourusername/voice-todolist/issues)

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [讯飞开放平台](https://www.xfyun.cn/) - 语音识别服务
- [DeepSeek](https://www.deepseek.com/) - AI 模型
- [Lucide](https://lucide.dev/) - 图标库

---

<div align="center">

**如果这个项目对你有帮助，请给一个 ⭐ Star！**

Made with ❤️ by [Your Name]

</div>
