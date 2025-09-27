import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ConsultantCard = ({ consultant, onSelect, isSelected }) => {
  const getSpecializationIcon = (specialization) => {
    const iconMap = {
      'Anxiety & Depression': 'Brain',
      'Academic Stress': 'BookOpen',
      'Relationship Issues': 'Heart',
      'Crisis Intervention': 'AlertTriangle',
      'Sleep Disorders': 'Moon',
      'Eating Disorders': 'Apple',
      'Trauma Therapy': 'Shield',
      'Career Counseling': 'Briefcase'
    };
    return iconMap?.[specialization] || 'User';
  };

  const getCompatibilityColor = (score) => {
    if (score >= 90) return 'text-success bg-success/10';
    if (score >= 80) return 'text-primary bg-primary/10';
    if (score >= 70) return 'text-accent bg-accent/10';
    return 'text-muted-foreground bg-muted';
  };

  return (
    <div className={`bg-card border rounded-lg p-6 transition-all duration-300 hover:shadow-gentle-hover cursor-pointer ${
      isSelected ? 'border-primary shadow-gentle-hover' : 'border-border hover:border-primary/50'
    }`} onClick={() => onSelect(consultant)}>
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <Image
            src={consultant?.avatar}
            alt={`Dr. ${consultant?.name}`}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-card ${
            consultant?.isOnline ? 'bg-success' : 'bg-muted-foreground'
          }`}></div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-card-foreground text-lg">
                Dr. {consultant?.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {consultant?.credentials} • {consultant?.experience} years experience
              </p>
            </div>
            
            {/* Compatibility Score */}
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getCompatibilityColor(consultant?.compatibilityScore)}`}>
              {consultant?.compatibilityScore}% match
            </div>
          </div>

          {/* Specializations */}
          <div className="flex flex-wrap gap-2 mt-3">
            {consultant?.specializations?.slice(0, 3)?.map((spec, index) => (
              <div key={index} className="flex items-center space-x-1 px-2 py-1 bg-muted rounded-md text-xs">
                <Icon name={getSpecializationIcon(spec)} size={12} />
                <span>{spec}</span>
              </div>
            ))}
            {consultant?.specializations?.length > 3 && (
              <div className="px-2 py-1 bg-muted rounded-md text-xs text-muted-foreground">
                +{consultant?.specializations?.length - 3} more
              </div>
            )}
          </div>

          {/* Languages & Approach */}
          <div className="flex items-center space-x-4 mt-3 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Globe" size={14} />
              <span>{consultant?.languages?.join(', ')}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Lightbulb" size={14} />
              <span>{consultant?.therapeuticApproach}</span>
            </div>
          </div>

          {/* Rating & Reviews */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {[...Array(5)]?.map((_, i) => (
                  <Icon
                    key={i}
                    name="Star"
                    size={14}
                    className={i < Math.floor(consultant?.rating) ? 'text-accent fill-current' : 'text-muted-foreground'}
                  />
                ))}
                <span className="text-sm font-medium ml-1">{consultant?.rating}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                ({consultant?.reviewCount} reviews)
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <div className="text-sm text-muted-foreground">
                Next available: {consultant?.nextAvailable}
              </div>
              {consultant?.isOnline && (
                <div className="flex items-center space-x-1 text-xs text-success">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span>Online now</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isSelected && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Selected for booking
            </div>
            <Button variant="default" size="sm" iconName="Calendar" iconPosition="left">
              Book Appointment
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultantCard;