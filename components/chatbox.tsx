import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  sender: 'teacher' | 'student1' | 'student2' | 'student3' | 'student4';
  content: string;
}

const avatarMap = {
  teacher: "https://api.dicebear.com/7.x/avataaars/svg?seed=teacher",
  student1: "https://api.dicebear.com/7.x/avataaars/svg?seed=student1",
  student2: "https://api.dicebear.com/7.x/avataaars/svg?seed=student2",
  student3: "https://api.dicebear.com/7.x/avataaars/svg?seed=student3",
  student4: "https://api.dicebear.com/7.x/avataaars/svg?seed=student4",
};

interface ChatBoxProps {
  messages: Message[];
}

const ChatBox = ({ messages }: ChatBoxProps) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [displayMessages, setDisplayMessages] = useState<Message[]>([]);

  // 处理新消息
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      setDisplayMessages(messages);
    }
  }, [messages]);

  // 自动滚动到底部
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [displayMessages]);

  return (
    <div className="flex-1 mb-6 p-6 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
      <h3 className="text-white/90 text-lg mb-4">课堂互动</h3>
      <div 
        ref={messagesContainerRef}
        className="space-y-4 h-[400px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent"
        style={{ 
          overscrollBehavior: 'contain',
          isolation: 'isolate'
        }}
      >
        {displayMessages.map((message, index) => (
          <motion.div
            key={index}
            className={`flex items-start space-x-4 ${
              message.sender === 'teacher' ? '' : 'justify-end'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {message.sender === 'teacher' && (
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 p-0.5 flex-shrink-0">
                <img
                  src={avatarMap.teacher}
                  alt="Teacher"
                  className="w-full h-full rounded-lg"
                />
              </div>
            )}
            <div 
              className={`flex-1 max-w-[70%] p-4 ${
                message.sender === 'teacher' 
                  ? 'bg-white/5' 
                  : 'bg-purple-500/5'
              } rounded-2xl`}
            >
              <div className="text-white/90 markdown-content prose prose-invert prose-sm max-w-none prose-cyan">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
                {/* 添加打字机效果的光标 */}
                <span className="inline-block w-2 h-4 ml-1 bg-cyan-500/50 animate-pulse" />
              </div>
            </div>
            {message.sender !== 'teacher' && (
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-0.5 flex-shrink-0">
                <img
                  src={avatarMap[message.sender]}
                  alt="Student"
                  className="w-full h-full rounded-lg"
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ChatBox;