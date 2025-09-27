import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ChatHeader from './components/ChatHeader';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import QuickActions from './components/QuickActions';
import CrisisAlert from './components/CrisisAlert';
import TherapeuticSuggestions from './components/TherapeuticSuggestions';
import ConversationHistory from './components/ConversationHistory';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const AIAssistantChat = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [sessionStartTime] = useState(new Date());

  // Mock initial conversation
  const initialMessages = [
    {
      id: 1,
      content: `Hello! I'm MindBridge AI, your personal mental health companion. I'm here to provide you with 24/7 support in a safe, anonymous environment.\n\nHow are you feeling today? Feel free to share whatever is on your mind - whether it's stress, anxiety, academic pressure, or just need someone to talk to.`,
      isUser: false,
      timestamp: new Date(Date.now() - 300000),
      type: 'greeting'
    }
  ];

  // Mock therapeutic suggestions
  const therapeuticSuggestions = [
    {
      type: 'cbt',
      title: 'Thought Challenging Exercise',
      description: 'Let\'s examine those anxious thoughts and find more balanced perspectives together.',
      duration: '10-15 minutes'
    },
    {
      type: 'mindfulness',
      title: 'Mindful Breathing Session',
      description: 'A guided breathing exercise to help you feel more centered and calm.',
      duration: '5-10 minutes'
    },
    {
      type: 'grounding',
      title: '5-4-3-2-1 Grounding Technique',
      description: 'Use your senses to ground yourself in the present moment when feeling overwhelmed.',
      duration: '3-5 minutes'
    }
  ];

  useEffect(() => {
    setMessages(initialMessages);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (messageContent) => {
    const newMessage = {
      id: Date.now(),
      content: messageContent,
      isUser: true,
      timestamp: new Date(),
      type: 'user'
    };

    setMessages(prev => [...prev, newMessage]);
    setIsTyping(true);

    // Crisis detection simulation
    const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'no point living', 'want to die', 'hurt myself'];
    const hasCrisisContent = crisisKeywords?.some(keyword => 
      messageContent?.toLowerCase()?.includes(keyword)
    );

    if (hasCrisisContent) {
      setTimeout(() => {
        setIsTyping(false);
        setShowCrisisAlert(true);
      }, 1500);
      return;
    }

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        `I hear that you're going through a challenging time with ${messageContent?.includes('exam') || messageContent?.includes('study') ? 'academic stress' : messageContent?.includes('sleep') ? 'sleep difficulties' : messageContent?.includes('friend') || messageContent?.includes('social') ? 'social concerns' : 'these feelings'}.\n\nIt's completely normal to feel this way, and I want you to know that seeking support shows real strength. Let's work through this together.\n\nCan you tell me more about what specifically is making you feel this way? Understanding the details will help me provide better support.`,
        
        `Thank you for sharing that with me. What you're experiencing sounds really difficult, and your feelings are completely valid.\n\nI notice you mentioned feeling overwhelmed. When we're stressed, our minds can sometimes make situations feel bigger than they are. Let's try to break this down into smaller, more manageable pieces.\n\nWhat would you say is the most pressing concern right now? We can start there and work our way through it step by step.`,
        
        `I can sense the anxiety in your message, and I want you to know that you're not alone in feeling this way. Many students experience similar challenges, especially during stressful periods.\n\nLet's try a quick grounding exercise together. Take a deep breath with me - in for 4 counts, hold for 4, and out for 6. This can help calm your nervous system.\n\nAfter you've done that a few times, would you like to explore some coping strategies that might help with what you're experiencing?`
      ];

      const randomResponse = aiResponses?.[Math.floor(Math.random() * aiResponses?.length)];
      
      const aiMessage = {
        id: Date.now() + 1,
        content: randomResponse,
        isUser: false,
        timestamp: new Date(),
        type: 'response'
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000 + Math.random() * 1000);
  };

  const handleVoiceInput = (voiceMessage) => {
    // Voice input is processed same as text
    handleSendMessage(voiceMessage);
  };

  const handleQuickAction = (actionId) => {
    switch (actionId) {
      case 'breathing': handleSendMessage("I'd like to try a breathing exercise");
        break;
      case 'emergency':
        setShowCrisisAlert(true);
        break;
      case 'human-support': navigate('/appointment-booking');
        break;
      case 'mood-check': handleSendMessage("I'd like to do a mood check-in");
        break;
      default:
        break;
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion?.type === 'appointment') {
      navigate('/appointment-booking');
    } else if (suggestion?.type === 'mood') {
      handleSendMessage("I'd like to check in with my mood and feelings");
    } else if (suggestion?.type === 'goal') {
      handleSendMessage("I want to set some mental health goals");
    } else {
      handleSendMessage(`I'm interested in trying the ${suggestion?.title}`);
    }
  };

  const handleCrisisEmergencyContact = () => {
    // Simulate emergency contact
    window.open('tel:1800-599-0019', '_self');
  };

  const handleCrisisCounselorRequest = () => {
    setShowCrisisAlert(false);
    navigate('/appointment-booking', { state: { emergency: true } });
  };

  const handleLanguageChange = (langCode) => {
    setCurrentLanguage(langCode);
    localStorage.setItem('mindbridge_language', langCode);
    
    // Simulate language change message
    const languageNames = {
      'en': 'English',
      'hi': 'Hindi',
      'ta': 'Tamil',
      'te': 'Telugu',
      'bn': 'Bengali'
    };
    
    const langMessage = {
      id: Date.now(),
      content: `Language changed to ${languageNames?.[langCode]}. I can now communicate with you in your preferred language. How can I help you today?`,
      isUser: false,
      timestamp: new Date(),
      type: 'system'
    };
    
    setMessages(prev => [...prev, langMessage]);
  };

  const handleLoadConversation = (conversation) => {
    setShowHistory(false);
    // Simulate loading conversation
    const loadMessage = {
      id: Date.now(),
      content: `I've loaded our previous conversation about "${conversation?.title}". We were discussing ${conversation?.preview?.substring(0, 50)}...\n\nWould you like to continue where we left off, or is there something new you'd like to talk about?`,
      isUser: false,
      timestamp: new Date(),
      type: 'system'
    };
    setMessages(prev => [...prev, loadMessage]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex flex-col h-[calc(100vh-64px)]">
        {/* Chat Header */}
        <ChatHeader
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
          onSettingsOpen={() => setShowHistory(true)}
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat Messages */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name="Shield" size={20} color="white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-1">Safe & Anonymous Space</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      This is your private, encrypted conversation. Everything you share here is confidential and anonymous. 
                      I'm trained to detect crisis situations and can connect you with human support when needed.
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              {messages?.map((message) => (
                <ChatMessage
                  key={message?.id}
                  message={message?.content}
                  isUser={message?.isUser}
                  timestamp={message?.timestamp}
                />
              ))}

              {/* Typing Indicator */}
              {isTyping && <ChatMessage message="" isUser={false} timestamp={new Date()} isTyping={true} />}

              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <ChatInput
              onSendMessage={handleSendMessage}
              onVoiceInput={handleVoiceInput}
              disabled={isTyping}
            />
          </div>

          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block w-80 border-l border-border bg-muted/20 overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Quick Actions */}
              <QuickActions
                onActionClick={handleQuickAction}
                isVisible={true}
              />

              {/* Therapeutic Suggestions */}
              <TherapeuticSuggestions
                suggestions={therapeuticSuggestions}
                onSuggestionClick={handleSuggestionClick}
                isVisible={showSuggestions}
              />

              {/* Session Info */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
                  <Icon name="Info" size={16} className="mr-2 text-primary" />
                  Session Information
                </h3>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Started:</span>
                    <span>{sessionStartTime?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Messages:</span>
                    <span>{messages?.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Language:</span>
                    <span>{currentLanguage?.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="text-success">Active & Secure</span>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-sm font-medium text-foreground mb-3">Quick Navigation</h3>
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    iconName="Calendar"
                    iconPosition="left"
                    onClick={() => navigate('/appointment-booking')}
                    className="justify-start"
                  >
                    Book Appointment
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    iconName="BookOpen"
                    iconPosition="left"
                    onClick={() => navigate('/resource-library')}
                    className="justify-start"
                  >
                    Resource Library
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    iconName="ClipboardList"
                    iconPosition="left"
                    onClick={() => navigate('/assessment-center')}
                    className="justify-start"
                  >
                    Assessment Center
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    iconName="LayoutDashboard"
                    iconPosition="left"
                    onClick={() => navigate('/student-dashboard')}
                    className="justify-start"
                  >
                    Dashboard
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Quick Actions - Floating */}
        <div className="lg:hidden fixed bottom-20 right-4 z-30">
          <div className="flex flex-col space-y-2">
            <Button
              variant="secondary"
              size="icon"
              className="w-12 h-12 rounded-full shadow-lg"
              iconName="History"
              onClick={() => setShowHistory(true)}
              title="Conversation history"
            />
            <Button
              variant="destructive"
              size="icon"
              className="w-12 h-12 rounded-full shadow-lg breathing-animation"
              iconName="Phone"
              onClick={() => setShowCrisisAlert(true)}
              title="Emergency support"
            />
          </div>
        </div>
      </div>
      {/* Crisis Alert Modal */}
      <CrisisAlert
        isVisible={showCrisisAlert}
        onDismiss={() => setShowCrisisAlert(false)}
        onEmergencyContact={handleCrisisEmergencyContact}
        onCounselorRequest={handleCrisisCounselorRequest}
      />
      {/* Conversation History Modal */}
      <ConversationHistory
        isVisible={showHistory}
        onClose={() => setShowHistory(false)}
        onLoadConversation={handleLoadConversation}
      />
    </div>
  );
};

export default AIAssistantChat;