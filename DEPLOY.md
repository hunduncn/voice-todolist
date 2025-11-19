# 部署到Vercel指南

本指南将帮助您将语音Todo应用部署到Vercel，从而获得HTTPS访问，以便在手机上测试麦克风功能。

## 前置准备

1. 注册一个GitHub账号（如果还没有）：https://github.com
2. 注册一个Vercel账号（如果还没有）：https://vercel.com

## 第一步：初始化Git仓库

在项目根目录执行以下命令：

```bash
# 初始化git仓库
git init

# 添加所有文件到暂存区
git add .

# 创建第一次提交
git commit -m "Initial commit: Voice Todo App"
```

## 第二步：创建GitHub仓库并推送代码

### 2.1 在GitHub上创建新仓库

1. 访问 https://github.com/new
2. 仓库名称：`voice-todolist` （或其他你喜欢的名称）
3. 选择 **Private**（私有仓库，推荐）或 **Public**（公开仓库）
4. **不要**勾选 "Add a README file"、"Add .gitignore"、"Choose a license"
5. 点击 "Create repository"

### 2.2 推送代码到GitHub

GitHub会显示推送代码的命令，复制并执行：

```bash
# 添加远程仓库（替换YOUR_USERNAME为你的GitHub用户名）
git remote add origin https://github.com/YOUR_USERNAME/voice-todolist.git

# 推送代码
git branch -M main
git push -u origin main
```

## 第三步：在Vercel上部署

### 3.1 导入GitHub项目

1. 访问 https://vercel.com
2. 点击右上角 "Log in" 登录（建议用GitHub账号登录）
3. 登录后，点击 "Add New..." → "Project"
4. 在 "Import Git Repository" 页面，找到你的 `voice-todolist` 仓库
5. 点击 "Import"

### 3.2 配置项目设置

在配置页面：

1. **Project Name**: 保持默认或修改为你喜欢的名称
2. **Framework Preset**: 自动检测为 "Next.js"（无需修改）
3. **Root Directory**: 保持默认 "./"
4. **Build and Output Settings**: 保持默认

### 3.3 配置环境变量 ⚠️ 重要

展开 "Environment Variables" 部分，添加你的讯飞语音识别API密钥：

需要添加的环境变量（从你的 `.env.local` 文件中复制）：

| Name | Value |
|------|-------|
| `IFLYTEK_APP_ID` | 你的讯飞APP ID |
| `IFLYTEK_API_SECRET` | 你的讯飞API Secret |
| `IFLYTEK_API_KEY` | 你的讯飞API Key |

**如何查看你的环境变量：**

在项目根目录执行：
```bash
cat .env.local
```

复制显示的值，粘贴到Vercel的环境变量配置中。

### 3.4 开始部署

1. 确认环境变量已正确配置
2. 点击 "Deploy" 按钮
3. 等待部署完成（通常需要1-3分钟）

## 第四步：访问您的应用

部署成功后：

1. Vercel会显示一个类似 `https://voice-todolist.vercel.app` 的URL
2. 点击 "Visit" 或直接访问该URL
3. 现在您的应用已经支持HTTPS，可以在手机上测试麦克风功能了！

## 测试麦克风功能

在手机上：

1. 打开浏览器（iOS用Safari，Android用Chrome）
2. 访问你的Vercel部署地址
3. 点击录音按钮
4. 浏览器会弹出麦克风权限请求，点击"允许"
5. 现在可以使用语音输入功能了！

## 后续更新代码

当你修改代码后，只需要：

```bash
# 提交更改
git add .
git commit -m "描述你的修改"

# 推送到GitHub
git push
```

Vercel会自动检测到代码变化并重新部署！

## 常见问题

### Q: 部署后麦克风还是无法使用？
A:
- 确保使用的是Vercel提供的HTTPS地址
- iOS必须使用Safari浏览器
- 确保允许了浏览器的麦克风权限

### Q: 部署失败，显示环境变量错误？
A:
- 检查Vercel上的环境变量是否正确配置
- 确保所有3个讯飞API变量都已添加

### Q: 如何查看部署日志？
A:
- 在Vercel项目页面，点击 "Deployments"
- 点击最新的部署记录
- 可以查看详细的构建日志

### Q: 想要自定义域名？
A:
- 在Vercel项目设置中，找到 "Domains"
- 添加你的自定义域名
- 按照提示配置DNS记录

## 需要帮助？

如果遇到问题，可以：
1. 查看Vercel的部署日志
2. 检查浏览器控制台的错误信息
3. 确认环境变量配置正确

---

祝部署顺利！🚀
