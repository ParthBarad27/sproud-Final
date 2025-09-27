import React, { useState, useRef } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ChatInput = ({ onSendMessage, onVoiceInput, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (message?.trim() && !disabled) {
      onSendMessage(message?.trim());
      setMessage('');
      if (textareaRef?.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e) => {
    setMessage(e?.target?.value);
    // Auto-resize textarea
    const textarea = e?.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea?.scrollHeight, 120) + 'px';
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      setIsListening(false);
      // Simulate voice input completion
      setTimeout(() => {
        const voiceMessage = "I'm feeling anxious about my upcoming exams";
        setMessage(voiceMessage);
        onVoiceInput?.(voiceMessage);
      }, 1000);
    } else {
      setIsRecording(true);
      setIsListening(true);
    }
  };

  return (
    <div className="bg-background border-t border-border p-4">
      {/* Voice Recording Indicator */}
      {isRecording && (
        <div className="mb-3 p-3 bg-accent/10 border border-accent/20 rounded-lg">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
            <span className="text-sm text-accent font-medium">
              {isListening ? 'Listening...' : 'Processing...'}
            </span>
            <div className="flex space-x-1">
              <div className="w-1 h-4 bg-accent rounded-full animate-pulse"></div>
              <div className="w-1 h-6 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1 h-3 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1 h-5 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
            </div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress}
            placeholder="Share what's on your mind... (Press Enter to send, Shift+Enter for new line)"
            disabled={disabled}
            className="w-full resize-none border border-border rounded-lg px-4 py-3 pr-12 text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] max-h-[120px]"
            rows={1}
          />
          
          {/* Character count */}
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
            {message?.length}/500
          </div>
        </div>

        {/* Voice Input Button */}
        <Button
          type="button"
          variant={isRecording ? "destructive" : "outline"}
          size="icon"
          onClick={handleVoiceToggle}
          disabled={disabled}
          className="flex-shrink-0 h-12 w-12"
          title={isRecording ? "Stop recording" : "Voice input"}
        >
          <Icon 
            name={isRecording ? "Square" : "Mic"} 
            size={20} 
            className={isRecording ? "animate-pulse" : ""}
          />
        </Button>

        {/* Send Button */}
        <Button
          type="submit"
          variant="default"
          size="icon"
          disabled={!message?.trim() || disabled}
          className="flex-shrink-0 h-12 w-12"
          title="Send message"
        >
          <Icon name="Send" size={20} />
        </Button>
      </form>
      {/* Input Suggestions */}
      <div className="mt-3 flex flex-wrap gap-2">
        {[
          "I'm feeling stressed",
          "Help with anxiety",
          "Sleep problems",
          "Academic pressure"
        ]?.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => setMessage(suggestion)}
            disabled={disabled}
            className="px-3 py-1 text-xs bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatInput;