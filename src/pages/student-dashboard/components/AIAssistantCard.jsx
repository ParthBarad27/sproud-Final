import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AIAssistantCard = () => {
  const [isTyping, setIsTyping] = useState(false);

  const recentMessages = [
    {
      id: 1,
      type: "ai",
      message: "How are you feeling today? I\'m here to listen and support you.",
      timestamp: "2 minutes ago"
    },
    {
      id: 2,
      type: "user",
      message: "I\'ve been feeling anxious about my upcoming exams.",
      timestamp: "5 minutes ago"
    },
    {
      id: 3,
      type: "ai",
      message: "I understand exam anxiety can be overwhelming. Let\'s work through some coping strategies together.",
      timestamp: "6 minutes ago"
    }
  ];

  const handleQuickResponse = (response) => {
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 2000);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Icon name="Bot" size={20} color="white" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">AI Assistant</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-xs text-muted-foreground">Online 24/7</span>
            </div>
          </div>
        </div>
        <Link to="/ai-assistant-chat">
          <Button variant="ghost" size="sm" iconName="ExternalLink" iconSize={16}>
            Open Chat
          </Button>
        </Link>
      </div>
      <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
        {recentMessages?.map((msg) => (
          <div
            key={msg?.id}
            className={`flex ${msg?.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                msg?.type === 'user' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground'
              }`}
            >
              <p>{msg?.message}</p>
              <p className="text-xs opacity-70 mt-1">{msg?.timestamp}</p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted px-3 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground mb-2">Quick responses:</p>
        <div className="flex flex-wrap gap-2">
          {["I'm feeling stressed", "Need study tips", "Can't sleep well", "Feeling lonely"]?.map((response) => (
            <Button
              key={response}
              variant="outline"
              size="xs"
              onClick={() => handleQuickResponse(response)}
              className="text-xs"
            >
              {response}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIAssistantCard;