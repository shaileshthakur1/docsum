import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const MAX_MESSAGE_HISTORY = 100;

export function Chat({ initialMessage }: { initialMessage?: string }) {
  const [messages, setMessages] = useState<Message[]>(
    initialMessage ? [{ role: 'assistant', content: initialMessage }] : []
  );
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const formatSummary = (text: string) => {
    return text.replace(/\.\s+/g, '.\n');  
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
  
    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
  
    const limitedMessages = [...messages.slice(-MAX_MESSAGE_HISTORY), userMessage];
  
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: limitedMessages }),
      });
  
      if (!response.ok) {
        let errorMessage = response.statusText;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          console.error("Error parsing JSON:", parseError);
        }
        throw new Error(`Failed to fetch response: ${errorMessage}`);
      }
  
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');
  
      let assistantContent = ''; // Temporary variable for the assistant message content
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
  
        const chunk = new TextDecoder().decode(value);
        assistantContent += formatSummary(chunk);
  
        setMessages((prev) => [
          ...prev.slice(0, -1), // Remove the placeholder last message
          { role: 'assistant', content: assistantContent },
        ]);
      }
    } catch (error) {
      console.error('Error in chat:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Sorry, there was an error processing your request: ${(error as Error).message}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="flex flex-col h-[600px] border rounded-lg">
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
          >
            <span
              className={`inline-block p-2 rounded-lg ${
                message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}
            >
              {message.content}
            </span>
          </div>
        ))}
      </ScrollArea>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </form>
    </div>
  );
}
