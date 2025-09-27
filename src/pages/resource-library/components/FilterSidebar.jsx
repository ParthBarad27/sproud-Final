import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterSidebar = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  isOpen, 
  onToggle 
}) => {
  const filterSections = [
    {
      id: 'type',
      title: 'Content Type',
      options: [
        { value: 'video', label: 'Video Learning', icon: 'Play', count: 45 },
        { value: 'meditation', label: 'Meditation', icon: 'Brain', count: 32 },
        { value: 'audio', label: 'Audio Content', icon: 'Headphones', count: 28 },
        { value: 'worksheet', label: 'Worksheets', icon: 'FileText', count: 19 },
        { value: 'sleep', label: 'Sleep Stories', icon: 'Moon', count: 15 }
      ]
    },
    {
      id: 'difficulty',
      title: 'Difficulty Level',
      options: [
        { value: 'Beginner', label: 'Beginner', count: 67 },
        { value: 'Intermediate', label: 'Intermediate', count: 45 },
        { value: 'Advanced', label: 'Advanced', count: 27 }
      ]
    },
    {
      id: 'duration',
      title: 'Duration',
      options: [
        { value: '0-10', label: '0-10 minutes', count: 34 },
        { value: '10-30', label: '10-30 minutes', count: 52 },
        { value: '30-60', label: '30-60 minutes', count: 38 },
        { value: '60+', label: '60+ minutes', count: 15 }
      ]
    },
    {
      id: 'category',
      title: 'Categories',
      options: [
        { value: 'stress', label: 'Academic Stress', count: 42 },
        { value: 'anxiety', label: 'Anxiety Management', count: 38 },
        { value: 'relationships', label: 'Relationships', count: 29 },
        { value: 'sleep', label: 'Sleep & Rest', count: 25 },
        { value: 'focus', label: 'Focus & Study', count: 31 },
        { value: 'cultural', label: 'Cultural Adaptation', count: 18 }
      ]
    }
  ];

  const handleFilterChange = (sectionId, value, checked) => {
    const currentFilters = filters?.[sectionId] || [];
    const newFilters = checked 
      ? [...currentFilters, value]
      : currentFilters?.filter(f => f !== value);
    
    onFilterChange(sectionId, newFilters);
  };

  const getActiveFilterCount = () => {
    return Object.values(filters)?.reduce((total, filterArray) => total + filterArray?.length, 0);
  };

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={onToggle}
          iconName="Filter"
          iconPosition="left"
          iconSize={16}
          className="w-full justify-center"
        >
          Filters {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
        </Button>
      </div>
      {/* Filter Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-background border-r border-border transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:z-auto lg:w-full
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
            <h2 className="font-semibold text-lg">Filters</h2>
            <div className="flex items-center space-x-2">
              {getActiveFilterCount() > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Clear All
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                iconSize={16}
                onClick={onToggle}
                className="lg:hidden"
              />
            </div>
          </div>

          {/* Filter Sections */}
          <div className="p-4 space-y-6">
            {filterSections?.map((section) => (
              <div key={section?.id} className="space-y-3">
                <h3 className="font-medium text-sm text-foreground uppercase tracking-wide">
                  {section?.title}
                </h3>
                <div className="space-y-2">
                  {section?.options?.map((option) => (
                    <div key={option?.value} className="flex items-center justify-between">
                      <Checkbox
                        checked={filters?.[section?.id]?.includes(option?.value) || false}
                        onChange={(e) => handleFilterChange(section?.id, option?.value, e?.target?.checked)}
                        label={
                          <div className="flex items-center space-x-2">
                            {option?.icon && <Icon name={option?.icon} size={14} />}
                            <span className="text-sm">{option?.label}</span>
                          </div>
                        }
                      />
                      <span className="text-xs text-muted-foreground">
                        {option?.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="sticky bottom-0 bg-background border-t border-border p-4">
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                iconName="BookmarkPlus"
                iconPosition="left"
                iconSize={14}
              >
                View Bookmarked
              </Button>
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                iconName="TrendingUp"
                iconPosition="left"
                iconSize={14}
              >
                Popular This Week
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default FilterSidebar;