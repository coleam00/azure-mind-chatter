import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ConversationListProps {
  onSelect: (sessionId: string) => void;
  currentSessionId?: string;
}

export const ConversationList = ({ onSelect, currentSessionId }: ConversationListProps) => {
  const [conversations, setConversations] = useState<Array<{ session_id: string; title: string }>>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const fetchConversations = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('session_id, message')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching conversations:', error);
        return;
      }

      // Group by session_id and get first message
      const conversationMap = data.reduce((acc: any, curr) => {
        if (!acc[curr.session_id]) {
          const content = curr.message.content;
          acc[curr.session_id] = {
            session_id: curr.session_id,
            title: content.substring(0, 100) + (content.length > 100 ? '...' : '')
          };
        }
        return acc;
      }, {});

      setConversations(Object.values(conversationMap));
    };

    fetchConversations();
  }, []);

  if (isCollapsed) {
    return (
      <div className="w-12 border-r border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(false)}
          className="w-12 h-12"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-80 border-r border-border">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="font-semibold">Conversations</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(true)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-5rem)]">
        <div className="p-2">
          {conversations.map((conv) => (
            <Button
              key={conv.session_id}
              variant={currentSessionId === conv.session_id ? "secondary" : "ghost"}
              className="w-full justify-start mb-1"
              onClick={() => onSelect(conv.session_id)}
            >
              <span className="truncate">{conv.title}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};