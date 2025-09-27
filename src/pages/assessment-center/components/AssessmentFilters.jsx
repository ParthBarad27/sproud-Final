import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AssessmentFilters = ({ 
  selectedCategory, 
  onCategoryChange, 
  selectedStatus, 
  onStatusChange, 
  selectedDifficulty, 
  onDifficultyChange,
  onClearFilters 
}) => {
  const categories = [
    { value: 'all', label: 'All Categories', icon: 'Grid3X3' },
    { value: 'depression', label: 'Depression', icon: 'CloudRain' },
    { value: 'anxiety', label: 'Anxiety', icon: 'Zap' },
    { value: 'stress', label: 'Stress', icon: 'Target' },
    { value: 'sleep', label: 'Sleep Quality', icon: 'Moon' },
    { value: 'social', label: 'Social Support', icon: 'Users' },
    { value: 'academic', label: 'Academic Stress', icon: 'BookOpen' }
  ];

  const statuses = [
    { value: 'all', label: 'All Status', icon: 'Circle' },
    { value: 'not-started', label: 'Not Started', icon: 'Circle' },
    { value: 'in-progress', label: 'In Progress', icon: 'Clock' },
    { value: 'completed', label: 'Completed', icon: 'CheckCircle' }
  ];

  const difficulties = [
    { value: 'all', label: 'All Levels', icon: 'BarChart3' },
    { value: 'basic', label: 'Basic', icon: 'BarChart' },
    { value: 'intermediate', label: 'Intermediate', icon: 'BarChart2' },
    { value: 'advanced', label: 'Advanced', icon: 'BarChart3' }
  ];

  const hasActiveFilters = selectedCategory !== 'all' || selectedStatus !== 'all' || selectedDifficulty !== 'all';

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-semibold text-lg text-card-foreground">
          Filter Assessments
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            iconPosition="left"
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-card-foreground"
          >
            Clear All
          </Button>
        )}
      </div>
      <div className="space-y-6">
        {/* Category Filter */}
        <div>
          <h4 className="text-sm font-medium text-card-foreground mb-3">Category</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {categories?.map((category) => (
              <button
                key={category?.value}
                onClick={() => onCategoryChange(category?.value)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category?.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-card-foreground'
                }`}
              >
                <Icon name={category?.icon} size={14} />
                <span className="truncate">{category?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <h4 className="text-sm font-medium text-card-foreground mb-3">Status</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {statuses?.map((status) => (
              <button
                key={status?.value}
                onClick={() => onStatusChange(status?.value)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  selectedStatus === status?.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-card-foreground'
                }`}
              >
                <Icon name={status?.icon} size={14} />
                <span>{status?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Filter */}
        <div>
          <h4 className="text-sm font-medium text-card-foreground mb-3">Difficulty Level</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {difficulties?.map((difficulty) => (
              <button
                key={difficulty?.value}
                onClick={() => onDifficultyChange(difficulty?.value)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  selectedDifficulty === difficulty?.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-card-foreground'
                }`}
              >
                <Icon name={difficulty?.icon} size={14} />
                <span>{difficulty?.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Icon name="Filter" size={12} />
            <span>Active filters applied</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentFilters;