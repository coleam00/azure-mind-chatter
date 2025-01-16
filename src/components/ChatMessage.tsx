import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  content: string;
  isAI: boolean;
}

export const ChatMessage = ({ content, isAI }: ChatMessageProps) => {
  return (
    <div className={cn(
      "py-4 px-6",
      isAI ? "bg-secondary" : "bg-background"
    )}>
      <div className="max-w-3xl mx-auto">
        {isAI ? (
          <div className="markdown-content">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <p>{content}</p>
        )}
      </div>
    </div>
  );
};