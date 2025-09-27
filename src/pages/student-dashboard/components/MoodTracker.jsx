import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const moods = [
    { emoji: "😊", label: "Great", value: 5, color: "text-green-500" },
    { emoji: "🙂", label: "Good", value: 4, color: "text-blue-500" },
    { emoji: "😐", label: "Okay", value: 3, color: "text-yellow-500" },
    { emoji: "😔", label: "Low", value: 2, color: "text-orange-500" },
    { emoji: "😢", label: "Sad", value: 1, color: "text-red-500" }
  ];

  const weeklyData = [
    { day: "Mon", mood: 4, date: "18" },
    { day: "Tue", mood: 3, date: "19" },
    { day: "Wed", mood: 5, date: "20" },
    { day: "Thu", mood: 2, date: "21" },
    { day: "Fri", mood: 4, date: "22" }
  ];

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    // Simulate saving mood
    setTimeout(() => {
      setSelectedMood(null);
    }, 2000);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <Icon name="Heart" size={16} color="white" />
          </div>
          <h3 className="font-semibold text-card-foreground">Mood Tracker</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
          iconName={showDetails ? "ChevronUp" : "ChevronDown"}
          iconSize={16}
        >
          {showDetails ? "Less" : "Details"}
        </Button>
      </div>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-3">How are you feeling right now?</p>
          <div className="flex justify-between">
            {moods?.map((mood) => (
              <button
                key={mood?.value}
                onClick={() => handleMoodSelect(mood)}
                className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 hover:bg-muted ${
                  selectedMood?.value === mood?.value ? 'bg-primary/10 ring-2 ring-primary' : ''
                }`}
              >
                <span className="text-2xl mb-1">{mood?.emoji}</span>
                <span className={`text-xs font-medium ${mood?.color}`}>{mood?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {selectedMood && (
          <div className="bg-muted rounded-lg p-3 animate-fade-in">
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-sm text-muted-foreground">
                Mood logged: {selectedMood?.label} {selectedMood?.emoji}
              </span>
            </div>
          </div>
        )}

        {showDetails && (
          <div className="space-y-3 animate-fade-in">
            <div className="border-t border-border pt-3">
              <p className="text-sm font-medium text-card-foreground mb-2">This Week</p>
              <div className="flex justify-between items-end h-16">
                {weeklyData?.map((day) => (
                  <div key={day?.day} className="flex flex-col items-center space-y-1">
                    <div
                      className="w-4 bg-primary rounded-t"
                      style={{ height: `${day?.mood * 8}px` }}
                    ></div>
                    <span className="text-xs text-muted-foreground">{day?.day}</span>
                    <span className="text-xs font-medium">{day?.date}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-accent/10 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Icon name="TrendingUp" size={16} className="text-accent" />
                <span className="text-sm font-medium">Weekly Average: 3.6/5</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                You're doing better than last week! Keep it up.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodTracker;