import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RoleSelectionCard = ({ role, isSelected, onSelect, disabled = false }) => {
  const roleConfig = {
    student: {
      icon: 'GraduationCap',
      title: 'Student',
      description: 'College student seeking mental health support',
      requirements: ['Valid college email (@college.edu)', 'College ID card upload', 'Biometric verification'],
      color: 'primary'
    },
    consultant: {
      icon: 'UserCheck',
      title: 'Mental Health Consultant',
      description: 'Licensed mental health professional',
      requirements: ['Professional license verification', 'Background check', 'Credential validation'],
      color: 'secondary'
    },
    faculty: {
      icon: 'Users',
      title: 'Faculty/Instructor',
      description: 'Academic staff member',
      requirements: ['Faculty ID verification', 'Department validation', 'Institution confirmation'],
      color: 'accent'
    },
    admin: {
      icon: 'Shield',
      title: 'Administrator',
      description: 'Institutional administrator',
      requirements: ['Administrative privileges', 'Institution verification', 'Role authorization'],
      color: 'warning'
    }
  };

  const config = roleConfig?.[role];
  const colorClasses = {
    primary: isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50',
    secondary: isSelected ? 'border-secondary bg-secondary/5' : 'border-border hover:border-secondary/50',
    accent: isSelected ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50',
    warning: isSelected ? 'border-warning bg-warning/5' : 'border-border hover:border-warning/50'
  };

  return (
    <div 
      className={`relative p-6 rounded-lg border-2 transition-all duration-300 cursor-pointer ${colorClasses?.[config?.color]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={() => !disabled && onSelect(role)}
    >
      {isSelected && (
        <div className="absolute top-4 right-4">
          <div className={`w-6 h-6 rounded-full bg-${config?.color} flex items-center justify-center`}>
            <Icon name="Check" size={14} color="white" />
          </div>
        </div>
      )}
      <div className="flex items-start space-x-4">
        <div className={`w-12 h-12 rounded-lg bg-${config?.color}/10 flex items-center justify-center flex-shrink-0`}>
          <Icon name={config?.icon} size={24} className={`text-${config?.color}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground mb-2">{config?.title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{config?.description}</p>
          
          <div className="space-y-2">
            <p className="text-xs font-medium text-foreground">Verification Requirements:</p>
            <ul className="space-y-1">
              {config?.requirements?.map((req, index) => (
                <li key={index} className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {isSelected && (
        <div className="mt-4 pt-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            iconName="ArrowRight"
            iconPosition="right"
          >
            Continue with {config?.title}
          </Button>
        </div>
      )}
    </div>
  );
};

export default RoleSelectionCard;