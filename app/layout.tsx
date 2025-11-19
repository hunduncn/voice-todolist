import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '语音Todo - 小学生作业助手',
  description: '通过语音快速记录作业和学习任务',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
