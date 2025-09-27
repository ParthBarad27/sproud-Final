import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';


const QuickActions = () => {
  const actions = [
    {
      id: 1,
      title: "Crisis Support",
      description: "Immediate help available 24/7",
      icon: "AlertTriangle",
      color: "bg-destructive",
      textColor: "text-destructive-foreground",
      link: "/ai-assistant-chat",
      urgent: true
    },
    {
      id: 2,
      title: "Book Appointment",
      description: "Schedule with a counselor",
      icon: "Calendar",
      color: "bg-primary",
      textColor: "text-primary-foreground",
      link: "/appointment-booking"
    },
    {
      id: 3,
      title: "Take Assessment",
      description: "Check your mental wellness",
      icon: "ClipboardList",
      color: "bg-secondary",
      textColor: "text-secondary-foreground",
      link: "/assessment-center"
    },
    {
      id: 4,
      title: "Browse Resources",
      description: "Videos, articles & tools",
      icon: "BookOpen",
      color: "bg-accent",
      textColor: "text-accent-foreground",
      link: "/resource-library"
    }
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Icon name="Zap" size={16} color="white" />
        </div>
        <h3 className="font-semibold text-card-foreground">Quick Actions</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions?.map((action) => (
          <Link
            key={action?.id}
            to={action?.link}
            className={`group relative overflow-hidden rounded-lg p-4 transition-all duration-200 hover:scale-105 hover:shadow-lg ${
              action?.urgent ? 'ring-2 ring-destructive/20 animate-pulse' : ''
            }`}
            style={{ backgroundColor: `var(--color-${action?.color?.replace('bg-', '')})` }}
          >
            <div className="flex items-start space-x-3">
              <div className={`w-10 h-10 ${action?.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Icon name={action?.icon} size={20} color="white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`font-medium ${action?.textColor} group-hover:text-white transition-colors`}>
                  {action?.title}
                </h4>
                <p className={`text-sm ${action?.textColor} opacity-80 group-hover:opacity-100 transition-opacity`}>
                  {action?.description}
                </p>
              </div>
              <Icon 
                name="ArrowRight" 
                size={16} 
                className={`${action?.textColor} opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all`} 
              />
            </div>
            
            {action?.urgent && (
              <div className="absolute top-2 right-2">
                <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
              </div>
            )}
          </Link>
        ))}
      </div>
      <div className="mt-4 p-3 bg-muted rounded-lg">
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={16} className="text-success" />
          <span className="text-sm font-medium text-muted-foreground">
            All interactions are completely anonymous and secure
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;