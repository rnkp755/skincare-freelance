import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { CheckIcon } from 'lucide-react';
import Button from '../UI/Button';
import { Medicine } from '../../contexts/LogContext';

export interface ChatMessageOption {
  text: string;
  value: string;
}

export interface MessageRoutineStep {
  timeOfDay: string;
  steps: string[];
}

export interface ChatMessageData {
  id: string;
  sender: 'user' | 'ai';
  text?: string;
  imageUrl?: string;
  options?: ChatMessageOption[];
  routineSteps?: MessageRoutineStep[];
  medicines?: Medicine[];
  timestamp: Date;
}

interface ChatMessageProps {
  message: ChatMessageData;
  onOptionSelect?: (value: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onOptionSelect }) => {
  const { theme } = useTheme();
  const isUser = message.sender === 'user';
  
  const messageContainerClass = `flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`;
  
  const messageBubbleClass = `rounded-2xl p-3 max-w-[80%] md:max-w-[70%] shadow-sm ${
    isUser
      ? theme === 'dark'
        ? 'bg-teal-700 text-white'
        : 'bg-teal-600 text-white'
      : theme === 'dark'
        ? 'bg-gray-700 text-white'
        : 'bg-white border border-gray-200 text-gray-800'
  }`;
  
  const renderOptions = () => {
    if (!message.options) return null;
    
    return (
      <div className="mt-3 flex flex-wrap gap-2">
        {message.options.map((option, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onOptionSelect && onOptionSelect(option.value)}
            className="animate-fade-in"
          >
            {option.text}
          </Button>
        ))}
      </div>
    );
  };
  
  const renderRoutineSteps = () => {
    if (!message.routineSteps) return null;
    
    return (
      <div className="mt-3 border-t pt-2 border-gray-200 dark:border-gray-600">
        <p className="font-medium mb-2">Suggested Routine:</p>
        {message.routineSteps.map((timeSlot, index) => (
          <div key={index} className="mb-3">
            <h4 className="font-medium text-teal-600 dark:text-teal-400 capitalize">{timeSlot.timeOfDay}:</h4>
            <ul className="ml-4 mt-1">
              {timeSlot.steps.map((step, stepIndex) => (
                <li key={stepIndex} className="flex items-start gap-2 mb-1">
                  <CheckIcon size={16} className="mt-1 text-teal-500 flex-shrink-0" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };
  
  const renderMedicines = () => {
    if (!message.medicines || message.medicines.length === 0) return null;
    
    return (
      <div className="mt-3 border-t pt-2 border-gray-200 dark:border-gray-600">
        <p className="font-medium mb-2">Recommended Medicines:</p>
        <div className="flex overflow-x-auto pb-2 -mx-3 px-3 gap-3 medicine-scroll">
          {message.medicines.map((medicine) => (
            <div 
              key={medicine.id}
              className={`flex-shrink-0 w-36 rounded-lg shadow-sm overflow-hidden ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
              }`}
            >
              <img 
                src={medicine.image} 
                alt={medicine.name} 
                className="w-full h-24 object-cover"
              />
              <div className="p-2">
                <h5 className="font-medium text-sm">{medicine.name}</h5>
                <p className="text-xs opacity-75">{medicine.dosage}</p>
                <p className="text-xs mt-1">{medicine.frequency}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className={messageContainerClass}>
      <div className={messageBubbleClass}>
        {message.text && <p className="whitespace-pre-wrap">{message.text}</p>}
        
        {message.imageUrl && (
          <div className="mt-2 rounded-lg overflow-hidden">
            <img 
              src={message.imageUrl} 
              alt="Message attachment" 
              className="max-w-full rounded-lg"
            />
          </div>
        )}
        
        {renderOptions()}
        {renderRoutineSteps()}
        {renderMedicines()}
        
        <div className={`text-xs mt-1 ${isUser ? 'text-right text-teal-100' : 'text-left opacity-60'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;