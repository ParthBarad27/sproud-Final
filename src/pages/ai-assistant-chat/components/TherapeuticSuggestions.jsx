import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const TherapeuticSuggestions = ({ suggestions, onSuggestionClick, isVisible = true }) => {
  if (!isVisible || !suggestions || suggestions?.length === 0) return null;

  const suggestionTypes = {
    cbt: { icon: 'Brain', color: 'text-primary', bg: 'bg-primary/10' },
    mindfulness: { icon: 'Flower2', color: 'text-secondary', bg: 'bg-secondary/10' },
    breathing: { icon: 'Wind', color: 'text-accent', bg: 'bg-accent/10' },
    grounding: { icon: 'Anchor', color: 'text-success', bg: 'bg-success/10' },
    resource: { icon: 'BookOpen', color: 'text-warning', bg: 'bg-warning/10' }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-foreground flex items-center">
          <Icon name="Lightbulb" size={16} className="mr-2 text-accent" />
          Therapeutic Suggestions
        </h3>
        <span className="text-xs text-muted-foreground">Based on our conversation</span>
      </div>
      <div className="space-y-2">
        {suggestions?.map((suggestion, index) => {
          const type = suggestionTypes?.[suggestion?.type] || suggestionTypes?.cbt;
          
          return (
            <div
              key={index}
              className={`p-3 rounded-lg border transition-all hover:shadow-sm cursor-pointer ${type?.bg} border-transparent hover:border-border`}
              onClick={() => onSuggestionClick(suggestion)}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${type?.bg} ${type?.color}`}>
                  <Icon name={type?.icon} size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground mb-1">
                    {suggestion?.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {suggestion?.description}
                  </p>
                  {suggestion?.duration && (
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                      <Icon name="Clock" size={12} className="mr-1" />
                      <span>{suggestion?.duration}</span>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="xs"
                  iconName="ArrowRight"
                  iconSize={12}
                  className="flex-shrink-0 opacity-60 hover:opacity-100"
                />
              </div>
            </div>
          );
        })}
      </div>
      {/* Quick Access Actions */}
      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="xs"
            iconName="Heart"
            iconPosition="left"
            iconSize={12}
            onClick={() => onSuggestionClick({ type: 'mood', action: 'check-in' })}
          >
            Mood Check
          </Button>
          <Button
            variant="outline"
            size="xs"
            iconName="Target"
            iconPosition="left"
            iconSize={12}
            onClick={() => onSuggestionClick({ type: 'goal', action: 'set' })}
          >
            Set Goal
          </Button>
          <Button
            variant="outline"
            size="xs"
            iconName="Calendar"
            iconPosition="left"
            iconSize={12}
            onClick={() => onSuggestionClick({ type: 'appointment', action: 'book' })}
          >
            Book Session
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TherapeuticSuggestions;