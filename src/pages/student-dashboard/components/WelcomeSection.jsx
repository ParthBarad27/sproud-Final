import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeSection = ({ anonymousId, currentTime }) => {
  const getGreeting = () => {
    const hour = new Date()?.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            {getGreeting()}! 👋
          </h1>
          <p className="text-muted-foreground">
            Welcome back to your safe space for mental wellness
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-background rounded-full text-sm font-medium text-muted-foreground border">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>ID: {anonymousId}</span>
            <Icon name="Shield" size={14} />
          </div>
          <div className="text-xs text-muted-foreground">
            {currentTime}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;