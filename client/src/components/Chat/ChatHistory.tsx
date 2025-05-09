import React from 'react';
import { X } from 'lucide-react';
import { ChatMessageData } from './ChatMessage';
import { useTheme } from '../../contexts/ThemeContext';

interface ChatHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  history: ChatMessageData[][];
  onSelectChat: (index: number) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ 
  isOpen, 
  onClose, 
  history, 
  onSelectChat 
}) => {
  const { theme } = useTheme();
  
  if (!isOpen) return null;
  
  return (
    <div 
      className={`fixed inset-0 z-50 ${theme === 'dark' ? 'bg-gray-900/80' : 'bg-black/50'}`}
      onClick={onClose}
    >
      <div 
        className={`absolute right-0 top-0 bottom-0 w-full max-w-md p-4 overflow-y-auto ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Chat History</h2>
          <button 
            onClick={onClose}
            className={`p-2 rounded-full ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          {history.map((chat, index) => {
            // Get first few messages to show as preview
            const firstMsg = chat.find(msg => msg.text)?.text || "Chat session";
            const date = chat[0]?.timestamp.toLocaleDateString();
            
            return (
              <div 
                key={index}
                className={`p-4 rounded-lg cursor-pointer ${
                  theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => {
                  onSelectChat(index);
                  onClose();
                }}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium">Chat {index + 1}</h3>
                  <span className="text-xs opacity-70">{date}</span>
                </div>
                <p className="text-sm opacity-80 line-clamp-2">{firstMsg}</p>
              </div>
            );
          })}
          
          {history.length === 0 && (
            <div className="text-center py-8 opacity-70">
              <p>No chat history yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;