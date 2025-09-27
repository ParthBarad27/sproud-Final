import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AssessmentCard = ({ assessment, onStart, onContinue, onViewResults }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success bg-success/10 border-success/20';
      case 'in-progress':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'not-started':
        return 'text-muted-foreground bg-muted border-border';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'CheckCircle';
      case 'in-progress':
        return 'Clock';
      case 'not-started':
        return 'Circle';
      default:
        return 'Circle';
    }
  };

  const renderActionButton = () => {
    switch (assessment?.status) {
      case 'completed':
        return (
          <Button
            variant="outline"
            size="sm"
            iconName="Eye"
            iconPosition="left"
            onClick={() => onViewResults(assessment?.id)}
          >View Results
                      </Button>
        );
      case 'in-progress':
        return (
          <Button
            variant="default"
            size="sm"
            iconName="Play"
            iconPosition="left"
            onClick={() => onContinue(assessment?.id)}
          >Continue
                      </Button>
        );
      case 'not-started':
        return (
          <Button
            variant="default"
            size="sm"
            iconName="Play"
            iconPosition="left"
            onClick={() => onStart(assessment?.id)}
          >Start Assessment
                      </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-gentle-hover transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name={assessment?.icon} size={24} className="text-primary" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-card-foreground">
              {assessment?.name}
            </h3>
            <p className="text-sm text-muted-foreground">{assessment?.category}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full border text-xs font-medium flex items-center space-x-1 ${getStatusColor(assessment?.status)}`}>
          <Icon name={getStatusIcon(assessment?.status)} size={12} />
          <span className="capitalize">{assessment?.status?.replace('-', ' ')}</span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {assessment?.description}
      </p>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={12} />
            <span>{assessment?.estimatedTime} min</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="HelpCircle" size={12} />
            <span>{assessment?.questions} questions</span>
          </div>
          {assessment?.difficulty && (
            <div className="flex items-center space-x-1">
              <Icon name="BarChart3" size={12} />
              <span className="capitalize">{assessment?.difficulty}</span>
            </div>
          )}
        </div>
      </div>
      {assessment?.status === 'in-progress' && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Progress</span>
            <span>{assessment?.progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${assessment?.progress}%` }}
            ></div>
          </div>
        </div>
      )}
      {assessment?.lastCompleted && (
        <div className="mb-4 p-3 bg-muted/50 rounded-md">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Last completed:</span>
            <span className="font-medium text-card-foreground">{assessment?.lastCompleted}</span>
          </div>
          {assessment?.lastScore && (
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-muted-foreground">Previous score:</span>
              <span className={`font-medium ${assessment?.lastScore?.severity === 'low' ? 'text-success' : 
                assessment?.lastScore?.severity === 'moderate' ? 'text-warning' : 'text-destructive'}`}>
                {assessment?.lastScore?.value} ({assessment?.lastScore?.severity})
              </span>
            </div>
          )}
        </div>
      )}
      <div className="flex items-center justify-between">
        {renderActionButton()}
        <div className="flex items-center space-x-2">
          {assessment?.isRecommended && (
            <div className="px-2 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium">
              Recommended
            </div>
          )}
          {assessment?.isRequired && (
            <div className="px-2 py-1 bg-destructive/10 text-destructive rounded-full text-xs font-medium">
              Required
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentCard;