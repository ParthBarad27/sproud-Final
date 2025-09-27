import React, { useState } from 'react';

import Button from '../../../components/ui/Button';

import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const PreSessionForm = ({ selectedConsultant, selectedTimeSlot, onSubmit, onBack }) => {
  const [formData, setFormData] = useState({
    currentMood: '',
    stressLevel: 5,
    primaryConcerns: [],
    sessionGoals: '',
    preferredCommunicationStyle: '',
    previousTherapyExperience: '',
    urgencyLevel: 'normal',
    additionalNotes: '',
    consentGiven: false
  });

  const [errors, setErrors] = useState({});

  const moodOptions = [
    { value: 'anxious', label: 'Anxious' },
    { value: 'depressed', label: 'Depressed' },
    { value: 'stressed', label: 'Stressed' },
    { value: 'overwhelmed', label: 'Overwhelmed' },
    { value: 'confused', label: 'Confused' },
    { value: 'hopeful', label: 'Hopeful' },
    { value: 'neutral', label: 'Neutral' },
    { value: 'motivated', label: 'Motivated' }
  ];

  const concernOptions = [
    { value: 'academic_stress', label: 'Academic Stress' },
    { value: 'anxiety', label: 'Anxiety' },
    { value: 'depression', label: 'Depression' },
    { value: 'relationships', label: 'Relationship Issues' },
    { value: 'family_pressure', label: 'Family Pressure' },
    { value: 'career_confusion', label: 'Career Confusion' },
    { value: 'sleep_issues', label: 'Sleep Problems' },
    { value: 'eating_concerns', label: 'Eating Concerns' },
    { value: 'social_anxiety', label: 'Social Anxiety' },
    { value: 'self_esteem', label: 'Self-esteem Issues' }
  ];

  const communicationStyleOptions = [
    { value: 'direct', label: 'Direct and Solution-focused' },
    { value: 'supportive', label: 'Supportive and Empathetic' },
    { value: 'exploratory', label: 'Exploratory and Reflective' },
    { value: 'structured', label: 'Structured and Goal-oriented' }
  ];

  const therapyExperienceOptions = [
    { value: 'first_time', label: 'This is my first time' },
    { value: 'some_experience', label: 'I have some experience' },
    { value: 'experienced', label: 'I am experienced with therapy' },
    { value: 'prefer_not_say', label: 'Prefer not to say' }
  ];

  const urgencyOptions = [
    { value: 'low', label: 'Low - General support' },
    { value: 'normal', label: 'Normal - Regular session' },
    { value: 'high', label: 'High - Need urgent support' },
    { value: 'crisis', label: 'Crisis - Immediate help needed' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleConcernChange = (concern, checked) => {
    setFormData(prev => ({
      ...prev,
      primaryConcerns: checked
        ? [...prev?.primaryConcerns, concern]
        : prev?.primaryConcerns?.filter(c => c !== concern)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.currentMood) {
      newErrors.currentMood = 'Please select your current mood';
    }
    
    if (formData?.primaryConcerns?.length === 0) {
      newErrors.primaryConcerns = 'Please select at least one primary concern';
    }
    
    if (!formData?.sessionGoals?.trim()) {
      newErrors.sessionGoals = 'Please describe what you hope to achieve';
    }
    
    if (!formData?.preferredCommunicationStyle) {
      newErrors.preferredCommunicationStyle = 'Please select a communication style';
    }
    
    if (!formData?.previousTherapyExperience) {
      newErrors.previousTherapyExperience = 'Please indicate your therapy experience';
    }
    
    if (!formData?.consentGiven) {
      newErrors.consentGiven = 'Please provide consent to proceed';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const getUrgencyColor = (level) => {
    const colors = {
      low: 'text-success',
      normal: 'text-primary',
      high: 'text-accent',
      crisis: 'text-destructive'
    };
    return colors?.[level] || 'text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">
            Pre-Session Assessment
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Help us prepare for your session with Dr. {selectedConsultant?.name}
          </p>
        </div>
        <Button variant="ghost" size="sm" iconName="ArrowLeft" onClick={onBack}>
          Back
        </Button>
      </div>
      {/* Session Details Summary */}
      <div className="bg-muted rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-card-foreground">
              {selectedTimeSlot?.date?.toLocaleDateString('en-IN', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </div>
            <div className="text-sm text-muted-foreground">
              {selectedTimeSlot?.time} • {selectedTimeSlot?.type} session
            </div>
          </div>
          <div className="text-right">
            <div className="font-medium text-card-foreground">
              Dr. {selectedConsultant?.name}
            </div>
            <div className="text-sm text-muted-foreground">
              {selectedConsultant?.specializations?.[0]}
            </div>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Mood */}
        <Select
          label="How are you feeling right now?"
          description="This helps us understand your current state"
          options={moodOptions}
          value={formData?.currentMood}
          onChange={(value) => handleInputChange('currentMood', value)}
          error={errors?.currentMood}
          required
          placeholder="Select your current mood"
        />

        {/* Stress Level */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-card-foreground">
            Current Stress Level (1-10)
          </label>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Low</span>
            <input
              type="range"
              min="1"
              max="10"
              value={formData?.stressLevel}
              onChange={(e) => handleInputChange('stressLevel', parseInt(e?.target?.value))}
              className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-muted-foreground">High</span>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              formData?.stressLevel <= 3 ? 'bg-success text-success-foreground' :
              formData?.stressLevel <= 6 ? 'bg-accent text-accent-foreground': 'bg-destructive text-destructive-foreground'
            }`}>
              {formData?.stressLevel}
            </div>
          </div>
        </div>

        {/* Primary Concerns */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-card-foreground">
            Primary Concerns <span className="text-destructive">*</span>
          </label>
          <p className="text-xs text-muted-foreground">
            Select all that apply to your current situation
          </p>
          <div className="grid grid-cols-2 gap-3">
            {concernOptions?.map((concern) => (
              <Checkbox
                key={concern?.value}
                label={concern?.label}
                checked={formData?.primaryConcerns?.includes(concern?.value)}
                onChange={(e) => handleConcernChange(concern?.value, e?.target?.checked)}
              />
            ))}
          </div>
          {errors?.primaryConcerns && (
            <p className="text-sm text-destructive">{errors?.primaryConcerns}</p>
          )}
        </div>

        {/* Session Goals */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-card-foreground">
            What do you hope to achieve in this session? <span className="text-destructive">*</span>
          </label>
          <textarea
            value={formData?.sessionGoals}
            onChange={(e) => handleInputChange('sessionGoals', e?.target?.value)}
            placeholder="Describe your goals for this session..."
            rows={4}
            className="w-full px-3 py-2 border border-border rounded-md bg-input text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
          {errors?.sessionGoals && (
            <p className="text-sm text-destructive">{errors?.sessionGoals}</p>
          )}
        </div>

        {/* Communication Style */}
        <Select
          label="Preferred Communication Style"
          description="How would you like your therapist to interact with you?"
          options={communicationStyleOptions}
          value={formData?.preferredCommunicationStyle}
          onChange={(value) => handleInputChange('preferredCommunicationStyle', value)}
          error={errors?.preferredCommunicationStyle}
          required
          placeholder="Select communication style"
        />

        {/* Therapy Experience */}
        <Select
          label="Previous Therapy Experience"
          options={therapyExperienceOptions}
          value={formData?.previousTherapyExperience}
          onChange={(value) => handleInputChange('previousTherapyExperience', value)}
          error={errors?.previousTherapyExperience}
          required
          placeholder="Select your experience level"
        />

        {/* Urgency Level */}
        <Select
          label="Urgency Level"
          description="How urgent is your need for support?"
          options={urgencyOptions}
          value={formData?.urgencyLevel}
          onChange={(value) => handleInputChange('urgencyLevel', value)}
          placeholder="Select urgency level"
        />

        {/* Additional Notes */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-card-foreground">
            Additional Notes (Optional)
          </label>
          <textarea
            value={formData?.additionalNotes}
            onChange={(e) => handleInputChange('additionalNotes', e?.target?.value)}
            placeholder="Any additional information you'd like to share..."
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-md bg-input text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>

        {/* Consent */}
        <div className="space-y-4 p-4 bg-muted rounded-lg">
          <Checkbox
            label="I consent to sharing this information with my assigned therapist"
            description="This information will help your therapist prepare for the session and provide better support"
            checked={formData?.consentGiven}
            onChange={(e) => handleInputChange('consentGiven', e?.target?.checked)}
            error={errors?.consentGiven}
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-6 border-t border-border">
          <div className="text-sm text-muted-foreground">
            All information is kept confidential and anonymous
          </div>
          <Button
            type="submit"
            variant="default"
            iconName="Calendar"
            iconPosition="left"
            className="breathing-animation"
          >
            Confirm Appointment
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PreSessionForm;