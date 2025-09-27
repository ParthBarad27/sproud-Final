import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const SmartMatchingFilters = ({ onFiltersChange, activeFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    specializations: [],
    languages: [],
    therapeuticApproach: '',
    availability: '',
    sessionType: '',
    experienceLevel: '',
    gender: '',
    ageRange: '',
    ...activeFilters
  });

  const specializationOptions = [
    { value: 'anxiety_depression', label: 'Anxiety & Depression' },
    { value: 'academic_stress', label: 'Academic Stress' },
    { value: 'relationship_issues', label: 'Relationship Issues' },
    { value: 'crisis_intervention', label: 'Crisis Intervention' },
    { value: 'sleep_disorders', label: 'Sleep Disorders' },
    { value: 'eating_disorders', label: 'Eating Disorders' },
    { value: 'trauma_therapy', label: 'Trauma Therapy' },
    { value: 'career_counseling', label: 'Career Counseling' },
    { value: 'family_therapy', label: 'Family Therapy' },
    { value: 'addiction_support', label: 'Addiction Support' }
  ];

  const languageOptions = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'tamil', label: 'Tamil' },
    { value: 'telugu', label: 'Telugu' },
    { value: 'bengali', label: 'Bengali' },
    { value: 'marathi', label: 'Marathi' },
    { value: 'gujarati', label: 'Gujarati' },
    { value: 'kannada', label: 'Kannada' }
  ];

  const therapeuticApproachOptions = [
    { value: 'cbt', label: 'Cognitive Behavioral Therapy (CBT)' },
    { value: 'humanistic', label: 'Humanistic Approach' },
    { value: 'psychodynamic', label: 'Psychodynamic Therapy' },
    { value: 'mindfulness', label: 'Mindfulness-Based Therapy' },
    { value: 'solution_focused', label: 'Solution-Focused Therapy' },
    { value: 'integrative', label: 'Integrative Approach' }
  ];

  const availabilityOptions = [
    { value: 'today', label: 'Available Today' },
    { value: 'this_week', label: 'This Week' },
    { value: 'next_week', label: 'Next Week' },
    { value: 'flexible', label: 'Flexible Schedule' }
  ];

  const sessionTypeOptions = [
    { value: 'individual', label: 'Individual Sessions' },
    { value: 'group', label: 'Group Sessions' },
    { value: 'crisis', label: 'Crisis Intervention' },
    { value: 'all', label: 'All Session Types' }
  ];

  const experienceLevelOptions = [
    { value: 'junior', label: '1-5 years' },
    { value: 'mid', label: '5-10 years' },
    { value: 'senior', label: '10-15 years' },
    { value: 'expert', label: '15+ years' }
  ];

  const genderOptions = [
    { value: 'any', label: 'Any Gender' },
    { value: 'female', label: 'Female' },
    { value: 'male', label: 'Male' },
    { value: 'non_binary', label: 'Non-binary' }
  ];

  const ageRangeOptions = [
    { value: 'young', label: '25-35 years' },
    { value: 'mid', label: '35-45 years' },
    { value: 'mature', label: '45-55 years' },
    { value: 'senior', label: '55+ years' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSpecializationChange = (specialization, checked) => {
    const newSpecializations = checked
      ? [...filters?.specializations, specialization]
      : filters?.specializations?.filter(s => s !== specialization);
    
    const newFilters = { ...filters, specializations: newSpecializations };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleLanguageChange = (language, checked) => {
    const newLanguages = checked
      ? [...filters?.languages, language]
      : filters?.languages?.filter(l => l !== language);
    
    const newFilters = { ...filters, languages: newLanguages };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      specializations: [],
      languages: [],
      therapeuticApproach: '',
      availability: '',
      sessionType: '',
      experienceLevel: '',
      gender: '',
      ageRange: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters?.specializations?.length > 0) count++;
    if (filters?.languages?.length > 0) count++;
    if (filters?.therapeuticApproach) count++;
    if (filters?.availability) count++;
    if (filters?.sessionType) count++;
    if (filters?.experienceLevel) count++;
    if (filters?.gender) count++;
    if (filters?.ageRange) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-card-foreground">
            Smart Matching Filters
          </h3>
          {activeFilterCount > 0 && (
            <div className="px-2 py-1 bg-primary text-primary-foreground rounded-full text-xs font-medium">
              {activeFilterCount} active
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={clearAllFilters}
            >
              Clear All
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Less' : 'More'} Filters
          </Button>
        </div>
      </div>
      {/* Quick Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Select
          label="Availability"
          options={availabilityOptions}
          value={filters?.availability}
          onChange={(value) => handleFilterChange('availability', value)}
          placeholder="Any time"
        />
        
        <Select
          label="Session Type"
          options={sessionTypeOptions}
          value={filters?.sessionType}
          onChange={(value) => handleFilterChange('sessionType', value)}
          placeholder="All types"
        />
        
        <Select
          label="Experience Level"
          options={experienceLevelOptions}
          value={filters?.experienceLevel}
          onChange={(value) => handleFilterChange('experienceLevel', value)}
          placeholder="Any experience"
        />
      </div>
      {/* Expanded Filters */}
      {isExpanded && (
        <div className="space-y-6 pt-4 border-t border-border">
          {/* Specializations */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-card-foreground">
              Specializations
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {specializationOptions?.map((option) => (
                <Checkbox
                  key={option?.value}
                  label={option?.label}
                  checked={filters?.specializations?.includes(option?.value)}
                  onChange={(e) => handleSpecializationChange(option?.value, e?.target?.checked)}
                />
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-card-foreground">
              Languages
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {languageOptions?.map((option) => (
                <Checkbox
                  key={option?.value}
                  label={option?.label}
                  checked={filters?.languages?.includes(option?.value)}
                  onChange={(e) => handleLanguageChange(option?.value, e?.target?.checked)}
                />
              ))}
            </div>
          </div>

          {/* Additional Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Therapeutic Approach"
              options={therapeuticApproachOptions}
              value={filters?.therapeuticApproach}
              onChange={(value) => handleFilterChange('therapeuticApproach', value)}
              placeholder="Any approach"
            />
            
            <Select
              label="Gender Preference"
              options={genderOptions}
              value={filters?.gender}
              onChange={(value) => handleFilterChange('gender', value)}
              placeholder="Any gender"
            />
            
            <Select
              label="Age Range"
              options={ageRangeOptions}
              value={filters?.ageRange}
              onChange={(value) => handleFilterChange('ageRange', value)}
              placeholder="Any age"
            />
          </div>
        </div>
      )}
      {/* AI Matching Insight */}
      <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Brain" size={20} className="text-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-card-foreground mb-1">
              AI Matching Insight
            </h4>
            <p className="text-sm text-muted-foreground">
              Based on your assessment data and preferences, we'll show consultants with the highest compatibility scores first. 
              Our algorithm considers therapeutic approach alignment, cultural sensitivity, and success rates with similar cases.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartMatchingFilters;