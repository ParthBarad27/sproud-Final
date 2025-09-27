import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ChatHeader = ({ onLanguageChange, onSettingsOpen, currentLanguage = 'en' }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇮🇳' }
  ];

  const currentLang = languages?.find(lang => lang?.code === currentLanguage) || languages?.[0];

  const handleLanguageSelect = (langCode) => {
    onLanguageChange?.(langCode);
    setShowLanguageMenu(false);
  };

  return (
    <div className="bg-background border-b border-border px-4 py-3 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        {/* AI Assistant Info */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Icon name="Brain" size={20} color="white" />
            </div>
            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
              isOnline ? 'bg-success' : 'bg-muted-foreground'
            }`}></div>
          </div>
          <div>
            <h1 className="font-semibold text-foreground">MindBridge AI</h1>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-success' : 'bg-muted-foreground'}`}></div>
              <span className="text-xs text-muted-foreground">
                {isOnline ? 'Online • Responds instantly' : 'Connecting...'}
              </span>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center space-x-2">
          {/* Language Selector */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="h-8 px-2"
            >
              <span className="text-sm mr-1">{currentLang?.flag}</span>
              <span className="text-xs font-medium">{currentLang?.code?.toUpperCase()}</span>
              <Icon name="ChevronDown" size={14} className="ml-1" />
            </Button>

            {/* Language Dropdown */}
            {showLanguageMenu && (
              <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[140px] z-20">
                {languages?.map((lang) => (
                  <button
                    key={lang?.code}
                    onClick={() => handleLanguageSelect(lang?.code)}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center space-x-2 ${
                      currentLanguage === lang?.code ? 'bg-muted text-primary font-medium' : 'text-foreground'
                    }`}
                  >
                    <span>{lang?.flag}</span>
                    <span>{lang?.name}</span>
                    {currentLanguage === lang?.code && (
                      <Icon name="Check" size={14} className="ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Settings Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onSettingsOpen}
            className="h-8 w-8"
            title="Chat settings"
          >
            <Icon name="Settings" size={16} />
          </Button>

          {/* More Options */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="More options"
          >
            <Icon name="MoreVertical" size={16} />
          </Button>
        </div>
      </div>
      {/* Session Info Bar */}
      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <Icon name="Shield" size={12} />
            <span>Anonymous Session #MB2025</span>
          </span>
          <span className="flex items-center space-x-1">
            <Icon name="Clock" size={12} />
            <span>Started 2:30 PM</span>
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="Lock" size={12} />
          <span>End-to-end encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;