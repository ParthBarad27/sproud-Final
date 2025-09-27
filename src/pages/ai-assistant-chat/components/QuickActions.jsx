import React from 'react';
import Button from '../../../components/ui/Button';

const QuickActions = ({ onActionClick, isVisible = true }) => {
  const quickActions = [
    {
      id: 'breathing',
      label: 'Breathing Exercise',
      icon: 'Wind',
      variant: 'outline',
      description: 'Start a 5-minute guided breathing session'
    },
    {
      id: 'emergency',
      label: 'Emergency Help',
      icon: 'Phone',
      variant: 'destructive',
      description: 'Connect with crisis support immediately'
    },
    {
      id: 'human-support',
      label: 'Talk to Counselor',
      icon: 'UserCheck',
      variant: 'secondary',
      description: 'Request human counselor assistance'
    },
    {
      id: 'mood-check',
      label: 'Mood Check-in',
      icon: 'Heart',
      variant: 'outline',
      description: 'Quick mood assessment and tracking'
    }
  ];

  if (!isVisible) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-4">
      <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
        <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {quickActions?.map((action) => (
          <Button
            key={action?.id}
            variant={action?.variant}
            size="sm"
            iconName={action?.icon}
            iconPosition="left"
            iconSize={16}
            onClick={() => onActionClick(action?.id)}
            className="justify-start text-xs h-auto py-2 px-3"
            title={action?.description}
          >
            <span className="truncate">{action?.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;