import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const SearchHeader = ({ 
  searchQuery, 
  onSearchChange, 
  sortBy, 
  onSortChange, 
  viewMode, 
  onViewModeChange,
  totalResults = 0 
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'duration-short', label: 'Shortest Duration' },
    { value: 'duration-long', label: 'Longest Duration' }
  ];

  const quickFilters = [
    { label: 'For You', value: 'recommended', icon: 'Sparkles' },
    { label: 'Trending', value: 'trending', icon: 'TrendingUp' },
    { label: 'New', value: 'new', icon: 'Plus' },
    { label: 'Bookmarked', value: 'bookmarked', icon: 'Bookmark' }
  ];

  return (
    <div className="bg-background border-b border-border sticky top-0 z-30">
      <div className="p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <div className={`relative transition-all duration-200 ${isSearchFocused ? 'transform scale-[1.02]' : ''}`}>
            <Icon 
              name="Search" 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <Input
              type="search"
              placeholder="Search videos, meditations, worksheets..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e?.target?.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="pl-10 pr-12 h-12 text-base"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="xs"
                iconName="X"
                iconSize={16}
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              />
            )}
          </div>

          {/* Search Suggestions */}
          {isSearchFocused && searchQuery?.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-gentle-hover z-50 max-h-60 overflow-y-auto">
              <div className="p-2">
                <div className="text-xs text-muted-foreground mb-2 px-2">Suggestions</div>
                {[
                  'Anxiety management techniques',
                  'Study stress relief',
                  'Sleep meditation',
                  'Relationship counseling',
                  'Academic pressure coping'
                ]?.filter(suggestion => 
                  suggestion?.toLowerCase()?.includes(searchQuery?.toLowerCase())
                )?.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      onSearchChange(suggestion);
                      setIsSearchFocused(false);
                    }}
                    className="w-full text-left px-2 py-2 hover:bg-muted rounded text-sm flex items-center space-x-2"
                  >
                    <Icon name="Search" size={14} className="text-muted-foreground" />
                    <span>{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {quickFilters?.map((filter) => (
            <Button
              key={filter?.value}
              variant="outline"
              size="sm"
              iconName={filter?.icon}
              iconPosition="left"
              iconSize={14}
              className="whitespace-nowrap"
            >
              {filter?.label}
            </Button>
          ))}
        </div>

        {/* Controls Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              {totalResults?.toLocaleString()} resources found
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Sort Dropdown */}
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={onSortChange}
              placeholder="Sort by"
              className="w-40"
            />

            {/* View Mode Toggle */}
            <div className="flex items-center border border-border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="xs"
                iconName="Grid3X3"
                iconSize={16}
                onClick={() => onViewModeChange('grid')}
                className="rounded-md"
              />
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="xs"
                iconName="List"
                iconSize={16}
                onClick={() => onViewModeChange('list')}
                className="rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Active Search Info */}
        {searchQuery && (
          <div className="flex items-center justify-between bg-muted rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Icon name="Search" size={16} className="text-muted-foreground" />
              <span className="text-sm">
                Searching for: <span className="font-medium">"{searchQuery}"</span>
              </span>
            </div>
            <Button
              variant="ghost"
              size="xs"
              iconName="X"
              iconSize={14}
              onClick={() => onSearchChange('')}
            >
              Clear
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchHeader;