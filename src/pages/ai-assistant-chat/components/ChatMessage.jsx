import React from 'react';
import Icon from '../../../components/AppIcon';

const ChatMessage = ({ message, isUser, timestamp, isTyping = false }) => {
  const formatTime = (date) => {
    return new Date(date)?.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (isTyping) {
    return (
      <div className="flex items-start space-x-3 mb-4">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
          <Icon name="Brain" size={16} color="white" />
        </div>
        <div className="flex-1">
          <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-3 max-w-xs">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1 ml-1">MindBridge is typing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start space-x-3 mb-4 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser 
          ? 'bg-secondary text-white' :'bg-primary text-white'
      }`}>
        <Icon name={isUser ? "User" : "Brain"} size={16} />
      </div>
      <div className="flex-1">
        <div className={`rounded-2xl px-4 py-3 max-w-xs md:max-w-md ${
          isUser 
            ? 'bg-secondary text-white rounded-tr-md ml-auto' :'bg-muted text-foreground rounded-tl-md'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
        </div>
        <p className={`text-xs text-muted-foreground mt-1 ${isUser ? 'text-right mr-1' : 'ml-1'}`}>
          {formatTime(timestamp)}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;