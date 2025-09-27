import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = ({ onAction }) => {
  const quickActions = [
    {
      id: 'crisis-assessment',
      title: 'Crisis Assessment',
      description: 'Immediate mental health evaluation for urgent situations',
      icon: 'AlertTriangle',
      color: 'destructive',
      urgent: true,
      estimatedTime: '5-10 min'
    },
    {
      id: 'daily-mood',
      title: 'Daily Mood Check',
      description: 'Quick daily assessment to track your emotional state',
      icon: 'Heart',
      color: 'primary',
      estimatedTime: '2-3 min'
    },
    {
      id: 'stress-level',
      title: 'Stress Level Check',
      description: 'Evaluate your current stress levels and get recommendations',
      icon: 'Zap',
      color: 'warning',
      estimatedTime: '5 min'
    },
    {
      id: 'sleep-quality',
      title: 'Sleep Quality',
      description: 'Assess your sleep patterns and quality',
      icon: 'Moon',
      color: 'secondary',
      estimatedTime: '3-5 min'
    },
    {
      id: 'academic-stress',
      title: 'Academic Pressure',
      description: 'Evaluate academic-related stress and anxiety',
      icon: 'BookOpen',
      color: 'accent',
      estimatedTime: '7-10 min'
    },
    {
      id: 'social-support',
      title: 'Social Support',
      description: 'Assess your social connections and support network',
      icon: 'Users',
      color: 'success',
      estimatedTime: '5-8 min'
    }
  ];

  const getColorClasses = (color, urgent = false) => {
    if (urgent) {
      return {
        bg: 'bg-destructive/10 hover:bg-destructive/20',
        border: 'border-destructive/20 hover:border-destructive/30',
        icon: 'text-destructive',
        button: 'destructive'
      };
    }

    const colorMap = {
      primary: {
        bg: 'bg-primary/10 hover:bg-primary/20',
        border: 'border-primary/20 hover:border-primary/30',
        icon: 'text-primary',
        button: 'default'
      },
      secondary: {
        bg: 'bg-secondary/10 hover:bg-secondary/20',
        border: 'border-secondary/20 hover:border-secondary/30',
        icon: 'text-secondary',
        button: 'secondary'
      },
      success: {
        bg: 'bg-success/10 hover:bg-success/20',
        border: 'border-success/20 hover:border-success/30',
        icon: 'text-success',
        button: 'success'
      },
      warning: {
        bg: 'bg-warning/10 hover:bg-warning/20',
        border: 'border-warning/20 hover:border-warning/30',
        icon: 'text-warning',
        button: 'warning'
      },
      accent: {
        bg: 'bg-accent/10 hover:bg-accent/20',
        border: 'border-accent/20 hover:border-accent/30',
        icon: 'text-accent',
        button: 'default'
      }
    };

    return colorMap?.[color] || colorMap?.primary;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading font-semibold text-xl text-card-foreground">
            Quick Actions
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Fast assessments for immediate insights
          </p>
        </div>
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Zap" size={24} className="text-primary" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions?.map((action) => {
          const colors = getColorClasses(action?.color, action?.urgent);
          
          return (
            <div
              key={action?.id}
              className={`border rounded-lg p-4 transition-all duration-200 cursor-pointer ${colors?.bg} ${colors?.border}`}
              onClick={() => onAction(action?.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors?.bg}`}>
                  <Icon name={action?.icon} size={20} className={colors?.icon} />
                </div>
                {action?.urgent && (
                  <div className="px-2 py-1 bg-destructive/20 text-destructive rounded-full text-xs font-medium">
                    Urgent
                  </div>
                )}
              </div>
              <h3 className="font-medium text-card-foreground mb-2">
                {action?.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {action?.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Icon name="Clock" size={12} />
                  <span>{action?.estimatedTime}</span>
                </div>
                <Button
                  variant={colors?.button}
                  size="sm"
                  iconName="ArrowRight"
                  iconPosition="right"
                  onClick={(e) => {
                    e?.stopPropagation();
                    onAction(action?.id);
                  }}
                >
                  Start
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      {/* Emergency Notice */}
      <div className="mt-6 p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="AlertTriangle" size={20} className="text-destructive flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-destructive text-sm">
              Crisis Support Available 24/7
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              If you're experiencing thoughts of self-harm or suicide, please reach out immediately. 
              Our crisis intervention team is available around the clock.
            </p>
            <div className="flex items-center space-x-2 mt-3">
              <Button
                variant="destructive"
                size="sm"
                iconName="Phone"
                iconPosition="left"
              >
                Emergency Hotline
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="MessageCircle"
                iconPosition="left"
              >
                Crisis Chat
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;