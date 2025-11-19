'use client';

import { Subject } from '@/lib/types';
import { BookOpen, Calculator, Globe, Beaker, FileText } from 'lucide-react';

interface SubjectIconProps {
  subject: Subject;
  className?: string;
}

export default function SubjectIcon({ subject, className = 'w-6 h-6' }: SubjectIconProps) {
  const getIcon = () => {
    switch (subject) {
      case '语文':
        return <BookOpen className={className} />;
      case '数学':
        return <Calculator className={className} />;
      case '英语':
        return <Globe className={className} />;
      case '科学':
        return <Beaker className={className} />;
      default:
        return <FileText className={className} />;
    }
  };

  const getColor = () => {
    switch (subject) {
      case '语文':
        return 'text-pink-500';
      case '数学':
        return 'text-blue-500';
      case '英语':
        return 'text-purple-500';
      case '科学':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return <div className={getColor()}>{getIcon()}</div>;
}
