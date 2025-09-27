import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ConversationHistory = ({ isVisible, onClose, onLoadConversation }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const conversationHistory = [
    {
      id: 1,
      date: new Date(Date.now() - 86400000),
      title: "Exam Anxiety Discussion",
      preview: "I\'m feeling really stressed about my upcoming finals...",
      messageCount: 23,
      duration: "45 min",
      mood: "anxious",
      tags: ["anxiety", "academics", "coping"]
    },
    {
      id: 2,
      date: new Date(Date.now() - 172800000),
      title: "Sleep Issues & Study Balance",
      preview: "I\'ve been having trouble sleeping lately because...",
      messageCount: 18,
      duration: "32 min",
      mood: "tired",
      tags: ["sleep", "balance", "wellness"]
    },
    {
      id: 3,
      date: new Date(Date.now() - 259200000),
      title: "Social Anxiety at College",
      preview: "Making friends in college has been really difficult...",
      messageCount: 31,
      duration: "52 min",
      mood: "lonely",
      tags: ["social", "friendship", "college"]
    },
    {
      id: 4,
      date: new Date(Date.now() - 432000000),
      title: "Family Pressure Discussion",
      preview: "My parents have high expectations and I feel...",
      messageCount: 27,
      duration: "41 min",
      mood: "stressed",
      tags: ["family", "pressure", "expectations"]
    }
  ];

  const moodColors = {
    anxious: "text-warning bg-warning/10",
    tired: "text-muted-foreground bg-muted/20",
    lonely: "text-primary bg-primary/10",
    stressed: "text-destructive bg-destructive/10",
    happy: "text-success bg-success/10"
  };

  const filteredHistory = conversationHistory?.filter(conv =>
    conv?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    conv?.preview?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    conv?.tags?.some(tag => tag?.toLowerCase()?.includes(searchTerm?.toLowerCase()))
  );

  const formatDate = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date?.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short',
      year: date?.getFullYear() !== now?.getFullYear() ? 'numeric' : undefined
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <Icon name="History" size={20} className="text-primary" />
            <div>
              <h2 className="font-semibold text-foreground">Conversation History</h2>
              <p className="text-xs text-muted-foreground">Your private chat sessions</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <Icon name="X" size={16} />
          </Button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations, topics, or moods..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredHistory?.length === 0 ? (
            <div className="text-center py-8">
              <Icon name="MessageCircle" size={48} className="mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                {searchTerm ? 'No conversations found matching your search' : 'No conversation history yet'}
              </p>
            </div>
          ) : (
            filteredHistory?.map((conversation) => (
              <div
                key={conversation?.id}
                className="border border-border rounded-lg p-4 hover:shadow-sm transition-all cursor-pointer hover:border-primary/20"
                onClick={() => onLoadConversation(conversation)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-foreground text-sm">
                    {conversation?.title}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(conversation?.date)}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {conversation?.preview}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <Icon name="MessageSquare" size={12} />
                      <span>{conversation?.messageCount} messages</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Icon name="Clock" size={12} />
                      <span>{conversation?.duration}</span>
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Mood Indicator */}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${moodColors?.[conversation?.mood] || moodColors?.happy}`}>
                      {conversation?.mood}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {conversation?.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/20">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Shield" size={12} />
              <span>All conversations are encrypted and anonymous</span>
            </div>
            <Button
              variant="ghost"
              size="xs"
              iconName="Download"
              iconPosition="left"
              iconSize={12}
            >
              Export Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationHistory;